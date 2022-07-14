import { Icon } from "rsuite";

function getFadedColor(color, fade = 1) {
	switch (color) {
		case 'Agenda':
			return `rgba( 235, 223, 59, ${fade} )`;
		case 'bio':
			return `rgba( 0, 181, 0, ${fade} )`;
		case 'Normal':
			return `rgba( 0, 71, 171, ${fade} )`;
		case 'chemical':
			return `rgba( 232, 70, 178, ${fade} )`;

		case 'weapon':
			return `rgba( 255, 79, 57, ${fade} )`;
		case 'andriod':
			return '#00A38E';	
		case 'electronic':
			return '#007E56';	

		case 'gold':
			return `rgba( 212, 175, 55, ${fade} )`;

		case 'alien':
			return '#6600ff';
		case 'space':
			return '#6600ff';
		case 'pink':
			return '#d83ffe';
		case 'food': return '#006600'
		case 'drug': return '#ff99ff'
		case 'fuel':
			return '#5e5e5e';
		case 'advanced':
			return '#ff9933';

		case 'lab':
		case 'lab1':
		case 'lab2': return `rgba(51, 102, 255, ${fade})`;
		case 'factory':
		case 'factory2':
		case 'factory1': return `rgba(223, 7, 43, ${fade})`;

		case 'assembly':
		case 'assembly2':
		case 'assembly1': return `rgba(162, 27, 240, ${fade})`;

		case 'refinery':
		case 'refinery2':
		case 'refinery1': return `rgba(156, 160, 173, ${fade})`;

		case 'offworld-command':
		case 'space-elevator': return `rgba(166, 0, 255, ${fade})`;

		default:
			return `rgba( 0, 160, 189, ${fade} )`;
			
	}
}

function getIcon (type) {
	switch(type){
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