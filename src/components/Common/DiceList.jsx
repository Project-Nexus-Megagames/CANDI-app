import React, { useEffect, useState } from "react";
import { AlertDescription, AlertIcon, AlertTitle, Alert, Image, CloseButton, Grid, HStack, } from '@chakra-ui/react';
import { getFadedColor } from "../../scripts/frontend";
import ResourceNugget from "./ResourceNugget";

export const DiceList = (props) => {
  const { assets, type } = props;
  const [show, setShow] = useState(true);

  const getThisDicePool = () => {
    let pool = [];
    for (const ass of assets.filter(el => el)) {
      if (type && ass?.dice) {
        let temp = type === 'all' ? ass?.dice : ass?.dice.filter(die => die.type === type);
        pool = [...pool, ...temp];
      }
    }
    return pool;
  }

  return (
    <>
      {<h4>{type.toUpperCase()} Dice</h4>}
      {getThisDicePool().length == 0 && <b>No Dice</b>}
      <HStack justify={'center'} gap={4}>
        {getThisDicePool().map(die => (
          <div key={die._id} style={{ textAlign: 'center' }} >
            {<img style={{ maxHeight: '30px', backgroundColor: getFadedColor(die.type), height: 'auto', borderRadius: '5px', }} src={die ? `/images/d${die.amount}.png` : '/images/unknown.png'} alt={die.amount} />}
          </div>
        ))}
      </HStack>
    </>

  );
};