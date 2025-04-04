import React from 'react';
import './ImagePlaceholder.css';
import placeholder from '../assets/image-2.png';

interface ImagePlaceholderProps {
    img?: string;
}

const ImagePlaceholder = ({img}: ImagePlaceholderProps) => {
    return (
        <div className="image-placeholder">
            <div className='image-placeholder-box'>
                {img ? (    
                    <div className='uploaded-placeholder-container'>
                        <img src={img} className='uploaded-placeholder-image' alt="Uploaded content"/>
                    </div>
                ) : (
                    <img src={placeholder} className='image-placeholder-image' alt="Placeholder"/>
                )}
            </div>
        </div>
    );
};

export default ImagePlaceholder;