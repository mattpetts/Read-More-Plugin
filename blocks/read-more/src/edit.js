import apiFetch from '@wordpress/api-fetch';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useEffect, useState } from "@wordpress/element";
import { buildQuery, normaliseResult, createSelectOptions } from "./utilities";
import { useDebounce } from "./hooks/useDebounce";
import Preview from "./components/Preview";
import Settings from "./components/Settings";
import './editor.scss';

const queryConfig = {
	post_type: 'posts',
	per_page: 20,
	status: 'publish'
}

export default function Edit({ attributes, setAttributes }) {
	const [searchTerm, setSearchTerm]   = useState('');
	const [options, setOptions]         = useState([]);
	const [posts, setPosts]             = useState([]);
	const [isResolving, setIsResolving] = useState(false);
	const [page, setPage]               = useState(1);
	const [totalPages, setTotalPages]   = useState(1);
	const blockProps                    = useBlockProps();

	const debounced = useDebounce(searchTerm, 2000);

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
				setPosts([]);
				setOptions(createSelectOptions([]));
			} finally {
				setIsResolving(false);
			}
		};

		const query = buildQuery(queryConfig.post_type, queryConfig.per_page, queryConfig.status, debounced, page);
		runAPIFetch(query);
	}, [debounced, page]);

	useEffect(() => {
		setPage(1);
	}, [debounced]);

	const postToPreview = posts.find((p) => p.id === attributes.selectedPost);

	return (
		<>
			<InspectorControls>
				<Settings
					attributes={ attributes }
					handleSetSelectedPost={ (id) => setAttributes({ selectedPost: Number(id) }) }
					handleSetSearchTerm={ setSearchTerm }
					searchTerm={ searchTerm }
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