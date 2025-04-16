import { TableFocusContainer } from '../focus';
import { EventListener, IEventListener } from '../utils/EventListener';
import { toEntries } from '../utils/toEntries';
import {
	ADD,
	BACKSPACE,
	CAPS,
	DEL,
	DONE,
	END,
	HOME,
	LAYOUT,
	LEFT,
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

enum Effect {
	NONE,
	SHIFT,
	CAPS,
}

export class VirtualKeyboard implements IEventListener<VirtualKeyboardEvents> {
	private events = new EventListener<VirtualKeyboardEvents>();

	public addEventListener = this.events.addEventListener;
	public removeEventListener = this.events.removeEventListener;

	private layouts: FullVirtualKeyboardLayouts;

	private currentLayout: string;

	private effect: Effect = Effect.NONE;

	private input: HTMLInputElement | undefined;

	constructor(
		layouts: VirtualKeyboardLayouts,
		public container: TableFocusContainer,
	) {
		validateLayouts(layouts);
		this.layouts = this.prepareLayouts(layouts);
		this.currentLayout = Object.keys(this.layouts)[0];
	}

	public assignInput(input: HTMLInputElement) {
		this.input = input;
	}

	public unassignInput() {
		this.input = undefined;
	}

	public getRenderData() {
		return {
			effect: this.effectToString(),
			layoutName: this.currentLayout as string,
			layout: this.layouts[this.currentLayout],
		};
	}

	private prepareLayouts(
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

	private onKey = (actionCreator: InternalAction<string>) => (): true => {
		const { action, payload } = actionCreator();
		switch (action) {
			case ADD:
				this.onChar(payload as string);
				break;
			case SHIFT:
				this.onShift();
				break;
			case CAPS:
				this.onCaps();
				break;
			case SHIFT_AND_CAPS:
				this.onShiftAndCaps();
				break;
			case BACKSPACE:
				this.onBackspace();
				break;
			case DEL:
				this.onDelete();
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
				this.onLayout(payload as string);
				break;
		}
		return true;
	};

	private onChar(rawChar: string) {
		const char =
			this.effect === Effect.CAPS || this.effect === Effect.SHIFT
				? rawChar.toUpperCase()
				: rawChar;
		this.cancelShift();
		if (this.input) {
			const oldValue = this.input.value;
			const start = this.input.selectionStart ?? oldValue.length;
			this.input.value =
				oldValue.slice(0, start) + char + oldValue.slice(start);
			this.input.dispatchEvent(new InputEvent('input'));
		}
		this.events.triggerEvent('addChar', char);
		this.triggerRenderData();
	}

	private onShift() {
		this.effect = this.effect === Effect.SHIFT ? Effect.NONE : Effect.SHIFT;
		this.triggerRenderData();
	}

	private onCaps() {
		this.effect = this.effect === Effect.CAPS ? Effect.NONE : Effect.CAPS;
		this.triggerRenderData();
	}

	private onShiftAndCaps() {
		this.effect =
			this.effect === Effect.SHIFT
				? Effect.CAPS
				: this.effect === Effect.CAPS
					? Effect.NONE
					: Effect.SHIFT;
		this.triggerRenderData();
	}

	private onBackspace() {
		if (this.input) {
			const oldValue = this.input.value;
			const start = this.input.selectionStart ?? oldValue.length;
			this.input.value =
				oldValue.slice(0, start - 1) + oldValue.slice(start);
			this.input.dispatchEvent(new InputEvent('input'));
		}
		this.events.triggerEvent('removeChar');
		this.triggerRenderData();
	}

	private onDelete() {
		if (this.input) {
			const oldValue = this.input.value;
			const start = this.input.selectionStart ?? oldValue.length;
			this.input.value =
				oldValue.slice(0, start) + oldValue.slice(start + 1);
			this.input.dispatchEvent(new InputEvent('input'));
		}
		this.triggerRenderData();
	}

	private onLeft() {
		if (this.input) {
			this.input.selectionStart = Math.max(
				0,
				(this.input.selectionStart ?? this.input.value.length) - 1,
			);
			this.input.dispatchEvent(new InputEvent('select'));
		}
	}

	private onRight() {
		if (this.input) {
			this.input.selectionStart = Math.min(
				this.input.value.length,
				(this.input.selectionStart ?? 0) + 1,
			);
			this.input.dispatchEvent(new InputEvent('select'));
		}
	}

	private onHome() {
		if (this.input) {
			this.input.selectionStart = 0;
			this.input.dispatchEvent(new InputEvent('select'));
		}
	}

	private onEnd() {
		if (this.input) {
			this.input.selectionStart = this.input.value.length;
			this.input.dispatchEvent(new InputEvent('select'));
		}
	}

	private onDone() {
		this.events.triggerEvent('done');
	}

	private onLayout(layoutName: string) {
		this.currentLayout = layoutName;
		this.effect = Effect.NONE;
		this.triggerRenderData();
	}

	private cancelShift() {
		if (this.effect === Effect.SHIFT) {
			this.effect = Effect.NONE;
		}
	}

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

	private triggerRenderData() {
		this.events.triggerEvent('renderData', this.getRenderData());
	}
}
