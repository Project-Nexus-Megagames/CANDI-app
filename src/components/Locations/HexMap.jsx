import { Button, ButtonGroup, Center, Divider, Wrap } from '@chakra-ui/react';
import { MapInteractionCSS } from 'react-map-interaction';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ResourceNugget from '../Common/ResourceNugget';
import StatBar from './StatBar';
import { Minus, Plus } from '@rsuite/icons';
import { getMyLocations } from '../../redux/entities/locations';

const HexMap = (props) => {
  const { mode, setMode } = props;
  const [gStats, setGStats] = React.useState([]);
  const locations = useSelector(getMyLocations);

  const globalStats = useSelector(s => s.gameConfig.globalStats);
  const [value, setValue] = React.useState({ scale: 1, translation: { x: 0, y: 0 } });

  const hexWidth = 180; // Width of each hexagon
  const hexHeight = 180; // Height of each hexagon

  const tiles = [
    { "cave": "https://cdn.discordapp.com/attachments/857862435096100884/1176726546761928705/bigfall.png?ex=662f147f&is=662dc2ff&hm=8ab81afedc389f764e91529070a439ec71089d99b726462c4fa26069ebf73a61&" }
  ]

  const getHexId = (row, col) => {
    const Letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var letterIndex = row;
    var letters = "";
    while (letterIndex > 25) {
      letters = [letterIndex % 26] + letters;
      letterIndex -= 26;
    }
    return `${Letters[letterIndex] + letters + (col + 1)}`;
  };

  function handleClick(data) {
    //console.log(data.target.getAttribute("xCord"))
    const loc = props.locations.find(el => el._id === data.target.id);
    if (loc) props.onClick(loc);
    else props.onClick({ x: data.target.getAttribute("xCord"), y: data.target.getAttribute("yCord") })
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
    compileStats()
  }, [props.selectedStat, locations]);

  const getHexCenter = (x, y) => {
    // Apply offset for staggered rows (even rows shifted right)
    const hexSelector = `.hexagon[xCord="${x}"][yCord="${y}"]`;
    const container = document.querySelector(hexSelector);
    //console.log(container)
    const rect = container?.getBoundingClientRect();
    console.log(rect)

    const offset = (y % 2 === 0) ? hexWidth / 2 : 0;

    const posX = x * hexWidth + offset;
    const posY = y * (hexHeight); // Height of staggered hexagon
    return { x: rect?.x, y: rect?.y };
  };


  const inRange = ({ x, y }) => {

    const startHex = getHexCenter(x, y); // Example starting hex

    const closeLocations = locations.filter(el => ((el.coords.x - x + el.coords.y - y) > 0))
    // console.log(x, y)
    // console.log(closeLocations)

    let lineMap = closeLocations.map(loc => {
      const endHex = getHexCenter(loc.coords.x, loc.coords.y); // Example ending hex
      // console.log(startHex)
      // console.log(endHex)
      return (
        < svg
          key={endHex.name}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <path
            d={`M ${startHex.x} ${startHex.y} L ${endHex.x} ${endHex.y}`}
            stroke="red"
            strokeWidth="2"
            fill="none"
          />
        </svg >
      )
    })

    return lineMap;
  }

  const rows = [6, 7, 8, 9, 10, 11, 10, 9, 8, 7, 6,]

  const drawLine = (start, end) => {
    const startHex = getHexCenter(start.x, start.y); // Start hexagon
    const endHex = getHexCenter(end.x, end.y); // End hexagon

    // console.log(rows[start.x])
    // console.log(rows[end.x])

    return (
      < svg
        key={endHex.name}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <path
          d={`M ${startHex.x} ${startHex.y} L ${endHex.x} ${endHex.y}`}
          stroke="red"
          strokeWidth="3"
          fill="none"
        />
      </svg >
    )
  }

  return (
    <div style={{}}>
      <h2>Stockpot City</h2>
      <ButtonGroup>
        {['Stats', 'Actions'].map(el => (
          <Button colorScheme='blue' key={el} variant={mode !== el ? 'ghost' : 'solid'} onClick={() => setMode(el)} >{el}</Button>
        ))}

      </ButtonGroup>

      {mode && mode === 'Stats' && <div>
        <b>Global Stats</b>
        <StatBar selectedStat={props.selectedStat} setSelectedStat={props.setSelectedStat} globalStats={gStats} />
      </div>}

      <hr />

      {mode !== 'newFacility' && mode !== 'newLocation' && <MapInteractionCSS
        minScale={0.5}
        maxScale={4}
        value={value}
        onChange={(value) => setValue(value)}

        showControls={true}
        plusBtnContents={<Plus />}
        minusBtnContents={<Minus />}>

        {/* Line Drawing */}
        {locations.map(loc =>
          inRange(loc.coords)
        )}



        <div style={{ position: 'relative' }} >
          {drawLine({ x: 5, y: 6 }, { x: 6, y: 5 })}

          {drawLine({ x: 8, y: 5 }, { x: 7, y: 7 })}
          {(rows).map((rowLength, y) => (
            <div className='row' key={y}>
              {[...Array(rowLength)].map((_thing, x) => {
                const loc = locations.find(el => el.coords.x === x && el.coords.y === y);
                const stat = loc?.locationStats.find(el => el.type === props.selectedStat.type);

                const hash = (y * 6 + x * 6) % 7;

                return (
                  <div
                    className='hexagon'
                    onClick={handleClick}
                    key={x}
                    xCord={x}
                    yCord={y}
                    id={`${x},${y}`}
                    style={{
                      opacity: (loc) ? 0.7 : 0.1,
                      width: hexWidth,
                      height: hexHeight,
                      backgroundImage: loc ?
                        "url(" + "https://cdn.discordapp.com/attachments/857862435096100884/1176725122166575154/high_district.png?ex=662f132b&is=662dc1ab&hm=41383be2431cd2634665253c31a3f32382cd83438a49a22dea866f696f1b5a7a&" + ")" :
                        "",
                    }} >♦
                    <div className='container' >
                      <t>{loc?.name}</t>
                      {loc?.tileType} -
                      {stat && <ResourceNugget key={x} value={stat?.statAmount} type={`${props.selectedStat.type}`} />}
                      ({x}, {y})
                    </div>

                  </div>
                )
              })}
            </div>
          ))}

        </div>
      </MapInteractionCSS>}
    </div>
  );
}

export default HexMap;
