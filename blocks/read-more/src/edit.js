import apiFetch from '@wordpress/api-fetch';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useEffect, useState } from "@wordpress/element";
import { buildQuery, normaliseResult, createSelectOptions } from "./utilities";

import Preview from "./components/Preview";
import Settings from "./components/Settings";

import './editor.scss';

const queryConfig = {
	post_type: 'posts',
	per_page: 20,
	status: 'publish'
}

export default function Edit({ attributes, setAttributes }) {
	const debouncePeriod = 2000;

	const [searchTerm, setSearchTerm]   = useState({ active: '', debounced: '' });
	const [options, setOptions]         = useState([]);
	const [posts, setPosts]             = useState([]);
	const [isResolving, setIsResolving] = useState(false);
	const [page, setPage]               = useState(1);
	const [totalPages, setTotalPages]   = useState(1);
	const blockProps                    = useBlockProps();

	useEffect(() => {
		const runAPIFetch = async (query) => {
			setIsResolving(true);

			try {
				const result     = await apiFetch({ path: `/wp/v2/${query}`, parse: false  });
				const json       = await result.json();
				const normalised = normaliseResult(json)
				const totalPages = result.headers.get('X-WP-TotalPages');

				setPosts(normalised);
				setTotalPages(totalPages ? Number(totalPages) : 1);
				setOptions(createSelectOptions(normalised));
			} catch (err) {
				console.log(err)
				setPosts([]);
				setOptions([{ label: 'No results found', value: 0 }]);
			} finally {
				setIsResolving(false);
			}
		};

		const query = buildQuery(queryConfig.post_type, queryConfig.per_page, queryConfig.status, searchTerm.debounced, page);
		runAPIFetch(query);
	}, [searchTerm.debounced, page]);

	useEffect(() => {
		const handler = setTimeout(() => {
			setSearchTerm(prev => ({ debounced: searchTerm.active, active: prev.active }));
			setPage(1);
		}, debouncePeriod);

		return () => clearTimeout(handler);
	}, [searchTerm.active]);

	const postToPreview = posts.find((p) => p.id === attributes.selectedPost);

	return (
		<>
			<InspectorControls>
				<Settings
					attributes={ attributes }
					handleSetSelectedPost={ (id) => setAttributes({ selectedPost: Number(id) }) }
					handleSetSearchTerm={ setSearchTerm }
					searchTerm={ searchTerm.active }
					options={ options }
					loading={ isResolving }
					page={ page }
					totalPages={ totalPages }
					handleUpdatePage={ (page) => setPage(page) }
				/>
			</InspectorControls>
			<div {...blockProps}>
				{postToPreview && (
					<Preview
						link={ postToPreview.link }
						title={ postToPreview.title?.rendered }
					/>
				)}
			</div>
		</>
	);
}