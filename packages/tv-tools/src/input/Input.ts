import { ENTER, INPUT_DONE } from '../control';
import { type Interactable, focus } from '../focus';
import { EventListener, type IEventListener } from '../utils/EventListener';
import { runAsync } from '../utils/runAsync';
import type { CharRenderData, InputEvents, RenderData } from './types';

export class Input implements IEventListener<InputEvents> {
	protected events = new EventListener<InputEvents>();

	public addEventListener = this.events.addEventListener;
	public removeEventListener = this.events.removeEventListener;

	/**
	 * The input element that is being used for input of the text.
	 */
	protected element: HTMLInputElement | undefined;

	/**
	 * The render data of the Input component..
	 */
	protected renderData: RenderData = {
		active: false,
		placeholder: false,
		value: '',
		caret: 0,
		selection: null,
	};

	protected boundOnBlur = this.onBlur.bind(this);
	protected boundOnSelect = this.onSelect.bind(this);
	protected boundOnKeyUp = this.onKeyUp.bind(this);
	protected boundOnKeyDown = this.onKeyDown.bind(this);
	protected boundOnChange = this.onChange.bind(this);
	protected boundOnInteractablePress = this.onInteractablePress.bind(this);

	/**
	 * The interactable component that is used to wrap the input element.
	 */
	public constructor(public interactable: Interactable) {
		this.interactable.setOnPress(this.boundOnInteractablePress);
	}

	/**
	 * Sets the input element that is being used for input of the text.
	 * @param element The input element to be set or cleared.
	 */
	public setInputElement(element: HTMLInputElement | null) {
		this.cleanElement();
		this.element = element ?? undefined;
		this.prepareElement();
	}

	/**
	 * Returns the render data of the Input component.
	 * @returns The render data of the Input component
	 */
	public getRenderData(): CharRenderData {
		return { type: 'char', ...this.renderData };
	}

	/**
	 * Cleans up the input element and removes all event listeners.
	 */
	public destroy() {
		this.cleanElement();
	}

	/**
	 * Prepares the input element by adding all the necessary event listeners.
	 */
	protected prepareElement() {
		if (this.element) {
			this.element.addEventListener('blur', this.boundOnBlur);
			this.element.addEventListener('select', this.boundOnSelect);
			this.element.addEventListener('keyup', this.boundOnKeyUp);
			this.element.addEventListener('keydown', this.boundOnKeyDown);
			this.element.addEventListener('change', this.boundOnChange);
			this.element.addEventListener('input', this.boundOnChange);
			this.updateRenderData();
		}
	}

	/**
	 * Cleans up the input element by removing all the event listeners.
	 */
	protected cleanElement() {
		if (this.element) {
			this.element.removeEventListener('blur', this.boundOnBlur);
			this.element.removeEventListener('select', this.boundOnSelect);
			this.element.removeEventListener('keyup', this.boundOnKeyUp);
			this.element.removeEventListener('keydown', this.boundOnKeyDown);
			this.element.removeEventListener('change', this.boundOnChange);
			this.element.removeEventListener('input', this.boundOnChange);
		}
	}

	/**
	 * Focuses the interactable component if it exists in focus management.
	 */
	protected focusInteractable() {
		if (focus.hasFocusId(this.interactable.id)) {
			focus.focus(this.interactable.id, { preventScroll: true });
			this.updateRenderData();
		}
	}

	/**
	 * Updates the render data of the Input component and triggers the event if
	 * Something has changed since the last time.
	 */
	protected updateRenderData() {
		if (this.element) {
			const caret =
				this.element.selectionDirection === 'backward'
					? (this.element.selectionStart ?? 0)
					: (this.element.selectionEnd ?? 0);
			const start = this.element.selectionStart ?? 0;
			const end = this.element.selectionEnd ?? 0;
			const value = this.element.value;
			const placeholder =
				this.element.value.length === 0 && !!this.element.placeholder;
			const active = document.activeElement === this.element;
			const selection =
				start !== end
					? ([Math.min(start, end), Math.max(start, end)] as [
							number,
							number,
						])
					: null;
			if (
				this.renderData.active !== active ||
				this.renderData.placeholder !== !!placeholder ||
				this.renderData.value !== value ||
				this.renderData.caret !== caret ||
				JSON.stringify(this.renderData.selection) !==
					JSON.stringify(selection)
			) {
				this.renderData.active = active;
				this.renderData.value = this.getVisualValue();
				this.renderData.placeholder = placeholder;
				this.renderData.caret = caret;
				this.renderData.selection = selection;
				this.events.triggerEvent('renderData', this.getRenderData());
			}
		}
	}

	/**
	 * Returns the visual value of the input element.
	 * @returns The visual value of the input element
	 */
	protected getVisualValue() {
		if (!this.element) {
			return '';
		}
		const { value } = this.element;
		if (value.length === 0) {
			return this.element.placeholder ?? '';
		}
		if (this.element.type === 'password') {
			return value.replace(/./g, '●');
		}
		return value;
	}

	/**
	 * Handles the input done event.
	 * @param event The keyboard event that triggered this function.
	 */
	protected inputDone(event: KeyboardEvent) {
		this.focusInteractable();
		event.preventDefault();
		event.stopPropagation();
	}

	/**
	 * Handles the blur event of the input element.
	 */
	protected onBlur() {
		this.focusInteractable();
	}

	/**
	 * Handles the select event of the input element.
	 */
	protected onSelect() {
		this.updateRenderData();
	}

	/**
	 * Handles the key down event of the input element.
	 * @param event The keyboard event that triggered this function.
	 */
	protected onKeyDown(event: KeyboardEvent) {
		runAsync(() => this.updateRenderData());
		if (ENTER.is(event) && document.activeElement === this.element) {
			this.inputDone(event);
		}
	}

	/**
	 * Handles the key up event of the input element.
	 * @param event The keyboard event that triggered this function.
	 */
	protected onKeyUp(event: KeyboardEvent) {
		if (INPUT_DONE.is(event)) {
			this.inputDone(event);
		}
		this.updateRenderData();
	}

	/**
	 * Handles the change event of the input element.
	 * @param event The keyboard event that triggered this function.
	 */
	protected onChange() {
		this.updateRenderData();
	}

	/**
	 * Handles the interactable press event and focuses the input element..
	 * @returns True if the event was handled, false otherwise.
	 */
	protected onInteractablePress() {
		if (this.element) {
			this.element.focus();
			this.updateRenderData();
		}
		return true;
	}
}
