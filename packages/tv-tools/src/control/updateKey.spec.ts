import type { Key } from './types';
import { KeyInternal } from './KeyInternal';
import { updateKey } from './updateKey';

describe('updateKey', () => {
	it('should throw if something else than Key is passed', () => {
		const invalidKey = {
			is: () => false,
			toKeyboardEvent: () => new KeyboardEvent('keydown'),
		} satisfies Key;
		expect(() => updateKey(invalidKey, {})).toThrow();
	});

	it('should update keyCodes', () => {
		const key = new KeyInternal([13], ['Enter']);
		updateKey(key, { keyCodes: [14] });
		expect(key.keyCodes).toEqual([14]);
		expect(key.codes).toEqual(['Enter']);
	});

	it('should update codes', () => {
		const key = new KeyInternal([13], ['Enter']);
		updateKey(key, { codes: ['Escape'] });
		expect(key.keyCodes).toEqual([13]);
		expect(key.codes).toEqual(['Escape']);
	});

	it('should update rtlKeyCodes', () => {
		const key = new KeyInternal([13], ['Enter']);
		updateKey(key, { rtlKeyCodes: [14] });
		expect(key.keyCodes).toEqual([13]);
		expect(key.codes).toEqual(['Enter']);
		expect(key.rtlKeyCodes).toEqual([14]);
		expect(key.rtlCodes).toEqual(undefined);
	});

	it('should update rtlCodes', () => {
		const key = new KeyInternal([13], ['Enter']);
		updateKey(key, { rtlCodes: ['Escape'] });
		expect(key.keyCodes).toEqual([13]);
		expect(key.codes).toEqual(['Enter']);
		expect(key.rtlKeyCodes).toEqual(undefined);
		expect(key.rtlCodes).toEqual(['Escape']);
	});

	it('should remove rtlKeyCodes', () => {
		const key = new KeyInternal([13], ['Enter'], [14], ['Escape']);
		updateKey(key, { rtlKeyCodes: undefined });
		expect(key.keyCodes).toEqual([13]);
		expect(key.codes).toEqual(['Enter']);
		expect(key.rtlKeyCodes).toEqual(undefined);
		expect(key.rtlCodes).toEqual(['Escape']);
	});

	it('should remove rtlCodes', () => {
		const key = new KeyInternal([13], ['Enter'], [14], ['Escape']);
		updateKey(key, { rtlCodes: undefined });
		expect(key.keyCodes).toEqual([13]);
		expect(key.codes).toEqual(['Enter']);
		expect(key.rtlKeyCodes).toEqual([14]);
		expect(key.rtlCodes).toEqual(undefined);
	});
});
