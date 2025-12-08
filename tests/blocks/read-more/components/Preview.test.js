import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Preview from "../../../../blocks/read-more/src/components/Preview";

describe('Preview Component', () => {
	test('displays the correct attributes', async () => {
		render(<Preview link="/test.com" title="Hello World" />)

		const paragraph = screen.getByText('Read more:').closest('p')
		expect(paragraph).toHaveClass('dmg-read-more')

		const link = screen.getByRole('link', {name: 'Hello World'})
		expect(link).toHaveAttribute('href', '/test.com')
	});

	test('Component does not render if title prop is missing', () => {
		const { container } = render(<Preview link="/test.com" title="" />);
		expect(container).toBeEmptyDOMElement();
	});

	test('Component does not render if link prop is missing', () => {
		const { container } = render(<Preview link="" title="Hello World" />);
		expect(container).toBeEmptyDOMElement();
	});
});