import Metadata from "../interfaces/Metadata"
import Base64ImageOpenAI from "../interfaces/Base64ImageOpenAI"

type ImageCollectionOpenAI = Array<Base64ImageOpenAI>


export const composeGeneric = async (
    metadata: Metadata,
    imageB64: string,
    imageName: string,
    sysMessage: string,
    fewShotExamples: ImageCollectionOpenAI,
    userMessage: string
) : Promise<string> => {
    return JSON.stringify({
        'model': import.meta.env.GPT_MODEL,
        'max-completion-tokens' : 100,
        'images': [
            {
                'filename': imageName,
                'base64DataUrl': imageB64,
            },
            ...fewShotExamples
        ],
        'messages':[
            {
                'role': 'system',
                'content': sysMessage
            },
            {
                'role': 'user',
                'content': userMessage
            }
        ]
    });
}

export default composeGeneric;