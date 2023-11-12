import React, { useEffect } from 'react';

const HexMap = (props) => {
	const [hexagons, setHexagons] = React.useState([]); 

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

  //     for (let i = 0; i < hexagonPattern.length; i++) {
  //     const row = document.createElement('div');
  //     row.classList.add('row');
  //      for (let j = 0; j < hexagonPattern[i]; j++) {
  //       const loc = props.locations.find(el => el.coords.x === i && el.coords.y === j && el.coords.z === h);
  //       const hexagon = document.createElement('div');
  //       hexagon.classList.add('hexagon');
  //       hexagon.classList.add('container');
  //       hexagon.key = getHexId(i, j)
  //       hexagon.id =  loc ? loc._id : `${h}${i}${j}`;
  //       // hexagon.style.backgroundImage= "url(" + "https://cdn.discordapp.com/attachments/904953351999983626/1117310453857656902/Map.png" + ")"
  //       const text = document.createElement('div')
  //       text.classList.add('centerHex');
  //       text.id =  `${i}${j}`
  //       text.innerHTML = `${h}, ${i}, ${j}`;
        
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
    

    for (let i = 0; i < hexagonPattern.length; i++) {
      const row = document.createElement('div');
      row.classList.add('row');
       for (let j = 0; j < hexagonPattern[i]; j++) {
        const loc = props.locations.find(el => el.coords.x === i && el.coords.y === j);
        const hexagon = document.createElement('div');
        hexagon.classList.add('container');
        hexagon.classList.add('hexagon');
        hexagon.key = getHexId(i, j)
        hexagon.id =  loc ? loc._id : `${i}${j}`;
        const text = document.createElement('div')
        text.classList.add('centerHex');
        text.id =  `${i}${j}`

        if (loc) {
          text.innerHTML = loc.name;
          hexagon.style.backgroundImage= "url(" + "https://cdn.discordapp.com/attachments/904953351999983626/1117310453857656902/Map.png" + ")"
        }
        else {
          text.innerHTML = `${i}, ${j}`;
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
    props.handleHover(props.locations.find(el => el._id === data.target.id))
  }
  
  function hoverOut(data) {
    let div = document.getElementById(data.target.id);
    // div.style.backgroundImage= "url(" + "https://cdn.discordapp.com/attachments/904953351999983626/1117310453857656902/Map.png" + ")"
  }

  useEffect(() => {
    createHex()
	}, []);

    return (
      <div style={{   }}>
        <h2>The Surface</h2>
        <hr />
        <div className="container">
        </div>
        
      </div>
    );
}

export default HexMap;
