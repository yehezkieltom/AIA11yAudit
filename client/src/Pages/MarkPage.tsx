import ElementList from '../components/ElementList';
import React, { useState } from 'react';
import { useImageContext } from '../components/ImageContext';
import ImagePlaceholder from '../components/ImagePlaceholder';
import InputFields from '../components/InputFields';
import SelectionTool from '../components/SelectionTool';
import './Markpage.css';

const MarkPage =  () => {
    const[showInput, setShowInput] = useState<boolean>(false);
    const { imgURL } = useImageContext();
    const[elements, setElements] = useState<{ title: string; description: string, x: number, y: number, width: number, height: number}[]>([]);
    const [isSelecting, setIsSelecting] = useState<boolean>(false);
    const [markedAreas, setMarkedAreas] = useState<{x: number; y: number; width: number; height: number} | null>(null);
    const [selectRect, setSelectedRect] = useState<string | null>(null);


    const handleSelection = (selection: { x: number; y: number; width: number; height: number }) => {
        const occlusion = elements.some((element) => 
            selection.x < element.x + element.width &&
            selection.x + selection.width > element.x &&
            selection.y < element.y + element.height &&
            selection.y + selection.height > element.y 
        )

        if(occlusion) {
            alert('Selected area occludes existing element');
            return;
        };

        setMarkedAreas(selection);
        setShowInput(true);
    };
    const addElement = (title: string, description: string) => {
        if (title.trim() !== '' && description.trim() !== '' && markedAreas) {
            const newElements = [...elements, { title: title.trim(), description: description.trim(), ...markedAreas }];
            setElements(newElements);
            setMarkedAreas(null);
            setShowInput(false);
            setIsSelecting(false);
            exportData(newElements);
        }
    }
    const removeElement = (index: number) => {
        setElements(elements.filter((_, i) => i !== index));
    }
    const editElement = (index: number, newTitle: string, newDescription: string) => {
        setElements(elements.map((element, i) => 
        i === index ? { ...element, title: newTitle, description: newDescription } : element));
    }
    const exportData = (data: typeof elements) => {
        const jsonData = JSON.stringify({ image: imgURL, marked_elements: elements}, null, 2);
        console.log(jsonData);
        navigator.clipboard.writeText(jsonData).then(() => alert('Data copied to clipboard'));
    }
    const updateElement = (index: number, updatedProps: { x?: number; y?: number; width?: number; height?: number }) => {
        setElements((prevElements) => 
            prevElements.map((el, i) => (i === index ? { ...el, ...updatedProps } : el))
        );
    }

    return (
        <div className='mark-page'>
            <div className='sidebar'>
                <div className='sidebar-top'>
                    <h1>Elements</h1>
                    <button className='add-button' onClick={() => setIsSelecting(true)}>+ Add</button>
                </div>
                <div className='sidebar-bottom'>
                    <ElementList elements={ elements } onRemove={removeElement} onEdit={editElement}/>
                </div>
            </div>
            <div className='image-container'>
                {imgURL ? (
                    console.log(imgURL),
                    <SelectionTool imgSrc={imgURL} onSelect={handleSelection} onUpdate={updateElement} isSelecting={isSelecting} markedAreas={elements}/>
                ) : (
                 <ImagePlaceholder img={imgURL}/>
             )}
            </div>

            {showInput && (
                <div className='input-container'>
                    <InputFields onAdd={addElement} />
                </div>
                )} 
        </div>
    );
};

export default MarkPage;