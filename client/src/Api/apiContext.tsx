import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Guidelines } from '../middlewares/composeMetadataContext'
import Metadata from '../interfaces/Metadata';
import { FilteredImage } from '../Filtering/FilterColor';
import guideline1_4_3 from '../middlewares/WCAGuidelines/guideline1_4_3';
import wcagDictionary from '../definitions/WCAGDictionary';

type GuidelineFun = (metadata: Metadata, imageB64Original: string, imagesB64Filtered: FilteredImage[], imageName: string) => Promise<string>

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

export const APIContext = createContext<APIContextType|undefined>(undefined);

// const leanscopeAICallContent = client.chat.completions.create(
//     model="gpt-4o",
//     messages
// );

export const APIProvider: React.FC<ApiProviderProps> = ({children}) => {
    const [designMetadata, setDesignMetadata] = useState({} as Metadata);
    const [isLoading, setIsLoading] = useState(false);
    const [requests, setRequests] = useState<RequestsState>({});

    const allRequestComplete = (): boolean => {
        if (Object.keys(requests).length === 0) return false;
        return Object.values(requests).every(req => 
            req.status === 'completed' || req.status === 'error'
        )
    };

    const setIsLoadingExternal = (value: boolean): void => {
        setIsLoading(value)
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const submitDesign = async (
        data: Metadata,
        originalImageB64: string,
        filename: string,
        filteredImagesB64: FilteredImage[]
    ) => {
        setDesignMetadata(data);
        setIsLoading(true);
        setRequests({});
        // try {
        //     const response = await fetch(
        //         import.meta.env.API_ENDPOINT_MAIN_DOMAIN, {
        //             method: 'POST',
        //             headers: { 'Authorization': `Bearer ${import.meta.env.LEANSCOPE_BEARER_TOKEN}`},
        //             body: JSON.stringify(data)
        //         }
        //     );

        //     if (!response.ok) throw new Error('API request failed!');

        //     const result = await response.json();
        //     setRequests(result);
        // } catch (e) {
        //     setError(e.message);
        // } finally {
        //     setIsLoading(false);
        // }

        // TODO: send request for each guideline

        const promises = [
            sendRequest('1.4.3', guideline1_4_3, originalImageB64, filename, filteredImagesB64)
        ];
        
        await Promise.allSettled(promises);
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

        const payload = JSON.parse(await guidelineFun(designMetadata, originalImage, filteredImagesB64, filename));
        console.log(payload);
        console.log("Preparing to send request")
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_ENDPOINT_MAIN_DOMAIN}/ai/stream-chat-completion`, {
                    method: 'POST',
                    headers: { 
                        'Authorization': `Bearer ${import.meta.env.VITE_LEANSCOPE_BEARER_TOKEN}`,
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                        "Content-Type": "application/json",
                    },
                    body: payload
                }
            );
            console.log("Request sent, waiting for response from OpenAI")
            if (!response.ok) {
                throw new Error(`Request ${guideline} failed with status ${response.status}\n${response}`);
            }

            const result = await response.json();

            setRequests(prev => ({
                ...prev,
                [guideline]: {
                    status: 'completed', 
                    response: {
                        ...result,
                        open: false,
                        wcag_num: guideline,
                        wcag_t: guideline in wcagDictionary ? wcagDictionary[guideline].text : '',
                        level: guideline in wcagDictionary ? wcagDictionary[guideline].level : '',
                    },
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