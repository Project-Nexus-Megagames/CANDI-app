/* eslint-disable react/react-in-jsx-scope */
import { Tag, Tooltip } from "@chakra-ui/react";

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
    case 'Misc':
			return `#5b26b0`;

    case 'Craft':
      return `rgba(66,133,244, ${fade})`; // #4285f4
    case 'Form Bond':
			return `rgba(204,0,0, ${fade})`; // #cc0000
    case 'A':
			return `rgba(52,168,83, ${fade})`; // #34a853
		case 'Control':
			return `#ff9800`

    case 'Pig':
		case 'Fail':
			return `#e74c3c`

    case 'Refined Item':
		case 'Wealth':

			return `#fbbc04`
    case 'Workshop':
		case 'Power':
			return `#71368a`
    case 'Success':
    case 'Asset':
			return `#1f8b4c`
    case 'Labor':
		case 'Trait':
			return `#e91e63`
    case 'Production':
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
        
  
        
      case 'Undead':
      case 'The Overlord':
        return `#6d6d6d`
  
      case 'Surface':
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

  var date1 = new Date(date);
  var date2 = new Date();
  let text = '';

  const distance =  date2.getTime() - date1.getTime(); 
  const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
  const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
  if (days > 0) text = (`${days} Days, ${hours} Hours, ${minutes} Minutes`);
  else if (hours > 0) text = (`${hours} Hours, ${minutes} Minutes`);
  else text = (`${minutes} Minutes`);
              
	return (
    <Tooltip
    label={`${day} - ${time}`}
    aria-label='Publish tooltip'
>
    <Tag
        size="sm"
        backgroundColor={getFadedColor('Power', hours * 0.2)}
        marginTop='0.25rem'
        aria-label={'Publish Action'}
    >{text} Ago</Tag>
</Tooltip>
	);
};

const openLink = (link) => {
  // 'https://www.patreon.com/wcmprojectnexus'
  const win = window.open(link, '_blank');
  win.focus();
};

export { getCountdownHours, getFadedColor, getThisEffort, getTextColor, getTime, openLink };