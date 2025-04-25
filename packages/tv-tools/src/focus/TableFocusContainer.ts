import { RenderProgress } from './RenderProgress';
import { focus } from './focus';

type Coord = [number, number];

type Spans = {
	colSpan?: number;
	rowSpan?: number;
};

export class TableFocusContainer {
	/**
	 * The table of children ids.
	 */
	private focusTable: string[][] = [];

	/**
	 * The table of children ids that are being worked on.
	 * This is used to keep track of the children that are being added.
	 */
	private wipFocusTable: string[][] = [];

	/**
	 * The current phase of the render loop.
	 */
	private renderProgress = RenderProgress.STARTED;

	/**
	 * The current coordinate of the focus.
	 * This is used to keep track of the current position of the focus.
	 */
	private coord: Coord = [0, 0];

	/**
	 * The coordinate of the current insertion point.
	 */
	private insertionCoord: Coord = [0, 0];

	/**
	 * Id of the last child that was focused by the container. When the container
	 * is focused again, it will prefer this id if it still exists.
	 */
	private lastFocusedId: string | null = null;

	/**
	 * Stores last focus options used when there's no child to focus.
	 * These will be reused if it still valid to focus a child once we have some.
	 */
	private lastFocusOptions: FocusOptions | undefined = undefined;

	constructor(public readonly id: string = focus.generateId()) {
		focus.addFocusId(this.id, this.focus.bind(this));
		focus.addOnFocusWithin(id, this.onFocusWithin.bind(this));
	}

