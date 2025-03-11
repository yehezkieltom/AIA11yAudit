export const getBase64 = (file : File) : Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result;

            if (typeof result === 'string') {
                resolve(result.split(',')[1])
            } else if (result instanceof ArrayBuffer) {
                const binary = Array.from(new Uint8Array(result))
                    .map(b => String.fromCharCode(b))
                    .join('');
                resolve(btoa(binary));
            } else {
                //kinda impossible to ended up here
                reject(new Error('FileReader result is null'));
            }
        };

        reader.onerror = () => reject(reader.error);

        reader.readAsDataURL(file);
    });
}