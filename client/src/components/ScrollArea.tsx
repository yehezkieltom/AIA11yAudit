import React from 'react';
import './ScrollArea.css';

interface ScrollAreaProps {
    children: React.ReactNode;
}

const ScrollArea: React.FC<ScrollAreaProps> = ({ children }) => {
    return (
        <div className='scroll-area'>
            {children}
        </div>
    );
};

export default ScrollArea;