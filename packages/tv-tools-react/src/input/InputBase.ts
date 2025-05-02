import type { FocusManager, Interactable } from '@salik1992/tv-tools/focus';
import { Input } from '@salik1992/tv-tools/input';

/**
 * InputBase is extending the Input class from tv-tools and add possibility to override
 * onInteractablePress method.
 */
export class InputBase extends Input {
	protected override boundOnInteractablePress =
		this.onInteractablePress.bind(this);

	public constructor(
		focusManager: FocusManager,
		interactable: Interactable,
		protected overrides: {
			onInteractablePress?: () => boolean;
		},
	) {
		super(focusManager, interactable);
		this.interactable.setOnPress(this.boundOnInteractablePress);
	}

	protected override onInteractablePress() {
		if (this.overrides.onInteractablePress) {
			return this.overrides.onInteractablePress();
		}
		return super.onInteractablePress();
	}
}
