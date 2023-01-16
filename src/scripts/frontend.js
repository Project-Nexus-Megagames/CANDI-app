function getFadedColor(color, fade = 1) {
	// console.log(color)
	switch (color) {
		case 'Agenda':
		case 'Public':
			return `#22a12a`;
		case 'Agenda-rs':
			return 'green'

		case 'Normal':
			return `#5b26b0`;
		case 'Normal-rs':
			return `violet`;

		case 'Control':
			return `#ff9800`

		case 'Pig':
			return `#e74c3c`

		case 'Frog':
			return `#fbbc04`
		case 'Dwarves':
			return '#03fcbe'
		case 'Spider':
			return `#206694`
		case 'Myconid':
			return `#71368a`
		case 'Drow':
			return `#1f8b4c`
		case 'Raccoon':
			return `#e91e63`
		case 'Other':
			return `#992d22`
			

			
		case 'The Overlord':
			return `#6d6d6d`

		case 'Whitewall':
			return `#e0fffd`
			
		case 'gold':
			return `rgb(212, 175, 55, ${fade})`


		default:
			return `rgba( 0, 160, 189, ${fade} )`;

	}
}

function getTextColor(color, fade = 1) {
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

		case 'Pig':
			return `#e74c3c`

		case 'Frog':
			return `#f1c40f`
		case 'Spider':
			return `#206694`
		case 'Myconid':
			return `#71368a`
		case 'Drow':
			return `#1f8b4c`
		case 'Raccoon':
			return `#e91e63`
			
		case 'Unknown-text':
		case 'Myconid-text':
		case 'Drow-text':
		case 'Spider-text':
		case 'Other-text':
		case 'The Overlord-text':
		case 'PC-text':
		return 'white'

		case 'Control-text':
		case 'Private-text':
		case 'Swamp-text':
		case 'Raccoon-text':
		case 'Dwarves-text':
		case 'Frog-text':
		case 'Pig-text':
		case 'Whitewall-text':
			return `black`

		case 'gold':
			return `rgb(212, 175, 55, ${fade})`


		default:
			return `black`;

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

const getTime = (date) => {
	let day = new Date(date).toDateString();
	let time = new Date(date).toLocaleTimeString();
	return (
		<b>
			{day} - {time}
		</b>
	);
};

export { getCountdownHours, getFadedColor, getThisEffort, getTextColor, getTime };