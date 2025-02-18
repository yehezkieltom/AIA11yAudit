import React, {useState} from 'react';
import './ElementList.css';

interface ElementListProps {
    elements: { title: string; description: string }[];
    onRemove: (index: number) => void;
    onEdit: (index: number, title: string, description: string) => void;
}

const ElementList: React.FC<ElementListProps> = ({ elements, onRemove, onEdit}) => {
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [inputTitle, setInputTitle] = useState<string>('');
    const [inputDescription, setInputDescription] = useState<string>('');

    const handleEdit = (index: number) => {
        setEditIndex(index);
        console.log({index});
        setInputTitle(elements[index].title);
        setInputDescription(elements[index].description);
    };

    const handleSave = () => {
        if (editIndex !== null) {
            onEdit(editIndex, inputTitle, inputDescription);
            setEditIndex(null);
            setInputTitle('');
            setInputDescription('');
            
        }
        console.log('Saved');
    }

    return (
            <div className='elements' >
                    {elements.map((element, index) => (
                        <div key={index} className='element'>
                            {editIndex === index ? (
                                <div>
                                    <input type='text' value={inputTitle} onChange={(e) => setInputTitle(e.target.value)} />
                                    <input type='text' value={inputDescription} onChange={(e) => setInputDescription(e.target.value)} />
                                    <button onClick={handleSave}>Save</button>
                                    <button onClick={() => {setEditIndex(null)}}>Cancel</button>
                                </div>
                            ) : (
                                <div>
                                    <span>{element.title} <br /> 
                                    {element.description}</span>
                                    <button className='remove-button' onClick={() => onRemove(index)}>Remove</button>
                                    <button className='edit-button' onClick={() => handleEdit(index)}>Edit</button>
                                </div>
                            )}
                        </div> 
                    ))}
            </div>
    );
}

export default ElementList;