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
 * @returns {string}
 */
export const buildQuery = (postType, paginate, status, searchTerm) => {
	let path = `${ postType }`;
	let query = `?per_page=${ paginate }&order=desc&orderby=date&status=${ status }`;

	if (searchTerm) {
		if (isPostId(searchTerm)) {
			path += `/${ searchTerm }`;
		} else {
			query += `&search=${ encodeURIComponent(searchTerm) }`;
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