	/**
	 * Focus function for the container.
	 * - If last focused id still exists among children, it will be focused.
	 * - Otherwise if exists, child at the current coordinate will be focused.
	 * - Otherwise the first child is focused.
	 * - If there are no children it marks itself as focused and it will be
	 * able to check again when it gains children.
	 *
	 * @param options - optional FocusOptions
	 */
	public focus(options?: FocusOptions) {
		if (this.lastFocusedId && this.hasChild(this.lastFocusedId)) {
			this.focusChild(this.lastFocusedId, options);
			return;
		}
		const childAtCoord = this.focusTable[this.coord[0]]?.[this.coord[1]];
		if (childAtCoord) {
			this.focusChild(childAtCoord, options);
			return;
		}
		const firstChild = this.focusTable[0]?.[0];
		if (firstChild) {
			this.focusChild(firstChild, options);
			return;
		}
		focus.focusTrappedInContainer = this.id;
		this.lastFocusOptions = options;
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
			this.wipFocusTable = [];
			this.insertionCoord = [-1, -1];
		}
		if (this.renderProgress === RenderProgress.FINISHED) {
			this.focusTable = this.trim(this.wipFocusTable);
			this.focusTable.forEach((row) => {
				row.forEach((childId) => {
					focus.addParentChild(this.id, childId);
				});
			});
			if (focus.focusTrappedInContainer === this.id) {
				focus.focusTrappedInContainer = undefined;
				this.focus(this.lastFocusOptions);
			}
		}
	}

	/**
	 * Adds a child to the container.
	 * @param childId - id of the child
	 * @param spans - optional spans of the child (colSpan and rowSpan)
	 */
	public addChild(childId: string, spans: Spans = {}): void {
		if (this.renderProgress === RenderProgress.STARTED) {
			this.setRenderProgress(RenderProgress.CHILDREN);
			this.insertChild(childId, spans);
		} else if (this.renderProgress === RenderProgress.CHILDREN) {
			this.insertChild(childId, spans);
		}
	}

	/**
	 * Adds a row to the container.
	 */
	public addRow(): void {
		this.insertionCoord[0] += 1;
		this.insertionCoord[1] = 0;
		if (this.wipFocusTable[this.insertionCoord[0]] === undefined) {
			this.wipFocusTable[this.insertionCoord[0]] = [];
		}
	}

	/**
	 * Moves focus in the container in specified direction..
	 * @param direction - the direction to move the focus (x and y coordinates)
	 * @param fromChildId - the id from which to initiate the move, if it is not
	 * found, no move will happen and the event is not processed and can bubble
	 * further.
	 */
	public moveFocus(
		{ x = 0, y = 0 }: { x?: -1 | 0 | 1; y?: -1 | 0 | 1 },
		fromChildId: string,
	): boolean {
		if (x === 0 && y === 0) {
			return false;
		}
		const eventChildren = focus.getEventChildren(fromChildId);
		const childAtCurrentCoord =
			this.focusTable[this.coord[0]]?.[this.coord[1]];
		const coord = eventChildren.includes(childAtCurrentCoord)
			? ([...this.coord] as Coord)
			: this.findStartingCoord(eventChildren);
		if (!coord) {
			return false;
		}
		const startChildId = this.focusTable[coord[0]]?.[coord[1]];
		if (!startChildId) {
			return false;
		}
		do {
			coord[0] += y;
			coord[1] += x;
		} while (startChildId === this.focusTable[coord[0]]?.[coord[1]]);
		const targetChildId = this.focusTable[coord[0]]?.[coord[1]];
		if (targetChildId) {
			this.coord = coord;
			this.focusChild(targetChildId, {
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
		focus.removeFocusId(this.id);
	}

	/**
	 * Sends focus down to child and marks it as the last focused id.
	 * @param id - id of the child
	 * @param options - optional FocusOptions
	 */
	public focusChild(id: string, options?: FocusOptions) {
		this.lastFocusedId = id;
		if (focus.hasFocusId(id)) {
			focus.focus(id, options);
		} else {
			focus.focusTrappedInContainer = this.id;
		}
	}

	/**
	 * Inserts a child into the table at the current insertion coordinate.
	 * @param childId - id of the child
	 * @param spans - optional spans of the child (colSpan and rowSpan)
	 */
	private insertChild(
		childId: string,
		{ colSpan = 1, rowSpan = 1 }: Spans = {},
	) {
		if (this.insertionCoord[0] === -1) {
			this.addRow();
		}
		const startAt = this.moveToEmptyCoord(this.insertionCoord);
		for (let y = 0; y < rowSpan; y++) {
			for (let x = 0; x < colSpan; x++) {
				this.setAtCoord(childId, [startAt[0] + y, startAt[1] + x]);
			}
		}
	}

	/**
	 * Sets the id at the specified coordinate in the work-in-progress table.
	 * @param id - id of the child
	 * @param coord - coordinate to set the id at
	 * @throws Error if the coordinate is already occupied
	 */
	private setAtCoord(id: string, coord: Coord) {
		if (this.wipFocusTable[coord[0]] === undefined) {
			this.wipFocusTable[coord[0]] = [];
		}
		if (this.wipFocusTable[coord[0]][coord[1]] !== undefined) {
			throw new Error(
				`Cannot set focus "${id}" at [${coord[0]}, ${coord[1]}] because it is already occupied by "${this.wipFocusTable[coord[0]][coord[1]]}"`,
			);
		}
		this.wipFocusTable[coord[0]][coord[1]] = id;
	}

	/**
	 * Moves to the next empty coordinate in the work-in-progress table.
	 * @param startAt - coordinate to start searching from
	 * @returns the next empty coordinate
	 */
	private moveToEmptyCoord(startAt: Coord): Coord {
		const coord = startAt;
		while (this.wipFocusTable[coord[0]] !== undefined) {
			if (this.wipFocusTable[coord[0]][coord[1]] === undefined) {
				break;
			}
			coord[1] += 1;
		}
		return coord;
	}

	/**
	 * Remember id of the child that had focus last time.
	 * @param id = id of the child
	 */
	private onFocusWithin(id: string) {
		if (this.hasChild(id)) {
			this.lastFocusedId = id;
		}
	}

	/**
	 * Checks if the container has a child with the specified id.
	 * @param id - id of the child
	 * @returns true if the child exists, false otherwise
	 */
	private hasChild(id: string): boolean {
		return this.focusTable.some((row) => row.includes(id));
	}

	/**
	 * Finds the starting coordinate for the focus move.
	 * @param eventChildren - array of child ids to check
	 * @returns the closest coordinate of the child id in the focus table
	 */
	private findStartingCoord(eventChildren: string[]): Coord | undefined {
		const coords: Coord[] = [];
		this.focusTable.forEach((row, y) => {
			row.forEach((childId, x) => {
				if (eventChildren.includes(childId)) {
					coords.push([y, x]);
				}
			});
		});
		if (coords.length === 0) {
			return undefined;
		}
		return coords.reduce(
			(prev, curr) => {
				const distance =
					Math.abs(curr[0] - this.coord[0]) +
					Math.abs(curr[1] - this.coord[1]);
				if (distance < prev.distance) {
					return { distance, coord: curr };
				}
				return prev;
			},
			{ distance: Infinity, coord: [0, 0] as Coord },
		).coord;
	}

	/**
	 * Trims the table to remove empty rows and columns.
	 * @param table - the table to trim
	 * @returns the trimmed table
	 */
	private trim(table: string[][]): string[][] {
		return table
			.filter((row) => row.length > 0)
			.map((row) => row.filter((id) => typeof id === 'string'));
	}
}
