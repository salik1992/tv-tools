import { type RefObject, createRef } from 'react';
import { render } from '@testing-library/react';
import { useMultiRef } from './useMultiRef';

describe('useMultiRef', () => {
	it('should apply value to all refs', () => {
		const TestComponent = ({
			ref1,
			ref2,
		}: {
			ref1: RefObject<HTMLDivElement | null>;
			ref2: RefObject<HTMLDivElement | null>;
		}) => {
			const multiRef = useMultiRef(ref1, ref2);

			return <div ref={multiRef} />;
		};
		const ref1 = createRef<HTMLDivElement>();
		const ref2 = createRef<HTMLDivElement>();
		const { container, unmount } = render(
			<TestComponent ref1={ref1} ref2={ref2} />,
		);
		expect(ref1.current).toBe(container.firstChild);
		expect(ref2.current).toBe(container.firstChild);
		unmount();
		expect(ref1.current).toBe(null);
		expect(ref2.current).toBe(null);
	});
});
