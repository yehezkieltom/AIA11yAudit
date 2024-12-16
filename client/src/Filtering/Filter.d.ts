
    export type cbtype = 
      | "deuteranopia" 
      | "protanopia" 
      | "tritanopia" 
      | "protanomaly" 
      | "deuteranomaly" 
      | "tritanomaly" 
      | "achromatopsia" 
      | "achromatomaly";

    export type matrix = [number, number, number, number, number, number, number, number, number];

    export const colFilter: Record<cbtype, matrix>;

    export interface res {
        type: cbtype;
        image: string;
    }

    
    declare const applyColBlindFilter: (img: File) =>  Promise<res[]>;
    export default applyColBlindFilter



