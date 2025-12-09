import { PanelBody, PanelRow, SelectControl, Spinner, TextControl } from "@wordpress/components";
import Pagination from "./Pagination";

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
					onChange={ (val) => handleSetSearchTerm(prev => ({ active: val, debounced: prev.debounced } )) }
				/>
			</PanelRow>
			<PanelRow>
				{loading ? <Spinner /> :
					<>
						<SelectControl
							label="Found Posts"
							options={ options }
							onChange={ (val) => handleSetSelectedPost(val) }
							value={ attributes.selectedPost ? attributes.selectedPost.id : 0 }
						/>
					</>
				}
			</PanelRow>
			<PanelRow>
				{ !loading && <Pagination page={ page } totalPages={ totalPages } handleUpdatePage={ handleUpdatePage } /> }
			</PanelRow>
		</PanelBody>
	);
};

export default Settings;