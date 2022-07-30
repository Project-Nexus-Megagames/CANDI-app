export const getDateTimeString = (date) => {
	const d = new Date(date);
	const dd = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
	const mm = d.getMonth()<10 ? '0'+d.getMonth() : d.getMonth;
	const yyyy = d.getFullYear();
	const hh = d.getUTCHours();
	const min = d.getMinutes();
	const dateTimeString = `${yyyy}/${mm}/${dd} ${hh}:${min} (UTC)`;
	return dateTimeString;
};