import { PanelBody, PanelRow, SelectControl, Spinner, TextControl } from "@wordpress/components";

const Settings = ({ handleSetSearchTerm, handleSetSelectedPost, searchTerm, attributes, options, loading }) => {
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
				{loading ? <Spinner /> : <SelectControl
					label="Found Posts"
					options={ options }
					onChange={ (val) => handleSetSelectedPost(val) }
					value={ attributes.selectedPost ? attributes.selectedPost.id : 0 }
				/> }
			</PanelRow>
		</PanelBody>
	);
};

export default Settings;