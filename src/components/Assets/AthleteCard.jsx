import React from 'react';
import { Avatar, AvatarBadge, Box, Button, ButtonGroup, Card, CardBody, CardHeader, Center, Flex, HStack, IconButton, SimpleGrid, Spacer, Stack, Tag, Text, Wrap, WrapItem } from '@chakra-ui/react';
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
  const { showButtons = false, handleSelect, drafts = false, removeAsset, showRemove, stats, filterTags, compact } = props;
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

  const asset = props.asset?._id ? props.asset : assets.find(el => el._id === props.asset)

  const disabled = asset?.status?.some(el => el.toLowerCase() === ('working' || 'used'));
  const account = populateThisAccount(accounts, asset?.account)
  const team = getThisTeam(teams, account.manager);
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

              <Stack>
                <Avatar size={compact ? 'md' : 'xl'} bg={getFadedColor(asset.species)} name={asset.species} src={`/images/species/${asset.species}.png`}>
                  {asset.teamOwner && <AvatarBadge boxSize='1.25em' bg={true ? 'green.500' : '#d4af37'}>
                    <TeamAvatar size={compact ? 'xs' : 'md'} team={asset.teamOwner?._id} />
                  </AvatarBadge>}
                </Avatar>

                {showButtons && <ButtonGroup isAttached>
                  {control &&
                    <IconButton  variant={'ghost'} onClick={() => setMode("modify")} colorScheme="orange" size={'xs'} icon={<BsPencil />} />}
                  {/* <Button onClick={() => setShow(!show)} >{!show ? "Show Stats" : "Hide Stats"}</Button> */}
                  {drafts && <Button size={'xs'} isDisabled={drafts.length === 0 || asset?.teamOwner} onClick={() => setMode("draft")} >{"Draft"}</Button>}
                </ButtonGroup>}
              </Stack>



              <Spacer />

              <div style={{ borderRadius: '10px', border: `2px solid ${getFadedColor(asset.type)}`, padding: '5px' }} display="flex"  >
                <Center >

                  <Box textAlign={'left'} marginLeft={'5px'} >

                    <HStack marginBottom={'3px'} >
                      <Text as='u' fontSize={'lg'} casing={'capitalize'} >{asset.name}</Text>

                      <Text as='kbd' fontSize={'md'} casing={'capitalize'}>{asset.species}</Text>

                      {asset.tags.map((el, index) => (
                        <Tag key={index} variant={'solid'} colorScheme={el.color}>
                          {el}
                        </Tag>
                      ))}
                    </HStack>

                    {!compact && <SimpleGrid columns={3} spacing={1}>
                      {asset.stats.map((stat, index) => (
                        <Tag variant={'outline'} key={stat._id} color={stat.color} >{stat.name} - {stat.statAmount}</Tag>
                      ))}
                    </SimpleGrid>}

                    {<CountDownTag timeout={asset.timeout} />}
                  </Box>
                </Center>
              </div>

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