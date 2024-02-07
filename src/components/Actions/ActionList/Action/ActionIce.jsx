/* eslint-disable react/react-in-jsx-scope */
import { Box, Code, Flex, Wrap, WrapItem } from "@chakra-ui/react";
import SubRoutine from "../../../Hacking/SubRoutine";
import Dice from "../../../Hacking/Dice";
import { AddAsset } from "../../../Common/AddAsset";
import socket from "../../../../socket";
import { getFadedColor } from "../../../../scripts/frontend";
import { useSelector } from "react-redux";


export const ActionIce = ({ subRotuine, action, index, loading, show, ice }) => {
  const assets = useSelector(state => state.assets.list);
  console.log(subRotuine)

  const handleSelect = (asset) => {
    socket.emit("request", {
      route: "action",
      action: "contribute",
      data: { id: action._id, choiceIndex: index, asset: asset._id, subRotuine: subRotuine._id, ice: ice._id },
    })
  }

  function getAsset(assetID) {
    return assetID ? assets.find((el) => el._id === assetID) : null;
}

  const stats = (assets, cost) => {
    console.log(assets, cost )

    const probs = [];
    
    let sum = 0;
    for (let asset of assets) {

      const populated = getAsset(asset)

      sum = 1;
      for (const die of asset.dice.filter(el => el.amount >= cost)) {
        probs.push(1 - (die.amount+1 - cost) / die.amount)
      }

    }

    for (let prob of probs.filter(el => el > 0)) {
      sum = sum * prob
    }

    if (probs.filter(el => el > 0).length ===0 ) return (0);
    if (sum >= 1) return (sum*100);      
    return (Math.trunc((1 - sum)*100));
  };

  const getRelevantDice = (assets, types) => {
    let total = [];
    for (const ass of assets) {
      total = total.concat(ass.dice.filter(el =>
        types.some(t => el.type == t)        
      ))
    }
    return (total)
  }

  const prob = stats(subRotuine.contributed, subRotuine.challengeCost.value);

  return (
    <div >
      {/* <SubRoutine loading={loading} subRotuine={subRotuine} index={index} /> */}
      

      {subRotuine.contributed && subRotuine.challengeCost.allowed && subRotuine.challengeCost.allowed.length > 0 &&
        <Wrap justify={'space-evenly'} align='center'>
          {getRelevantDice(subRotuine.contributed, subRotuine.challengeCost.allowed).map((die, index2) => (
            <WrapItem key={index2} colSpan={4}>
              {/* <Dice alt asset={die} /> */}
              <div key={die._id} >
                  {<img style={{ maxHeight: '30px', backgroundColor: getFadedColor(die.type), height: 'auto', borderRadius: '5px', }} src={die ? `/images/d${die.amount}.png` : '/images/unknown.png'} alt={die.amount} />}
              </div>
            </WrapItem>
          ))}
        </Wrap >}

        <Code colorScheme={prob > 80 ? 'green' : prob > 40 ? 'yellow' : 'red'} >{prob}% Chance of success</Code>

      {show && <div
        key={subRotuine._id}
        style={{ width: "100%", border: ".75px solid white" }}

      >- {subRotuine.challengeCost.amount}
        <AddAsset
          handleSelect={(ass) => handleSelect(ass)}
          assets={assets}
          //assets={assets?.filter(el => el.dice.some(el => subRotuine.challengeCost.allowed.some(t => el.type === t)))}
        />        
      </div>   }   
    </div>

  );
};