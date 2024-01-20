export default (obj, key, func) => {
	obj[key] = async () => {
		try {
			await func();
		} catch (e) {
			if (obj[key]) obj[key]();
		}
	};
	obj[key]();
};
