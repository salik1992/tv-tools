import { useEffect, useMemo, useState } from 'react';
import loadingImage from '../assets/loading-image.png';
import noImage from '../assets/no-image.png';

export const ImageWithFallback = ({
	src,
	className,
}: {
	src: string;
	className?: string;
}) => {
	const buffer = useMemo(() => new Image(), [src]);
	const [image, setImage] = useState(loadingImage);

	useEffect(() => {
		buffer.onload = () => {
			setImage(src);
		};
		buffer.onerror = () => {
			setImage(noImage);
		};
		buffer.src = src;
	}, [buffer]);

	return (
		<div
			className={className}
			style={{ backgroundImage: `url(${image})` }}
		/>
	);
};
