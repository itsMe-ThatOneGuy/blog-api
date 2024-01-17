exports.randomId = (resource) => {
	let _id = resource.id.replace(/.$/, Math.floor(Math.random() * 10));

	while (_id === resource.id) {
		_id = resource.id.replace(/.$/, Math.floor(Math.random() * 10));
	}
	return _id;
};
