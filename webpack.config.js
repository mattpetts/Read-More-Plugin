const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = {
	...defaultConfig,

	entry: {
		'read-more': path.resolve(__dirname, 'blocks/read-more/src/index.js'),
	},

	output: {
		...defaultConfig.output,
		path: path.resolve(__dirname, 'blocks/read-more/build'),
	},
};