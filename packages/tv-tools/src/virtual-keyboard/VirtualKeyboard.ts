import { BACK, ENTER } from '../control';
import { TableFocusContainer } from '../focus';
import { EventListener, IEventListener } from '../utils/EventListener';
import { toEntries } from '../utils/toEntries';
import { NON_PRINTABLE_CHARS } from './NonPrintableChars';
import {
	ADD,
	BACKSPACE,
	CAPS,
	DEL,
	DONE,
	END,
	Effect,
	HOME,
	LAYOUT,
	LEFT,
	NEXT_EFFECT,
	RIGHT,
	SHIFT,
	SHIFT_AND_CAPS,
	add,
} from './constants';
import type {
	FullVirtualKeyboardLayouts,
	InternalAction,
	VirtualKeyboardEvents,
	VirtualKeyboardLayouts,
} from './types';
import { validateLayouts } from './validateLayouts';

/**
 * VirtualKeyboard is a class that manages the state and behavior of a virtual keyboard.
 */
export class VirtualKeyboard implements IEventListener<VirtualKeyboardEvents> {
	/**
	 * Handles the events triggered by the virtual keyboard.
	 */
	protected events = new EventListener<VirtualKeyboardEvents>();

	/**
	 * @link EventListener.addEventListener
	 */
	public addEventListener = this.events.addEventListener;

	/**
	 * @link EventListener.removeEventListener
	 */
	public removeEventListener = this.events.removeEventListener;

	/**
	 * The full virtual keyboard layouts where all keys have all details.
	 */
	protected layouts: FullVirtualKeyboardLayouts;

	/**
	 * The current layout of the virtual keyboard.
	 */
	protected currentLayout: string;

	/**
	 * The current effect of the virtual keyboard (e.g., SHIFT, CAPS).
	 */
	protected effect: Effect = Effect.NONE;

	/**
	 * The input element that the virtual keyboard is associated with.
	 */
	protected input: HTMLInputElement | undefined;

	constructor(
		layouts: VirtualKeyboardLayouts,
		public container: TableFocusContainer,
	) {
		validateLayouts(layouts);
		this.layouts = this.prepareLayouts(layouts);
		this.currentLayout = Object.keys(this.layouts)[0];
	}

	/**
	 * Assigns an input element to the virtual keyboard.
	 * If undefined is passed, the keyboard will not control any element.
	 * @param input The optional input element to be assigned.
	 */
	public assignInput(input: HTMLInputElement | undefined) {
		this.input = input;
	}

	/**
	 * Returns the render data object.
	 * @param triggeredByKey optional key that triggered the render data update.
	 */
	public getRenderData(triggeredByKey?: string) {
		return {
			effect: this.effectToString(),
			layoutName: this.currentLayout as string,
			layout: this.adjustFocusOnMount(
				this.layouts[this.currentLayout],
				triggeredByKey,
			),
		};
	}

	/**
	 * Handles the key down event for the virtual keyboard.
	 * This enables using HW keyboard while the virtual keyboard is open.
	 * @param event The keyboard event.
	 */
	public onKeyDown(event: KeyboardEvent) {
		if (ENTER.is(event) || BACK.is(event)) {
			this.onDone();
			return true;
		}
		if (
			typeof event.key === 'string' &&
			!NON_PRINTABLE_CHARS.includes(event.key)
		) {
			this.onChar(event.key, event.key);
			return true;
		}
		return false;
	}

	/**
	 * Converts the passed layouts that can be simplified to the full layout.
	 * @param layouts The layouts to be converted.
	 * @return The full virtual keyboard layouts.
	 */
	protected prepareLayouts(
		layouts: VirtualKeyboardLayouts,
	): FullVirtualKeyboardLayouts {
		return toEntries(layouts).reduce(
			(layouts, [layoutName, layout]) => ({
				...layouts,
				[layoutName]: layout.keys.map((row) =>
					row.map((key) => ({
						key: typeof key === 'string' ? key : key.key,
						label:
							typeof key === 'string'
								? key
								: (key.label ?? key.key),
						colSpan:
							typeof key === 'string' ? 1 : (key.colSpan ?? 1),
						rowSpan:
							typeof key === 'string' ? 1 : (key.rowSpan ?? 1),
						onPress: this.onKey(
							typeof key === 'string'
								? add(key)
								: typeof key.action === 'function'
									? key.action
									: add(key.char ?? key.key),
							typeof key === 'string' ? key : key.key,
						),
						focusOnMount:
							typeof key === 'string'
								? key === layout.initialKey
								: key.key === layout.initialKey,
					})),
				),
			}),
			{} as FullVirtualKeyboardLayouts,
		);
	}

