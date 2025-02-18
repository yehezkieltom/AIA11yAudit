const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;
const SESSION_TOKEN = import.meta.env.VITE_APP_SESSION_TOKEN;

export const streamChatCompletion = async (
  prompt: { role: string, content: string}[],
  file: File | null,
  onStreamData: (chunk: string) => void
): Promise<void> => {
 
  try {
    let base64DataUrl = null;
    if (file) {
      const reader = new FileReader();
      base64DataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    }

    const payload = {
      model: 'gpt-4o',
      messages: prompt,
      images: base64DataUrl
        ? [
            {
              filename: file?.name,
              base64DataUrl: base64DataUrl,
            },
          ]
        : [],
    };

    const response = await fetch(
      `${API_BASE_URL}/ai//stream-chat-completion`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SESSION_TOKEN}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('The response does not contain a body or streaming is not supported.');
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      onStreamData(chunk); 
    }

  } catch (error) {
    console.error('Error during streaming:', error);
    throw error;
  }
};

export default streamChatCompletion

