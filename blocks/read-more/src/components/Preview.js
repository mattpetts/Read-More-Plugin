const Preview = ({ link, title }) => {
	return (
		<p className="dmg-read-more">Read more: <a href={ link }>{ title }</a></p>
	);
};

export default Preview;