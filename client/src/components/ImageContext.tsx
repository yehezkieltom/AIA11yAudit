import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImageContextProps { 
    imgURL?: string;
    setImgURL: (imgURL: string) => void;
    iconImgURL?: string;
    setIconImgURL: (iconImgURL: string) => void;
};

const ImageContext = createContext<ImageContextProps | null>(null);

export const ImageProvider = ({children}: {children: ReactNode}) => {
    const [imgURL, setImgURL] = useState<string | undefined>();
    const [iconImgURL, setIconImgURL] = useState<string | undefined>();

    return (
        <ImageContext.Provider value={{imgURL, setImgURL, iconImgURL, setIconImgURL}}>
            {children}
        </ImageContext.Provider>
    );
};

export const useImageContext = () => {
    const context = useContext(ImageContext);
    if(!context){
        throw new Error('ImageContext must be used within ImageProvider');
    }
    return context;
}