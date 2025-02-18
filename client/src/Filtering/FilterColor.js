import { protanopia, protanomaly, deuteranopia, deuteranomaly, tritanopia, tritanomaly, achromatopsia, achromatomaly } from 'color-blind';

const cbTypes = [
    'protanopia',
    'protanomaly',
    'deuteranopia',
    'deuteranomaly',
    'tritanopia',
    'tritanomaly',
    'achromatopsia',
    'achromatomaly',
  ];

const applyColorBlindnessToPixels = (imgData, blindnessType) => {
    for (let i = 0; i < imgData.data.length; i += 4) {
      let r = imgData.data[i];
      let g = imgData.data[i + 1];
      let b = imgData.data[i + 2];
      
      let hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  
      let newHex;
  
      switch (blindnessType) {
        case 'protanopia':
          newHex = protanopia(hex);
          break;
        case 'protanomaly':
            newHex = protanomaly(hex);
            break;
        case 'deuteranopia':
          newHex = deuteranopia(hex);
          break;
        case 'deuteranomaly':
            newHex = deuteranomaly(hex);
            break;
        case 'tritanopia':
          newHex = tritanopia(hex);
          break;
        case 'tritanomaly':
            newHex = tritanomaly(hex);
            break;
        case 'achromatopsia':
          newHex = achromatopsia(hex);
          break;
        case 'achromatomaly':
            newHex = achromatomaly(hex);
            break;
        default:
          newHex = hex;
      }
  
      r  = parseInt(newHex.slice(1, 3), 16);
      g =  parseInt(newHex.slice(3, 5), 16);
      b =  parseInt(newHex.slice(5, 7), 16);

      imgData.data[i] = r;
      imgData.data[i + 1] = g;
      imgData.data[i + 2] = b;
    }
  };
  
const applyColBlindFilter = (image) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                context.drawImage(img, 0, 0);
                const imgData = context.getImageData(0, 0, img.width, img.height);

                const filteredImages = cbTypes.map((type) => {
                    applyColorBlindnessToPixels(imgData, type);
                    context.putImageData(imgData, 0, 0);

                    const filteredImage = canvas.toDataURL();
                    return {
                        type,
                        image: filteredImage,
                    };
                });

                console.log('Filtered images: ', filteredImages);

                resolve(filteredImages);
            };

            img.onerror = (err) => reject('Error loading image: ' + err);
        };

        reader.onerror = (err) => reject('Error reading file: ' + err);

        reader.readAsDataURL(image);
    });
};

export default applyColBlindFilter;