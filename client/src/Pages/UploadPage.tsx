import ImagePlaceholder from "../components/ImagePlaceholder";
import Dropdown from "../components/Dropdown";
import './UploadPage.css';
import uploadlogo from '../assets/svg/upload.svg';
import arrowRight from '../assets/svg/arrow-right.svg';
import placeholder from '../assets/image-2.png';
import LoadingPage from "./LoadingPage";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useImageContext } from "../components/ImageContext";

const UploadPage = () => {
    const [img, setImg] = useState<File | null>(null);
    const [buttonClicked, setButtonClicked] = useState(false);
    const [dropdownValues, setDropdownValues] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);

    const imgURL = img ? URL.createObjectURL(img) : undefined;
    const {setImgURL} = useImageContext();
    const navigate = useNavigate();

    const handleImgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setImg(file || null);
        setButtonClicked(true);
    };

    const handleStart = () => {
        setLoading(true);
        setButtonClicked(false);
        console.log(imgURL);
        console.log(JSON.stringify(dropdownValues));
        if(imgURL) {
            setImgURL(imgURL);
        }
        setTimeout(() => {
            setLoading(false);
            navigate('/eval');
        }, 2000);
    }
    const handleBack = () => {
        setButtonClicked(false);
        setImg(null);
    }

    const handleDropdownChange = (values: { [key: string]: string }) => {
        setDropdownValues(values);
    }

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
            </div>        
        </div>
    );
}

export default UploadPage;