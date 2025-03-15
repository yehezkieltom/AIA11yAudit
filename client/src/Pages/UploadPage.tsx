import ImagePlaceholder from "../components/ImagePlaceholder";
import Dropdown from "../components/Dropdown";
import './UploadPage.css';
import uploadlogo from '../assets/svg/upload.svg';
import arrowRight from '../assets/svg/arrow-right.svg';
//import placeholder from '../assets/image-2.png';
import LoadingPage from "./LoadingPage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImageContext } from "../components/ImageContext";
import { getBase64 } from "../middlewares/getBase64";
import applyColBlindFilter, { FilteredImage } from '../Filtering/FilterColor';
import { useAPI } from "../Api/apiContext";
import { hex as wcagContrast} from 'wcag-contrast';
import { constrainedMemory } from "process";
import { color } from "framer-motion";

const UploadPage = () => {
    const { submitDesign } = useAPI();
    const [img, setImg] = useState<File | null>(null);
    const [filteredImages, setFilteredImages] = useState<FilteredImage[]>([]);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [dropdownValues, setDropdownValues] = useState<{ [key: string]: string }>({
        "screen-size-category" : "",
        "screen-size-specific" : "",
        "screen-size-orientation" : ""
    });
    const [loading, setLoading] = useState(false);
    // const [jsonScreen, setJsonScreen] = useState('');
    const [contrastIssues, setContrastIssues] = useState<{ x: number; y: number}[]>([]);
    const [iconImg, setIconImg] = useState<string | null >(null);

    const imgURL = img ? URL.createObjectURL(img) : undefined;
    const {setImgURL, setIconImgURL } = useImageContext();
    const navigate = useNavigate();

    const rgbToHex = (r: number, g: number, b: number) => {
        return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
    };

    const getMostFrequentColor = (data: Uint8ClampedArray) => {
        const colorMap = new Map<string, number>();

        for (let i = 0; i < data.length; i += 4) {
            const hex = rgbToHex(data[i], data[i + 1], data[i + 2]);
            colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
        }

        return [...colorMap.entries()].sort((a, b) => b[1] - a[1])[0][0];
    };

    const analyzeContrast = async (imgFile: File) => {
        const sectionCountX = 5;
        const sectionCountY = 5;
        const frequentColorInSection = (data: Uint8ClampedArray, width: number, height: number, sectionX: number, sectionY: number, sectionWidth: number, sectionHeight: number, topN = 3) => {
            const colorMap = new Map<string, number>();
            for(let y= sectionY; y < sectionY + sectionHeight; y++) {
                for(let x = sectionX; x < sectionX + sectionWidth; x++) {
                    const i = (y * width + x) * 4;
                    const hex = rgbToHex(data[i], data[i + 1], data[i + 2]);
                    colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
                }
            }
            return [...colorMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, topN).map(entry => entry[0]);
        };
        const getMostFrequentColor = (data: Uint8ClampedArray, topN = 3) => {
            const colorMap = new Map<string, number>();
            for (let i = 0; i < data.length; i += 4) {
                const hex = rgbToHex(data[i], data[i + 1], data[i + 2]);
                colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
            }
            return [...colorMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, topN).map(entry => entry[0]);
        };
        return new Promise<{ x: number; y: number }[]>((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(imgFile);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve([]);

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const data = imageData.data;
                const sectionWidth = Math.floor(img.width / sectionCountX);
                const sectionHeight = Math.floor(img.height / sectionCountY);
                const sectionBackground: string[][] = [];

                for (let sy = 0; sy < sectionCountY; sy++) {
                    sectionBackground[sy] = [];
                    for (let sx = 0; sx < sectionCountX; sx++) {
                        const sectionX = sx * sectionWidth;
                        const sectionY = sy * sectionHeight;
                        const dominantColor = frequentColorInSection(data, img.width, img.height, sectionX, sectionY, sectionWidth, sectionHeight);
                        sectionBackground[sy][sx] = dominantColor[0];
                    }
                }

                const issues: { x: number; y: number }[] = [];

                for(let y = 0; y < img.height - 1; y+= 10) {
                    for(let x = 0; x < img.width - 1; x+= 10) {
                        const i = (y * img.width + x) * 4;
                        const hex1 = rgbToHex(data[i], data[i + 1], data[i + 2]);

                        const sx = Math.floor(x / sectionWidth);
                        const sy = Math.floor(y / sectionHeight);
                        const backgroundColor = sectionBackground[sy]?.[sx] || '#FFFFFF';
                        
                        if(hex1 !== backgroundColor) {
                            const j = ((y + 10) * img.width + (x + 10)) * 4;
                            const hex2 = rgbToHex(data[j], data[j + 1], data[j + 2]);

                            if(hex2 == backgroundColor && wcagContrast(hex1, hex2) < 4.5) {
                                issues.push({ x, y });
                            }
                        }
                    }
                }

                resolve(issues);

            };
        });
    };


    const overlayIcons = async (imgFile: File, issues : { x: number; y: number }[]) => {
        return new Promise<string>((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(imgFile);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) return resolve('');

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                const iconSVG = `
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="yellow" stroke="black" stroke-width="2"/>
                    <rect x="11" y="6" width="2" height="8" fill="black"/>
                    <circle cx="12" cy="18" r="1.5" fill="black"/>
                </svg>
                `;

                const icon = new Image();
                const svgBlob = new Blob([iconSVG], { type: "image/svg+xml;charset=utf-8" });
                const url = URL.createObjectURL(svgBlob);

                icon.src = url;
                icon.onload = () => {
                    issues.forEach(({ x, y }) => {
                        ctx.drawImage(icon, x-10, y-10, 20, 20);
                    });

                    URL.revokeObjectURL(url);

                    resolve(canvas.toDataURL('image/png'));
                };
            };
        });
    }

    const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setImg(file || null);
        setButtonClicked(true);
        
    };

    const handleStart = async () => {
        setLoading(true);
        setButtonClicked(false);

        if(!img) return;
        const issues = await analyzeContrast(img);
        setContrastIssues(issues);

        const processedImg = await overlayIcons(img, issues);
        setIconImg(processedImg);


        {/* Filter Logic */}
        // if(!img) return;
        // try {
        //     const res =  await applyColBlindFilter(img);
        //     setFilteredImages(res);
        //   } catch (error) {
        //     console.error('Error applying filter', error);
        // };
    
        const imageB64 = img ? getBase64(img) : '';
     //UI Debugging   
        console.log(imgURL);
        // console.log(jsonScreen);
        if(imgURL) {
            setImgURL(imgURL);
        }

        if(processedImg) {
            setIconImgURL(processedImg);
        }

        setTimeout(() => {
            setLoading(false);
            navigate('/eval');
        }, 2000); 
        //end here
        
        //TODO: handle form and send request
        // await submitDesign(dropdownValues, await imageB64, img.name, filteredImages)
        

        // navigate('/eval')
    }
    const handleBack = () => {
        setButtonClicked(false);
        setImg(null);
    }

    const handleDropdownChange = (values: { [key: string]: string }) => {
        setDropdownValues(values);
        // setJsonScreen(JSON.stringify(values));
    }

    /* const handleDebug = () => {
        console.log(dropdownValues)
        console.log(jsonScreen)
    } */

