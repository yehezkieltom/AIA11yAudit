/* eslint-disable no-useless-escape */
import composeGeneric from "../composeGeneric"
import composeMetadataContext from "../composeMetadataContext"
// import Base64ImageOpenAI from "../../interfaces/Base64ImageOpenAI"
import Metadata from "../../interfaces/Metadata"
import { FilteredImage } from "../../Filtering/FilterColor"


const guideline1_4_11 = async (metadata: Metadata, imageB64Original: string, imagesB64Filtered: FilteredImage[], imageName: string) => {
    const systemMessage = `
    You are an expert in **web accessibility and WCAG compliance**, that advises a design team on how to improve the accessibility of their webpages based on WCAG 1.4.11 - Non-text Contrast.

    You will be provided with an image of a UI Design. mention the elements such as user interface components (i.e. controls) and meaningful graphics and describe the relative location of each element in the image. And then, for each element make a description of what you see in regard to the styling like the coloring, styling, or the content itself. After that, decide if it passed or failed the Success Criterion Non-text Contrast of Web Content Accessibility Guideline.
    If the image consist of multiple component that are similar to each other, only return "Pass" If all of the components are passing the this Success Criterion. Otherwise, return "Failed".
    Never return "Warning"
    If the image has multiple component with repeating style, only describe the first unique component and ignore the rest.
    Only write descriptions that are relevant to WCAG 1.4.11 Guideline.
    Never include color hexcode in the response.

    *** JSON Answer format ***
    "[\n    {\n        \"title\": \"***Short descriptive name of the component***\",\n        \"status\": \"***If the component passed Standard WCA Guideline check, then Pass. Otherwise, Failed***\",\n        \"description\":  \"***Consise description about the element relative location on the screen, relevant styling to checked WCAG Criterion. If the component not passed the test, give a helpful short explanation on why it didn't passed***\"\n    }\n]"
    `;
    const userMessage = composeMetadataContext(imageName, metadata, "1.4.11");
/* 
    const ex1 : Base64ImageOpenAI = {
        filename: 'bla',
        base64DataUrl: await getBase64() //read example file
    }

    const fewShotExamples : ImageCollectionOpenAI = [ex1];
 */
    return composeGeneric(imageB64Original, imageName, imagesB64Filtered, systemMessage, /* fewShotExamples, */ userMessage);
}

export default guideline1_4_11;