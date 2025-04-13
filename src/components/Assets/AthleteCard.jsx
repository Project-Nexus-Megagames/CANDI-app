import React, { useEffect } from 'react';
import { Avatar, AvatarBadge, Box, Button, ButtonGroup, Card, CardBody, CardHeader, Center, Flex, HStack, Icon, IconButton, SimpleGrid, Spacer, Stack, Tag, TagLeftIcon, Text, Tooltip, Wrap, WrapItem } from '@chakra-ui/react';
import { useState } from 'react';
import socket from '../../socket';
import { CandiWarning } from '../Common/CandiWarning';
import NexusTag from '../Common/NexusTag';
import { useSelector } from 'react-redux';
import { CandiModal } from '../Common/CandiModal';
import { BsBookmarkHeartFill, BsBookmark, BsPencil } from 'react-icons/bs';
import { Calendar, Close, Trash } from '@rsuite/icons';
import CountDownTag from '../Common/CountDownTag';
import { getFadedColor, getTextColor, getThisTeam, populateThisAccount } from '../../scripts/frontend';
import CharacterNugget from '../Common/CharacterNugget';
import DraftCard from './DraftCard';
import TeamAvatar from '../Common/TeamAvatar';
import AssetForm from '../Common/AssetForm';
import StatIcon from './StatIcon';
import { ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons';


const AthleteCard = (props) => {
  const {
    showButtons = false,
    handleSelect,
    drafts = false,
    upcomingDrafts = false,
    removeAsset,
    showRemove,
    stats = true,
    height,
    compact,
    filterTags = []
  } = props;
  const [mode, setMode] = useState(false);
  const [show, setShow] = useState(false);
  const [draftIndex, setDraftIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isBookmarked, setBookmarked] = useState(false);

  const control = useSelector(state => state.auth.control);
  const myTeam = useSelector(state => state.auth.team);
  const teams = useSelector(state => state.teams.list);
  const assets = useSelector(state => state.assets.list);
  const accounts = useSelector(state => state.accounts.list);


  useEffect(() => {
    if (myTeam) {
      const team = teams.find(el => el._id === myTeam._id)
      setBookmarked(team?.bookmarked.some(el => el == asset._id))
    }
  }, [teams])

  const deleteAssert = async () => {
    socket.emit('request', {
      route: 'asset',
      action: 'delete',
      data: { id: asset._id }
    });
  };

  const bookmarkAthlete = async () => {
    setLoading(true)
    socket.emit('request', {
      route: 'asset',
      action: 'bookmarkAthlete',
      data: { athlete: asset._id, team: myTeam._id }
    },
      (response) => {
        setLoading(false)
      });
  };

  const asset = props.asset?._id ? props.asset : assets.find(el => el._id === props.asset)
  const disabled = asset?.status?.some(el => el.toLowerCase() === ('working' || 'used'));
  const isHidden = asset?.status?.some(el => el.toLowerCase() === ('hidden'));
  const border = isHidden ? 'dotted' : 'solid'

  if (asset)
    return (
      <div style={{ textAlign: 'center', width: "100%" }} onClick={() => (handleSelect && !disabled) ? handleSelect(asset) : console.log((handleSelect && !disabled))} >
        <Card
          key={asset._id}
          style={{
            border: `3px ${border} ${getFadedColor(asset.type)}`,
            height: height ? height : '100%'
          }}
        >
          <CardHeader>
            <Flex align={'center'} overflow='hidden' width='100%'>
              <Spacer />

              <Stack>
                <Avatar size={height ? height : 'xl'} bg={getFadedColor(asset.species)} name={asset.species} src={`/images/species/${asset.species}.png`}>
                  {asset.teamOwner && <AvatarBadge boxSize='1.25em' bg={true ? 'green.500' : '#d4af37'}>
                    <TeamAvatar size={compact ? 'md' : 'md'} team={asset.teamOwner?._id} />
                  </AvatarBadge>}
                </Avatar>

                {showButtons && <ButtonGroup isAttached>
                  {control &&
                    <IconButton variant={'ghost'} onClick={() => setMode("modify")} colorScheme="orange" size={'xs'} icon={<BsPencil />} />}

                  <Tooltip hasArrow placement='top' label={"Bookmark this Athlete"}>
                    <IconButton
                      size={'xs'}
                      isDisabled={upcomingDrafts.length === 0}
                      icon={isBookmarked ? <BsBookmarkHeartFill /> : <BsBookmark />}
                      variant={!isBookmarked ? 'outline' : 'solid'}
                      colorScheme='yellow'
                      isLoading={loading}
                      onClick={() => bookmarkAthlete()} >
                      {"Draft"}
                    </IconButton>
                  </Tooltip>

                  {drafts && <Button
                    size={'xs'}
                    isDisabled={drafts.length === 0 || asset?.teamOwner}
                    variant={'solid'}
                    isLoading={loading}
                    style={{ backgroundColor: '#8c271e', color: 'white' }}
                    onClick={() => setMode("draft")} >
                    {"Draft"}
                  </Button>}
                  {upcomingDrafts &&
                    <Tooltip hasArrow placement='top' label={"Schedule this Athlete to be drafted"}>
                      <IconButton
                        size={'xs'}
                        isDisabled={upcomingDrafts.length === 0 || asset?.teamOwner}
                        icon={<Calendar />}
                        variant={'solid'}
                        isLoading={loading}
                        style={{ backgroundColor: '#8c271e', color: 'white' }}
                        onClick={() => setMode("sechedule")} >
                        {"Draft"}
                      </IconButton>
                    </Tooltip>}
                </ButtonGroup>}
                {stats && <HStack marginBottom={'3px'} overflow={'hidden'} >

                  {asset.injuries && asset.injuries.length > 0 &&
                    <Tag variant={'solid'} colorScheme='red'>
                      <Avatar size={'xs'} src={'/images/injury.png'} />
                      {asset.injuries.length}x Injury
                    </Tag>}
                </HStack>}
              </Stack>

              <Spacer />

              <div style={{ borderRadius: '10px', border: `2px solid ${getFadedColor(asset.type)}`, padding: '5px' }} display="flex"  >
                <Center >

                  <Box textAlign={'left'} marginLeft={'5px'} >

                    <HStack marginBottom={'3px'} >
                      {isBookmarked && <BsBookmarkHeartFill size={'18px'} color='yellow' fill='yellow' />}
                      <Text as='u' fontSize={'lg'} casing={'capitalize'} >{asset.name}</Text>

                      <Text as='kbd' fontSize={'md'} casing={'capitalize'}>{asset.species}</Text>

                      {!compact && asset.tags.map((el, index) => (
                        <Tag key={index} variant={'solid'} colorScheme={el.color}>
                          {el}
                        </Tag>
                      ))}
                    </HStack>



                    {stats && <SimpleGrid columns={3}>
                      {asset.stats && asset.stats.filter(s => filterTags.length == 0 || filterTags.some(ft => ft.code === s.code)).map((stat, index) => (
                        <Tag key={stat._id}
                          variant={'outline'}
                          size={compact ? "sm" : "md"}
                          style={{
                            backgroundColor: getFadedColor(stat.code, stat.statAmount / 8 + 0.4),
                            color: getTextColor(stat.name),
                            border: `1px solid white`,
                            borderRadius: '0'
                          }}>
                          <StatIcon stat={stat} compact={compact} preferredCurrency={asset.preferredCurrency} />
                          {!compact && stat.code} {stat.statAmount}
                        </Tag>
                      ))}
                    </SimpleGrid>}

                  </Box>
                </Center>
              </div>

              {removeAsset && showRemove && <IconButton variant={'outline'} onClick={removeAsset} colorScheme="red" size={'sm'} icon={<Close />} />}

              <Spacer />
            </Flex>
          </CardHeader>

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

        <CandiModal onClose={() => { setMode(false); }} open={mode === "sechedule"} title={`Sechedule Draft of "${asset.name}"`}>
          {upcomingDrafts.length === 0 && <Box>
            You do not have a valid draft slot yet!
          </Box>}
          {upcomingDrafts.length > 0 && <Box>
            Using Draft Pick

            <Center height={'100%'} >
              <IconButton colorScheme='blue' variant={'solid'} icon={<ArrowLeftIcon />} isDisabled={draftIndex <= 0} onClick={() => setDraftIndex(draftIndex - 1)} />
              <DraftCard
                draft={upcomingDrafts[draftIndex]}
                handleClose={() => setMode(false)}
                scheduleAthlete={asset}
              />
              <IconButton colorScheme='blue' variant={'solid'} icon={<ArrowRightIcon />} isDisabled={draftIndex + 1 === upcomingDrafts.length} onClick={() => setDraftIndex(draftIndex + 1)} />
            </Center>

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