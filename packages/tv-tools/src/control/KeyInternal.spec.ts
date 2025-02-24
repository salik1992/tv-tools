import { KeyInternal as Key } from './KeyInternal';

describe('Key', () => {
	it('should recognize itself', () => {
		const enter = new Key([13], ['Enter']);
		const eventWithKeyCodeOnly = { keyCode: 13 };
		const eventWithCodeOnly = { code: 'Enter' };
		const eventWithBoth = { keyCode: 13, code: 'Enter' };
		expect(enter.is(eventWithKeyCodeOnly)).toBe(true);
		expect(enter.is(eventWithCodeOnly)).toBe(true);
		expect(enter.is(eventWithBoth)).toBe(true);
	});

	it('should not recognize other keys', () => {
		const enter = new Key([13], ['Enter']);
		const eventWithKeyCodeOnly = { keyCode: 14 };
		const eventWithCodeOnly = { code: 'Escape' };
		const eventWithBoth = { keyCode: 14, code: 'Escape' };
		expect(enter.is(eventWithKeyCodeOnly)).toBe(false);
		expect(enter.is(eventWithCodeOnly)).toBe(false);
		expect(enter.is(eventWithBoth)).toBe(false);
	});

	it('should recognize all variants with rtl', () => {
		const left = new Key([37], ['ArrowLeft'], [39], ['ArrowRight']);
		const leftToRight = { keyCode: 37, code: 'ArrowLeft' };
		const rightToLeft = { keyCode: 39, code: 'ArrowRight' };
		expect(left.is(leftToRight)).toBe(true);
		expect(left.is(rightToLeft)).toBe(false);
		document.documentElement.dir = 'rtl';
		expect(left.is(leftToRight)).toBe(false);
		expect(left.is(rightToLeft)).toBe(true);
		expect(left.is(leftToRight, { ignoreRtl: true })).toBe(true);
		expect(left.is(rightToLeft, { ignoreRtl: true })).toBe(false);
		document.documentElement.dir = 'ltr';
	});

	it('should recognize its own event', () => {
		const enter = new Key([13], ['Enter']);
		const event = enter.toKeyboardEvent('keydown');
		expect(enter.is(event)).toBe(true);
	});

	it('converts to string nicely', () => {
		const enter = new Key([13], ['Enter']);
		expect(`${enter}`).toBe('[Enter]');
	});
});
