import {
	type ComponentProps,
	type ComponentType,
	type PropsWithChildren,
	createContext,
	useCallback,
	useContext,
	useMemo,
} from 'react';
import { FocusContext } from './context';
import { useTableFocusContainer } from './useTableFocusContainer';

const ChildrenOnlyComponent = ({ children }: PropsWithChildren) => {
	return <>{children}</>;
};

const TableContext = createContext<{
	TrComponent: ComponentType<PropsWithChildren<unknown>>;
	TdComponent: ComponentType<PropsWithChildren<unknown>>;
}>({
	TrComponent: ChildrenOnlyComponent,
	TdComponent: ChildrenOnlyComponent,
});

export const FocusTd = ({
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
	const { TrComponent } = useContext(TableContext);

	return <TrComponent {...props} />;
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
	children: (components: {
		FocusTr: ComponentProps<typeof TrComponent>;
		FocusTd: { colSpan?: number; rowSpan?: number } & ComponentProps<
			typeof TdComponent
		>;
	}) => React.ReactNode;
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
			TrComponent,
			TdComponent,
		}),
		[TrComponent, TdComponent],
	);

	return (
		<TableContext.Provider value={tableContextValue}>
			<FocusContext.Provider value={focusContextValue}>
				<TableComponent id={id} {...tableProps}>
					{children({ FocusTr, FocusTd })}
				</TableComponent>
			</FocusContext.Provider>
		</TableContext.Provider>
	);
};