	/**
	 * Handles key press for the virtual keys and calls the appropriate action.
	 * @param actionCreator The action creator function for the key press action.
	 * @param keyId The ID of the key that was pressed.
	 * @returns boolean indicating whether the action was handled successfully.
	 */
	private onKey =
		(actionCreator: InternalAction<string>, keyId: string) => (): true => {
			const { action, payload } = actionCreator();
			switch (action) {
				case ADD:
					this.onChar(payload as string, keyId);
					break;
				case SHIFT:
					this.onShift(keyId);
					break;
				case CAPS:
					this.onCaps(keyId);
					break;
				case SHIFT_AND_CAPS:
					this.onShiftAndCaps(keyId);
					break;
				case BACKSPACE:
					this.onBackspace(keyId);
					break;
				case DEL:
					this.onDelete(keyId);
					break;
				case LEFT:
					this.onLeft();
					break;
				case RIGHT:
					this.onRight();
					break;
				case HOME:
					this.onHome();
					break;
				case END:
					this.onEnd();
					break;
				case DONE:
					this.onDone();
					break;
				case LAYOUT:
					this.onLayout(payload as string, keyId);
					break;
			}
			return true;
		};

	/**
	 * Handles the character input for the virtual keyboard.
	 * @param rawChar The character to be added.
	 * @param triggeredByKey The ID of the key that triggered the input.
	 */
	private onChar(rawChar: string, triggeredByKey: string) {
		const char =
			this.effect === Effect.CAPS || this.effect === Effect.SHIFT
				? rawChar.toUpperCase()
				: rawChar;
		this.cancelShift();
		if (this.input) {
			const oldValue = this.input.value;
			const start = this.input.selectionStart ?? oldValue.length;
			this.setInputValue(
				oldValue.slice(0, start) + char + oldValue.slice(start),
			);
			this.triggerInput();
		}
		this.events.triggerEvent('addChar', char);
		this.triggerRenderData(triggeredByKey);
	}

	/**
	 * Handles the shift effect for the virtual keyboard.
	 * @param triggeredByKey The ID of the key that triggered the shift.
	 */
	private onShift(triggeredByKey: string) {
		this.effect = this.effect === Effect.SHIFT ? Effect.NONE : Effect.SHIFT;
		this.triggerRenderData(triggeredByKey);
	}

	/**
	 * Handles the caps effect for the virtual keyboard.
	 * @param triggeredByKey The ID of the key that triggered the caps effect.
	 */
	private onCaps(triggeredByKey: string) {
		this.effect = this.effect === Effect.CAPS ? Effect.NONE : Effect.CAPS;
		this.triggerRenderData(triggeredByKey);
	}

	/**
	 * Handles the shift and caps effect for the virtual keyboard.
	 * @param triggeredByKey The ID of the key that triggered the shift and caps effect.
	 */
	private onShiftAndCaps(triggeredByKey: string) {
		this.effect = NEXT_EFFECT[this.effect];
		this.triggerRenderData(triggeredByKey);
	}

	/**
	 * Handles the backspace action for the virtual keyboard.
	 * @param triggeredByKey The ID of the key that triggered the backspace action.
	 */
	private onBackspace(triggeredByKey: string) {
		if (this.input) {
			const oldValue = this.input.value;
			const start = this.input.selectionStart ?? oldValue.length;
			this.setInputValue(
				oldValue.slice(0, start - 1) + oldValue.slice(start),
			);
			this.input.selectionStart = Math.max(0, start - 1);
			this.triggerInput();
		}
		this.events.triggerEvent('removeChar');
		this.triggerRenderData(triggeredByKey);
	}

