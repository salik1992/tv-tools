import {
	type ComponentProps,
	type ComponentType,
	type PropsWithChildren,
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
} from 'react';
import type { TableFocusContainer } from '@salik1992/tv-tools/focus';
import { FocusContext } from './context';
import { useTableFocusContainer } from './useTableFocusContainer';

/**
 * ChildrenOnlyComponent is a component that renders its children only.
 */
const ChildrenOnlyComponent = ({ children }: PropsWithChildren) => {
	return <>{children}</>;
};

const TableContext = createContext<{
	container?: TableFocusContainer;
	TrComponent: ComponentType<PropsWithChildren<unknown>>;
	TdComponent: ComponentType<PropsWithChildren<unknown>>;
}>({
	TrComponent: ChildrenOnlyComponent,
	TdComponent: ChildrenOnlyComponent,
});

/**
 * FocusTd is a component that renders a table cell with focus management.
 *
 * @prop rowSpan - The number of rows the cell should span.
 * @prop colSpan - The number of columns the cell should span.
 * @prop children - The content of the cell.
 * @prop ...props - Additional props to pass to the cell component that is specified
 * in the props of the parent FocusTable.
 */
const FocusTd = ({
	rowSpan,
	colSpan,
	children,
	...props
}: PropsWithChildren<{
	colSpan?: number;
	rowSpan?: number;
}>) => {
	const { addChild, ...originalfocusContextValue } = useContext(FocusContext);
	const { TdComponent } = useContext(TableContext);

	// Add more params to the addChild function to support rowSpan and colSpan.
	// This way it does not need to be handled by the end focus component (Interactable in most cases).
	const addChildWithSpans = useCallback(
		(childId: string) => {
			addChild(childId, { rowSpan, colSpan });
		},
		[addChild, rowSpan, colSpan],
	);

	const focusContextValue = useMemo(
		() => ({ ...originalfocusContextValue, addChild: addChildWithSpans }),
		[addChildWithSpans, originalfocusContextValue],
	);

	return (
		<FocusContext.Provider value={focusContextValue}>
			<TdComponent {...props}>{children}</TdComponent>
		</FocusContext.Provider>
	);
};

/**
 * FocusTr is a component that renders a table row with focus management.
 *
 * @prop children - The content of the row.
 * @prop ...props - Additional props to pass to the row component that is specified
 * in the props of the parent FocusTable.
 */
const FocusTr = (props: PropsWithChildren<unknown>) => {
	const { TrComponent, container } = useContext(TableContext);

	useEffect(() => {
		// Needs to run every time to maintain children order.
		container?.addRow();
	});

	return <TrComponent {...props} />;
};

export type FocusTableRenderComponents<
	TrComponent extends ComponentType,
	TdComponent extends ComponentType,
> = {
	// FocusTr is a component that renders a table row with focus management.
	FocusTr: (props: ComponentProps<TrComponent>) => ReactNode;
	// FocusTd is a component that renders a table cell with focus management.
	FocusTd: (
		props: {
			colSpan?: number;
			rowSpan?: number;
		} & ComponentProps<TdComponent>,
	) => ReactNode;
};

/**
 * FocusTable is a component that renders a table with focus management.
 *
 * @prop id - The id of the table.
 * @prop children - Function that returns the table rows and cells.
 * @prop TableComponent - The component to use for the table element.
 * @prop TrComponent - The component to use for the table row element.
 * @prop TdComponent - The component to use for the table cell element.
 * @example
 * ```typescriptreact
 * // SIMPLIFIED
 * const VirtualKeyboard = ({ layout }: { layout: string[][] }) => {
 *     return (
 *         <FocusTable
 *		       TableComponent="div"
 *		       TrComponent="div"
 *		       TdComponent={Interactable}
 *         >
 *             {({ FocusTr, FocusTd }) => layout.map((row, i) => (
 *			       <FocusTr key={i}>
 *			           {row.map((item) => (
 *			               <FocusTd key={item}>{item}</FocusTd>
 *			           ))}
 *			       </FocusTr>
 *			   ))}
 *	       </FocusTable>
 *	   );
 * };
 * ```
 */
export const FocusTable = ({
	id,
	children,
	// @ts-expect-error: Circular type definition
	TableComponent = ChildrenOnlyComponent,
	TrComponent = ChildrenOnlyComponent,
	TdComponent = ChildrenOnlyComponent,
	...tableProps
}: {
	children: (
		components: FocusTableRenderComponents<
			typeof TrComponent,
			typeof TdComponent
		>,
		container: TableFocusContainer,
	) => ReactNode;
	id?: string;
	TableComponent?: ComponentType;
	TrComponent?: ComponentType;
	TdComponent?: ComponentType;
} & ComponentProps<typeof TableComponent>) => {
	const {
		focusContextValue,
		container,
		useOnLeft,
		useOnUp,
		useOnDown,
		useOnRight,
	} = useTableFocusContainer(id);

	useOnLeft(
		(event) =>
			container.moveFocus({ x: -1 }, (event.target as HTMLElement).id),
		[container],
	);

	useOnRight(
		(event) =>
			container.moveFocus({ x: 1 }, (event.target as HTMLElement).id),
		[container],
	);

	useOnUp(
		(event) =>
			container.moveFocus({ y: -1 }, (event.target as HTMLElement).id),
		[container],
	);

	useOnDown(
		(event) =>
			container.moveFocus({ y: 1 }, (event.target as HTMLElement).id),
		[container],
	);

	const tableContextValue = useMemo(
		() => ({
			container,
			TrComponent,
			TdComponent,
		}),
		[container, TrComponent, TdComponent],
	);

	return (
		<TableContext.Provider value={tableContextValue}>
			<FocusContext.Provider value={focusContextValue}>
				<TableComponent {...tableProps}>
					{children({ FocusTr, FocusTd }, container)}
				</TableComponent>
			</FocusContext.Provider>
		</TableContext.Provider>
	);
};
