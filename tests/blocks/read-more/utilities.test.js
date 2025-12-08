import { isPostId, buildQuery, normaliseResult } from '../../../blocks/read-more/src/utilities';

describe('isPostId', () => {
	test('function returns true if searchTerm is a number', () => {
		const result = isPostId(1);
		expect(result).toBe(true);
	});

	test('function returns false if searchTerm is a string', () => {
		const result = isPostId('hello');
		expect(result).toBe(false);
	});

	test('function returns false if searchTerm contains a mixture of numbers and letters', () => {
		const result = isPostId('12 days of Christmas');
		expect(result).toBe(false);
	});
});

describe('buildQuery', () => {

	const makeQuery = (searchTerm) => {
		return buildQuery('posts', 10, 'publish', searchTerm);
	}

	test('query is returned with post id as a segment if postId is provided', () => {
		const query = makeQuery(1);
		expect(query).toContain('/1?');
	});

	test('query does not contain a search parameter if post id is provided', () => {
		const query = makeQuery(1);
		expect(query).not.toContain('&search=1');
	});

	test('paginate, status and postType are in the query as expected', () => {
		const query = makeQuery('hello');
		expect(query).toContain('posts?');
		expect(query).toContain('per_page=10');
		expect(query).toContain('&status=publish');
	});

	test('search parameter is appended is a search term is provided', () => {
		const query = makeQuery('hello');
		expect(query).toContain('&search=hello')
	})
});

describe('normaliseResult', () => {
	test('returns unchanged res parameter if res is an array', () => {
		const array = [1, 2, 3];
		const result = normaliseResult(array);

		expect(result).toEqual(array);
	});

	test('if an object is provided and contains an id key, it is returned in an array', () => {
		const object = {
			id: '123'
		}
		const result = normaliseResult(object);

		expect(result).toEqual([{...object}]);
	});

	test('if an object is provided and does not contain an id key, a blank array is returned', () => {
		const object = {
			test: '123'
		}
		const result = normaliseResult(object);

		expect(result).toEqual([]);
	});
});