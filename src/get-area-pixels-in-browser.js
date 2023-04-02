function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
}

function isNullObj(obj) {
    return !Object.keys(obj).length;
}

async function getAreaPixels(url, imgArea = {}) {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    let pixels;
    if (isNullObj(imgArea)) {
        pixels = ctx.getImageData(0, 0, img.width, img.height);
    } else {
        pixels = ctx.getImageData(
            imgArea.x,
            imgArea.y,
            imgArea.width,
            imgArea.height
        );
    }
    return pixels.data;
}

module.exports = getAreaPixels;
