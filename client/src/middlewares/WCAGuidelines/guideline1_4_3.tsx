/* eslint-disable no-useless-escape */
import composeGeneric from "../composeGeneric"
import composeMetadataContext from "../composeMetadataContext"
// import Base64ImageOpenAI from "../../interfaces/Base64ImageOpenAI"
import Metadata from "../../interfaces/Metadata"
import { FilteredImage } from "../../Filtering/FilterColor"


const guideline1_4_3 = async (metadata: Metadata, imageB64Original: string, imagesB64Filtered: FilteredImage[], imageName: string) => {
    const systemMessage = `
    You are an expert in **web accessibility and WCAG compliance**, that advises a design team on how to improve the accessibility of their webpages based on WCAG 1.4.3 - Text Contrast (Minimum).

    You will be provided with multiple image of a UI Design with different color filter that simulates color blindness and the original without color filter. Using the original image (filename suffixed with "_nofilter") mention elements that are applicable to this guideline and describe the relative location of each element in the image. And then, for each element make a description of what you see in regard to the text styling like the coloring and its background color, text weight, case and font family. refer sans serif font as normal. After that, decide if it passed or failed the Success Criterion Contrast (Minimum) of Web Content Accessibility Guideline.
    Additionally, if similar image with color blind filter is provided, then check again the element(s) that passed the standard WCAG 1.4.3 in the image with color filter whether or not the element still has minimum contrast value required by WCAG 1.4.3, if no, then return "Warning".
    If the image consist of multiple component, only return "Pass" If all of the components are passing the this Success Criterion. Otherwise, return "Failed".
    If the image has multiple component with repeating style, only describe the first unique component and ignore the rest.
    Never include color hexcode in the response.

    *** JSON Answer format ***
    "[\n    {\n        \"title\": \"***Short descriptive name of the component***\",\n        \"status\": \"***If the component passed both Standard WCA Guideline and Additional Colorblind check, then Pass. If the component only passed Standard WCA Guideline but not the Additional Colorblind check, then Warning. Otherwise, Failed***\",\n        \"description\":  \"***Consise description about the element relative location on the screen, relevant styling to checked WCAG Criterion. If the component not passed the test, give a helpful short explanation on why it didn't passed***\"\n    }\n]"
    `;
    const userMessage = composeMetadataContext(imageName, metadata, "1.4.3");
/* 
    const ex1 : Base64ImageOpenAI = {
        filename: 'bla',
        base64DataUrl: await getBase64() //read example file
    }

    const fewShotExamples : ImageCollectionOpenAI = [ex1];
 */
    return composeGeneric(imageB64Original, imageName, imagesB64Filtered, systemMessage, /* fewShotExamples, */ userMessage);
}

export default guideline1_4_3;