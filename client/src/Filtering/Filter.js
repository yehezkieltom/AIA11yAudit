import  filter from 'image-filter-color';
import  fs from 'fs';

//Colorblindness types
const colFilter = {
    deuteranopia: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
    protanopia: [0.56667, 0.43333, 0, 0.55833, 0.44167, 0, 0, 0.24167, 0.75833],
    tritanopia: [0.95, 0.05, 0, 0, 0.43333, 0.56667, 0, 0.475, 0.525],
    protanomaly: [0.816, 0.184, 0, 0.333, 0.667, 0, 0, 0.125, 0.875],
    deuteranomaly: [0.8, 0.2, 0, 0.258, 0.742, 0, 0, 0.142, 0.858],
    tritanomaly: [0.967, 0.033, 0, 0, 0.733, 0.267, 0, 0.183, 0.817],
    achromatopsia: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
    achromatomaly: [0.618, 0.320, 0.062, 0.163, 0.775, 0.062, 0.163, 0.320, 0.516],
};

const applyColBlindFilter = async (file) => {
    const results = [];

    const img = new Promise((resolve, reject) => {
        const image = new Image();
        const reader = new FileReader();

        reader.onload = () => {
            image.src = reader.result;
            image.onload = () => resolve(image);
            image.onerror = reject;
        };
        reader.readAsDataURL(file);
    });

    for (const [blindness, values] of Object.entries(colFilter)) {
        console.log(img)
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        var context = canvas.getContext('2d');
        // TODO : ISSUE HERE DONT KNOW HOW TPO FIX
        context.drawImage(img, 0, 0);

        var data = context.getImageData(0, 0, canvas.width, canvas.height);
        var filt_img = filter(data, values);
        context.putImageData(filt_img, 0, 0);

        results.push({type, image: canvas.toDataURL("image/png")});
    }

return results;
};

export default applyColBlindFilter
