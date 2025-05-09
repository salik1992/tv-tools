import { ENTER } from '../control';
import type { FocusManager } from './FocusManager';
import type { ControlEvent } from './types';

/**
 * The behavior class for the end component that displays focus visually.
 * Like buttons, menu items, tiles, etc.
 */
export class Interactable {
	/**
	 * HTMLElement of the component that will be focused.
	 */
	protected element: HTMLElement | undefined;

	/**
	 * If the element is undefined when we receive focus, we store the last
	 * focus options to reuse them once we receive element and the focus is still
	 * valid.
	 */
	protected lastFocusOptions: FocusOptions | undefined;

	/**
	 * Function to trigger when ENTER is pressed while the component is focused
	 * or when the component is clicked with pointer device (left button for mouse)
	 */
	protected onPress: (() => boolean) | undefined;

	/**
	 * Id of the component. It will be autogenerated if not specified.
	 */
	public readonly id: string;

	public constructor(
		/**
		 * Focus manager instance.
		 */
		protected readonly focusManager: FocusManager,
		id?: string,
		/**
		 * Tab index. It will default to 0 if not specififed.
		 */
		protected tabIndex: number = 0,
	) {
		this.id = id ?? this.focusManager.generateId();
		this.focusManager.addFocusId(this.id, this.focus.bind(this));
		this.focusManager.addEventListener(
			this.id,
			this.onKeyDown,
			'keydown',
			'bubble',
		);
	}

	/**
	 * Function for focusing the component.
	 * - If the element exists, it gets focused.
	 * - Otherwise we mark that the focus was requested and we can check again
	 * when we get the element.
	 * @param options - optional FocusOptions
	 */
	public focus(options?: FocusOptions) {
		if (this.element) {
			this.element.focus(options);
		} else {
			this.focusManager.focusTrappedInContainer = this.id;
			this.lastFocusOptions = options;
		}
	}

	/**
	 * Function for setting or removing the element from this component.
	 * @param element - HTMLElement or null or undefined
	 */
	public setElement(element: HTMLElement | null | undefined) {
		this.cleanElement();
		this.element = element ?? undefined;
		this.handleElement();
		if (this.focusManager.focusTrappedInContainer === this.id) {
			this.focus(this.lastFocusOptions);
		}
	}

	/**
	 * Set onPress function.
	 * @param onPress = the onPress function to be called
	 */
	public setOnPress(onPress: () => boolean) {
		this.onPress = onPress;
	}

	/**
	 * Function to update tab index if it is used by the app.
	 */
	public updateTabIndex(tabIndex: number = 0) {
		this.tabIndex = tabIndex;
		if (this.element) {
			this.element.tabIndex = this.tabIndex;
		}
	}

	/**
	 * Cleanup when the component is removed.
	 */
	public destroy() {
		this.focusManager.removeFocusId(this.id);
		this.cleanElement();
	}

	/**
	 * Listener for the key event that will call onPress if ENTER key is used.
	 * @param event - base of the KeyboardEvent
	 */
	protected onKeyDown = (event: ControlEvent): boolean => {
		if (ENTER.is(event)) {
			return this.onPress?.() ?? false;
		}
		return false;
	};

	/**
	 * Listener for pointer click events.
	 * It will call onPress if clicked with left mouse button or touched.
	 */
	protected onClick = (event: MouseEvent) => {
		if (event.button === 0 && this.onPress?.()) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	/**
	 * Focus itself when the pointer is over the component.
	 */
	protected onMouseOver = () => {
		this.focusManager.focus(this.id, { preventScroll: true });
	};

	/**
	 * When we get element, set required properties and attach listeners.
	 */
	protected handleElement() {
		if (!this.element) {
			return;
		}
		this.element.id = this.id;
		this.element.tabIndex = this.tabIndex;
		this.element.addEventListener('click', this.onClick);
		this.element.addEventListener('mouseover', this.onMouseOver);
	}

	/**
	 * Remove event listeners when the element is removed.
	 */
	protected cleanElement() {
		this.element?.removeEventListener('click', this.onClick);
		this.element?.removeEventListener('mouseover', this.onMouseOver);
	}
}
