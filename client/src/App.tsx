import './App.css'
import React, { useState } from 'react';
import { streamChatCompletion } from './Api/api';
import applyColBlindFilter, { FilteredImage } from './Filtering/FilterColor';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar.tsx';
import UploadPage from './Pages/UploadPage.tsx';
import MarkPage from './Pages/MarkPage.tsx';
import EvalPage from './Pages/EvalPage.tsx';
import { StatusType, Level } from './Pages/EvalPage.tsx';
import { ImageProvider } from './components/ImageContext.tsx';

function App() {
  const userMessage = 'What do you see in the picture, give some insightful HTML features. Does the contents of the picture align with color blindness?';
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [chatResponse, setChatResponse] = useState('');
  const [isStreamingSend, setIsStreamingSend] = useState(false);
  const [isStreamingFilter, setIsStreamingFilter] = useState(false);
  const [filteredImages, setFilteredImages] = useState<FilteredImage[]>([]);
  const [buttonPushedSend, setButtonPushedSend] = useState(false);
  const [buttonPushedFilter, setButtonPushedFilter] = useState(false);

  const exampleStatus: StatusType = 'Fail';
  const exampleStatus2: StatusType = 'Pass';
  const exampleStatus3: StatusType = 'Warning';
  const exampleLevel: Level = 'A';
  const exampleLevel2: Level = 'AA';
  const exampleLevel3: Level = 'AAA';

  const exampleDataItem = [
    {
      title: "1 - Points",
      status: exampleStatus,
      description: "This component is only using color for its 2 unique options. Furthermore, there is no explanation for what this color signifies.",
      open: true,
      wcag_num: 1.4,
      wcag_t: 'Use of Color',
      level: exampleLevel,
    },
    {
      title: "2 - Pie Diagram",
      status: exampleStatus2,
      description: "This component is only using color that is mapped to a data point in the legend. 1.4.3 Contrast (Minimum) (Level AA) is violated. The title and legend are illegible. Ensure a minimum of 18pt or 14pt bold with a high contrast ratio.",
      open: false,
      wcag_num: 1.4,
      wcag_t: 'Use of Color',
      level: exampleLevel2,
    },
    {
      title: "3 - Green switch",
      status: exampleStatus,
      description: "This switch relies solely on color to indicate state. Consider adding a label or icon.",
      open: false,
      wcag_num: 1.4,
      wcag_t: 'Use of Color',
      level: exampleLevel,
    },
    {
      title: "4 - 'Please enter your name'",
      status: exampleStatus3,
      description: "This input field meets accessibility guidelines.",
      open: false,
      wcag_num: 1.4,
      wcag_t: 'Use of Color',
      level: exampleLevel3,
    },
    {
      title: "4 - 'Please enter your name'",
      status: exampleStatus,
      description: "This input field meets accessibility guidelines.",
      open: false,
      wcag_num: 1.4,
      wcag_t: 'Use of Color',
      level: exampleLevel,
    },
    {
      title: "4 - 'Please enter your name'",
      status: exampleStatus,
      description: "This input field meets accessibility guidelines.",
      open: false,
      wcag_num: 1.4,
      wcag_t: 'Use of Color',
      level: exampleLevel,
    },
    {
      title: "4 - 'Please enter your name'",
      status: exampleStatus,
      description: "This input field meets accessibility guidelines.",
      open: false,
      wcag_num: 1.4,
      wcag_t: 'Use of Color',
      level: exampleLevel,
    },
    {
      title: "4 - 'Please enter your name'",
      status: exampleStatus,
      description: "This input field meets accessibility guidelines.",
      open: false,
      wcag_num: 1.4,
      wcag_t: 'Use of Color',
      level: exampleLevel,
    },
    {
      title: "4 - 'Please enter your name'",
      status: exampleStatus,
      description: "This input field meets accessibility guidelines.",
      open: false,
      wcag_num: 1.4,
      wcag_t: 'Use of Color',
      level: exampleLevel,
    },
    {
      title: "4 - 'Please enter your name'",
      status: exampleStatus,
      description: "This input field meets accessibility guidelines.",
      open: false,
      wcag_num: 1.4,
      wcag_t: 'Use of Color',
      level: exampleLevel,
    },
    {
      title: "4 - 'Please enter your name'",
      status: exampleStatus,
      description: "This input field meets accessibility guidelines.",
      open: false,
      wcag_num: 1.4,
      wcag_t: 'Use of Color',
      level: exampleLevel,
    },
  ];

    const exampleSummary = {
    passed: exampleDataItem.filter((item) => item.status === 'Pass').length,
    total: exampleDataItem.length,
    levelA: exampleDataItem.filter((item) => item.level === 'A').length,
    levelAA: exampleDataItem.filter((item) => item.level === 'AA').length,
    levelAAA:  exampleDataItem.filter((item) => item.level === 'AAA').length,
    description: "The color selection in this design requires significant adjustments to avoid frequent proximity of red and green. However, the contrast of the fonts remains very clear and can be retained.The color selection in this design requires significant adjustments to avoid frequent proximity of red and green. However, the contrast of the fonts remains very clear and can be retained.The color selection in this design requires significant adjustments to avoid frequent proximity of red and green. However, the contrast of the fonts remains very clear and can be retained.The color selection in this design requires significant adjustments to avoid frequent proximity of red and green. However, the contrast of the fonts remains very clear and can be retained. The color selection in this design requires significant adjustments to avoid frequent proximity of red and green. However, the contrast of the fonts remains very clear and can be retained.",
    checklists: [
      "Ensure sufficient color contrast.",
      "Provide text alternatives for all icons and images.",
      "Use semantic HTML elements for better accessibility.",
      "Ensure interactive elements are keyboard navigable."
    ],
  };

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
    <div>
      <Topbar />
      <ImageProvider>
      <Routes>
        <Route path='/' element={<UploadPage  />} />
        <Route path='/mark' element={<MarkPage />} />
        <Route path='/eval' element={<EvalPage  data={exampleDataItem} summary={exampleSummary}/>} />
      </Routes>
      </ImageProvider>
    </div>
  );
};

export default App;


/* <div className='main-cunt' >
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
      </div> */
