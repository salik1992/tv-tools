import type { Key } from '../control';
import { uuidV4 } from '../utils/uuidV4';
import type {
	FocusFunction,
	FocusWithinListener,
	ControlType,
	ControlPhase,
	ControlListener,
	ControlEvent,
} from './types';

/**
 * Main class that manages the focus, key events and their propagation through
 * focus tree.
 */
class FocusManager {
	/**
	 * Set of all ids of focusable elements that are currently managed.
	 */
	private focusIds = new Set<string>();

	/**
	 * Mapping between the ids and focus functions. Each member requires to have
	 * a focus listener that is called when it is focused.
	 */
	private focusFunctions = new Map<string, FocusFunction>();

	/**
	 * Lists of children to a parent.
	 */
	private children = new Map<string, string[]>();

	/**
	 * Mapping of the child to its parent. If it is null, the element is root
	 * for that tree. There may be multiple root elements.
	 */
	private parents = new Map<string, string | null>();

	/**
	 * Event listeners tied to an element.
	 */
	private eventListeners = new Map<
		string,
		{ listener: ControlListener; type: ControlType; phase: ControlPhase }[]
	>();

	/**
	 * Key sequences and their listeners.
	 */
	private keySequenceListeners = new Map<Key[], () => void>();

	/**
	 * Current sequence of last N keys. The N is set based on the longest
	 * sequence from the keySequenceListeners mapping.
	 */
	private currentKeySequence: ControlEvent[] = [];

	/**
	 * Listeners for focus within.
	 */
	private focusWithinListeners = new Map<string, FocusWithinListener>();

	/**
	 * Focus ids that were focused historically.
	 */
	private focusHistory: string[] = [];

	/**
	 * This is used for components to signal that their focus was requested but
	 * there was no element to focus. It helps to determine whether the focus
	 * should be continued to the element once any appears.
	 */
	public focusTrappedInContainer: string | undefined = undefined;

	/**
	 * Generates a unique id for the focusable element.
	 * @returns unique id string
	 */
	public generateId() {
		let id: string;
		do {
			id = uuidV4();
		} while (this.focusIds.has(id));
		return id;
	}

	/**
	 * Registers focus id of a focusable component and its focus function.
	 * @param id - if for the focus management
	 * @param onFocus - function to call when the component should receive focus
	 */
	public addFocusId(id: string, onFocus: FocusFunction) {
		if (this.focusIds.has(id)) {
			throw new Error(`Focus element "${id}" already exists.`);
		}
		this.focusIds.add(id);
		this.focusFunctions.set(id, onFocus);
		this.eventListeners.set(id, []);
		this.children.set(id, []);
		this.parents.set(id, null);
		return id;
	}

	/**
	 * Removes focus id from the management and cleans up all listeners and mapping.
	 * @param id - id to remove
	 */
	public removeFocusId(id: string) {
		this.focusIds.delete(id);
		this.focusFunctions.delete(id);
		this.focusWithinListeners.delete(id);
		this.eventListeners.delete(id);
		this.children.delete(id);
		const parentId = this.getParent(id);
		this.parents.delete(id);
		this.removeFromFocusHistory(id);
		if (id === (document.activeElement as HTMLElement).id) {
			this.focusRestoreAttempt(parentId);
		}
	}

	/**
	 * Returns whether id is maintained by focus manager.
	 * @param id - id to enquire
	 */
	public hasFocusId(id: string) {
		return this.focusIds.has(id);
	}

	/**
	 * Creates parent <-> child pairing.
	 * @param parentId - id of the parent
	 * @param childId - id of the child
	 */
	public addParentChild(parentId: string, childId: string) {
		const children = this.getChildren(parentId);
		children.push(childId);
		this.children.set(parentId, children);
		this.parents.set(childId, parentId);
	}

	/**
	 * Adds listener to key events for the component.
	 * @param id - id of the component that registers the listener
	 * @param listener - function that will be called for key events. It should
	 * return a boolean. True if it processed and acted on the event, false in
	 * other cases which will let it bubble further.
	 * @param type - keydown or keyup
	 * @param phase - bubble or capture
	 */
	public addEventListener(
		id: string,
		listener: ControlListener,
		type: ControlType,
		phase: ControlPhase,
	) {
		const currentListeners = this.eventListeners.get(id);
		if (!currentListeners) {
			return;
		}
		const index = currentListeners.findIndex(
			(l) =>
				l.listener === listener && l.type === type && l.phase === phase,
		);
		if (index === -1) {
			currentListeners.push({ listener, type, phase });
		}
	}

