import React, { useState, useEffect } from 'react';
import { streamChatCompletion } from '../Api/api';
import applyColBlindFilter, { FilteredImage } from '../Filtering/FilterColor';



const FilterPage = () => {
    const userMessage = 'What do you see in the picture, give some insightful HTML features. Does the contents of the picture align with color blindness?';
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [chatResponse, setChatResponse] = useState('');
    const [isStreamingSend, setIsStreamingSend] = useState(false);
    const [isStreamingFilter, setIsStreamingFilter] = useState(false);
    const [filteredImages, setFilteredImages] = useState<FilteredImage[]>([]);
    const [buttonPushedSend, setButtonPushedSend] = useState(false);
    const [buttonPushedFilter, setButtonPushedFilter] = useState(false);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setSelectedImage(file || null);
        setFilteredImages([]);
        setChatResponse('');
        setButtonPushedSend(false);
        setButtonPushedFilter(false);
      };
    
    const handleImageFilter = async () => {
        if (!selectedImage) return;
        setIsStreamingFilter(true);
        setButtonPushedFilter(true);
    
        try {
          const res = await applyColBlindFilter(selectedImage);
          setFilteredImages(res);
        } catch (error) {
          console.error('Error applying filter', error);
        } finally {
          setIsStreamingFilter(false);
        }
      }
    
    const handleSendMessage = async () => {
        if(!selectedImage) return;
        setIsStreamingSend(true);
        setButtonPushedSend(true);
    
        const prompt = [
          { role: 'user', content: userMessage }, 
        ];
    
        try {
          await streamChatCompletion (prompt, selectedImage, (chunk) => {
            setChatResponse((prev) => prev + chunk);
          });
        } catch (error) {
          console.error('Error during streaming:', error);
        } finally {
          setIsStreamingSend(false);
        }
      };
  
    return (
        <div className='main-cunt' >
            <h1>ChatGPT Integration with Image</h1>
            <p>Please input your desired design/image 😊</p>
            <input type="file" accept="image/png, image/jpeg"  onChange={handleImageChange} disabled={isStreamingSend || isStreamingFilter} />
            <button onClick={handleSendMessage} disabled={isStreamingSend || isStreamingFilter || buttonPushedSend || selectedImage == null}>
                {isStreamingSend ? 'Streaming...' : 'Send'}
            </button>
            <button onClick={handleImageFilter} disabled={isStreamingSend || isStreamingFilter || buttonPushedFilter || selectedImage == null}>
                {isStreamingFilter ? 'Loading...' : 'Filter'}
            </button>
            <div>
                <h2>Response:</h2>
                <p>{chatResponse || (isStreamingSend ? 'Waiting for response...' : 'No response yet')}</p>
            </div>
            <div>
                <h2>Filtered Image:</h2>
                {filteredImages.map(({type, image}, index) => 
                <div key={index}>
                    <h3>{type}</h3>
                    <img src={image}/>
                </div>
                )}
            </div>
        </div> 
    );
};

export default FilterPage;