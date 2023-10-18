function getFadedColor(color, fade = 1) {
	// console.log(color)
	switch (color) {
		case 'Agenda':
		case 'Public':
			return `#22a12a`;
		case 'Agenda-rs':
			return 'green'

    case 'Main':
		case 'Normal':
			return `#5b26b0`;
		case 'Normal-rs':
			return `violet`;

		case 'Control':
			return `#ff9800`

		case 'Fail':
			return `#e74c3c`

		case 'Wealth':
			return `#fbbc04`
		case 'Power':
			return `#71368a`
    case 'Success':
    case 'Asset':
			return `#1f8b4c`
		case 'Trait':
			return `#e91e63`
		case 'Other':
			return `#992d22`
			
    case 'Result': 
      return '#0d73d4'
    case 'Effect': 
      return '#531ba8'
    case 'Comment':
      return `#6d6d6d`
			
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
    case 'Wealth-text':
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
  // console.log(efforts)
  // console.log(type)
	const found = type ?  (efforts.find(el => el.type.toLowerCase() === type.toLowerCase()) ) : false;
	return(found ? found.amount : 0)
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

const openLink = (link) => {
  // 'https://www.patreon.com/wcmprojectnexus'
  const win = window.open(link, '_blank');
  win.focus();
};

export { getCountdownHours, getFadedColor, getThisEffort, getTextColor, getTime, openLink };