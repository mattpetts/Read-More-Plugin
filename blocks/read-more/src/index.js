import {registerBlockType} from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import metadata from '../block.json';

const {category, title, icon, name, attributes} = metadata;

registerBlockType(name, {
	title,
	category,
	icon,
	attributes,
	edit: Edit,
	save: () => {
		return null;
	},
});
