import {
	type InputHTMLAttributes,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { Interactable as InteractableBase } from '@salik1992/tv-tools/focus';
import {
	type CharRenderData,
	Input as InputBase,
	type PxRenderData,
	charRenderDataToPxRenderData,
} from '@salik1992/tv-tools/input';
import { Interactable } from '../focus';

/**
 * Input component that wraps the Interactable and Input classes from tv-tools.
 *
 * @prop id - optional id that will be assigned to div and also used for focus management.
 * @prop className - optional class name for the wrapping element.
 * @prop style - optional style for the wrapping element.
 * @prop tabIndex - optional tab index for the Interactable component.
 * @prop focusOnMount - optional mark to tell the component to focus itself when mounted.
 * @prop disabled - optional flag to disable the input.
 * @prop other props - other props that will be passed to the input element.
 */
export const Input = ({
	id: passedId,
	className,
	style,
	tabIndex,
	focusOnMount,
	disabled = false,
	...props
}: {
	focusOnMount?: boolean;
} & InputHTMLAttributes<HTMLInputElement>) => {
	// Instance of Interactable and Input classes
	const interactable = useMemo(
		() => (disabled ? null : new InteractableBase(passedId, tabIndex)),
		[passedId, disabled],
	);
	const input = useMemo(
		() => (!interactable ? null : new InputBase(interactable)),
		[interactable],
	);

	// References to the input and text elements
	const inputRef = useRef<HTMLInputElement>(null);
	const textRef = useRef<HTMLDivElement>(null);

	// Render data handling
	const [renderData, setRenderData] = useState<PxRenderData>(
		charRenderDataToPxRenderData(
			input?.getRenderData(),
			textRef.current?.firstChild,
		),
	);

	const onRenderData = (renderData: CharRenderData) => {
		setRenderData(
			charRenderDataToPxRenderData(
				renderData,
				textRef.current?.firstChild,
			),
		);
	};

	useEffect(() => {
		if (input) {
			input.addEventListener('renderData', onRenderData);
		}
		return () => {
			if (input) {
				input.removeEventListener('renderData', onRenderData);
			}
		};
	}, [input]);

	// Pass element to the tv-tools Input class
	useEffect(() => {
		input?.setInputElement(inputRef.current);
	}, [inputRef.current]);

	// Text, caret and selection rendering
	const visualText = (
		<>
			<div className="text" ref={textRef}>
				{renderData.value}
			</div>
			<div
				className="caret"
				style={{ transform: `translateX(${-renderData.caret}px)` }}
			/>
			{renderData.selection && (
				<div
					className="selection"
					style={{
						transform: `translateX(${-renderData.selection[0]}px)`,
						width: renderData.selection[1],
					}}
				/>
			)}
		</>
	);

	// If there is no Interactable (disabled), return the visual text only.
	if (!interactable) {
		return (
			<div className={className} style={style}>
				{visualText}
			</div>
		);
	}

	let fullClassName = className ?? '';
	if (renderData.active) {
		fullClassName += ' active';
	}
	if (renderData.placeholder) {
		fullClassName += ' placeholder';
	}

	return (
		<Interactable
			interactableBase={interactable}
			className={fullClassName}
			style={style}
			focusOnMount={focusOnMount}
		>
			{visualText}
			<input
				{...props}
				id={`${interactable.id}-input`}
				tabIndex={tabIndex}
				ref={inputRef}
			/>
		</Interactable>
	);
};
