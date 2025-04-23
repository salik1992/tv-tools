import { type Interactable } from '@salik1992/tv-tools/focus';
import { Input } from '@salik1992/tv-tools/input';

export class InputBase extends Input {
	protected boundOnInteractablePress = this.onInteractablePress.bind(this);

	constructor(
		interactable: Interactable,
		private overrides: {
			onInteractablePress?: () => boolean;
		},
	) {
		super(interactable);
		this.interactable.setOnPress(this.boundOnInteractablePress);
	}

	protected override onInteractablePress() {
		if (this.overrides.onInteractablePress) {
			return this.overrides.onInteractablePress();
		}
		return super.onInteractablePress();
	}
}
