import { PanelBody, PanelRow, SelectControl, Spinner, TextControl } from '@wordpress/components';
import Pagination from './Pagination';

const Settings = ({
	handleSetSearchTerm,
	handleSetSelectedPost,
	searchTerm,
	attributes,
	options,
	loading,
	page,
	totalPages,
	handleUpdatePage
}) => {
	return (
		<PanelBody title={ 'Select a post' }>
			<PanelRow>
				<TextControl
					label="Search by post name or ID"
					value={ searchTerm }
					onChange={ (val) => handleSetSearchTerm(val) }
				/>
			</PanelRow>
			{!loading ?
				<>
					<PanelRow>
						<SelectControl
							label="Found Posts"
							options={ options }
							onChange={ (val) => handleSetSelectedPost(val) }
							value={ attributes.selectedPost ? attributes.selectedPost.id : 0 }
						/>
					</PanelRow>
					<PanelRow>
						<Pagination page={ page } totalPages={ totalPages } handleUpdatePage={ handleUpdatePage } />
					</PanelRow>
				</>
				:
				<PanelRow>
					<Spinner />
				</PanelRow>
			}
		</PanelBody>
	);
};

export default Settings;