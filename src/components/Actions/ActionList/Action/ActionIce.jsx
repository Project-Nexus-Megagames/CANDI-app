/* eslint-disable react/react-in-jsx-scope */
import { Box, Flex, Wrap, WrapItem } from "@chakra-ui/react";
import SubRoutine from "../../../Hacking/SubRoutine";
import Dice from "../../../Hacking/Dice";
import { AddAsset } from "../../../Common/AddAsset";
import socket from "../../../../socket";
import { getFadedColor } from "../../../../scripts/frontend";
import { useSelector } from "react-redux";


export const ActionIce = ({ subRotuine, action, index, loading, show, ice }) => {
  const assets = useSelector(state => state.assets.list);

  const handleSelect = (asset) => {
    socket.emit("request", {
      route: "action",
      action: "contribute",
      data: { id: action._id, choiceIndex: index, asset: asset._id, subRotuine: subRotuine._id, ice: ice._id },
    })
  }

  const stats = (assets, cost) => {
    const probs = [];
    
    let sum = 0;
    for (let asset of assets) {
      const relevantDice = asset?.dice?.filter(el => el.type === subRotuine.challengeCost.type)

      sum = 1;
      for (const die of relevantDice) {
        probs.push(1 - (die.amount+1 - cost) / die.amount)
      }

    }

    for (let prob of probs.filter(el => el > 0)) {
      sum = sum * prob
    }

    if (sum >= 1 || sum == 0) return (sum*100);
    return (Math.trunc((1 - sum)*100));
  };

  const getRelevantDice = (assets, type) => {
    console.log(assets)
    let total = [];
    for (const ass of assets) {
      total = total.concat(ass.dice.filter(el => el.type == type))
    }
    return (total)
  }

  return (
    <div >
      {/* <SubRoutine loading={loading} subRotuine={subRotuine} index={index} /> */}
      

      {subRotuine.contributed && subRotuine.challengeCost.type && <Wrap justify={'space-evenly'} align='center'>
          {getRelevantDice(subRotuine.contributed, subRotuine.challengeCost.type).map((die, index2) => (
            <WrapItem key={index2} colSpan={4}>
              {/* <Dice alt asset={die} /> */}
              <div key={die._id} >
                  {<img style={{ maxHeight: '30px', backgroundColor: getFadedColor(die.type), height: 'auto', borderRadius: '5px', }} src={die ? `/images/d${die.amount}.png` : '/images/unknown.png'} alt={die.amount} />}
              </div>
            </WrapItem>
          ))}
        </Wrap >}

      {show && <div
        key={subRotuine._id}
        style={{ width: "100%", border: ".75px solid white" }}

      >{subRotuine.challengeCost.type} - {subRotuine.contributed.length}
        <AddAsset handleSelect={(ass) => handleSelect(ass)} assets={assets?.filter(el => el.dice.some(el => el.type === subRotuine.challengeCost.type))} />        
      </div>   }   
    </div>

  );
};