	/**
	 * Removes the listener from the event listeners.
	 * @param id - id of the component that the listener is tied to
	 * @param listener - the listener to remove
	 * @param type - keydown or keyup
	 * @param phase - bubble or capture
	 *
	 * The same listener can be registered up to 4 times:
	 * keydown-bubble, keydown-capture, keyup-bubble and keyup-capture
	 * Therefore we need to specify these parameters here as well.
	 */
	public removeEventListener(
		id: string,
		listener: ControlListener,
		type: ControlType,
		phase: ControlPhase,
	) {
		const currentListeners = this.eventListeners.get(id);
		if (!currentListeners) {
			return;
		}
		const index = currentListeners.findIndex(
			(l) =>
				l.listener === listener && l.type === type && l.phase === phase,
		);
		if (index !== -1) {
			currentListeners.splice(index, 1);
		}
	}

	/**
	 * Adds a key sequence listener. Each sequence can have only one listener.
	 * But since it is only for edge cases like opening devtools, it shouldn't
	 * matter that much.
	 * @param keySequence - array of keys in order of their presses
	 * @param listener - function to call after all keys are pressed in sequence
	 *
	 * It will call the listener for keydown-bubble phase before any normal key
	 * listener.
	 */
	public addKeySequenceListener(keySequence: Key[], listener: () => void) {
		this.keySequenceListeners.set(keySequence, listener);
	}

	/**
	 * Removes keySequence listener.
	 * @param keySequence - key sequence of the listener to remove
	 */
	public removeKeySequenceListener(keySequence: Key[]) {
		this.keySequenceListeners.delete(keySequence);
	}

	/**
	 * Returns children of a component.
	 * @returns Always an array, if component has no children, the array will be empty.
	 */
	public getChildren(parentId: string) {
		return this.children.get(parentId) ?? [];
	}

	/**
	 * Returns an array of all components that the event will bubble through from
	 * the target to either a given id or to the root if omitted.
	 * @param targetId - id of the target the is the lowest component
	 * @param upToId - where to stop bubbling up, leave empty for the root
	 * @returns array of ids the event would bubble through, target at index 0,
	 * root at the end
	 */
	public getEventChildren(targetId: string, upToId: string | null = null) {
		const eventChildren: string[] = [];
		let currentNodeId: string | null = targetId;
		while (currentNodeId !== null && currentNodeId !== upToId) {
			eventChildren.push(currentNodeId);
			currentNodeId = this.getParent(currentNodeId);
		}
		return eventChildren;
	}

	/**
	 * Focuses the component of the given id.
	 * @param id - id to focus
	 * @param options - optional focus options ({ preventScroll: boolean })
	 */
	public focus(id: string, options?: FocusOptions) {
		if (!this.focusIds.has(id)) {
			throw new Error(
				`Could not focus "${id}" as it is not maintained by focus manager.`,
			);
		}
		this.focusTrappedInContainer = undefined;
		this.removeFromFocusHistory(id);
		this.focusHistory.push(id);
		const focusFunction = this.focusFunctions.get(id);
		focusFunction?.(options);
	}

	/**
	 * Sets the focus withing listener for id.
	 * @param id - id of the listenee (parent)
	 * @param listener = function that is called if focus is within a child
	 */
	public addOnFocusWithin(id: string, listener: FocusWithinListener) {
		this.focusWithinListeners.set(id, listener);
	}

	/**
	 * Handles focus event for focusWithinListeners
	 * @param event - original focus event
	 */
	public handleFocusEvent(e: FocusEvent) {
		const targetId = (e.target as HTMLElement).id;
		if (this.children.has(targetId)) {
			const childrenPath = this.getEventChildren(targetId);
			for (let i = 1; i < childrenPath.length; i++) {
				const listener = this.focusWithinListeners.get(childrenPath[i]);
				if (listener) {
					listener(childrenPath[i - 1]);
				}
			}
		}
	}

