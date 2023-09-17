import React, { useState } from "react";
import { AccordionItem, AccordionPanel, Box, Button, Center, Code, Editable, EditableInput, EditablePreview, Flex, HStack, Tag } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import usePermissions from "../../../../hooks/usePermissions";
import { CloseIcon } from "@chakra-ui/icons";
import WordDivider from "../../../WordDivider";
import AssetCard from "../../../Common/AssetCard";
import InputNumber from "../../../Common/InputNumber";
import socket from "../../../../socket";

function ActionDifficulty({action, submission}) {
    const assetList = useSelector(state => state.assets.list);
    const myCharacter = useSelector(state => state.auth.myCharacter);
    const [number, setNumber] = useState(submission.difficulty);
    const [mode, setMode] = useState(false);
    const {isControl} = usePermissions();

    function getAsset(assetID) {
        return assetID ? assetList.find((el) => el._id === assetID) : null;
    }
    
    const handleDifficulty = async () => {
      const data = {
        action: action._id,
        submission: submission._id,
        difficulty: number
      };
      socket.emit('request', {
        route: 'action',
        action: 'difficulty',
        data
      });
      setMode(false)
    };

    const handleRoll = async () => {
      const data = {
        action: action._id,
        submission: submission._id,
      };
      socket.emit('request', {
        route: 'action',
        action: 'roll',
        data
      });
      setMode(false)
    };


    const stats = (assets, cost) => {
      const probs = [];
      
      let sum = 0;
      for (let asset of assets) {
        // const relevantDice = asset?.dice?.filter(el => el.type === subRotuine.challengeCost.type)
        const populated = getAsset(asset)
  
        sum = 1;
        for (const die of populated.dice.filter(el => el.amount >= cost)) {
          probs.push(1 - (die.amount+1 - cost) / die.amount)
        }
  
      }

      console.log(probs)
  
      for (let prob of probs.filter(el => el > 0)) {
        sum = sum * prob
      }
      console.log(sum)
  
      if (probs.filter(el => el > 0).length ===0 ) return (0);
      if (sum >= 1) return (sum*100);      
      return (Math.trunc((1 - sum)*100));
    };

    const prob = stats(submission.assets, submission.difficulty);

    return (
    <Box>
      <WordDivider word={`Difficulty: ${submission.difficulty}`}/>
      <Code colorScheme={prob > 80 ? 'green' : prob > 40 ? 'yellow' : 'red'} children={`${prob}% Chance of success`} />
      {isControl && <Button onClick={() => setMode(!mode)} >{mode ? "Cancel" : "Edit"}</Button> }  

      {mode && <Center>
        <InputNumber defaultValue={submission.difficulty} onChange={setNumber} />      
        <Button onClick={handleDifficulty} >Submit {stats(submission.assets, number)}% </Button>           
      </Center>}
      
      {myCharacter?._id === action.creator._id && action.results.length === 0 && <Center>
          <Button onClick={handleRoll} variant={'solid'} color={'green'} >ROLL THEM DICE</Button>
      </Center>}
    </Box>
    );
}

export default ActionDifficulty;