import { Level } from "../Pages/EvalPage";

const wcagDictionary: Record<string, {text: string; details: string, level: Level}> = {

        "1.1.1": {text: "Ensure all non-text content has a text alternative.", details: "This includes images, charts, graphs, audio files, and videos. Provide alt text or transcripts where applicable." , level: "A"},
        "1.2.1": {text: "Provide alternatives for time-based media such as captions and transcripts.", details: "Ensure that users with hearing impairments can access media content via text-based alternatives.", level: "A"},
        "1.2.3": {text: "Provide an audio description for pre-recorded video content.", details: "This helps visually impaired users by describing visual elements in a video.", level: "A"},
        "1.2.4": {text: "Include captions for live multimedia presentations.", details: "Live captions should be provided for any real-time streaming or broadcast events.", level: "A"},
        "1.2.5": {text: "Ensure an audio description track is available for synchronized media.", details: "For videos, provide an alternative audio track describing important visual content.", level: "A"},
        "1.2.6": {text: "Provide sign language interpretation for pre-recorded audio content.", details: "Consider embedding a sign language interpreter video alongside the main content.", level: "A"},
        "1.2.7": {text: "Extend audio descriptions for media when necessary.", details: "For complex visual content, allow additional audio descriptions beyond the default.", level: "AA"},
        "1.2.8": {text: "Offer text alternatives for live video content.", details: "For live broadcasts, provide real-time captions or text-based descriptions.", level: "AA"},
        "1.2.9": {text: "Ensure sign language interpretation for live media.", details: "If possible, include a live interpreter on-screen during broadcasts.", level: "AAA"},
        "1.4.1": {text: "Use of Color", details: "Ensure color is not the sole means of conveying information, distinguishing elements, or prompting action.", level: "A"},
        "1.4.3": {text: "Contrast (Minimum)", details: "Ensure text and images of text have a contrast ratio of at least 4.5:1 (or 3:1 for large text).", level: "AA"},
        "1.4.4": {text: "Allow text resizing without loss of content or functionality.", details: "Ensure that users can increase font sizes without breaking the layout or hiding essential content.", level: "AA"},
        "1.4.10": {text: "Reflow", details: "Ensure content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions for text content at 400% zoom.", level: "AA"},
        "1.4.11": {text: "Non-text Contrast", details: "Ensure that graphical elements essential for understanding content have a contrast ratio of at least 3:1.", level: "AA"}
    }

export default wcagDictionary;