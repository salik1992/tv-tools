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
	FocusTr: (props: ComponentProps<TrComponent>) => ReactNode;
	FocusTd: (
		props: {
			colSpan?: number;
			rowSpan?: number;
		} & ComponentProps<TdComponent>,
	) => ReactNode;
};

export const FocusTable = ({
	id,
	children,
	// @ts-expect-error: TODO
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
		[TrComponent, TdComponent],
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
