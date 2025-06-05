import { useEffect, useMemo, useState } from 'react';
import loadingImage from '../../assets/loading-image.png';
import noImage from '../../assets/no-image.png';

export const Image = ({
	src,
	className,
}: {
	src: string | null;
	className?: string;
}) => {
	const buffer = useMemo(() => new window.Image(), [src]);
	const [image, setImage] = useState(loadingImage);

	useEffect(() => {
		buffer.onload = () => {
			setImage(src ?? noImage);
		};
		buffer.onerror = () => {
			setImage(noImage);
		};
		buffer.src = src ?? noImage;
	}, [buffer]);

	useEffect(() => {
		setImage(loadingImage);
	}, [src]);

	return (
		<div
			className={className}
			style={{ backgroundImage: `url(${image})` }}
		/>
	);
};
