import { isRtl } from './isRtl';

describe('isRtl', () => {
	it('should return true if document direction is rtl', () => {
		Object.defineProperty(document.documentElement, 'dir', {
			value: 'rtl',
			writable: true,
		});
		expect(isRtl()).toBe(true);
	});

	it('should return false if document direction is ltr', () => {
		Object.defineProperty(document.documentElement, 'dir', {
			value: 'ltr',
			writable: true,
		});
		expect(isRtl()).toBe(false);
	});

	it('should return false if document direction is not set', () => {
		Object.defineProperty(document.documentElement, 'dir', {
			value: '',
			writable: true,
		});
		expect(isRtl()).toBe(false);
	});
});
