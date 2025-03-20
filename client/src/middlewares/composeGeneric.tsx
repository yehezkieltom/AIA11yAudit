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
) : object => {

    const filteredImage : Base64ImageOpenAI[] = []
    for (const cbMode of imageB64Filtered) {
        filteredImage.push({
            filename: `${imageName}_${cbMode.type}`,
            base64DataUrl: cbMode.image
        });
    }

    return {
        model: import.meta.env.VITE_GPT_MODEL,
        response_format: {
    "type": "json_schema",
    "json_schema": {
        "name": "ui_analysis_report",
        "description": "Give a report on an uploaded UI design based on a specific Web Content Accessibility Guideline Success Criterion",
        "schema": {
        "type": "object",
        "properties": {
          "result": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "title": {
                  "type": "string",
                  "description": "Short descriptive name of the UI element or component"
                },
                "status": {
                  "type": "string",
                  "description": "If the component passed both Standard WCAG Guideline and Additional Colorblind check, then Pass. If the component only passed the Standard WCAG Guideline but not the Additional Colorblind check, then Warning. Otherwise, Fail",
                  "enum": ["Pass", "Warning", "Fail"]
                },
                "description": {
                  "type": "string",
                  "description": "Concise description of the element’s relative location on the screen, relevant styling to checked WCAG Criterion. If the component did not pass the test, provide a short explanation on why it failed."
                }
              },
              "required": ["title", "status", "description"]
            }
          }
        },
        "required": ["result"]
      }
    }
  },
        messages:[
            {
                role: 'system',
                content: sysMessage
            },
            {
                role: 'user',
                content: [
                    {
                        type: 'text', text: userMessage
                    },
                    {
                        type: 'image_url',
                        image_url: {
                            url: `data:image/png;base64,${imageB64Original}`
                        } //need to find a way to attach the filtered images too
                    }
                ]
            }
        ]
    };
}

export default composeGeneric;