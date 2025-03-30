/* eslint-disable no-useless-escape */
import composeGeneric from "../composeGeneric"
import composeMetadataContext from "../composeMetadataContext"
// import Base64ImageOpenAI from "../../interfaces/Base64ImageOpenAI"
import Metadata from "../../interfaces/Metadata"
import { FilteredImage } from "../../Filtering/FilterColor"


const guideline1_1_1 = async (metadata: Metadata, imageB64Original: string, imagesB64Filtered: FilteredImage[], imageName: string) => {
    const systemMessage = `
    You are an expert in **web accessibility and WCAG compliance**, that advises a design team on how to improve the accessibility of their webpages based on WCAG 1.1.1 - Non-text Content.

    You will be provided with an image of a UI Design. mention the elements that are that are not text, especially graphics. Describe the relative location of each element in the image. And then, for each element make a description of what you see in regard to the element. After that, mark the element with "Warning" regardless.

    *** JSON Answer format ***
    "[\n    {\n        \"title\": \"***Short descriptive name of the element***\",\n        \"status\": \"***Warning***\",\n        \"description\":  \"***Consise description about the element relative location on the screen, and the element itself.***\"\n    }\n]"
    `;
    const userMessage = composeMetadataContext(imageName, metadata, "1.1.1");
/* 
    const ex1 : Base64ImageOpenAI = {
        filename: 'bla',
        base64DataUrl: await getBase64() //read example file
    }

    const fewShotExamples : ImageCollectionOpenAI = [ex1];
 */
    return composeGeneric(imageB64Original, imageName, imagesB64Filtered, systemMessage, /* fewShotExamples, */ userMessage);
}

export default guideline1_1_1;