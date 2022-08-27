import { Icon } from "rsuite";

function getFadedColor(color, fade = 1) {
	// console.log(color)
	switch (color) {
		case 'Agenda':
			return `#22a12a`;
		case 'Agenda-rs':
			return 'green'

		case 'Normal':
			return `#5b26b0`;
		case 'Normal-rs':
			return `violet`;

		case 'Control':
			return `#ff9800`

			case 'Private':
				return `red`

		case 'NPC-text':
		case 'PC-text':
		case 'Private-text':
			return 'white'

		case 'Control-text':
			return `coal`

		case 'gold':
			return `rgb(212, 175, 55, ${fade})`


		default:
			return `rgba( 0, 160, 189, ${fade} )`;

	}
}

function getIcon (type) {
	switch(type){
			case 'Normal':  return(<Icon icon="plus" />)
			case 'Agenda':  return(<Icon icon="plus" />)
			default:
				return(<Icon icon="plus" />)
	}
}

function getCountdownHours(start, end) {
	let countDownDate = new Date(end).getTime();
	const now = new Date(start).getTime();

	return Math.abs(countDownDate - now) / 36e5;
}

function getThisEffort(efforts, type) {
	const found = type ?  (efforts.find(el => el.type.toLowerCase() === type.toLowerCase()) ) : false;
	return(found ? found.amount : -999)
}

export { getIcon, getCountdownHours, getFadedColor, getThisEffort };