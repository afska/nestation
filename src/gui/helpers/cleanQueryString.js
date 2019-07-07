export default () => {
	let url;
	url = window.location.href;
	url = url.replace(url.substring(url.indexOf("?")), "");
	url = url.substring(url.indexOf("//") + 2);
	url = url.substring(url.indexOf("/"));
	window.history.replaceState({}, "", url);
};
