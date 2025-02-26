import {
	useContext,
	useEffect,
	useMemo,
	useRef,
	type DetailedHTMLProps,
	type HTMLAttributes,
} from 'react';
import { Interactable as InteractableBase } from '@salik1992/tv-tools/focus';
import { FocusContext } from './context';

/**
 * The main component for rendering focusable elements. It renders a div and you
 * can pass all usual props that you could use for the div.
 *
 * @prop onPress - action that should happen when user presses ENTER or clicks on
 * the element.
 * @prop focusOnMount - optional mark to tell the component to focus itself when mounted
 * If controlled you can also force focus on update. Please note, if there are other
 * components using focusOnMount later in the document, they will take over.
 * @prop id - id that will be assigned to div and also used for focus management. If left
 * empty, the focus manager will assign auto id. Please note, the id parameter is required
 * for finding the origin of the event.
 * @prop tabIndex - if needed it can be overriden here, otherwise it is set to 0 by focus
 * manager
 *
 * @example
 * ```typescriptreact
 * const MovieTile = ({ data }) => {
 *     return (
 *         <Interactable className="movie-tile">
 *             <Image src={data.poster} />
 *             <H4>{data.title}</H4>
 *         </Interactable>
 *     )
 * }
 */
export const Interactable = ({
	onPress,
	focusOnMount,
	id,
	tabIndex,
	...props
}: { onPress: () => boolean; focusOnMount?: boolean } & DetailedHTMLProps<
	HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>) => {
	const interactable = useMemo(
		() => new InteractableBase(onPress, id, tabIndex),
		[onPress, id],
	);
	const { addChild } = useContext(FocusContext);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Needs to run every time to maintain children order.
		addChild(interactable.id);
	});

	useEffect(() => {
		interactable.setElement(ref.current);
	}, [interactable, ref.current]);

	useEffect(() => {
		if (focusOnMount) {
			interactable.focus({ preventScroll: true });
		}
	}, [focusOnMount]);

	useEffect(
		() => () => {
			interactable.destroy();
		},
		[],
	);

	return <div {...props} ref={ref} />;
};
