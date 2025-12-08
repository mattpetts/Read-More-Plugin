const Preview = ({ link, title }) => {
	if (!link || !title) {
		return null;
	}

	return (
		<p className="dmg-read-more">
			Read more: <a href={ link }>{ title }</a>
		</p>
	);
};

export default Preview;