	/**
	 * Function to handle an keyboard event through the focus tree of components.
	 * Based od the phase it will go either from root to target (capture) or
	 * from target to the root (bubble). It will call preventDefault and stopPropagation
	 * if the event is handled by any of the listeners in the tree.
	 *
	 * @param type - keydown or keyup
	 * @param phase - bubble or capture
	 * @param event - subset of KeyboardEvent with necessary info only
	 */
	public handleKeyEvent<E extends ControlEvent>(
		type: ControlType,
		phase: ControlPhase,
		event: E,
	) {
		if (phase === 'bubble' && type === 'keydown') {
			this.addKeyToSequence(event);
		}
		const processed =
			phase === 'capture'
				? this.handleCaptureKeyEvent(type, event)
				: this.handleBubbleKeyEvent(type, event);
		if (processed) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	/**
	 * Goes through the focus components from root to the target and calls their
	 * listeners. If the event is handled, it will stop the propagation.
	 */
	private handleCaptureKeyEvent<E extends ControlEvent>(
		type: ControlType,
		event: E,
	) {
		const { target } = event;
		if (!(target instanceof HTMLElement)) {
			return false;
		}
		const currentNodeId: string | null = target.id ?? null;
		if (!this.focusIds.has(currentNodeId)) {
			return false;
		}
		const path = this.getEventChildren(currentNodeId).reverse();
		let processed = false;
		for (const nodeId of path) {
			const eventListeners = (
				this.eventListeners.get(nodeId) ?? []
			).filter((l) => l.type === type && l.phase === 'capture');
			for (const { listener } of eventListeners) {
				processed = listener(event);
				if (processed) {
					break;
				}
			}
			if (processed) {
				break;
			}
		}
		return processed;
	}

	/**
	 * Goes through the focus components from target to the root and calls their
	 * listeners. If the event is handled, it will stop the propagation.
	 */
	private handleBubbleKeyEvent<E extends ControlEvent>(
		type: ControlType,
		event: E,
	) {
		const { target } = event;
		if (!(target instanceof HTMLElement)) {
			return false;
		}
		let currentNodeId: string | null = target.id ?? null;
		if (!this.focusIds.has(currentNodeId)) {
			return false;
		}
		let processed = false;
		while (!processed && currentNodeId !== null) {
			const eventListeners = (
				this.eventListeners.get(currentNodeId) ?? []
			).filter((l) => l.type === type && l.phase === 'bubble');
			for (const { listener } of eventListeners) {
				processed = listener(event);
				if (processed) {
					break;
				}
			}
			currentNodeId = this.getParent(currentNodeId);
		}
		return processed;
	}

	/**
	 * Returns the parent of a child.
	 * @returns string id or null
	 */
	private getParent(childId: string) {
		return this.parents.get(childId) ?? null;
	}

	/**
	 * Goes through the sequence listeners, tests their validity and if they match
	 * it will call them.
	 */
	private testSequences() {
		for (const [sequence, listener] of this.keySequenceListeners) {
			const tested = this.currentKeySequence.slice(-sequence.length);
			if (tested.length < sequence.length) {
				continue;
			}
			if (
				tested.every((key, i) => {
					return sequence[i].is(key);
				})
			) {
				listener();
			}
		}
	}

	/**
	 * Truncates the key sequence history to the length of the longest sequence
	 * that we have a listener for.
	 */
	private truncateSequence() {
		const maxLength = Math.max(
			...Array.from(this.keySequenceListeners.keys()).map(
				(s) => s.length,
			),
		);
		this.currentKeySequence = this.currentKeySequence.slice(-maxLength);
	}

	/**
	 * Handles adding a new key to the key sequence, test, calling of listeners
	 * and truncation.
	 */
	private addKeyToSequence<E extends ControlEvent>(event: E) {
		if (this.keySequenceListeners.size === 0) {
			return;
		}
		this.currentKeySequence.push(event);
		this.truncateSequence();
		this.testSequences();
	}

	/**
	 * Attempts to focus the parent of the element if any.
	 * If the parent does not exist then we attempt to focus last known id
	 * and hope for the best. If nothing exists then hopefully something will
	 * self focus soon.
	 * @param parentId - id of the potential parent
	 */
	private focusRestoreAttempt(parentId: string | null) {
		if (parentId && this.focusIds.has(parentId)) {
			this.focus(parentId, { preventScroll: true });
		} else if (this.focusHistory.length) {
			this.focus(this.focusHistory.pop()!, { preventScroll: true });
		}
	}

	/**
	 * Removes id from focus history.
	 * @param idToRemove = id to remove
	 */
	private removeFromFocusHistory(idToRemove: string) {
		this.focusHistory = this.focusHistory.filter((id) => id !== idToRemove);
	}
}

export const focus = new FocusManager();
