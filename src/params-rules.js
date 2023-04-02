const contrast = require('get-contrast');
const getAreaPixels = typeof window === "undefined" ? require('./get-area-pixels-in-node') : require('./get-area-pixels-in-browser');
const getColors = require('./get-colors');

async function getImgColors(imgObj) {
    let hasAreaConf = imgObj.width && imgObj.height ? true : false;
    let imgColors;

    if (hasAreaConf) {
        imgColors = getColors(await getAreaPixels(imgObj.url, {x: imgObj.x, y: imgObj.y, width: imgObj.width, height: imgObj.height}));
    } else {
        imgColors = getColors(await getAreaPixels(imgObj.url));
    }
    return imgColors;
}

const twoColors = {
    condition: function (params) {
        return params.length === 2 && typeof params[0] === 'string' && typeof params[1] === 'string';
    },
    handle: function (params) {
        return contrast.ratio(params[0], params[1]).toFixed(2);
    }
}

const oneColorOneImg = {
    condition: function (params) {
        return params.length === 2 
        && ((typeof params[0] === 'object' && typeof params[1] === 'string') 
            || (typeof params[0] === 'string' && typeof params[1] === 'object'));
    },
    handle: async function (params) {
        let imgObj = typeof params[0] === 'object' ? params[0] : params[1];
        let colorStr = typeof params[0] === 'string' ? params[0] : params[1];
        let imgColors = await getImgColors(imgObj);
        return contrast.ratio(colorStr, imgColors[0].color).toFixed(2);
    }
}

const singleImg = {
    condition: function (params) {
        return params.length === 1 && typeof params[0] === 'object';
    },
    handle: async function (params) {
        let imgObj = params[0];
        let imgColors = await getImgColors(imgObj);
        if (imgColors.length >= 2) {
            return contrast.ratio(imgColors[0].color, imgColors[1].color).toFixed(2);
        } else {
            return 1;
        }
    }
}

const rules = [twoColors, oneColorOneImg, singleImg];
module.exports = rules;
