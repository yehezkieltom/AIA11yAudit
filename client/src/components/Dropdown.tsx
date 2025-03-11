import React, { useState } from 'react';
import './Dropdown.css';

const Dropdown = ({ onChange }: { onChange: (values: { [key: string]: string }) => void }) => {
    const [selectedOption, setSelectedOption] = useState<{ [key: string]: string }>({
        'screen-size-category': '',
        'screen-size-specific': '',
        'screen-size-orientation': '',
    });

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = event.target;
        const updatedOption = { ...selectedOption, [id]: value };
        setSelectedOption(updatedOption);
        onChange(updatedOption);
    }

    return (
        <div className='all-dropdowns'>
            <div className='dropdown'>
                <label htmlFor='screen-size-category' >Screen Size - Category</label>
                <select id='screen-size-category' value={selectedOption['screen-size-category']} onChange={handleSelectChange}>
                    <option value="" disabled hidden>Select a category</option>
                    <option value="desktop">Desktop</option>
                    <option value="phone">Phone</option>
                    <option value="tablet">Tablet</option>
                </select>
            </div>
            <div className='dropdown'>
                <label htmlFor='screen-size-specific'>Screen Size - Specific</label>
                <select id='screen-size-specific' value={selectedOption['screen-size-specific']} onChange={handleSelectChange}>
                    <option value="" disabled hidden>Select a specific size</option>
                    <option value="macbook-pro-14">MacBook Pro 14-inch</option>
                    <option value="macbook-pro-16">MacBook Pro 16-inch</option>
                    <option value="standard">Standard 24-inch Monitor</option>
                </select>
            </div>
            <div className='dropdown'>
                <label htmlFor='screen-size-orientation'>Screen Size - Orientation</label>
                <select id='screen-size-orientation' value={selectedOption['screen-size-orientation']} onChange={handleSelectChange}>
                    <option value="" disabled hidden>Select an orientation</option>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                </select>
            </div>
        </div>
    );
}

export default Dropdown;