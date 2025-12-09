/**
 *
 * @param input
 * @returns {boolean}
 */
export const isPostId = (input) => {
	return /^\d+$/.test(String(input).trim());
};

/**
 *
 * @param postType
 * @param paginate
 * @param status
 * @param searchTerm
 * @param page
 * @returns {string}
 */
export const buildQuery = (postType, paginate, status, searchTerm, page) => {
	let path = `${postType}`;
	let query = `?per_page=${paginate}&page=${page}&order=desc&orderby=date&status=${status}`;

	if (searchTerm) {
		if (isPostId(searchTerm)) {
			path += `/${searchTerm}`;
		} else {
			query += `&search=${encodeURIComponent(searchTerm)}`;
		}
	}

	return path + query;
};

/**
 *
 * @param res
 * @returns {array}
 */
export const normaliseResult = (res) => {

	if (Array.isArray(res)) {
		return res;
	} else {
		if (res?.id) {
			return [res]
		}
	}

	return [];
}

/**
 *
 * @param posts
 * @returns {[{label: string, value: number}]}
 */
export const createSelectOptions = (posts) => {

	const options = posts.filter(post => post.id && post.title.rendered);

	return [
		{ label: 'Select a post', value: 0 },
		...options.map(option => {
			return {
				label: option.title.rendered,
				value: option.id,
			}
		}),
	];
}