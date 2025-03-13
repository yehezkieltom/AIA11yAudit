import React, { useState } from 'react';
import './Dropdown.css';

const Dropdown = ({ onChange }: { onChange: (values: { [key: string]: string }) => void }) => {
    const [selectedOption, setSelectedOption] = useState<{ 
        'screen-size-category': string,
        'screen-size-specific': string,
        'screen-size-orientation': string
    }>({
        'screen-size-category': '',
        'screen-size-specific': '',
        'screen-size-orientation': '',
    });

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
            const { id, value } = event.target;
            setSelectedOption((prev) => ({
                ...prev,
                [id]: value,
                ...(id === "screen-size-category"
                    ? {
                        "screen-size-specific": "",
                        "screen-size-orientation": ""
                    }
                    : {})
            }));
        };

    const screenSizeOptions = {
        desktop: [
            { value: "macbook-pro-14", label: "MacBook Pro 14-inch" },
            { value: "macbook-pro-16", label: "MacBook Pro 16-inch" },
            { value: "standard", label: "Standard 24-inch Monitor" }
        ],
        phone: [
            { value: "iphone-13", label: "iPhone 13" },
            { value: "iphone-14", label: "iPhone 14" },
            { value: "pixel-7", label: "Google Pixel 7" }
        ],
        tablet: [
            { value: "ipad-air", label: "iPad Air" },
            { value: "ipad-pro-11", label: "iPad Pro 11-inch" },
            { value: "samsung-tab-s8", label: "Samsung Galaxy Tab S8" }
        ]
    };

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
                <select id='screen-size-specific' value={selectedOption['screen-size-specific']} onChange={handleSelectChange} disabled={!selectedOption["screen-size-category"]}>
                    <option value="" disabled hidden>Select a size</option>
                    {selectedOption["screen-size-category"] && 
                        screenSizeOptions[selectedOption["screen-size-category"] as keyof typeof screenSizeOptions]?.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                </select>
            </div>
            <div className='dropdown'>
                <label htmlFor='screen-size-orientation'>Screen Size - Orientation</label>
                <select id='screen-size-orientation' value={selectedOption['screen-size-orientation']} onChange={handleSelectChange} disabled={!selectedOption["screen-size-category"]}>
                    <option value="" disabled hidden>Select an orientation</option>
                    {selectedOption["screen-size-category"] !== "desktop" && (
                        <option value="portrait">Portrait</option>
                    )}
                    <option value="landscape">Landscape</option>
                </select>
            </div>
        </div>
    );
};

export default Dropdown;