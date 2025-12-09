import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../../../../blocks/read-more/src/hooks/useDebounce";

describe('useDebounce', () => {
	beforeEach(() => {
		jest.useFakeTimers();
	});

	test('renders the initial value immediately', () => {
		const { result } = renderHook(() => useDebounce('hello', 500));
		expect(result.current).toBe('hello');
	});

	test('does not immediately update when value is changed', () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, 500),
			{ initialProps: { value: 'Hello' } }
		);

		rerender({ value: 'Hello World' });

		expect(result.current).toBe('Hello');
	});

	test('does update after time period when value is changed', () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, 500),
			{ initialProps: { value: 'Hello' } }
		);

		rerender({ value: 'Hello World' });

		act(() => {
			jest.advanceTimersByTime(500);
		});

		expect(result.current).toBe('Hello World');
	});

	test('resets the debounce timer if value changes again before delay', () => {
		const { result, rerender } = renderHook(
			({ value }) => useDebounce(value, 500),
			{ initialProps: { value: 'Hello' } }
		);

		rerender({ value: 'Hello World' });

		act(() => {
			jest.advanceTimersByTime(250);
		});

		expect(result.current).toBe('Hello');

		rerender({ value: 'Hello Again' });

		act(() => {
			jest.advanceTimersByTime(250);
		});

		expect(result.current).toBe('Hello');
	})
});