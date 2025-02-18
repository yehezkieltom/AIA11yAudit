
    export interface FilteredImage {
            type: 'protanopia' | 'protanomaly' | 'deuteranopia' | 'deuteranomaly' | 'tritanopia' | 'tritanomaly' |'achromatopsia' | 'achromatomaly';
            image: string; 
            };
  
    declare const applyColBlindFilter: (image: File) => Promise<FilteredImage[]>;

    export default applyColBlindFilter;
