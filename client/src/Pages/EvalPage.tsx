import React, { useState, useEffect } from 'react';
import { useImageContext } from '../components/ImageContext';
import ImagePlaceholder from '../components/ImagePlaceholder';
import { ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import Card from '../components/Card';
import Button from '../components/Button';
import ScrollArea from '../components/ScrollArea';
import './EvalPage.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import arrowRight from '../assets/svg/arrow-right.svg';
import LoadingPage from './LoadingPage';
import { useAPI } from '../Api/apiContext';
import { guidelines } from '../middlewares/composeMetadataContext';


export type StatusType = 'Pass' | 'Fail' | 'Warning' | null;
export type Level = 'A' | 'AA' | 'AAA';

interface DataItem {
    title: string;
    status: StatusType;
    description: string;
    open: boolean;
    wcag_num: number;
    wcag_t: string;
    level: Level;
}

interface Summary {
    passed: number;
    total: number;
    levelA: number;
    levelAA: number;
    levelAAA: number;
    description: string;
}

interface EvalPageProps {
    data: DataItem[];
    summary: Summary;
}

const EvalPage: React.FC<EvalPageProps> =  ({ data, summary}) => {
    const navigate = useNavigate();
    const { imgURL } = useImageContext();
    const { isLoading, setIsLoadingExternal, allRequestComplete, requests, resetState } = useAPI();
    const [activeCard, setActiveCard] = useState<"violations" | "checklist" | null>("violations");
    const [selectedStatuses, setSelectedStatuses] = useState<StatusType[]>(['Pass', 'Fail', 'Warning']);
    const [selectedLevels, setSelectedLevels] = useState<Level[]>(['A', 'AA', 'AAA']);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [expandedItems, setExpandedItems] = useState<number[]>([]);
    const [expandedChecklist, setExpandedChecklist] = useState<string[]>([]);
    const [expandedGuideline, setExpandedGuideline] = useState<string[]>([]);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [reports, setReports] = useState<unknown[]>([]);
    // const [loading, setLoading] = useState(false);

    // const wcagDictionary: Record<string, DataItem> = {
    //     '1.1.1': {
    //         title: "Non-text Content",
    //         status: null,
    //         description: "Ensure all non-text content has a text alternative, including images, charts, graphs, and multimedia elements.",
    //         open: true,
    //         wcag_num: 1.1,
    //         wcag_t: "Non-text Content",
    //         level: "A",
    //     },
    //     '1.4.1': {
    //         title: "Use of Color",
    //         status: null,
    //         description: "Ensure color is not the sole means of conveying information.",
    //         open: true,
    //         wcag_num: 1.4,
    //         wcag_t: "Use of Color",
    //         level: "A",
    //     },
    //     '1.4.3': {
    //         title: "Contrast (Minimum)",
    //         status: null,
    //         description: "Ensure text has a contrast ratio of at least 4.5:1 (or 3:1 for large text).",
    //         open: true,
    //         wcag_num: 1.4,
    //         wcag_t: "Contrast (Minimum)",
    //         level: "AA",
    //     },
    //     '1.4.4': {
    //         title: "Resize Text",
    //         status: null,
    //         description: "Text should be resizable up to 200% without loss of content or functionality.",
    //         open: true,
    //         wcag_num: 1.4,
    //         wcag_t: "Resize Text",
    //         level: "AA",
    //     },
    //     '1.4.10': {
    //         title: "Reflow",
    //         status: null,
    //         description: "Ensure content remains usable at 400% zoom without requiring horizontal scrolling.",
    //         open: true,
    //         wcag_num: 1.4,
    //         wcag_t: "Reflow",
    //         level: "AA",
    //     },
    //     '1.4.11': {
    //         title: "Non-text Contrast",
    //         status: null,
    //         description: "Ensure UI elements like buttons, form controls, and graphical elements have sufficient contrast (minimum 3:1).",
    //         open: true,
    //         wcag_num: 1.4,
    //         wcag_t: "Non-text Contrast",
    //         level: "AA",
    //     },
    //     '1.2.1': {
    //         title: "Audio-only and Video-only (Prerecorded)",
    //         status: null,
    //         description: "Provide text alternatives for audio and video content.",
    //         open: true,
    //         wcag_num: 1.2,
    //         wcag_t: "Audio-only and Video-only",
    //         level: "A",
    //     },
    //     '1.2.2': {
    //         title: "Captions (Prerecorded)",
    //         status: null,
    //         description: "Ensure that prerecorded videos have captions.",
    //         open: true,
    //         wcag_num: 1.2,
    //         wcag_t: "Captions (Prerecorded)",
    //         level: "A",
    //     },
    //     '1.2.3': {
    //         title: "Audio Description or Media Alternative (Prerecorded)",
    //         status: null,
    //         description: "Provide an audio description or text alternative for video content.",
    //         open: true,
    //         wcag_num: 1.2,
    //         wcag_t: "Audio Description",
    //         level: "A",
    //     },
    //     '1.2.4': {
    //         title: "Captions (Live)",
    //         status: null,
    //         description: "Live multimedia presentations should include captions.",
    //         open: true,
    //         wcag_num: 1.2,
    //         wcag_t: "Captions (Live)",
    //         level: "AA",
    //     },
    //     '1.2.5': {
    //         title: "Audio Description (Prerecorded)",
    //         status: null,
    //         description: "Ensure an audio description track is available for prerecorded video content.",
    //         open: true,
    //         wcag_num: 1.2,
    //         wcag_t: "Audio Description",
    //         level: "AA",
    //     },
    //     '1.2.6': {
    //         title: "Sign Language (Prerecorded)",
    //         status: null,
    //         description: "Consider embedding a sign language interpreter video alongside the main content.",
    //         open: true,
    //         wcag_num: 1.2,
    //         wcag_t: "Sign Language (Prerecorded)",
    //         level: "AAA",
    //     },
    //     '1.2.7': {
    //         title: "Extended Audio Description (Prerecorded)",
    //         status: null,
    //         description: "For complex visual content, allow additional audio descriptions beyond the default.",
    //         open: true,
    //         wcag_num: 1.2,
    //         wcag_t: "Extended Audio Description",
    //         level: "AAA",
    //     },
    //     '1.2.8': {
    //         title: "Media Alternative (Prerecorded)",
    //         status: null,
    //         description: "Ensure text-based alternatives are available for all multimedia content.",
    //         open: true,
    //         wcag_num: 1.2,
    //         wcag_t: "Media Alternative",
    //         level: "AAA",
    //     },
    //     '1.2.9': {
    //         title: "Audio-only (Live)",
    //         status: null,
    //         description: "For live broadcasts, provide real-time captions or text-based descriptions.",
    //         open: true,
    //         wcag_num: 1.2,
    //         wcag_t: "Audio-only (Live)",
    //         level: "AAA",
    //     }
    // };

    const toggleExpand = (index: number) => {
        setExpandedItems(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const toggleExpandChecklist = (index: string) => {
        setExpandedChecklist(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const toggleExpandGuideline = (index: string) => {
        setExpandedGuideline(prev => 
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    const toggleStatusFilter = (status: StatusType) => {
        setSelectedStatuses(prev => {
            if (prev.includes(status)) {
                return prev.length == 1 ? prev : prev.filter(s => s !== status);
            }
            return [...prev, status];
        });
        setSelectAll(false);
    };

    const toggleLevelFilter = (level: Level) => {
        setSelectedLevels(prev => {
            if(prev.includes(level)) {
                return prev.length == 1 ? prev : prev.filter(l => l !== level);
            }
            return [...prev, level];
        });
        setSelectAll(false);
    };

    const toggleAllFilters = () => {
        if(selectAll) {
            setSelectedStatuses([]);
            setSelectedLevels([]);
        } else {
            setSelectedStatuses(['Pass', 'Fail', 'Warning']);
            setSelectedLevels(['A', 'AA', 'AAA']);
        }
        setSelectAll(!selectAll);
    };

    const toggleChecklistItem = (id: string, category: string) => {
        setCheckedItems(prev => {
            const newCheckedItems = { ...prev, [id]: !prev[id] };
            const allChecked = checklistsItems[category].every(item => newCheckedItems[`${category}-${item.guideline}`]);
            newCheckedItems[category] = allChecked;
            return newCheckedItems;
        });
    };


    const filterData = data.filter(item => 
        selectedStatuses.includes(item.status) && selectedLevels.includes(item.level)
    );

    const checklistsItems: Record<string, { guideline: string; text: string; details: string, level: Level }[]> = {
        "1.1": [
            { guideline: "1.1.1", text: "Ensure all non-text content has a text alternative.", details: "This includes images, charts, graphs, audio files, and videos. Provide alt text or transcripts where applicable." , level: "A"},
        ],
        "1.2": [
            { guideline: "1.2.1", text: "Provide alternatives for time-based media such as captions and transcripts.", details: "Ensure that users with hearing impairments can access media content via text-based alternatives.", level: "A" },
            { guideline: "1.2.2", text: "Ensure synchronized captions for pre-recorded audio and video.", details: "Captions should be accurate, synchronized with speech, and include relevant non-verbal sounds.", level: "A" },
            { guideline: "1.2.3", text: "Provide an audio description for pre-recorded video content.", details: "This helps visually impaired users by describing visual elements in a video.", level: "A" },
            { guideline: "1.2.4", text: "Include captions for live multimedia presentations.", details: "Live captions should be provided for any real-time streaming or broadcast events.", level: "A" },
            { guideline: "1.2.5", text: "Ensure an audio description track is available for synchronized media.", details: "For videos, provide an alternative audio track describing important visual content.", level: "A" },
            { guideline: "1.2.6", text: "Provide sign language interpretation for pre-recorded audio content.", details: "Consider embedding a sign language interpreter video alongside the main content.", level: "A" },
            { guideline: "1.2.7", text: "Extend audio descriptions for media when necessary.", details: "For complex visual content, allow additional audio descriptions beyond the default.", level: "AA" },
            { guideline: "1.2.8", text: "Offer text alternatives for live video content.", details: "For live broadcasts, provide real-time captions or text-based descriptions.", level: "AA" },
            { guideline: "1.2.9", text: "Ensure sign language interpretation for live media.", details: "If possible, include a live interpreter on-screen during broadcasts.", level: "AAA" }
        ],
        "1.4": [
            { guideline: "1.4.1", text: "Use of Color", details: "Ensure color is not the sole means of conveying information, distinguishing elements, or prompting action.", level: "A" },
            { guideline: "1.4.3", text: "Contrast (Minimum)", details: "Ensure text and images of text have a contrast ratio of at least 4.5:1 (or 3:1 for large text).", level: "AA" },
            { guideline: "1.4.4", text: "Allow text resizing without loss of content or functionality.", details: "Ensure that users can increase font sizes without breaking the layout or hiding essential content.", level: "AA" },
            { guideline: "1.4.10", text: "Reflow", details: "Ensure content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions for text content at 400% zoom.", level: "AA" },
            { guideline: "1.4.11", text: "Non-text Contrast", details: "Ensure that graphical elements essential for understanding content have a contrast ratio of at least 3:1.", level: "AA" }
        ]
    };

    const wcagDictionary: Record<string, {text: string; details: string, level: Level}> = {

        "1.1.1": {text: "Ensure all non-text content has a text alternative.", details: "This includes images, charts, graphs, audio files, and videos. Provide alt text or transcripts where applicable." , level: "A"},
        "1.2.1": {text: "Provide alternatives for time-based media such as captions and transcripts.", details: "Ensure that users with hearing impairments can access media content via text-based alternatives.", level: "A"},
        "1.2.3": {text: "Provide an audio description for pre-recorded video content.", details: "This helps visually impaired users by describing visual elements in a video.", level: "A"},
        "1.2.4": {text: "Include captions for live multimedia presentations.", details: "Live captions should be provided for any real-time streaming or broadcast events.", level: "A"},
        "1.2.5": {text: "Ensure an audio description track is available for synchronized media.", details: "For videos, provide an alternative audio track describing important visual content.", level: "A"},
        "1.2.6": {text: "Provide sign language interpretation for pre-recorded audio content.", details: "Consider embedding a sign language interpreter video alongside the main content.", level: "A"},
        "1.2.7": {text: "Extend audio descriptions for media when necessary.", details: "For complex visual content, allow additional audio descriptions beyond the default.", level: "AA"},
        "1.2.8": {text: "Offer text alternatives for live video content.", details: "For live broadcasts, provide real-time captions or text-based descriptions.", level: "AA"},
        "1.2.9": {text: "Ensure sign language interpretation for live media.", details: "If possible, include a live interpreter on-screen during broadcasts.", level: "AAA"},
        "1.4.1": {text: "Use of Color", details: "Ensure color is not the sole means of conveying information, distinguishing elements, or prompting action.", level: "A"},
        "1.4.3": {text: "Contrast (Minimum)", details: "Ensure text and images of text have a contrast ratio of at least 4.5:1 (or 3:1 for large text).", level: "AA"},
        "1.4.4": {text: "Allow text resizing without loss of content or functionality.", details: "Ensure that users can increase font sizes without breaking the layout or hiding essential content.", level: "AA"},
        "1.4.10": {text: "Reflow", details: "Ensure content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions for text content at 400% zoom.", level: "AA"},
        "1.4.11": {text: "Non-text Contrast", details: "Ensure that graphical elements essential for understanding content have a contrast ratio of at least 3:1.", level: "AA"}
    }


    const handleBack = () => {
        // setLoading(true);
        // setTimeout(() => {
        //     setLoading(false);
        //     navigate('/');
        // }, 2000);
        resetState();
        navigate('/');
    }

    useEffect(() => {
        //make sure once the parsing is done, you will only do it once
        if (allRequestComplete()) {
            //parse the result
            for (const requestId in requests) {
                setReports(prev => ([
                    ...prev,
                    {
                        /* AI response already has title, status, and description */
                        open: false,
                        wcag_num: requestId, // the requestId here is a guideline criteria code
                        wcag_t: requestId in wcagDictionary? wcagDictionary[requestId].text : '',
                        level: requestId in wcagDictionary? wcagDictionary[requestId].text : '',
                    }
                ]))
            }

            setIsLoadingExternal(false);
        }
    })
    

    return isLoading ? ( <LoadingPage /> ) : (
        <div className='container'>
            <div className='left-section'>
                <Card>
                    {imgURL ? (
                        <ImagePlaceholder img={imgURL}/>
                    ) : (
                        <div className='image-box'>
                            <span className='summary-typography'>No Image available, something went wrong. 
                                Please return to the Upload Page with the button "Back"</span>
                        </div>
                    )}
                </Card>
                <Card>
                    <h4 className='summary-title'>Summary</h4>
                    <p className='summary-typography'>
                        Passed elements: <strong>{summary.passed}/{summary.total} ({((summary.passed / summary.total) * 100).toFixed(0)}%)</strong>
                    </p>
                    <p className='summary-typography'>Level <strong>A</strong> violated: <strong>{summary.levelA}</strong></p>
                    <p className='summary-typography'>Level <strong>AA</strong>  violated: <strong>{summary.levelAA}</strong></p>
                    <p className='summary-typography'>Level <strong>AAA</strong>  violated: <strong>{summary.levelAAA}</strong></p>
                    <p className='summary-typography'>{summary.description}</p>
                </Card>
                <div className='button-container'>
                    <button className='back-button' onClick={handleBack}>Back</button>
                    <button className="start-button" onClick={handleBack}>
                            Upload 
                            <img src={arrowRight} width="20" height="20"/>
                    </button>
                </div>
            </div>

            <div className='right-section'>
                <div className='side-button-container'>
                    <Button  isActive={activeCard === "violations"} onClick={() => setActiveCard("violations")}>Violations</Button>
                    <Button isActive={activeCard === "checklist"} onClick={() => setActiveCard("checklist")}>Checklist</Button>
                </div>
                <AnimatePresence>
                <motion.div
                    className={`menu-slider ${activeCard ? 'active' : 'active'}`}
                    initial={{ x: '100%' }}
                    animate={{ x: 0}}
                    transition={{ type: "slide", stiffness: 100 }}
                >
                {activeCard === "violations" ? (
                    <>
                    <div className='filter-container'>
                        <div className='filter-row'>
                            <label className='checkbox-label'>
                                <input
                                    className='custom-checkbox'
                                    type='checkbox'
                                    checked={selectAll}
                                    onChange={toggleAllFilters}
                                /> Select All {`(${data.length})`}
                            </label>
                        {(['Pass', 'Fail', 'Warning'] as StatusType[]).map(status => (
                            <label key={status} className='checkbox-label'>
                                <input
                                    className='custom-checkbox'
                                    type='checkbox'
                                    checked={selectedStatuses.includes(status)}
                                    onChange={() => toggleStatusFilter(status)}
                                /> {status} {`(${data.filter(item => item.status === status).length})`}
                            </label>
                        ))}
                        </div>
                        <div className='filter-row'>
                        {(['A', 'AA', 'AAA'] as Level[]).map(level => (
                            <label key={level} className='checkbox-label'>
                                <input
                                    className='custom-checkbox'
                                    type='checkbox'
                                    checked={selectedLevels.includes(level)}
                                    onChange={() => toggleLevelFilter(level)}
                                /> {level} {`(${data.filter(item => item.level === level).length})`}
                            </label>
                        ))}
                        </div>
                    </div>
                    <ScrollArea>
                        {filterData.map((item, index) => (
                            <div key={index} className='element-tile'>
                                <div className='item-header' onClick={() => toggleExpand(index)}>
                                    {item.status === 'Pass' && <CheckCircle size={24} color='green'/>}
                                    {item.status === 'Warning' && <AlertTriangle size={24} color='orange'/>}
                                    {item.status === 'Fail' && <XCircle size={24} color='red'/>}
                                    <h3 className='font-bold text-md'>{item.title}</h3>
                                    <div className='expand-icon'>
                                        {expandedItems.includes(index) ? <ChevronUp size={24} color='black'/> : <ChevronDown size={24} color='black'/>}
                                    </div>
                                </div>
                            <AnimatePresence>
                                {expandedItems.includes(index) && (
                                    <motion.p
                                        className='item-description'
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        >
                                            <span><strong>{`${item.wcag_num} ${item.wcag_t}`}</strong></span>
                                            <br/>
                                            <br/>
                                            <span>{item.description}</span>
                                    </motion.p>
                                )}
                            </AnimatePresence>
                            </div>
                        ))}
                    </ScrollArea>
                    </>
                ) : (
                    <ScrollArea>
                        <h3 className='summary-title'>Accessibility Checklist</h3>
                        {Object.entries(checklistsItems).map(([category, guidelines]) => (
                            <div key={category} className='element-tile'>
                                <div className='item-header' onClick={() => toggleExpandGuideline(category)}>
                                    <input
                                        className='custom-checkbox'
                                        type='checkbox'
                                        checked={checkedItems[category] || false}
                                        onChange={() => {
                                            const allChecked = !checkedItems[category];
                                            setCheckedItems(prev => {
                                                const newCheckedItems = { ...prev, [category]: allChecked };
                                                guidelines.forEach(item => {
                                                    newCheckedItems[`${category}-${item.guideline}`] = allChecked;
                                                });
                                                return newCheckedItems;
                                            });
                                        }}
                                    />
                                    <h3 className='font-bold text-md'>{`Guideline ${category}`}</h3>
                                    <div className='expand-icon'>
                                        {expandedGuideline.includes(category) ? <ChevronUp size={24} color='black'/> : <ChevronDown size={24} color='black'/>}
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedGuideline.includes(category) && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                        >
                                            {guidelines.map((item, index) => (
                                                <div key={index} className='element-tile2'>
                                                    <div className='item-header'>
                                                        <input
                                                            type='checkbox'
                                                            id={`checklist-${item.guideline}-${index}`}
                                                            name={`checklist-${item.guideline}-${index}`}
                                                            checked={checkedItems[`${category}-${item.guideline}`] || false}
                                                            onChange={() => toggleChecklistItem(`${category}-${item.guideline}`, category)}
                                                        />
                                                        <label className='item-description' htmlFor={`checklist-${item.guideline}-${index}`}>
                                                            <div className='level-circle'>       
                                                            {`${item.level}`}
                                                            </div>
                                                            {`${item.guideline}: ${item.text}`}
                                                        </label>
                                                        <div className='expand-icon' onClick={() => toggleExpandChecklist(`${item.guideline}-${index}`)}>
                                                            {expandedChecklist.includes(`${item.guideline}-${index}`) ? <ChevronUp size={24} color='black'/> : <ChevronDown size={24} color='black'/>}
                                                        </div>
                                                    </div>

                                                    <AnimatePresence>
                                                        {expandedChecklist.includes(`${item.guideline}-${index}`) && (
                                                            <motion.p
                                                                className='item-description'
                                                                initial={{ opacity: 0, height: 0 }}
                                                                animate={{ opacity: 1, height: 'auto' }}
                                                                exit={{ opacity: 0, height: 0 }}
                                                            >
                                                                <span>{item.details}</span>
                                                            </motion.p>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </ScrollArea>
                )}
                </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EvalPage;