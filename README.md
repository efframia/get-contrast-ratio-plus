# get-contrast-ratio-plus
获取2个色值、1个色值与图像的主题色、图像的主次色的对比度。<br>
This package could get the contrast ratio between two colors, one color & the theme color of an image, or the top-2 theme colors of an image.
# Install
```
npm install get-contrast-ratio-plus
```
# Usage
Tip: use Promise/await
```javascript
const getContrastRatio = require('get-contrast-ratio-plus')

// 计算所传入2个色值的对比度。支持多种色值格式，例如：rgb、rgba、hsl
// Calculate the contrast ratio of the 2 colors ​passed in.Support multiple color formats, such as rgb, rgba, hsl, etc.
const twoColors = await getContrastRatio('#ffffff', '#000000')

// 计算传入的1个色值与指定图片主题色的对比度。需传入图片url、初始坐标x、初始坐标y、区域宽度width、区域宽度height构成的对象
// Calculate the contrast ratio between the input color and the specified image theme color. 
// The object composed of image's url, initial coordinate x, initial coordinate y, area width width, and area width height needs to be passed in.
const oneColorOneImage = await getContrastRatio('#ffffff', { url: 'picture.png', x: 0, y: 0, width: 100, height: 100 })

// 计算图片部分区域的主次色对比度
// Calculate the contrast ratio of the top-2 theme colors of part of the image.
const partOfSingleImage = await getContrastRatio({ url: 'picture.png', x: 0, y: 0, width: 100, height: 100 })

// 可省略x、y、width、height等信息，此时默认求整个图片的主次色对比度
// Information such as x, y, width, and height could be omitted.
// Then calculate the contrast ratio of the top-2 theme colors of the entire image by default.
const singleImage = await getContrastRatio({ url: 'picture.png' })
```