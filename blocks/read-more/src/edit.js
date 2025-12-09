import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useEffect, useState } from '@wordpress/element';
import { buildQuery, createSelectOptions } from './utilities';
import { useDebounce } from './hooks/useDebounce';
import { useApiRequest } from './hooks/useApiRequest';
import Preview from './components/Preview';
import Settings from './components/Settings';
import './editor.scss';

const queryConfig = {
	post_type: 'posts',
	per_page: 20,
	status: 'publish'
}

export default function Edit({ attributes, setAttributes }) {
	const [searchTerm, setSearchTerm]   = useState('');
	const [options, setOptions]         = useState([]);
	const [page, setPage]               = useState(1);
	const blockProps                    = useBlockProps();
	const debounced                     = useDebounce(searchTerm, 2000);

	const query = buildQuery(
		queryConfig.post_type,
		queryConfig.per_page,
		queryConfig.status,
		debounced,
		page
	);

	const { posts, totalPages, loading } = useApiRequest(query);

	useEffect(() => {
		setOptions(createSelectOptions(posts));
	}, [posts]);

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
					loading={ loading }
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