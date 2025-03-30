import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Guidelines } from '../middlewares/composeMetadataContext'
import Metadata from '../interfaces/Metadata';
import { FilteredImage } from '../Filtering/FilterColor';
import guideline1_4_3 from '../middlewares/WCAGuidelines/guideline1_4_3';
import wcagDictionary from '../definitions/WCAGDictionary';
import OpenAI from 'openai';
import { DataItem } from '../Pages/EvalPage';
import guideline1_4_1 from '../middlewares/WCAGuidelines/guideline1_4_1';
import guideline1_1_1 from '../middlewares/WCAGuidelines/guideline1_1_1';
import guideline1_4_11 from '../middlewares/WCAGuidelines/guideline1_4_11';

type GuidelineFun = (metadata: Metadata, imageB64Original: string, imagesB64Filtered: FilteredImage[], imageName: string) => Promise<object>

export interface ApiProviderProps {
    children: ReactNode;
}

export type RequestStatus = 'pending' | 'completed' | 'error';

export interface RequestState {
    status: RequestStatus;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response: any | null;
    error: string | null;
}

export interface RequestsState {
    [requestId: string]: RequestState;
}

export interface APIContextType {
    designMetadata: Metadata;
    requests: RequestsState;
    isLoading: boolean;
    openaiClient: OpenAI
    setIsLoadingExternal: (value: boolean) => void;
    allRequestComplete: () => boolean;
    submitDesign: (
        data: Metadata, 
        originalImageB64: string,
        filename: string,
        filteredImagesB64: FilteredImage[]
    ) => Promise<void>;
    resetState: () => void;
}

const APIContext = createContext<APIContextType|undefined>(undefined);

// const leanscopeAICallContent = client.chat.completions.create(
//     model="gpt-4o",
//     messages
// );

export const APIProvider: React.FC<ApiProviderProps> = ({children}) => {
    const [designMetadata, setDesignMetadata] = useState({} as Metadata);
    const [isLoading, setIsLoading] = useState(false);
    const [requests, setRequests] = useState<RequestsState>({});

    const openaiClient = new OpenAI({
        apiKey: import.meta.env.VITE_OPENAI_BEARER_TOKEN,
        dangerouslyAllowBrowser: true
    });

    const allRequestComplete = (): boolean => {
        if (Object.keys(requests).length === 0) return false;
        return Object.values(requests).every(req => 
            req.status === 'completed' || req.status === 'error'
        )
    };

    const setIsLoadingExternal = (value: boolean): void => {
        setIsLoading(value)
    }


    const submitDesign = async (
        data: Metadata,
        originalImageB64: string,
        filename: string,
        filteredImagesB64: FilteredImage[]
    ) => {
        setDesignMetadata(data);
        setIsLoading(true);
        setRequests({});

        try {
            const promises = [
                sendRequest('1.1.1', guideline1_1_1, originalImageB64, filename, filteredImagesB64),
                sendRequest('1.4.1', guideline1_4_1, originalImageB64, filename, filteredImagesB64),
                sendRequest('1.4.3', guideline1_4_3, originalImageB64, filename, filteredImagesB64),
                sendRequest('1.4.11', guideline1_4_11, originalImageB64, filename, filteredImagesB64)
            ];
            await Promise.allSettled(promises).then(() => {
                console.log('Promises returned but request probably not yet set')
                console.log(JSON.stringify(requests))
            });
        } finally {
            setIsLoading(false);
            // console.log(JSON.stringify(requests))
        }
        
        
        
    };

    const sendRequest = async (
        guideline: Guidelines,
        guidelineFun: GuidelineFun,
        originalImage: string, 
        filename: string, 
        filteredImagesB64: FilteredImage[]
    ) : Promise<unknown> => {
        setRequests(prev => ({
            ...prev,
            [guideline]: {status: 'pending', response: null, error: null}
        }));

        const payload = await guidelineFun(designMetadata, originalImage, filteredImagesB64, filename);
        // console.log(payload);
        // console.log("Preparing to send request")
        try {
            // const response = await fetch(
            //     `${import.meta.env.VITE_API_ENDPOINT_MAIN_DOMAIN}/ai/stream-chat-completion`, {
            //         method: 'POST',
            //         headers: { 
            //             'Authorization': `Bearer ${import.meta.env.VITE_LEANSCOPE_BEARER_TOKEN}`,
            //             "Access-Control-Allow-Origin": "*",
            //             "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
            //             "Content-Type": "application/json",
            //         },
            //         body: payload
            //     }
            // );

            //direct OpenAI access
            const response = await openaiClient.chat.completions.create(payload) //trust me dude

            // console.log("Request sent, waiting for response from OpenAI")
            // if (!completion.choices[0].) {
            //     throw new Error(`Request ${guideline} failed with status ${response.status}\n${response}`);
            // }

            if (response.choices.length === 0) throw new Error("No response");
            if (response.choices[0].message.content === null) throw new Error("Got response, but no content")
        
            const result = JSON.parse(response.choices[0].message.content); //we will get JSON Object as response
            
            // console.log(result.result)

            const expandedResult : DataItem[] = []

            result.result.forEach(element => {
                expandedResult.push({
                    ...element, //including title, description, status
                    open: false,
                    wcag_num: guideline,
                    wcag_t: guideline in wcagDictionary ? wcagDictionary[guideline].text : '',
                    level: guideline in wcagDictionary ? wcagDictionary[guideline].level : ''
                })
            });

            // console.log("Result from apiContext.tsx")
            // console.log(expandedResult);
            // console.log('\n');

            setRequests(prev => ({
                ...prev,
                [guideline]: {
                    status: 'completed', 
                    response: expandedResult,
                    error: null
                }
            }));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occured';
            setRequests(prev => ({
                ...prev,
                [guideline]: {status: 'completed', response: null, error: errorMessage}
            }));
            console.log(errorMessage)
            return {error : errorMessage}
        }
    }

    const resetState = () => {
        setDesignMetadata({});
        setRequests({});
        setIsLoading(false);
    };


    return (
        <APIContext.Provider value={{
            designMetadata,
            requests,
            isLoading,
            openaiClient,
            setIsLoadingExternal,
            allRequestComplete,
            submitDesign,
            resetState
        }}>
            {children}
        </APIContext.Provider>
    );
}

export const useAPI = () : APIContextType => {
    const context = useContext(APIContext);
    if (context === undefined) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
}