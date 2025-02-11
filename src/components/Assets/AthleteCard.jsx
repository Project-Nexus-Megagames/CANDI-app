import React from 'react';
import { Box, Button, ButtonGroup, Card, CardBody, CardHeader, Center, Flex, IconButton, SimpleGrid, Spacer, Tag, Text } from '@chakra-ui/react';
import { useState } from 'react';
import socket from '../../socket';
import { CandiWarning } from '../Common/CandiWarning';
import NexusTag from '../Common/NexusTag';
import { useSelector } from 'react-redux';
import { CandiModal } from '../Common/CandiModal';
import { BsPencil } from 'react-icons/bs';
import { Close, Trash } from '@rsuite/icons';
import CountDownTag from '../Common/CountDownTag';
import { getFadedColor, getThisTeam, populateThisAccount } from '../../scripts/frontend';
import CharacterNugget from '../Common/CharacterNugget';
import DraftCard from './DraftCard';
import TeamAvatar from '../Common/TeamAvatar';
import AssetForm from '../Common/AssetForm';


const AthleteCard = (props) => {
  const { showButtons = false, handleSelect, drafts = false, removeAsset, showRemove, stats, filterTags, } = props;
  const [mode, setMode] = useState(false);
  const [show, setShow] = useState(false);

  const [overflow, setOverflow] = useState(false);

  const control = useSelector(state => state.auth.control);
  const teams = useSelector(state => state.teams.list);
  const assets = useSelector(state => state.assets.list);
  const accounts = useSelector(state => state.accounts.list);
  const characters = useSelector(state => state.characters.list);

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
                    {asset.teamOwner && <TeamAvatar team={asset.teamOwner?._id} />}

                    <Box textAlign={'left'} marginLeft={'5px'} >
                      "{asset.description}" - {asset.name}
                      {control && showButtons && <ButtonGroup isAttached>
                        <IconButton variant={'ghost'} onClick={() => setMode("modify")} colorScheme="orange" size={'sm'} icon={<BsPencil />} />
                        {/* <IconButton variant={'ghost'} onClick={() => setMode("delete")} colorScheme="red" size={'sm'} icon={<Trash />} /> */}
                      </ButtonGroup>}
                      <br />
                      <Tag variant={'outline'} color={'green'} >{asset.position}</Tag>
                      <Tag variant={'outline'} color={'green'} >Pop: {asset.popularity}</Tag>
                      <Tag variant={'outline'} color={'orange'} >%{asset.robot}</Tag>


                      {<CountDownTag timeout={asset.timeout} />}
                    </Box>
                  </Center>
                </div>

              </Box>

              {removeAsset && showRemove && <IconButton variant={'outline'} onClick={removeAsset} colorScheme="red" size={'sm'} icon={<Close />} />}

              <Spacer />
            </Flex>

            {filterTags && filterTags.map(el => (
              <Tag variant={'solid'} colorScheme={'red'}>
                {el.property}: {asset[el.property]}
              </Tag>
            ))}

            <Flex align={'center'} overflow='hidden' width='100%' >
              {asset.tags?.map(el => (
                <NexusTag key={el} value={el}></NexusTag>
              ))}
            </Flex>

          </CardHeader>
          <Text fontWeight="light">Last Season Highlight: {asset.last_season_highlight}</Text>
          {showButtons && <ButtonGroup isAttached>
            <Button onClick={() => setShow(!show)} >{!show ? "Show Stats" : "Hide Stats"}</Button>
            {drafts && <Button isDisabled={drafts.length === 0 || asset.teamOwner} onClick={() => setMode("draft")} >{"Draft"}</Button>}
          </ButtonGroup>}


          {show && <CardBody style={{ paddingTop: '0px' }} >

            <SimpleGrid spacing={1} columns={2}>
              {stats.map((el, index) => (
                <Tag key={index} variant={'solid'} colorScheme={el.color}>
                  {el.name}: {asset[el.property]}
                </Tag>
              ))}
            </SimpleGrid>

          </CardBody>}

        </Card>

        {asset && <CandiWarning open={mode === 'delete'} title={`Delete "${asset.name}"?`} onClose={() => setMode(false)} handleAccept={() => deleteAssert()}>
          This can never be undone.
        </CandiWarning>}

        <CandiModal onClose={() => { setMode(false); }} open={mode === "draft"} title={`Draft "${asset.name}"`}>
          {drafts.length === 0 && <Box>
            You do not have a valid draft slot yet!
          </Box>}
          {drafts.length > 0 && drafts[0] && <Box>
            Using Draft Pick
            <DraftCard draft={drafts[0]} handleSelect={() => console.log('adsadasd')} />
            <Button onClick={() =>
              socket.emit('request', {
                route: 'asset',
                action: 'draftAthlete',
                data: {
                  draft: drafts[0]?._id,
                  athlete: asset._id
                }
              })} >Draft!</Button>
          </Box>}
        </CandiModal>

        <CandiModal onClose={() => { setMode(false); }} open={mode === "modify"} title={`${mode} Asset`}>
          <AssetForm closeModal={() => { setMode(false); }} asset={asset} mode={mode} />
        </CandiModal>

      </div>
    );
  return (
    <b>Cannot Render Asset {props.asset}</b>
  )
}

export default (AthleteCard);