/*     const handleDebugSimpleOpenAIReq = async () => {
        try {
            //${import.meta.env.VITE_API_ENDPOINT_MAIN_DOMAIN}/ai/stream-chat-completion`
        const response = await fetch(
            `https://api.leanscope.io/ai/stream-chat-completion`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_LEANSCOPE_BEARER_TOKEN}`,
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
                },
                body: {
                    "model": "gpt-4o",
                    "messages": [
                        {
                            "role": "user",
                            "content": "Hello"
                        }
                    ]
                }
            }
        );
        console.log(response);
        } catch(e) {
            console.log(e);
        }

        
    } */

    console.log()

    return loading ? ( <LoadingPage /> ) : (
        <div className="upload-page">
            <div className= "placeholder-area">
                <ImagePlaceholder img = {imgURL} />
                {!buttonClicked && (
                     <button className="upload-button">
                         Upload Image
                         <img src={uploadlogo} width="20" height="20" />
                         <input type="file" accept="image/jpeg, image/png" onChange={handleImgChange} />
                     </button>
                )} 
                {buttonClicked && (
                        <button className="back-button" onClick={handleBack}>
                            Back
                        </button>
                )}
            </div>
            <div className="dropdown-area">          
                <Dropdown onChange={handleDropdownChange}/> 
                {buttonClicked && (  
                    <button className="start-button" onClick={handleStart}>
                        Start 
                        <img src={arrowRight} width="20" height="20"/>
                    </button>
                )}
                {/* for testing */}
                {/* <button className="start-button" onClick={handleDebug}>
                    check dropdownValues
                </button> */}
                {/* <button className="start-button" onClick={handleDebugSimpleOpenAIReq}>
                    check simple request
                </button> */}
            </div>        
        </div>
    );
}

export default UploadPage;