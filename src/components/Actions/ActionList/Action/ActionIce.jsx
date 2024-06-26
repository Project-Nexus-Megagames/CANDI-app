/* eslint-disable react/react-in-jsx-scope */
import { Box, Button, Center, Code, Divider, Flex, Grid, HStack, Stack, Tag, Tooltip, VStack, Wrap, WrapItem } from "@chakra-ui/react";
import SubRoutine from "../../../Hacking/SubRoutine";
import Dice from "../../../Hacking/Dice";
import { AddAsset } from "../../../Common/AddAsset";
import socket from "../../../../socket";
import { getFadedColor, getTextColor } from "../../../../scripts/frontend";
import { useSelector } from "react-redux";
import { getMyUnusedAssets, getMyAssets } from "../../../../redux/entities/assets";
import ResourceNugget from "../../../Common/ResourceNugget";


export const ActionIce = ({ subRotuine, action, index, loading, show, ice }) => {
  const assets = useSelector(getMyUnusedAssets);

  const handleSelect = (asset) => {
    socket.emit("request", {
      route: "action",
      action: "contribute",
      data: { id: action?._id, choiceIndex: index, asset: asset._id, subRotuine: subRotuine._id, ice: ice._id },
    })
  }

  function getAsset(assetID) {
    return assetID ? assets.find((el) => el._id === assetID) : null;
  }

  const stats = (assets, cost) => {

    const probs = [];

    let sum = 0;
    for (let asset of assets) {
      sum = 1;
      if (asset && asset.dice) {
        for (const die of asset.dice.filter(el => el.amount >= cost)) {
          probs.push(1 - (die.amount + 1 - cost) / die.amount)
        }
      }


    }

    for (let prob of probs.filter(el => el > 0)) {
      sum = sum * prob
    }

    if (probs.filter(el => el > 0).length === 0) return (0);
    if (sum >= 1) return (sum * 100);
    return (Math.trunc((1 - sum) * 100));
  };

  const getRelevantDice = (assets, types) => {
    let total = [];
    for (const ass of assets) {

      if (types.some(t => t === 'asset')) total = total.concat(ass?.dice?.filter(el =>
        el.amount >= subRotuine.challengeCost.value))
      else
        total = total.concat(ass?.dice?.filter(el =>
          el.amount >= subRotuine.challengeCost.value &&
          types.some(t => el.type.toLowerCase() == t.toLowerCase())
        ))
    }
    return (total)
  }

  const prob = stats(subRotuine.contributed, subRotuine.challengeCost.value);

  return (
    <Box
      key={subRotuine._id}
      style={{
        width: '100%',
        border: `4px solid ${getFadedColor(subRotuine.challengeCost.allowed[0])}`,
        padding: '7px'
      }}
    >
      <Flex align={'center'} >
        <Box width={'60%'} >
          {subRotuine.description && (
            <h5>{subRotuine.description}</h5>
          )}
          {subRotuine.challengeCost.allowed.map((item) =>
            <Tag
              key={item}
              color={getTextColor(item)}
              style={{
                backgroundColor: getFadedColor(item),
                textTransform: 'capitalize',
                margin: '2px'
              }}
            >{item}</Tag>
          )}
        </Box>

        <Stack align={'center'}>
          <HStack>
            <img style={{ maxHeight: '50px', height: 'auto', borderRadius: '5px', }} src={`/images/dice-target.png`} alt={'oops'} />
            <h2>{subRotuine.challengeCost.value}</h2>
          </HStack>
          <Code colorScheme={prob > 80 ? 'green' : prob > 40 ? 'yellow' : 'red'} >{prob}% Chance of success</Code>
        </Stack>

      </Flex>

      <Divider vertical />

      <Tooltip
        label={subRotuine.contributed.map((asset, index) =>
          <Tag key={index} >{asset?.name}</Tag>
        )}
        aria-label='a tooltip'
      >
        <Button size={'sm'} margin={'0px'} variant={'ghost'} >{subRotuine.contributed.length} Assets Contributed</Button>
      </Tooltip>

      {subRotuine.contributed && subRotuine.challengeCost.allowed && subRotuine.challengeCost.allowed.length > 0 &&
        <Wrap justify={'space-evenly'} align='center'>
          {subRotuine.results.length == 0 && getRelevantDice(subRotuine.contributed, subRotuine.challengeCost.allowed).map((die, index2) => (
            <WrapItem key={index2} colSpan={4}>
              {/* <Dice alt asset={die} /> */}
              <div key={die?._id} >
                {<img
                  style={{
                    maxHeight: '30px',
                    backgroundColor: getFadedColor(die?.type),
                    height: 'auto',
                    borderRadius: '5px',
                  }}
                  src={die ? `/images/d${die?.amount}.png` : '/images/unknown.png'}
                  alt={die?.amount}
                />}
              </div>
            </WrapItem>
          ))}



          <WrapItem>
            {subRotuine.results.length == 0 && <AddAsset
              handleSelect={(ass) => handleSelect(ass)}
              assets={assets?.filter(el =>
                !subRotuine.contributed.some(s => s._id === el._id) &&
                el.dice.some(die =>
                  subRotuine.challengeCost.allowed.some(t => el?.model.toLowerCase() === t.toLowerCase() || die.type.toLowerCase() === t.toLowerCase()))
              )}
            />}
          </WrapItem>
        </Wrap >}

      {<Grid templateColumns='repeat(5, 1fr)' gap={2}>
        {subRotuine.results.map((die, index2) => (
          <WrapItem
            key={index2}
            colSpan={4}
            style={{
              textAlign: 'center',
              backgroundColor:
                die?.result >= subRotuine.challengeCost.value ? 'green' :
                  die?.result <= 2 ? 'red' : 'inherit'
            }}>
            {/* <Dice alt asset={die} /> */}
            <div >
              {<img
                style={{
                  maxHeight: '45px',
                  backgroundColor: getFadedColor(die?.type.toLowerCase()),
                  height: 'auto',
                  borderRadius: '5px',
                }}
                src={die ? `/images/d${die.dieValue}.png` : '/images/unknown.png'}
                alt={die?.dieValue}
              />}
              <h4>{die?.result}</h4>
            </div>

          </WrapItem>
        ))}
      </Grid>}

    </Box>

  );
};