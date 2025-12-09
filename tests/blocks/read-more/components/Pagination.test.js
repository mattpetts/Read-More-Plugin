import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Pagination from "../../../../blocks/read-more/src/components/Pagination";

describe('Pagination Component', () => {
	test('does not render if there is 1 or less total pages', async () => {
		const { container } = render(<Pagination page={ 1 } totalPages={ 1 } handleUpdatePage={ jest.fn() } />)
		expect(container).toBeEmptyDOMElement();
	});

	test('renders if there is more thjan 1 total pages', async () => {
		const { container } = render(<Pagination page={ 1 } totalPages={ 2 } handleUpdatePage={ jest.fn() } />)
		expect(container).not.toBeEmptyDOMElement();
	});

	test('displays the correct page information', async () => {
		render(<Pagination page={ 5 } totalPages={ 23 } handleUpdatePage={ jest.fn() } />)
		expect(screen.getByText('Page 5 / 23')).toBeInTheDocument();
	});

	test.each([
		{
			name: 'next button increments the current page by 1',
			buttonText: 'Next',
			initialPage: 5,
			expectedPage: 6
		},
		{
			name: 'previous button decrements the current page by 1',
			buttonText: 'Previous',
			initialPage: 5,
			expectedPage: 4
		}
	])('$name', ({ buttonText, initialPage, expectedPage }) => {
		const mockUpdateFunction = jest.fn();

		render(<Pagination page={ initialPage } totalPages={ 23 } handleUpdatePage={ mockUpdateFunction } />);

		const button = screen.getByText(buttonText);
		fireEvent.click(button);

		expect(mockUpdateFunction).toHaveBeenCalledWith(expectedPage);
	});
});