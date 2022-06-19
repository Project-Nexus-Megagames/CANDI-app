
import { connect } from 'react-redux';
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const HexMap = (props) => {
  const createHex = () => {
    console.log('Rendering Hex Map...')
    const container = document.querySelector('.container');
    const hexagonPattern = [3, 4, 5, 4, 3, ];
    
    for (let i = 0; i < hexagonPattern.length; i++) {
      const row = document.createElement('div');
      row.classList.add('row');
       for (let j = 0; j < hexagonPattern[i]; j++) {
        const loc = props.locations.find(el => el.coords.x === i && el.coords.y === j);
        const hexagon = document.createElement('div');
        hexagon.classList.add('hexagon');
        hexagon.classList.add('container');
        hexagon.key = getHexId(i, j)
        hexagon.id =  `${i}${j}`
        hexagon.style.backgroundImage = loc ? 
         `url(/images/map/${getHexId(i, j)}.jpg)` :
         'url("/images/map/fog.jpg")'
        const text = document.createElement('div')
        text.classList.add('center');
        text.id =  `${i}${j}`
        text.innerHTML = getHexId(i, j);
        
        hexagon.appendChild(text);
  
        row.appendChild(hexagon);
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
  
  function hoverChange(data) {
    let div = document.getElementById(data.target.id);
    // div.style.border= "url(" + "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Libya_%281977%E2%80%932011%2C_3-2%29.svg/1200px-Flag_of_Libya_%281977%E2%80%932011%2C_3-2%29.svg.png" + ")"
    props.handleHover(data.target.id)
  }
  
  function hoverOut(data) {
    let div = document.getElementById(data.target.id);
  }

  useEffect(() => {
    createHex()
	}, []);

  const constraintsRef = useRef(null);

    return (
            <div className="container" />
    );
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(HexMap);
