import { VirtualKeyboard } from '@salik1992/tv-tools/virtual-keyboard';

export class VirtualKeyboardBase extends VirtualKeyboard {
	protected override setInputValue(value: string) {
		if (this.input) {
			// React will override the value of the input element with its internal state.
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
