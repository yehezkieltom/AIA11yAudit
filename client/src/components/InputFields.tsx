import React, { useState } from 'react';
import './InputFields.css'

interface InputFieldsProps {
    onAdd: (title: string, description: string) => void;
}

const InputFields: React.FC<InputFieldsProps> = ({ onAdd }) => {
    const [inputTitle, setInputTitle] = useState<string>('');
    const [inputDescription, setInputDescription] = useState<string>('');

    const handleAddElement = () => {
        if (inputTitle.trim() !== '' && inputDescription.trim() !== '') {
            onAdd(inputTitle, inputDescription);
            setInputTitle('');
            setInputDescription('');
        }
    };

    const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddElement();
        }
    };

    return (
        <div className='input-container'> 
            <form onSubmit={handleAddElement}>
                <input type= 'text'
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
                className='input-field'
                placeholder='Enter Title'
                onKeyDown = {handleEnterKey}
                />
                <input type='text'
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)}
                className='input-field'
                placeholder='Enter Description'
                onKeyDown = {handleEnterKey} /> <br />
                <button type='submit' className='include-button'>+</button>
            </form>
        </div>
    );
};

export default InputFields;
