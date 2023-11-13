import { Wrap } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ResourceNugget from '../Common/ResourceNugget';

const HexMap = (props) => {
	const [gStats, setGStats] = React.useState([]); 
	const locations = useSelector(s => s.locations.list);
	const globalStats = useSelector(s => s.gameConfig.globalStats);

  // create hex with multiple levels
  // const createHex = () => {
  //   console.log('Rendering Hex Map...')
  //   const container = document.querySelector('.container');
  //   const hexagonPattern = [3, 4, 5, 4, 3];
    
  //   for (let h =  0; h < 4; h++) {    
  //     const level = document.createElement('div');
  //     level.classList.add('level-css');
  //     const levelText = document.createElement('h4');
  //     levelText.innerHTML = `B${h}`;
  //     level.appendChild(levelText)

  //     for (let x = 0; x < hexagonPattern.length; x++) {
  //     const row = document.createElement('div');
  //     row.classList.add('row');
  //      for (let y = 0; y < hexagonPattern[x]; y++) {
  //       const loc = props.locations.find(el => el.coords.x === x && el.coords.y === y && el.coords.z === h);
  //       const hexagon = document.createElement('div');
  //       hexagon.classList.add('hexagon');
  //       hexagon.classList.add('container');
  //       hexagon.key = getHexId(x, y)
  //       hexagon.id =  loc ? loc._id : `${h}${x}${y}`;
  //       // hexagon.style.backgroundImage= "url(" + "https://cdn.discordapp.com/attachments/904953351999983626/1117310453857656902/Map.png" + ")"
  //       const text = document.createElement('div')
  //       text.classList.add('centerHex');
  //       text.id =  `${x}${y}`
  //       text.innerHTML = `${h}, ${x}, ${y}`;
        
  //       hexagon.appendChild(text);
  
  //       row.appendChild(hexagon);
  //       hexagon.addEventListener("click", handleClick);
  //       hexagon.addEventListener("mouseenter", hoverChange);
  //       hexagon.addEventListener("mouseout", hoverOut);
  //       text.addEventListener("mouseenter", hoverChange);
  //       }
  //       level.appendChild(row);
  
  //     }
  //     container.appendChild(level);

  //   }
  // }

  const createHex = () => {
    console.log('Rendering Hex Map...')
    const container = document.querySelector('.container');
    const hexagonPattern = [3, 4, 5, 4, 3];
    

    for (let x = 0; x < hexagonPattern.length; x++) {
      const row = document.createElement('div');
      row.classList.add('row');
       for (let y = 0; y < hexagonPattern[x]; y++) {
        const loc = props.locations.find(el => el.coords.x === x && el.coords.y === y);
        const hexagon = document.createElement('div');
        hexagon.classList.add('container');
        hexagon.classList.add('hexagon');
        hexagon.key = getHexId(x, y)
        hexagon.id =  loc ? loc._id : `${x}${y}`;
        const text = document.createElement('div')
        text.classList.add('centerHex');
        text.id =  `${x}${y}`

        if (loc) {
          text.innerHTML = loc.name + `(${x}, ${y})`;
          hexagon.style.backgroundImage= "url(" + "https://cdn.discordapp.com/attachments/904953351999983626/1117310453857656902/Map.png" + ")"
        }
        else {
          text.innerHTML = `${x}, ${y}`;
        }
        
        hexagon.appendChild(text);
  
        row.appendChild(hexagon);
        hexagon.addEventListener("click", handleClick);
        hexagon.addEventListener("mouseenter", hoverChange);
        hexagon.addEventListener("mouseout", hoverOut);
        text.addEventListener("mouseenter", hoverChange);
        }
        container.appendChild(row);
  
    }

  }
  
  const getHexId = (row, col) => {
    const Letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var letterIndex = row;
    var letters = "";
    while(letterIndex > 25)
    {
      letters = [letterIndex%26] + letters;
      letterIndex -= 26;
    }
    return `${Letters[letterIndex] + letters + (col + 1)}`;
  };

  function handleClick(data) {
    props.onClick(props.locations.find(el => el._id === data.target.id))
  }
  
  function hoverChange(data) {
    let div = document.getElementById(data.target.id);
    // div.style.backgroundImage= "url(" + "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Libya_%281977%E2%80%932011%2C_3-2%29.svg/1200px-Flag_of_Libya_%281977%E2%80%932011%2C_3-2%29.svg.png" + ")"
    // props.handleHover(props.locations.find(el => el._id === data.target.id))
  }
  
  function hoverOut(data) {
    let div = document.getElementById(data.target.id);
    // div.style.backgroundImage= "url(" + "https://cdn.discordapp.com/attachments/904953351999983626/1117310453857656902/Map.png" + ")"
  }

  const compileStats = () => {
    let statCopy = []
    for (const stat of globalStats) {
      statCopy.push({
        statAmount: 0,
        type: stat.type
      })
    }

    for (const location of locations) {
      for (const stat of location.locationStats) {
        const statIndex = statCopy.findIndex(el => el.type === stat.type);
         if (statIndex !== -1) statCopy[statIndex].statAmount += stat.statAmount;
         else console.log("ERROR: " + stat.type)
      }
    }
    
    setGStats(statCopy)
  }

  useEffect(() => {
    createHex()
    compileStats()
	}, []);

    return (
      <div style={{   }}>
        <h2>Stockpot City</h2>
        <Wrap justify='center'>
              {gStats.map(stat => (
                <div key={stat._id} onClick={() => props.setSelectedStat(stat)} >
                  <ResourceNugget value={stat.statAmount} type={`${stat.type}-stat`} selected={props.selectedStat == stat} />
                </div>
              ))}              
            </Wrap>
        <hr />
        <div className="container">
        </div>
        
      </div>
    );
}

export default HexMap;
