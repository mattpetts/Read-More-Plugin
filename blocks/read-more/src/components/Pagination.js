import { Button } from '@wordpress/components';

const Pagination = ({ page, totalPages, handleUpdatePage }) => {

	if (totalPages <= 1) {
		return;
	}

	return (
		<div className="dmg-pagination-controls">
			<Button
				variant="secondary"
				disabled={page <= 1}
				onClick={() => handleUpdatePage(page - 1)}
			>
				Previous
			</Button>
			<span>Page {page} / {totalPages}</span>
			<Button
				variant="secondary"
				disabled={page >= totalPages}
				onClick={() => handleUpdatePage(page + 1)}
			>
				Next
			</Button>
		</div>
	);
};

export default Pagination;