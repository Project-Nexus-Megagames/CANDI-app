export const getDateTimeString = (date) => {
	const d = new Date(date);
	const dd = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
	const mm = d.getMonth()<10 ? '0'+d.getMonth() : d.getMonth();
	const yyyy = d.getFullYear();
	const hh = d.getUTCHours()<10 ? '0'+d.getUTCHours() : d.getUTCHours();
	const min = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
	const dateTimeString = `${yyyy}/${mm}/${dd} ${hh}:${min} (UTC)`;
	return dateTimeString;
};

export const getDateString = (date) => {
	const d = new Date(date);
	const dd = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
	const mm = d.getMonth()<10 ? '0'+d.getMonth() : d.getMonth();
	const yyyy = d.getFullYear();
	const dateString = `${yyyy}/${mm}/${dd}`;
	return dateString;
};

export const getTimeString = (date) => {
	const d = new Date(date);
	const hh = d.getUTCHours()<10 ? '0'+d.getUTCHours() : d.getUTCHours();
	const min = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
	const TimeString = `${hh}:${min} (UTC)`;
	return TimeString;
};