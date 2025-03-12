import { ENTER } from '../control';
import { focus } from './focus';
import type { ControlEvent } from './types';

/**
 * The behavior class for the end component that displays focus visually.
 * Like buttons, menu items, tiles, etc.
 */
export class Interactable {
	/**
	 * HTMLElement of the component that will be focused.
	 */
	private element: HTMLElement | undefined;

	/**
	 * If the element is undefined when we receive focus, we store the last
	 * focus options to reuse them once we receive element and the focus is still
	 * valid.
	 */
	private lastFocusOptions: FocusOptions | undefined;

	/**
	 * Function to trigger when ENTER is pressed while the component is focused
	 * or when the component is clicked with pointer device (left button for mouse)
	 */
	private onPress: (() => boolean) | undefined;

	constructor(
		/**
		 * Id of the component. It will be autogenerated if not specified.
		 */
		public id: string = focus.generateId(),
		/**
		 * Tab index. It will default to 0 if not specififed.
		 */
		private tabIndex: number = 0,
	) {
		focus.addFocusId(this.id, this.focus.bind(this));
		focus.addEventListener(this.id, this.onKeyDown, 'keydown', 'bubble');
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
			focus.focusTrappedInContainer = this.id;
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
		if (focus.focusTrappedInContainer === this.id) {
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
		focus.removeFocusId(this.id);
		this.cleanElement();
	}

	/**
	 * Listener for the key event that will call onPress if ENTER key is used.
	 * @param event - base of the KeyboardEvent
	 */
	private onKeyDown = (event: ControlEvent): boolean => {
		if (ENTER.is(event)) {
			return this.onPress?.() ?? false;
		}
		return false;
	};

	/**
	 * Listener for pointer click events.
	 * It will call onPress if clicked with left mouse button or touched.
	 */
	private onPointerDown = (event: PointerEvent) => {
		if (
			(event.pointerType !== 'mouse' || event.button === 0) &&
			this.onPress?.()
		) {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	/**
	 * Focus itself when the pointer is over the component.
	 */
	private onPointerMove = () => {
		this.element?.focus();
	};

	/**
	 * When we get element, set required properties and attach listeners.
	 */
	private handleElement() {
		if (!this.element) {
			return;
		}
		this.element.id = this.id;
		this.element.tabIndex = this.tabIndex;
		this.element.addEventListener('pointerdown', this.onPointerDown);
		this.element.addEventListener('pointermove', this.onPointerMove);
	}

	/**
	 * Remove event listeners when the element is removed.
	 */
	private cleanElement() {
		this.element?.removeEventListener('pointerdown', this.onPointerDown);
		this.element?.removeEventListener('pointermove', this.onPointerMove);
	}
}
