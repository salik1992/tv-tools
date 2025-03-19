export const getCurrentPath = () => {
	return location.hash.replace(/^#/, '');
};
