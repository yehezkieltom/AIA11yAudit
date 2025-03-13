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

    const imgURL = img ? URL.createObjectURL(img) : undefined;
    const {setImgURL} = useImageContext();
    const navigate = useNavigate();

    const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setImg(file || null);
        setButtonClicked(true);
    };

    const handleStart = async () => {
        setLoading(true);
        setButtonClicked(false);

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