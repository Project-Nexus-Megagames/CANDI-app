import React, { useEffect, useState } from "react";
import { AlertDescription, AlertIcon, AlertTitle, Alert, Image, CloseButton, Grid, } from '@chakra-ui/react';
import { getFadedColor } from "../../scripts/frontend";
import ResourceNugget from "./ResourceNugget";

export const DiceList = (props) => {
  const { assets, type } = props;
	const [show, setShow] = useState(true);


  useEffect(() => {

  }, []);

  const getThisDicePool = () => {
    let pool = [];
    for (const ass of assets) {
      if (ass) {
        let temp = ass?.dice.filter(die => die.type === type);
        pool = [ ...pool, ...temp];        
      }
    }
    return pool;
  }


  return (
    <Grid templateColumns='repeat(5, 1fr)' gap={2}>
    <h4>{type.toUpperCase()} Dice</h4>
    {getThisDicePool().map(die => (
      <div key={die._id} style={{  textAlign: 'center' }} >
        {<img style={{ maxHeight: '30px', backgroundColor: getFadedColor(die.type), height: 'auto', borderRadius: '5px', }} src={die ? `/images/Icons/d${die.amount}.png` : '/images/unknown.png'} alt={die.amount} />}
      </div>  
    ))}
    </Grid>
  );
};