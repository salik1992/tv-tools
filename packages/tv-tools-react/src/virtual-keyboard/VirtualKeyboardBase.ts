import { VirtualKeyboard } from '@salik1992/tv-tools/virtual-keyboard';

/**
 * VirtualKeyboardBase is extending the VirtualKeyboard class from tv-tools and
 * it overrides setInputValue to work with React where the value is edited on input
 * element and then the "input" event is fired.
 */
export class VirtualKeyboardBase extends VirtualKeyboard {
	protected override setInputValue(value: string) {
		if (this.input) {
			// React will override the value of the input element with its internal state
			// if we use just this.input.value = value;
			// https://stackoverflow.com/a/46012210
			const nativeInputSetter = Object.getOwnPropertyDescriptor(
				HTMLInputElement.prototype,
				'value',
			)?.set;
			if (nativeInputSetter) {
				nativeInputSetter.call(this.input, value);
			} else {
				this.input.value = value;
			}
		}
	}
}
