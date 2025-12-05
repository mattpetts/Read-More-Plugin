import apiFetch from '@wordpress/api-fetch';
import { useBlockProps } from '@wordpress/block-editor';
import { useEffect, useState } from "@wordpress/element";
import { buildQuery, normaliseResult } from "./utilities";

import Preview from "./components/Preview";
import Settings from "./components/Settings";

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
	const postType       = 'posts';
	const paginate       = 20;
	const status         = 'publish';
	const debouncePeriod = 2000;

	const [searchTerm, setSearchTerm]   = useState({active: '', debounced: ''});
	const [options, setOptions]         = useState([]);
	const [posts, setPosts]             = useState([]);
	const [isResolving, setIsResolving] = useState(false);
	const blockProps                    = useBlockProps();

	useEffect(() => {
		const runAPIFetch = async (query) => {
			setIsResolving(true);

			try {
				const result     = await apiFetch({ path: `/wp/v2/${ query }` });
				const normalised = normaliseResult(result)

				setPosts(normalised);

				setOptions([
					{ label: 'Select a post', value: 0 },
					...normalised.map((post) => ({
						label: post.title.rendered,
						value: post.id,
					})),
				]);
			} catch (err) {
				setPosts([]);
				setOptions([{ label: 'No results found', value: 0 }]);
			} finally {
				setIsResolving(false);
			}
		};

		const query = buildQuery(postType, paginate, status, searchTerm.debounced);
		runAPIFetch(query);
	}, [searchTerm.debounced]);

	useEffect(() => {
		const handler = setTimeout(() => {
			setSearchTerm(prev => ({ debounced: searchTerm.active, active: prev.active }));
		}, debouncePeriod);

		return () => clearTimeout(handler);
	}, [searchTerm.active]);

	const postToPreview = posts.find((p) => p.id === attributes.selectedPost);

	return (
		<>
			<Settings
				attributes={ attributes }
				handleSetSelectedPost={ (id) => setAttributes({ selectedPost: Number(id) }) }
				handleSetSearchTerm={ setSearchTerm }
				searchTerm={ searchTerm.active }
				options={ options }
				loading={ isResolving }
			/>

			<div { ...blockProps }>
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