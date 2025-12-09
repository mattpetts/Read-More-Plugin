import { isPostId, buildQuery, normaliseResult, createSelectOptions } from '../../../blocks/read-more/src/utilities';

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

describe('createSelectOptions', () => {

	const defaultOption = [{ label: 'Select a post', value: 0 }];

	test('returns just the default option if posts is an empty array', () => {
		const posts = [];
		const result = createSelectOptions(posts);

		expect(result).toEqual(defaultOption);
	});

	test('returns correct options based on posts array', () => {
		const posts = [
			{ id: 1, title: { rendered: 'hello' } },
			{ id: 2, title: { rendered: 'world' } },
		];
		const result = createSelectOptions(posts);

		expect(result).toEqual([...defaultOption, { value: 1, label: 'hello' }, { value: 2, label: 'world' }]);
	});

	test('does not create an option if post array does not contain the required params', () => {
		const posts = [
			{ id: 1, title: 'hello' },
			{ id: 2, title: { rendered: 'world' } },
			{ id: 3, title: { rendered: 'Test Option' } },
			{ title: { rendered: 'Another Test' } },
		];
		const result = createSelectOptions(posts);

		expect(result).toEqual([...defaultOption, { value: 2, label: 'world' }, { value: 3, label: 'Test Option' }]);
	});

});