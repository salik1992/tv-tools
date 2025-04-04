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
	const interactable = useMemo(
		() => (disabled ? null : new InteractableBase(passedId, tabIndex)),
		[passedId, disabled],
	);
	const input = useMemo(
		() => (!interactable ? null : new InputBase(interactable)),
		[interactable],
	);

	const inputRef = useRef<HTMLInputElement>(null);
	const textRef = useRef<HTMLDivElement>(null);
	const [renderData, setRenderData] = useState<PxRenderData>(
		charRenderDataToPxRenderData(
			input?.getRenderData(),
			textRef.current?.firstChild,
		),
	);

	const onRenderData = (renderData: CharRenderData) => {
		if (textRef.current && textRef.current.firstChild) {
			textRef.current.firstChild.textContent = renderData.value;
		}
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

	useEffect(() => {
		input?.setInputElement(inputRef.current);
	}, [inputRef.current]);

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
