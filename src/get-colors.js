function getColors(data) {
    const colorsMap = {};

    for (let i = 0; i < data.length; i += 4) {
        let alpha = data[i + 3];
        // skip fully transparent pixels
        if (alpha === 0) continue;

        let rgbComponents = Array.from(data.subarray(i, i + 3));

        // skip undefined data
        if (rgbComponents.indexOf(undefined) !== -1) continue;

        let color = `rgb(${rgbComponents.join(',')})`;

        if (colorsMap[color]) {
            colorsMap[color].count++;
        } else {
            colorsMap[color] = { color, count: 1 };
        }
    }

    const colors = Object.values(colorsMap);
    return colors.sort((a, b) => b.count - a.count);
}

module.exports = getColors;
