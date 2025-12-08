import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from '../../../../blocks/read-more/src/components/Settings';

jest.mock('@wordpress/components', ()  => ({
	PanelBody: ({ children }) => <div>{ children }</div>,
	PanelRow: ({ children }) => <div>{ children }</div>,
	SelectControl: ({ label, value, options, onChange }) => (
		<label>
			{ label }
			<select aria-label={ label } value={ value } onChange={ (e) => onChange(e.target.value) }>
				{ options?.map(opt => (
					<option key={ opt.value ?? opt.id } value={ opt.value ?? opt.id }>
						{ opt.label }
					</option>
				))}
			</select>
		</label>
	),
	Spinner: () => <div>spinner</div>,
	TextControl: ({ label, value, onChange }) => (
		<input aria-label={ label } value={ value } onChange={ (e) => onChange(e.target.value) } />
	),
}));

describe('Settings Component', () => {

	const renderSettings = (overrides = {}) => {

		const props = {
			handleSetSearchTerm: jest.fn(),
			handleSetSelectedPost: jest.fn(),
			searchTerm: 'Hello',
			attributes: { selectedPost: null },
			options: [],
			loading: false,
			...overrides
		}

		return render( <Settings { ...props } />)
	}

	test('search box renders the correct value', () => {
		renderSettings();

		expect(screen.getByLabelText('Search by post name or ID')).toHaveValue('Hello');
	});

	test('calls handleSetSearchTerm when TextControl changes', () => {
		const myCallback = jest.fn();

		renderSettings({ handleSetSearchTerm: myCallback });

		const input = screen.getByLabelText('Search by post name or ID');
		fireEvent.change(input, { target: { value: 'hello' } });

		expect(myCallback).toHaveBeenCalled();
	});

	test('shows loading spinner when loading', () => {
		renderSettings({ loading: true });

		expect(screen.getByText('spinner')).toBeInTheDocument();
	});

	test('SelectControl is present when not loading', () => {
		renderSettings();

		expect(screen.getByLabelText('Found Posts')).toBeInTheDocument();
	});

	test('SelectControl renders correct options', () => {
		renderSettings({ options: [{ id: 1, label: 'hello' }, { id: 2, label: 'world' }] });

		expect(screen.getByText('hello')).toBeInTheDocument();
		expect(screen.getByText('world')).toBeInTheDocument();
	});
});