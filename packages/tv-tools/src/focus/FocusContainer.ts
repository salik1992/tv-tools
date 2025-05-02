import { clamp } from '../utils/clamp';
import type { FocusManager } from './FocusManager';
import { RenderProgress } from './RenderProgress';

/**
 * The behavior class for focus containers. Focus container is a component that
 * renders focusable children itself and takes control of switching focus between
 * them. The children can themselves be FocusContainers or Interactables.
 */
export class FocusContainer {
	/**
	 * The current state of the render loop.
	 */
	protected renderProgress = RenderProgress.STARTED;

	/**
	 * List of the children that are currently belonging under this container.
	 */
	protected focusChildren: string[] = [];

	/**
	 * List of the children that are currently belonging under this container,
	 * while it is being rendered.
	 */
	protected wipFocusChildren: string[] = [];

	/**
	 * Id of the last child that was focused by the container. When the container
	 * is focused again, it will prefer this id if it still exists.
	 */
	protected lastFocusedId: string | null = null;

	/**
	 * Stores last focus options used when there's no child to focus.
	 * These will be reused if it still valid to focus a child once we have some.
	 */
	protected lastFocusOptions: FocusOptions | undefined = undefined;

	/**
	 * ID of the container.
	 */
	public readonly id: string;

	public constructor(
		protected readonly focusManager: FocusManager,
		id?: string,
	) {
		this.id = id ?? this.focusManager.generateId();
		this.focusManager.addFocusId(this.id, this.focus.bind(this));
		this.focusManager.addOnFocusWithin(
			this.id,
			this.onFocusWithin.bind(this),
		);
	}

	/**
	 * Focus function for the container.
	 * - If last focused id still exists among children, it will be focused.
	 * - Otherwise the first child is focused.
	 * - If there are no children it marks itself as focused and it will be
	 * able to check again when it gains children.
	 *
	 * @param options - optional FocusOptions
	 */
	public focus(options?: FocusOptions) {
		if (
			this.lastFocusedId &&
			this.focusChildren.includes(this.lastFocusedId)
		) {
			this.focusChild(this.lastFocusedId, options);
		} else if (this.focusChildren.length) {
			this.focusChild(this.focusChildren[0], options);
		} else {
			this.focusManager.focusTrappedInContainer = this.id;
			this.lastFocusOptions = options;
		}
	}

	/**
	 * Returns current render progress.
	 * @returns current render progress
	 */
	public getRenderProgress(): RenderProgress {
		return this.renderProgress;
	}

	/**
	 * Updates the phase of the render loop.
	 * If the phase is FINISHED we commit the work-in-progress children to full
	 * children. If the focus still belongs to the container it will attempt to
	 * focus a child again.
	 *
	 * @param renderProgress - the current phase
	 */
	public setRenderProgress(renderProgress: RenderProgress) {
		this.renderProgress = renderProgress;
		if (this.renderProgress === RenderProgress.STARTED) {
			this.wipFocusChildren = [];
		}
		if (this.renderProgress === RenderProgress.FINISHED) {
			this.focusChildren = this.wipFocusChildren;
			this.focusChildren.forEach((childId) => {
				this.focusManager.addParentChild(this.id, childId);
			});
			if (this.focusManager.focusTrappedInContainer === this.id) {
				this.focusManager.focusTrappedInContainer = undefined;
				this.focus(this.lastFocusOptions);
			}
		}
	}

	/**
	 * Adds a child component to its children.
	 * @param childId - id of the child
	 */
	public addChild(childId: string) {
		if (this.renderProgress === RenderProgress.STARTED) {
			this.setRenderProgress(RenderProgress.CHILDREN);
			this.wipFocusChildren.push(childId);
		} else if (this.renderProgress === RenderProgress.CHILDREN) {
			this.wipFocusChildren.push(childId);
		}
	}

	/**
	 * Moves focus in children by a number from certain childId.
	 * @param diff - how many components to move (negative for up/left,
	 * positive for down/right)
	 * @param fromChildId - the id from which to initiate the move, if it is not
	 * found, no move will happen and the event is not processed and can bubble
	 * further.
	 */
	public moveFocus(diff: number, fromChildId: string): boolean {
		const eventChildren = this.focusManager.getEventChildren(fromChildId);
		const originalChildIndex = this.focusChildren.findIndex((childId) =>
			eventChildren.includes(childId),
		);
		if (originalChildIndex === -1) {
			return false;
		}
		const targetChildIndex = clamp(
			0,
			originalChildIndex + diff,
			this.focusChildren.length - 1,
		);
		if (targetChildIndex !== originalChildIndex) {
			this.focusChild(this.focusChildren[targetChildIndex], {
				preventScroll: true,
			});
			return true;
		}
		return false;
	}

	/**
	 * Clean up when removed.
	 */
	public destroy() {
		this.focusManager.removeFocusId(this.id);
	}

	/**
	 * Sends focus down to child and marks it as the last focused id.
	 * @param id - id of the child
	 * @param options - optional FocusOptions
	 */
	public focusChild(id: string, options?: FocusOptions) {
		this.lastFocusedId = id;
		if (this.focusManager.hasFocusId(id)) {
			this.focusManager.focus(id, options);
		} else {
			this.focusManager.focusTrappedInContainer = this.id;
		}
	}

	/**
	 * Remember id of the child that had focus last time.
	 * @param id = id of the child
	 */
	protected onFocusWithin(id: string) {
		if (this.focusChildren.includes(id)) {
			this.lastFocusedId = id;
		}
	}
}
