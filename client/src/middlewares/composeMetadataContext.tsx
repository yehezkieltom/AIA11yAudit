import Metadata from '../interfaces/Metadata';


export const guidelines = ["1.1.1", "1.4.1", "1.4.3", "1.4.10", "1.4.11" ] as const
export type Guidelines = typeof guidelines[number]
// export type Guidelines = "1.1.1" | "1.4.1" | "1.4.3" | "1.4.10" | "1.4.11";

const composeMetadataContext = (imageName: string, metadata: Metadata, guideline: Guidelines) => {
  // const filtertypes = filteredImages.map(filterImg => filterImg.type).join(',');

  /* \\sorry but this is just way too much information.
    const message = `
    You are an expert in **web accessibility and WCAG compliance**, that advises a design team on how to improve the accessibility of their webpages.
    
    Analyze the given **static webpage design and its variations under different color blindness simulations** for accessibility issues according to the **Web Contnet Accessibility Guidelines (WCAG)**, specifically focusing on:
    - **1.1.1 Non-text Content**: Ensure tha essential non-text elements(e.g. images, icons) are **clearly interpretable** and **do not solely rely on color** to convey meaning.
    - **1.2.1 - 1.2.9 Multimedia Content**: Identify any issues that might make content **inaccessible to users who rely on caption, audio description, or text alternatives.**
    - **1.4.4 Resize Text**: Determine whether **text elements remain readable and usable when resized up to 200%** without loss of information or functionality.

    ---

    Regarding the design, please consider the following:
    - **Design Type**: Static Webpage

    ### ***Metadata:***

    This design is intended to be viewed on the following device configurations;
    - **Screen Size Category**: ${metadata['screen-size-category']}
    - **Screen Size Specific**: ${metadata['screen-size-specific']}
    - **Screen Size Orientation**: ${metadata['screen-size-orientation']}

    ***Important Considerations:***
    - The **screen size and resolution impact how to the webpage layout, text, and UI elements are displayed**.
    - The **screen orientation (portrait/landscape) changes the way elements are arranged** on the page.


    ### Color Blindness Type Filters Applied: 
    The design has been processed through multiple color blindness filters. The following filters were applied: ${filtertypes}. 
    The filtered versions of the design must be compared to detect **contrast issues, visibility loss, and readability concerns**.

    ### Your Tasks:
    1. **WCAG 1.1.1 - Non-Text Content**
      - Does the design contain **non-text information (icons, buttons, UI elements) that **becomes indistinguishable under different color filters?**
      - Are **alternative visual cues (shapes, patterns, labels)** present to avoid reliance on color alone?
      - If text is embedded in the design, **would a screen reader require an alternative description** to convey the same information?
      - Ensure **non-text elements remain distinguishable** across different color blindness filters.
      - If the design contains decorative images, confirm that they **do not interfere with readavility**.

    2. **WCAG 1.2.1 - 1.2.9 Multimedia Content**
    Evaluate whether the design complies with the following multimedia accessibility guidelines and evaluate whether it includes elements that would require accessibility considerations if implemented:
      - **1.2.1 Audio-only and Video-only (Prerecorded)**: 
                - Does teh design **contain placeholders for videos or audio elements** that might require alternative text or transcripts?
                - Would a **text desccription** be required for users who cannot hear or see these elements?

      - **1.2.2 Captions (Prerecorded)**: 
                - If the design includes a **video player component or a recorded media section**, does it indicate **captioning support** (e.g. via buttons to display such captioning )?

      - **1.2.3 Audio Description or Media Alternative (Prerecorded)**: 
                - If a **large visual-based content** is present, would users with vision impairments **require an alternative text description**?

      - **1.2.4 Captions (Live)**: 
                - If **placeholders for live streams** exist, should **captions be required and if so, are UI elements present to display them**?
      - **1.2.5 Audio Description (Prerecorded)**: 
                - If an **image-based infographic or complex visual** is present, would a **text alternative** be needed for blind users and if so, are **UI elements provided to display them**?

      - **1.2.6 Sign Language (Prerecorded)**: 
                - If the design suggests an **embedded sign language video**, is it positioned clearly for visibility?

      - **1.2.7 Extended Audio Description (Prerecorded)**: 
                - If the design includes **complex visual sequences**, does it provide an alternative way for users to understand them?

      - **1.2.8 Media Alternative (Prerecorded)**: Are **media alternatives available for all multimedia content**?
                - Would a **text-based alternative** be necessary for any **visual information presented on the page**?

      - **1.2.9 Audio-only (Live)**: Are **audio descriptions available for all multimedia content**?
                - If **placeholders for audio-only content** exist, are **alternative text descriptions** provided and if so, are there **UI elemenst provided to display them**?

    3. **WCAG 1.4.4 Resize Text**
      - Can all text be resized up to **200% without breaking the layout**?
      - Does **text remain readbale and properly spaced** at larger sizes?
      - Are **interactive elements (buttons, links, form fields)** still usable at increased text sizes?

    4. **Compare the Color-Blind Filtered Versions of the Design Against the Original**
      - Identify if any **essential UI elements become indistinguishable** under certain color blindness filters.
      - Check if **text remains radable** across all versions.
      - Evaluate if **interactive elements (buttons, links, form fields)** remain **visually distinct** and **perceivable**.
      - Ensure **sufficient contrast between text and background colors** to avoid readability issues.

    5. **Accessibility Recommendations**
      - Provide specific **WCAG-aligned** recommendations to improve accessibility.
      - Suggest **contrasta adjustments, alternative color schemes, additional visual cues, or layout refinements** to enhance the design's accessibility.
      - Recommend any **text or alternative descriptions** that should be included to improve the design's accessibility.`;
 */

  
  return `I have a UI design named ${imageName} that is tailored made for ${metadata['screen-size-specific']} in ${metadata['screen-size-orientation']} orientation. I would like you to check whether or not the design is WCAG ${guideline} compliant.`
}

export default composeMetadataContext

/* {{Include array of filtered versions}} /*
/* ...filteredImages.map(img => ({
  role: "user",
  content: [{ type: "text", text: `This is the webpage design screenshot processed for ${img.type} color blindness.` }, { type: "image_url", image_url: img.image }]
})) */