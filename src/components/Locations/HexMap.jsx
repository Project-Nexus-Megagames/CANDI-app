import { Button, Center, Divider, Wrap } from '@chakra-ui/react';
import { MapInteractionCSS } from 'react-map-interaction';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ResourceNugget from '../Common/ResourceNugget';
import StatBar from './StatBar';
import { Minus, Plus } from '@rsuite/icons';

const HexMap = (props) => {
  const [gStats, setGStats] = React.useState([]);
  const locations = useSelector(s => s.locations.list);
  const globalStats = useSelector(s => s.gameConfig.globalStats);
  const [value, setValue] = React.useState({ scale: 1, translation: { x: 0, y: 0 } });

  const tiles = [
    'https://cdn.discordapp.com/attachments/857862435096100884/1176709929030135910/test.png?ex=656fdb85&is=655d6685&hm=bcd3fac009a7acbc85e26f8a86a245be72fe7705ae8ffa9ad7a3baef1a41295d&',
    "https://cdn.discordapp.com/attachments/857862435096100884/1176706561079525478/test.png?ex=656fd862&is=655d6362&hm=9105c1a4c109ef635528b84ad7baa53626f0f0a1a575aa71cc6226095739f8cc&",
    "https://cdn.discordapp.com/attachments/857862435096100884/1176712237554089994/spiderhomes.png?ex=656fddab&is=655d68ab&hm=c7f330ca58b14101a71daed5ae4608616aa749878463ecd795f8e44ab95d2e24&",
    "https://cdn.discordapp.com/attachments/857862435096100884/1176719645277945906/underkin.png?ex=656fe491&is=655d6f91&hm=519c971c6dafadd126bacd570eed5a80c4057665a00eef323b4fa2739766c165&",
    "https://cdn.discordapp.com/attachments/857862435096100884/1176721794783264768/mimic.png?ex=656fe692&is=655d7192&hm=49819a22a36deafa8274dba56144b20975c9314a05115b02d173f87f657f9cba&",
    "https://cdn.discordapp.com/attachments/857862435096100884/1176725122166575154/high_district.png?ex=656fe9ab&is=655d74ab&hm=cb522a0da6c49db85a4b8dba82c65ac3f1793915c71dfaad30378c557f17ccfb&",
    "https://cdn.discordapp.com/attachments/857862435096100884/1176726546761928705/bigfall.png?ex=656feaff&is=655d75ff&hm=6c460400c29fb95d7f848cd57e33a571b3f39598fa4e927401112fd90ece14e4&"
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
    // destroyHex()
    // createHex()
    compileStats()
  }, [props.selectedStat]);

  return (
    <div style={{}}>
      <h2>Stockpot City</h2>
      <b>Global Stats</b>
      <StatBar selectedStat={props.selectedStat} setSelectedStat={props.setSelectedStat} globalStats={gStats} />
      <hr />
      <div className="container">
      </div>

      <MapInteractionCSS
        minScale={1}
        maxScale={4}
        value={value}
        onChange={(value) => setValue(value)}

        showControls={true}
        plusBtnContents={<Plus />}
        minusBtnContents={<Minus />}>
        <div className='container' >
          {([4, 5, 6, 7, 6, 5, 4]).map((rowLength, y) => (
            <div className='row' key={y}>
              {[...Array(rowLength)].map((_thing, x) => {
                const loc = locations.find(el => el.coords.x === x && el.coords.y === y);
                const stat = loc?.locationStats.find(el => el.type === props.selectedStat.type);

                const hash = (y * 6 + x * 6) % 7;

                return (
                  <span
                    className='hexagon'
                    onClick={handleClick}
                    key={x}
                    xCord={x}
                    yCord={y}
                    id={loc?._id}
                    style={{
                      // opacity: (loc && loc._id === props.selected?._id) ? 0.7 : 'inherit',
                      backgroundImage: loc ?
                        "url(" + tiles[y+x % 7] + ")" :
                        "inherit"
                    }} >♦
                    <div className='container' >
                      <t>{loc?.name}</t>

                      {stat && <ResourceNugget key={x} value={stat?.statAmount} type={`${props.selectedStat.type}`} />}
                    </div>

                  </span>
                )
              })}
            </div>
          ))}

        </div>
      </MapInteractionCSS>



    </div>
  );
}

export default HexMap;
