export const getDateTimeString = (date) => {
	const d = new Date(date);
	// TODO: get Date/time to local date/time
	var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
	return d.toLocaleString('en-US', options);
};

export const getDateString = (date) => {
	const d = new Date(date);
	return d.toLocaleDateString('en-US');
};

export const getTimeString = (date) => {
	const d = new Date(date);
	return d.toLocaleTimeString('en-US');
};