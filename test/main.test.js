const getContrastRatio = require('../dist/get-contrast-ratio');

test('contrast with two colors', async () => {
	expect(await getContrastRatio('#ffffff', '#000000')).toBe('21.00');
});

test('contrast with one color & one image', async () => {
	expect(await getContrastRatio('#ffffff', { url: 'test/test.png', x: 0, y: 0, width: 100, height: 100 })).toBe('1.49');
});

test('contrast with the top-2 main colors of single image', async () => {
	expect(await getContrastRatio({ url: 'test/test.png' })).toBe('1.24');
});
