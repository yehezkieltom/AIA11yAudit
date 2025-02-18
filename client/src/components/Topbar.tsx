import react from 'react';
import './Topbar.css';
import leanscopelogo from '../assets/svg/leanscopewhitenav.svg';

const Topbar = () => {
    return (
        <div className="topbar">                                    
            <p className='topbar-text'>A11Y - Audit</p>
            <a href='https://www.leanscope.ai' target='_blank'>
                <img src={leanscopelogo} className='topbar-icon'/>
            </a>
        </div>
    );
};

export default Topbar;