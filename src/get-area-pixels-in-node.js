const { createCanvas, loadImage } = require("canvas");

function isNullObj(obj) {
    return !Object.keys(obj).length;
}

async function getAreaPixels(url, imgArea = {}) {
    const img = await loadImage(url);
    const canvas = createCanvas(img.width, img.height);
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
