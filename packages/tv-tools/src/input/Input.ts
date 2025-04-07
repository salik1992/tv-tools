import { INPUT_DONE } from '../control';
import { type Interactable, focus } from '../focus';
import { EventListener, type IEventListener } from '../utils/EventListener';
import { runAsync } from '../utils/runAsync';
import type { CharRenderData, InputEvents, RenderData } from './types';

export class Input implements IEventListener<InputEvents> {
	private events = new EventListener<InputEvents>();

	public addEventListener = this.events.addEventListener;
	public removeEventListener = this.events.removeEventListener;

	private element: HTMLInputElement | undefined;

	private renderData: RenderData = {
		active: false,
		placeholder: false,
		value: '',
		caret: 0,
		selection: null,
	};

	constructor(public interactable: Interactable) {
		this.interactable.setOnPress(this.onInteractablePress);
	}

	public setInputElement(element: HTMLInputElement | null) {
		this.cleanElement();
		this.element = element ?? undefined;
		this.prepareElement();
	}

	public getRenderData(): CharRenderData {
		return { type: 'char', ...this.renderData };
	}

	public destroy() {
		this.cleanElement();
	}

	private prepareElement() {
		if (this.element) {
			this.element.addEventListener('blur', this.onBlur);
			this.element.addEventListener('select', this.onSelect);
			this.element.addEventListener('keyup', this.onKeyUp);
			this.element.addEventListener('keydown', this.onKeyDown);
			this.element.addEventListener('change', this.onChange);
			this.element.addEventListener('input', this.onChange);
			this.updateRenderData();
		}
	}

	private cleanElement() {
		if (this.element) {
			this.element.removeEventListener('blur', this.onBlur);
			this.element.removeEventListener('select', this.onSelect);
			this.element.removeEventListener('keyup', this.onKeyUp);
			this.element.removeEventListener('keydown', this.onKeyDown);
			this.element.removeEventListener('change', this.onChange);
			this.element.removeEventListener('input', this.onChange);
		}
	}

	private focusInteractable() {
		if (focus.hasFocusId(this.interactable.id)) {
			focus.focus(this.interactable.id, { preventScroll: true });
			this.updateRenderData();
		}
	}

	private updateRenderData() {
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

	private getVisualValue() {
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

	private onBlur = () => {
		this.focusInteractable();
	};

	private onSelect = () => {
		this.updateRenderData();
	};

	private onKeyDown = () => {
		runAsync(() => this.updateRenderData());
	};

	private onKeyUp = (event: KeyboardEvent) => {
		if (INPUT_DONE.is(event)) {
			this.focusInteractable();
			event.preventDefault();
			event.stopPropagation();
		}
		this.updateRenderData();
	};

	private onChange = () => {
		this.updateRenderData();
	};

	private onInteractablePress = () => {
		if (this.element) {
			this.element.focus();
			this.updateRenderData();
		}
		return true;
	};
}
