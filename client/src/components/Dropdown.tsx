import React from 'react';
import './Dropdown.css';

const Dropdown = () => {
    return (
        <div className='all-dropdowns'>
            <div className='dropdown'>
                <label htmlFor='screen-size-category' >Screen Size - Category</label>
                <select id='screen-size-category'>
                    <option value="desktop">Desktop</option>
                    <option value="phone">Phone</option>
                    <option value="tablet">Tablet</option>
                </select>
            </div>
            <div className='dropdown'>
                <label htmlFor='screen-size-specific'>Screen Size - Specific</label>
                <select id='screen-size-specific'>
                    <option value="macbook-pro-14">MacBook Pro 14-inch</option>
                    <option value="macbook-pro-16">MacBook Pro 16-inch</option>
                    <option value="standard">Standard 24-inch Monitor</option>
                </select>
            </div>
            <div className='dropdown'>
                <label htmlFor='screen-size-orientation'>Screen Size - Orientation</label>
                <select id='screen-size-orientation'>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                </select>
            </div>
        </div>
    );
}

export default Dropdown;