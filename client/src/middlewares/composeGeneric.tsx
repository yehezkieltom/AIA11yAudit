import Base64ImageOpenAI from "../interfaces/Base64ImageOpenAI"

import { FilteredImage } from "../Filtering/FilterColor";

// type ImageCollectionOpenAI = Array<Base64ImageOpenAI>


export const composeGeneric = (
    imageB64Original: string,
    imageName: string,
    imageB64Filtered: FilteredImage[],
    sysMessage: string,
    /* fewShotExamples: ImageCollectionOpenAI, */
    userMessage: string
) : string => {

    const filteredImage : Base64ImageOpenAI[] = []
    for (const cbMode of imageB64Filtered) {
        filteredImage.push({
            filename: `${imageName}_${cbMode.type}`,
            base64DataUrl: cbMode.image
        });
    }

    return JSON.stringify({
        'model': import.meta.env.VITE_GPT_MODEL,
        'max-completion-tokens' : 100,
        'response_format': {
            'type' : 'json_object'
        },
        'images': [
            {
                'filename': `${imageName}`, //add _nofilter back in later
                'base64DataUrl': `data:image/png;base64,${imageB64Original}`,
            },
            ...filteredImage
/*             ...fewShotExamples */
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