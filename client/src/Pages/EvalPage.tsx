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
import { X } from 'lucide-react';
import { useAPI } from '../Api/apiContext';
import checklistsItems from '../definitions/checklistsItems';


export type StatusType = 'Pass' | 'Fail' | 'Warning' | null;
export type Level = 'A' | 'AA' | 'AAA';

export interface DataItem {
    title: string;
    status: StatusType;
    description: string;
    open: boolean;
    wcag_num: string[];
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
    dummy_data: DataItem[];
    summary: Summary;
}

const EvalPage: React.FC<EvalPageProps> =  ({ dummy_data, summary }) => {
    const navigate = useNavigate();
    const { imgURL, iconImgURL } = useImageContext();
    const { isLoading, requests, resetState } = useAPI();
    const [activeCard, setActiveCard] = useState<"violations" | "checklist" | null>("violations");
    const [selectedStatuses, setSelectedStatuses] = useState<StatusType[]>(['Pass', 'Fail', 'Warning']);
    const [selectedLevels, setSelectedLevels] = useState<Level[]>(['A', 'AA', 'AAA']);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [expandedItems, setExpandedItems] = useState<number[]>([]);
    const [expandedChecklist, setExpandedChecklist] = useState<string[]>([]);
    const [expandedGuideline, setExpandedGuideline] = useState<string[]>([]);
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [reports, setReports] = useState<DataItem[]>([]);
    // const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [filterData, setFilterData] = useState<DataItem[]>([]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hell = dummy_data

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


    // const filterData = dummy_data.filter(item => 
    //     selectedStatuses.includes(item.status) && selectedLevels.includes(item.level)
    // );


    useEffect(() => {
        setFilterData(Object.values(reports).filter((item: DataItem) => (
        selectedStatuses.includes(item.status) && selectedLevels.includes(item.level)
    )));
    }, [reports, selectedLevels, selectedStatuses])



    const handleBack = () => {
        ////dummy
        // setLoading(true);
        // setTimeout(() => {
        //     setLoading(false);
        //     navigate('/');
        // }, 2000);

        //actual
        resetState();
        navigate('/');
    }

    useEffect(() => {
        // const reportItem = []
        //TODO: check if it still problematic
        setReports([])
        for(const requestState of Object.values(requests)) {
            // reportItem.push(requestState.response)
            setReports(prev => [
                ...prev,
                ...requestState.response
            ])
        }

        console.log("result read from EvalPage.tsx")
        console.log(requests)
        console.log('\n')
    }, [requests])

    useEffect(() => {

        const violatedWCAGNums = new Set(reports
            .filter(item => item.status === "Fail" || item.status === "Warning" || item.status == "Pass")
            .flatMap(item => item.wcag_num));
    
        setCheckedItems(prev => {
            const newCheckedItems = { ...prev };
    
            Object.entries(checklistsItems).forEach(([category, guidelines]) => {
                let allSubItemsChecked = true;
                guidelines.forEach(item => {
                    if (violatedWCAGNums.has(item.guideline)) {
                        newCheckedItems[`${category}-${item.guideline}`] = true;
                    } else {
                        allSubItemsChecked = false;
                    }
                });
                newCheckedItems[category] = allSubItemsChecked;
            });
    
            return newCheckedItems;
        });
        console.log("flatten result read from EvalPage.tsx")
        console.log(reports)
        console.log('\n')
        console.log("violatedWCAGNums from EvalPage.tsx")
        console.log(violatedWCAGNums)
        console.log('\n')

        
    }, [reports]);


    //debug
    useEffect(() => {
        console.log("checkedItems from EvalPage.tsx")
        console.log(checkedItems)
        console.log('\n')
    }, [checkedItems])
    

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
                {isModalOpen && (
                    <div className='modal-overlay'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                    <h3>Contrast Issues</h3>
                                    <button className='modal-close' onClick={() => setIsModalOpen(false)}>
                                        <X size={24} color='white'/>
                                    </button>
                            </div>
                            <div className='modal-body'>
                                {iconImgURL ? (
                                    <img src={iconImgURL} />
                                ) : (
                                    <p> No image there. Please upload one</p>
                                )} 
                            </div>  
                        </div>
                    </div>
                )}
                <Card>
                    <h4 className='summary-title'>Summary</h4>
                    <p className='summary-typography'>
                        Passed elements: 
                        <strong>
                            {reports.filter(item => item.status === "Pass").length}/{reports.length} 
                            ({((reports.filter(item => item.status === "Pass").length / reports.length) * 100).toFixed(0)}%)
                        </strong>
                    </p>
                    <p className='summary-typography'>Level <strong>A</strong> violated: 
                        <strong>
                            {reports.filter(item => (item.level === "A") && (item.status === "Fail" || item.status === "Warning")).length}
                        </strong>
                    </p>
                    <p className='summary-typography'>Level <strong>AA</strong> violated: 
                        <strong>
                            {reports.filter(item => (item.level === "AA") && (item.status === "Fail" || item.status === "Warning")).length}
                        </strong>
                    </p>
                    <p className='summary-typography'>Level <strong>AAA</strong> violated: 
                        <strong>
                            {reports.filter(item => (item.level === "AAA") && (item.status === "Fail" || item.status === "Warning")).length}
                        </strong>
                    </p>
                    <p className='summary-typography'>{summary.description}</p>
                </Card>
                <div className='button-container'>
                    <button className='back-button' onClick={handleBack}>Back</button>
                    <button className='modal-button' onClick={() => setIsModalOpen(true)}>Show contrast issues</button>
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
                                /> Select All {`(${reports.length})`}
                            </label>
                        {(['Pass', 'Fail', 'Warning'] as StatusType[]).map(status => (
                            <label key={status} className='checkbox-label'>
                                <input
                                    className='custom-checkbox'
                                    type='checkbox'
                                    checked={selectedStatuses.includes(status)}
                                    onChange={() => toggleStatusFilter(status)}
                                /> {status} {`(${reports.filter(item => item.status === status).length})`}
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
                                /> {level} {`(${reports.filter(item => item.level === level).length})`}
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
                                        className='item-description2'
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
                <>
                    <div className='filter-container2'>
                    <div className='filter-row'>
                        <label className='checkbox-label'>
                            <input
                                className='custom-checkbox'
                                type='checkbox'
                                checked={selectAll}
                                onChange={toggleAllFilters}
                            /> Select All {`(${reports.length})`}
                        </label>
                    {(['Pass', 'Fail', 'Warning'] as StatusType[]).map(status => (
                        <label key={status} className='checkbox-label'>
                            <input
                                className='custom-checkbox'
                                type='checkbox'
                                checked={selectedStatuses.includes(status)}
                                onChange={() => toggleStatusFilter(status)}
                            /> {status} {`(${reports.filter(item => item.status === status).length})`}
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
                            /> {level} {`(${reports.filter(item => item.level === level).length})`}
                        </label>
                    ))}
                    </div>
                </div>
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
                </>
                )}
                </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default EvalPage;