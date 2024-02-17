import React, { useState } from "react";
import { Box, Button, Center, Code, Tooltip, VStack } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import usePermissions from "../../../../hooks/usePermissions";
import InputNumber from "../../../Common/InputNumber";
import socket from "../../../../socket";
import WordDivider from "../../../Common/WordDivider";
import { DiceList } from "../../../Common/DiceList";

function ActionDifficulty({ action, submission }) {
  const assetList = useSelector(state => state.assets.list);
  const myCharacter = useSelector(state => state.auth.myCharacter);
  const [number, setNumber] = useState(submission.difficulty);
  const [mode, setMode] = useState(false);
  const { isControl } = usePermissions();

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
      action: 'rollSubmission',
      data
    });
    setMode(false)
  };


  const stats = (assets, cost) => {
    const probs = [];

    let sum = 0;
    for (let asset of assets) {
      if (!asset.dice) asset = getAsset(asset);
      sum = 1;
      for (const die of asset.dice.filter(el => el.amount >= cost)) {
        probs.push(1 - (die.amount + 1 - cost) / die.amount)
      }

    }

    for (let prob of probs.filter(el => el > 0)) {
      sum = sum * prob
    }

    if (probs.filter(el => el > 0).length === 0) return (0);
    if (sum >= 1) return (sum * 100);
    return (Math.trunc((1 - sum) * 100));
  };

  const allAssets = () => {
    let assets = [...submission.assets]
    for (const sub of action.submissions) {
      assets = [...assets, ...sub.assets]
    }
    return assets.map(asset => getAsset(asset));
  }

  const prob = stats(allAssets(), submission.difficulty);

  return (
    <Box justifyItems={'center'} width={"fit-container"} >
      <WordDivider word={`Difficulty: ${submission.difficulty}`} />
      {isControl && <Button onClick={() => setMode(!mode)} >{mode ? "Cancel" : "Edit"}</Button>}

      {mode && <Center>
        <InputNumber defaultValue={submission.difficulty} onChange={setNumber} />
        <Button onClick={handleDifficulty} >Submit {prob}% </Button>
      </Center>}

      {action.type !== 'Agenda' && myCharacter?._id === action.creator._id && <VStack>
        <Code colorScheme={prob > 80 ? 'green' : prob > 40 ? 'yellow' : 'red'}>{`${prob}% Chance of success`}</Code>
        <Tooltip
          label={"This will roll all dice submitted for this action"}
          aria-label='a tooltip'
        >
          <Button isDisabled={submission.difficulty <= 0} onClick={handleRoll} variant={'solid'} color={'green'} >ROLL THEM DICE</Button>
        </Tooltip>
      </VStack>}
      {action.type !== 'Agenda' && myCharacter?._id !== action.creator._id && submission.difficulty > 0 && <b>Only the Action creator can roll</b>}
      <DiceList assets={allAssets()} type='all' />
    </Box>
  );
}

export default ActionDifficulty;