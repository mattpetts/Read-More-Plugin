import { renderHook, waitFor } from '@testing-library/react';
import apiFetch from '@wordpress/api-fetch';
import { useApiRequest } from '../../../../blocks/read-more/src/hooks/useApiRequest';
import { normaliseResult } from '../../../../blocks/read-more/src/utilities';

jest.mock('@wordpress/api-fetch');
jest.mock('../../../../blocks/read-more/src/utilities', () => ({
	normaliseResult: jest.fn()
}));

describe('useApiRequest Hook', () => {
	beforeEach(() => {
		jest.useFakeTimers();
		jest.clearAllMocks();
	});

	test('does nothing when query is empty', () => {
		const { result } = renderHook(() => useApiRequest(''));

		expect(result.current.posts).toEqual([]);
		expect(result.current.totalPages).toBe(1);
		expect(result.current.loading).toBe(false);
		expect(apiFetch).not.toHaveBeenCalled();
	});

	test('returns data and updates state correctly', async () => {
		const mockJson       = { id: 1, title: 'Test' };
		const mockNormalised = [{ id: 1, title: 'Normalised Test' }];
		const mockHeaders    = new Headers({ 'X-WP-TotalPages': '2' });

		const mockResponse = {
			json: jest.fn().mockResolvedValue(mockJson),
			headers: mockHeaders
		};

		apiFetch.mockResolvedValue(mockResponse);
		normaliseResult.mockReturnValue(mockNormalised);

		const { result } = renderHook(() =>
			useApiRequest('posts?search=hello')
		);

		expect(result.current.loading).toBe(true);

		await waitFor(() =>
			expect(result.current.loading).toBe(false)
		);

		expect(apiFetch).toHaveBeenCalledWith({
			path: '/wp/v2/posts?search=hello',
			parse: false
		});

		expect(normaliseResult).toHaveBeenCalledWith(mockJson);
		expect(result.current.posts).toEqual(mockNormalised);
		expect(result.current.totalPages).toBe(2);
		expect(result.current.loading).toBe(false);
	});

	test('sets posts to empty array on fetch error', async () => {
		apiFetch.mockRejectedValue(new Error('Network error'));

		const { result } = renderHook(() =>
			useApiRequest('posts?search=hello')
		);

		expect(result.current.loading).toBe(true);

		await waitFor(() =>
			expect(result.current.loading).toBe(false)
		);

		expect(result.current.posts).toEqual([]);
		expect(result.current.totalPages).toBe(1);
		expect(result.current.loading).toBe(false);
	});
})