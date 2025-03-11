import React, { createContext, useState } from 'react';

export const APIContext = createContext();

const leanscopeAICallContent = client.chat.completions.create(
    model="gpt-4o",
    messages
);

export const APIProvider = ({children}) => {
    const [designMetadata, setDesignMetadata] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [APIResponse, setAPIResponse] = useState(null);
    const [error, setError] = useState(null);

    const submitDesign = async data => {
        setDesignMetadata(data);
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(
                import.meta.env.API_ENDPOINT_MAIN_DOMAIN, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${import.meta.env.LEANSCOPE_BEARER_TOKEN}`},
                    body: JSON.stringify(data)
                }
            );

            if (!response.ok) throw new Error('API request failed!');

            const result = await response.json();
            setAPIResponse(result);
        } catch (e) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const resetState = () => {
        setDesignMetadata({});
        setAPIResponse(null);
        setIsLoading(false);
        setError(null);
    };

    return (
        <APIContext.Provider value={{
            designMetadata,
            APIResponse,
            isLoading,
            error,
            submitDesign,
            resetState
        }}>
            {children}
        </APIContext.Provider>
    );
}