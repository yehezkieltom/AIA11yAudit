import React from "react";
import './Button.css';

interface ButtonProps {
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ isActive, onClick, children }) => {
    return (
        <button className={`button ${isActive ? 'active' : ''}`}onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
