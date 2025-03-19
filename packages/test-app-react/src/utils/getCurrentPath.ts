export const getCurrentPath = () => {
	const hash = location.hash.replace(/^#/, '');
	return hash.length ? hash : '/';
};
