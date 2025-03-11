import composeGeneric from "../composeGeneric"
import composeMetadataContext from "../composeMetadataContext"
import Base64ImageOpenAI from "../../interfaces/Base64ImageOpenAI"
import { getBase64 } from "../getBase64"

type ImageCollectionOpenAI = Array<Base64ImageOpenAI>


const guideline1_4_1 = async (metadata, imageB64, imageName) => {
    const systemMessage = ''
    const userMessage = composeMetadataContext()

    const ex1 : Base64ImageOpenAI = {
        filename: 'bla',
        base64DataUrl: await getBase64() //read example file
    }

    const fewShotExamples : ImageCollectionOpenAI = [ex1];

    composeGeneric(metadata, imageB64, imageName, systemMessage, fewShotExamples, userMessage)
}

export default guideline1_4_1;