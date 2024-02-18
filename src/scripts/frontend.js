/* eslint-disable react/react-in-jsx-scope */
import { PlusSquareIcon } from "@chakra-ui/icons";
import { Tag, Tooltip } from "@chakra-ui/react";

function getFadedColor(color, fade = 1) {
  // console.log(color)
  switch (color) {
    case 'Agenda':
    case 'Public':
    case 'For':
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
    case 'food':
      return `rgba(52,168,83, ${fade})`; // #34a853
    case 'Control':
      return `#ff9800`

    case 'Against':
    case 'Pig':
    case 'Pig Goblins':
    case 'Fail':
    case 'brawling':
      return `#e74c3c`

    case 'Refined Item':
    case 'wealth':

      return `#fbbc04`
    case 'Workshop':
    case 'scavenge':
      return `#71368a`
    case 'Success':
    case 'Asset':
      return `#1f8b4c`
    case 'Labor':
    case 'Trait':
    case 'performance':
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
    case 'Frog Goblins':
      return `#fbbc04`
    case 'Dwarves':
      return '#03fcbe'

    case 'science':
    case 'Spider':
    case 'Spider Goblins':
      return `#206694`
    case 'Myconid':
      return `#71368a`
    case 'Rat':
    case 'Rat Goblins':
      return `#1f8b4c`
    case 'Mimic':
    case 'Mimic Party':
      return `#e91e63`


    case 'Underkin':
    case 'minion':
    case 'Underkin Faction':
    case 'The Overlord':
      return `#6d6d6d`

    case 'Surface':
    case 'Whitewall':
      return `#e0fffd`

    case 'gold':
      return `rgb(212, 175, 55, ${fade})`

    case 'magic': return `#df812e`
    case 'The Nova Union': return `#3198dd`
    case 'Kepler Vanguard': return `#2dcc70`
    case 'Exploratory Society': return `#1cbb9b`
    case 'Nomadum Negotiation': return `#71368a`
    case 'Factionless': return `#2dcc70`

    case 'background':
      return `rgba( 15, 19, 26, ${fade} )`;

    case 'card':
      return '#1a1d24'

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
    case 'wealth':
    case 'Surface':
    case 'Surface-text':
    case 'Exploratory society':
    case 'magic':
    case 'Mars Mining Corporation':
      return `black`


    case 'gold':
      return `rgb(212, 175, 55, ${fade})`


    default:
      return `white`;

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
  const found = type ? (efforts.find(el => el.type.toLowerCase() === type.toLowerCase())) : false;
  return (found ? found.amount : 0)
}

const getTime = (date) => {
  let day = new Date(date).toDateString();
  let time = new Date(date).toLocaleTimeString();

  var date1 = new Date(date);
  var date2 = new Date();
  let text = '';

  const distance = date2.getTime() - date1.getTime();
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

function getThisTeam(teams, character) {
  // console.log(teams)
  // console.log(character)
  const found = teams.find((el) => el.characters.some((char) => char._id === character));
  return found ? found : { name: 'No Team found' };
}

function getThisAccount(accounts, account) {
  // console.log(teams)
  // console.log(character)
  const found = accounts.find((el) => el._id === account);
  return found ? found.name : 'No Account found';
}

function populateThisAccount(accounts, account) {
  // console.log(teams)
  // console.log(character)
  const found = accounts.find((el) => el._id === account);
  return found ? found : { name: 'No Account found' };
}


function getThisTeamFromAccount(accounts, teams, account) {
  // console.log(teams)
  // console.log(character)
  // const found = accounts.find(el => el._id === account)?.team;
  // return found ? found.name : 'No team found';
  let team;
  let acc = accounts.find(el => el._id === account);

  if (account) {
    team = acc?.team;
  }

  if (account && !team) {
    team = teams.find(el => el.characters.some(c => c?._id === acc.manager || c === acc.manager))
  }

  if (team) return team;
  return { name: 'no team found lol' }
}

function getIcon(type) {
  switch (type) {
    case 'Normal':
      return <PlusSquareIcon />;
    case 'Agenda':
      return <img style={{ margin: '4px', }} src={`/images/gavel.png`} width={'20px'} alt={`gavel???`} />;
    case 'Craft':
      return <img style={{ margin: '4px', }} src={`/images/stone-crafting.png`} width={'22px'} alt={`gavel???`} />;
    case 'Form Bond':
      return <img style={{ margin: '4px', }} src={`/images/shaking-hands.png`} width={'22px'} alt={`gavel???`} />;
    default:
      return <PlusSquareIcon />;
  }
}

const calculateProgress = (options) => {
  let forProg = 0;
  for (let resource of options[0].resources) {
    forProg += agendaValue(resource.type, resource.amount)
  }

  for (let asset of options[0].assets) {
    for (const die of asset.dice) {
      forProg += die.amount;
    }
  }

  let agProg = 0;
  for (let resource of options[1].resources) {
    agProg += agendaValue(resource.type, resource.amount)
  }

  for (let asset of options[1].assets) {
    for (const die of asset.dice) {
      agProg += die.amount;
    }
  }

  return forProg - agProg;
}


const agendaValue = (resource, value) => {
  switch (resource) {
    case 'agenda_effort': return 20 * value;
    case 'effort': return 10 * value;
    default: return 1 * value;
  }
}



export { calculateProgress, getThisTeam, getThisAccount, getThisTeamFromAccount, getCountdownHours, getFadedColor, getThisEffort, getTextColor, getTime, openLink, getIcon, populateThisAccount, agendaValue };