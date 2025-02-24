import { clamp } from './clamp';

describe('clamp', () => {
	it('should pass the inbetween value', () => {
		expect(clamp(0, 10, 100)).toBe(10);
	});

	it('should clamp to the min when below min', () => {
		expect(clamp(0, -10, 100)).toBe(0);
	});

	it('should clamp to the max when above max', () => {
		expect(clamp(0, 1000, 100)).toBe(100);
	});
});
