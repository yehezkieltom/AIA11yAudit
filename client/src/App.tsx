import './App.css'
import React, { useState } from 'react';
import { streamChatCompletion } from './api';
import applyColBlindFilter, {res} from './Filtering/Filter';


function App() {
  const userMessage = 'What do you see in the picture, give some insightful HTML features. Does the contents of the picture align with color blindness?';
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [chatResponse, setChatResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [filteredImages, setFilteredImages] = useState<res[]>([]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedImage(file || null);
    setFilteredImages([]);
    console.log(file);
  };

  const handleImageFilter = async () => {
    console.log('Hello!')
    if(!selectedImage) return;
    console.log('Hello!2')
    try{
      const res = await applyColBlindFilter(selectedImage);
      setFilteredImages(res);
    } catch (error) {
      console.error('Error applying filter', error);
    }
  }

  const handleSendMessage = async () => {
    console.log('Hello!')
    if(!selectedImage) return;
    console.log('Hello!2')
    try{
      const res = await applyColBlindFilter(selectedImage);
      setFilteredImages(res);
    } catch (error) {
      console.error('Error applying filter', error);
    }
    console.log('Test');
    setIsStreaming(true);

    const prompt = [
      { role: 'user', content: userMessage }, 
    ];

    try {
      await streamChatCompletion (prompt, selectedImage, (chunk) => {
        setChatResponse((prev) => prev + chunk); // Append each chunk to the chat response
      });
    } catch (error) {
      console.error('Error during streaming:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div>
      <h1>ChatGPT Integration with Image</h1>
      <p>Please input your desired design/image 😊</p>
      <input type="file" accept="image/*"  onChange={handleImageChange} disabled={isStreaming} />
      <button onClick={handleSendMessage} disabled={isStreaming || selectedImage == null}>
        {isStreaming ? 'Streaming...' : 'Send'}
      </button>
      <button onClick={handleImageFilter} disabled={isStreaming || selectedImage == null}>
        {isStreaming ? 'Loading...' : 'Filter'}
      </button>
      <div>
        <h2>Response:</h2>
        <p>{chatResponse || (isStreaming ? 'Waiting for response...' : 'No response yet')}</p>
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

export default App
