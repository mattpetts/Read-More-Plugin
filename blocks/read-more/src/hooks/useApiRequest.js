import apiFetch from '@wordpress/api-fetch';
import { useState, useEffect } from '@wordpress/element';
import { normaliseResult } from '../utilities';

/**
 *
 * @param query
 * @returns {{posts:[], totalPages: number, loading: boolean}}
 */
export const useApiRequest = (query) => {
	const [posts, setPosts] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!query) {
			return;
		}

		async function fetchData() {
			setLoading(true);

			try {
				const response   = await apiFetch({ path: `/wp/v2/${query}`, parse: false });
				const json       = await response.json();
				const pages      = response.headers.get('X-WP-TotalPages');
				const normalised = normaliseResult(json);

				setPosts(normalised);
				setTotalPages(Number(pages) || 1);
			} catch (err) {
				setPosts([]);
			} finally {
				setLoading(false);
			}
		}

		fetchData();

	}, [query]);

	return { posts, totalPages, loading };
};