	/**
	 * Handles the delete action for the virtual keyboard.
	 * @param triggeredByKey The ID of the key that triggered the delete action.
	 */
	private onDelete(triggeredByKey: string) {
		if (this.input) {
			const oldValue = this.input.value;
			const start = this.input.selectionStart ?? oldValue.length;
			this.setInputValue(
				oldValue.slice(0, start) + oldValue.slice(start + 1),
			);
			this.triggerInput();
		}
		this.triggerRenderData(triggeredByKey);
	}

	/**
	 * Handles the left arrow action for the virtual keyboard.
	 */
	private onLeft() {
		if (this.input) {
			this.input.selectionStart = Math.max(
				0,
				(this.input.selectionStart ?? this.input.value.length) - 1,
			);
			this.triggerInput('select');
		}
	}

	/**
	 * Handles the right arrow action for the virtual keyboard.
	 */
	private onRight() {
		if (this.input) {
			this.input.selectionStart = Math.min(
				this.input.value.length,
				(this.input.selectionStart ?? 0) + 1,
			);
			this.triggerInput('select');
		}
	}

	/**
	 * Handles the home action for the virtual keyboard.
	 */
	private onHome() {
		if (this.input) {
			this.input.selectionStart = 0;
			this.triggerInput('select');
		}
	}

	/**
	 * Handles the end action for the virtual keyboard.
	 */
	private onEnd() {
		if (this.input) {
			this.input.selectionStart = this.input.value.length;
			this.triggerInput('select');
		}
	}

	/**
	 * Handles the done action for the virtual keyboard.
	 */
	private onDone() {
		this.events.triggerEvent('done');
	}

	/**
	 * Handles the layout change action for the virtual keyboard.
	 * @param layoutName The name of the new layout.
	 * @param triggeredByKey The ID of the key that triggered the layout change.
	 */
	private onLayout(layoutName: string, triggeredByKey: string) {
		this.currentLayout = layoutName;
		this.effect = Effect.NONE;
		this.triggerRenderData(triggeredByKey);
	}

	/**
	 * Cancels the current shift effect.
	 */
	private cancelShift() {
		if (this.effect === Effect.SHIFT) {
			this.effect = Effect.NONE;
		}
	}

	/**
	 * Returns the string representation of the current effect.
	 * @returns The string representation of the current effect.
	 */
	private effectToString() {
		switch (this.effect) {
			case Effect.SHIFT:
				return 'shift';
			case Effect.CAPS:
				return 'caps';
			default:
				return undefined;
		}
	}

	/**
	 * Triggers the render data event with the current render data.
	 * @param triggeredByKey optional key that triggered the render data update.
	 */
	private triggerRenderData(triggeredByKey?: string) {
		this.events.triggerEvent(
			'renderData',
			this.getRenderData(triggeredByKey),
		);
	}

	/**
	 * Adjusts the focus on mount for the virtual keyboard layout.
	 * @param layout The layout of the virtual keyboard.
	 * @param triggeredByKey optional key that triggered the render data update.
	 * @returns The adjusted layout with focus on the specified triggeredByKey key.
	 */
	private adjustFocusOnMount(
		layout: FullVirtualKeyboardLayouts[string],
		triggeredByKey?: string,
	) {
		if (!triggeredByKey) {
			return layout;
		}
		const newLayoutHasKey = layout.some((row) =>
			row.some((key) => key.key === triggeredByKey),
		);
		if (!newLayoutHasKey) {
			return layout;
		}
		return layout.map((row) =>
			row.map((key) => ({
				...key,
				focusOnMount: key.key === triggeredByKey,
			})),
		);
	}

	/**
	 * Sets the value of the input element.
	 * @param value The value to be set.
	 */
	protected setInputValue(value: string) {
		if (this.input) {
			this.input.value = value;
		}
	}

	/**
	 * Triggers the input event on the input element.
	 * @param eventName The name of the event to be triggered (default: 'input').
	 */
	protected triggerInput(eventName = 'input') {
		if (this.input) {
			this.input.dispatchEvent(
				new InputEvent(eventName, { bubbles: true }),
			);
		}
	}
}
