import './App.css'
import React, { useState, useEffect } from 'react';
import { streamChatCompletion } from './Api/api';
import applyColBlindFilter, { FilteredImage } from './Filtering/FilterColor';
import { Routes, Route } from 'react-router-dom';
import Topbar from './components/Topbar.tsx';
import UploadPage from './Pages/UploadPage.tsx';
import MarkPage from './Pages/MarkPage.tsx';
import EvalPage from './Pages/EvalPage.tsx';
import FilterPage from './Pages/FilterPage.tsx';
import { StatusType, Level } from './Pages/EvalPage.tsx';
import { ImageProvider } from './components/ImageContext.tsx';
import LoadingPage from './Pages/LoadingPage.tsx';
import { APIProvider } from './Api/apiContext.jsx';

function App() {
  const userMessage = 'What do you see in the picture, give some insightful HTML features. Does the contents of the picture align with color blindness?';
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [chatResponse, setChatResponse] = useState('');
  const [isStreamingSend, setIsStreamingSend] = useState(false);
  const [isStreamingFilter, setIsStreamingFilter] = useState(false);
  const [filteredImages, setFilteredImages] = useState<FilteredImage[]>([]);
  const [buttonPushedSend, setButtonPushedSend] = useState(false);
  const [buttonPushedFilter, setButtonPushedFilter] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  const exampleStatus: StatusType = 'Fail';
  const exampleStatus2: StatusType = 'Pass';
  const exampleStatus3: StatusType = 'Warning';
  const exampleLevel: Level = 'A';
  const exampleLevel2: Level = 'AA';
  const exampleLevel3: Level = 'AAA';

  const exampleDataItem = [
    {
      title: "1 - Alternative Text for Images",
      status: exampleStatus3,
      description: "If images are used for critical navigation or CTA buttons, they must include descriptive alt text to be accessible for screen readers.",
      open: false,
      wcag_num: '1.1.1',
      wcag_t: 'Non-text Content',
      level: exampleLevel,
    },
    {
      title: "2 - Polar Bear Video Captions",
      status: exampleStatus2,
      description: "The webpage includes a promotional video (`What is the AHH Effect?`), which seems to be embedded as a YouTube Video, which usually offers automatic captions.",
      open: false,
      wcag_num: ["1.2.1","1.2.2", "1.2.3"],
      wcag_t: 'Multimedia Alternatives',
      level: exampleLevel,
    },
    {
      title: "3 - Navigation Arrows (Carousel & Side Menu) - Color Only Navigators",
      status: exampleStatus3,
      description: "The arrows and navigation buttons use color as the only visual cue, making them difficult to perceive for color-blind users.",
      open: false,
      wcag_num: '1.4.1',
      wcag_t: 'Use of Color',
      level: exampleLevel,
    },
    {
      title: "4 - 'Main Banner (Title & Description) - Text Contrast Issues ",
      status: exampleStatus,
      description: "The white text on the banner (`The Polar Bears`) blends into the background, making it hard to read, especially under color blindness filters.",
      open: false,
      wcag_num: '1.4.3',
      wcag_t: 'Contrast (Minimum)',
      level: exampleLevel2,
    },
    {
      title: "5 - 'Sidebars - Text Contrast Issues'",
      status: exampleStatus,
      description: "The colores text on the left sidebar (`AHH`) blends into the background. The same applies to the Social Media Emebeds on the right sidebar.",
      open: false,
      wcag_num: '1.4.3',
      wcag_t: 'Contrast (Minimum)',
      level: exampleLevel2,
    },
    {
      title: "6 - 'Sidebar (Recent Activity) - Small Text & Readability'",
      status: exampleStatus3,
      description: "The sidebar text is too small and could be difficult to read, especially when zoomed in (up to 200%)",
      open: false,
      wcag_num: '1.4.4',
      wcag_t: 'Resize Text',
      level: exampleLevel2,
    },
    {
      title: "7 - 'UI Layout Might Break on Resize'",
      status: exampleStatus3,
      description: "The side navigation and buttons might overlap or shift when resized, affecting usability.",
      open: false,
      wcag_num: '1.4.10',
      wcag_t: 'Reflow',
      level: exampleLevel2,
    },
    {
      title: "8 - 'Logo & Icons (Coca-Cola Branidng & Social Media) - Visibility Issues'",
      status: exampleStatus,
      description: "Some icons and branding elements become indistinguishable under achromatopsia (grayscale mode)",
      open: false,
      wcag_num: '1.4.11',
      wcag_t: 'Non-text Contrast',
      level: exampleLevel2,
    },
    {
      title: "9 - 'CTA Button Visisbility Issues'",
      status: exampleStatus,
      description: "The `See the Film` button blends into the background under color blindness filters, making it less distinguishable",
      open: false,
      wcag_num: '1.4.11',
      wcag_t: 'Non-text Contrast',
      level: exampleLevel2,
    },
  ];

    const exampleSummary = {
    passed: exampleDataItem.filter((item) => item.status === 'Pass').length,
    total: exampleDataItem.length,
    levelA: exampleDataItem.filter((item) => item.level === 'A').length,
    levelAA: exampleDataItem.filter((item) => item.level === 'AA').length,
    levelAAA:  exampleDataItem.filter((item) => item.level === 'AAA').length,
    description: "The webpage exhibits several accessibility challenges, particularly in contrast, readability, and navigation clarity, which become more pronounced under color blindness simulations. One of the most significant issues is the low contrast in the main banner text and side navigation text, making it difficult to read against the background, especially for users with color vision deficiencies. Additionally, buttons and call-to-action (CTA) elements blend into the background, reducing their visibility and making it harder for users to identify interactive elements. The small text in the sidebar poses a challenge for readability and does not scale well when zoomed in, which could impact users with low vision. Furthermore, the embedded video lacks clear accessibility features, such as captions and audio descriptions, making it inaccessible to users who are deaf or visually impaired. Icons and other interactive elements lack sufficient contrast, making them difficult to distinguish, particularly in grayscale simulations. Moreover, color is used as the only indicator for navigation elements, which creates usability issues for color-blind users who may struggle to differentiate between key visual elements. When viewed under different color blindness filters, the webpage presents several visibility and usability challenges. Users with Protanopia and Deuteranopia (red-green color blindness) may struggle to distinguish the `See the Film` button and yellow UI elements, as they appear faded and blend into the background, making key interactive elements difficult to perceive. For users with Tritanopia (blue-yellow deficiency), the contrast of the main banner is significantly reduced, making it harder to read the title and supporting text. This issue is particularly problematic for content that relies on clear textual presentation. In the case of Achromatopsia (total color blindness), where all colors appear as grayscale, icons and text lose their distinction, making it challenging to differentiate between interactive and non-interactive elements. This can severely impact navigation and overall usability. Similarly, users with Achromatomaly (partial color blindness) experience reduced contrast between light-colored text and light backgrounds, further hindering readability. To improve accessibility for color-blind users, the webpage should incorporate higher contrast ratios, alternative visual indicators (such as borders, patterns, or underlines for interactive elements), and a reduction in reliance on color alone to convey meaning. These adjustments will ensure a more inclusive and user-friendly experience for all visitors, regardless of their visual capabilities.",
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

  useEffect(() => {
    setTimeout(() => setIsLoaded(false), 1000);
  }, []);

  return isLoaded ? <LoadingPage /> :(
    <div>
      <Topbar />
      <APIProvider>
        <ImageProvider>
          <Routes>
            <Route path='/' element={<UploadPage  />} />
            <Route path='/mark' element={<MarkPage />} />
            <Route path='/eval' element={<EvalPage  dummy_data={exampleDataItem} summary={exampleSummary}/>} />
            <Route path='/loading' element={<LoadingPage />} />
            <Route path='/filter' element={<FilterPage />} />
          </Routes>
        </ImageProvider>
      </APIProvider>
    </div>
  );
};

export default App;


/* <Topbar />
      <ImageProvider>
      <Routes>
        <Route path='/' element={<UploadPage  />} />
        <Route path='/mark' element={<MarkPage />} />
        <Route path='/eval' element={<EvalPage  data={exampleDataItem} summary={exampleSummary}/>} />
      </Routes>
      </ImageProvider>
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
      </div> */
