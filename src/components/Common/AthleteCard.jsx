import React from 'react';
import { Avatar, Box, Button, ButtonGroup, Card, CardBody, CardHeader, Center, Collapse, Flex, HStack, IconButton, SimpleGrid, Spacer, Tag, TagLabel, Text, Wrap } from '@chakra-ui/react';
import { useState } from 'react';
import socket from '../../socket';
import { CandiWarning } from './CandiWarning';
import NexusTag from './NexusTag';
import AssetForm from './AssetForm';
import { useSelector } from 'react-redux';
import { CandiModal } from './CandiModal';
import { BsPencil } from 'react-icons/bs';
import { Close, Trash } from '@rsuite/icons';
import ResourceNugget from './ResourceNugget';
import CountDownTag from './CountDownTag';
import { getFadedColor, getThisTeam, populateThisAccount } from '../../scripts/frontend';
import TeamAvatar from './TeamAvatar';
import assets from '../../redux/entities/assets';
import CharacterNugget from './CharacterNugget';
import { FaHandshake } from 'react-icons/fa';
import { AddCharacter } from './AddCharacter';
import { CloseIcon } from '@chakra-ui/icons';
import MDEditor from '@uiw/react-md-editor';

const AthleteCard = (props) => {
  const { showButtons, handleSelect, compact, removeAsset, showRemove } = props;
  const [mode, setMode] = useState(false);
  const [show, setShow] = useState(false);

  const [overflow, setOverflow] = useState(false);

  const control = useSelector(state => state.auth.control);
  const teams = useSelector(state => state.teams.list);
  const assets = useSelector(state => state.assets.list);
  const accounts = useSelector(state => state.accounts.list);
  const characters = useSelector(state => state.characters.list);

  const statData = [
    { property: "buff_ness", name: "Buff Ness", color: "blue" },
    { property: "theoretical_squat_strength", name: "Theoretical Squat Strength", color: "blue" },
    { property: "tibia_diameter", name: "Tibia Diameter", color: "blue" },
    { property: "juke_torque", name: "Juke Torque", color: "blue" },
    { property: "chakra", name: "Chakra", color: "yellow" },
    { property: "doctors_notes", name: "Doctor's Notes", color: "yellow" },
    { property: "williams_ratio", name: "Williams Ratio", color: "yellow" },
    { property: "playstyles", name: "Playstyles", color: "yellow" },
    { property: "k_score", name: "K Score", color: "red" },
    { property: "rdd", name: "RDD", color: "red" },
    { property: "bb", name: "BB", color: "red" },
    { property: "tackles", name: "Tackles", color: "red" },
    { property: "strides", name: "Strides", color: "purple" },
    { property: "syn_act", name: "Syn Act", color: "purple" },
    { property: "ydl", name: "YDL", color: "purple" },
    { property: "union_rank", name: "Union Rank", color: "purple" },
  ];
  
  

  const deleteAssert = async () => {
    socket.emit('request', {
      route: 'asset',
      action: 'delete',
      data: { id: asset._id }
    });
  };

  const asset = props.asset._id ? props.asset : assets.find(el => el._id === props.asset)

  const disabled = asset?.status?.some(el => el.toLowerCase() === ('working' || 'used'));
  const account = populateThisAccount(accounts, asset?.account)
  const team = getThisTeam(teams, account.manager);
  const character = props.character ? props.character : characters.find(el => el.account === asset?.account)
  const isHidden = asset?.status?.some(el => el.toLowerCase() === ('hidden'));
  const border = isHidden ? 'dotted' : 'solid'


  if (asset)
    return (
      <div style={{ textAlign: 'center', width: "100%" }} onClick={() => (handleSelect && !disabled) ? handleSelect(asset) : console.log((handleSelect && !disabled))} >
        <Card 
        className={disabled ? 'forbidden' : "toggle-tag"} 
        key={asset._id} 
        style={{ 
          border: `3px ${border} ${getFadedColor(asset.type)}`, 
          height: '100%' 
        }} 
        >
          <CardHeader>
            <Flex align={'center'} overflow='hidden' width='100%'>
              <Spacer />
              <Box>

                <div style={{ borderRadius: '10px', border: `2px solid ${getFadedColor(asset.type)}`, padding: '5px' }} display="flex"  >
                  <Center >
                    {character && <CharacterNugget size='lg' character={character} />}

                    <Box textAlign={'left'} marginLeft={'5px'} >
                    "{asset.description}" - {asset.name}
                      <br />
                        <Tag variant={'outline'} color={'green'} >{asset.position}</Tag>
                        <Tag variant={'outline'} color={'green'} >{asset.popularity}</Tag>
                        <Tag variant={'outline'} color={'orange'} >%{asset.robot}</Tag>


                      {<CountDownTag timeout={asset.timeout} />}
                    </Box>
                  </Center>

                </div>

                {control && showButtons && <ButtonGroup isAttached>
                  <IconButton variant={'ghost'} onClick={() => setMode("modify")} colorScheme="orange" size={'sm'} icon={<BsPencil />} />
                  <IconButton variant={'ghost'} onClick={() => setMode("delete")} colorScheme="red" size={'sm'} icon={<Trash />} />
                </ButtonGroup>}


              </Box>

              {removeAsset && showRemove && <IconButton variant={'outline'} onClick={removeAsset} colorScheme="red" size={'sm'} icon={<Close />} />}

              <Spacer />
            </Flex>

            <Flex align={'center'} overflow='hidden' width='100%' >
              {asset.tags?.map(el => (
                <NexusTag key={el} value={el}></NexusTag>
              ))}
            </Flex>

          </CardHeader>
          <Text lineClamp="2" fontWeight="light">Last Season Highlight: {asset.last_season_highlight}</Text>
          <Button onClick={() => setShow(!show)} >{!show ? "Show" : "Hide"}</Button>
          
          {show && <CardBody style={{ paddingTop: '0px' }} >
           
            <SimpleGrid spacing={1} columns={2}>
                {statData.map(el => (
                    <Tag  variant={'solid'} colorScheme={el.color}>
                        {el.name}: {asset[el.property]}
                    </Tag>
                ))}                
            </SimpleGrid>

          </CardBody>}

        </Card>

        {asset && <CandiWarning open={mode === 'delete'} title={`Delete "${asset.name}"?`} onClose={() => setMode(false)} handleAccept={() => deleteAssert()}>
          This can never be undone.
        </CandiWarning>}

        <CandiModal onClose={() => { setMode(false); }} open={mode === "modify"} title={`${mode} Asset`}>
          <AssetForm closeModal={() => { setMode(false); }} character={character} asset={asset} mode={mode} />
        </CandiModal>

      </div>
    );
  return (
    <b>Cannot Render Asset {props.asset}</b>
  )
}

export default (AthleteCard);