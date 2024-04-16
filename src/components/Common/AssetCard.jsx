import React from 'react';
import { Avatar, Box, Button, ButtonGroup, Card, CardBody, CardHeader, Center, Flex, HStack, IconButton, Spacer, Tag, TagCloseButton, TagLabel, Wrap } from '@chakra-ui/react';
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

const AssetCard = (props) => {
  const { showButtons, handleSelect, compact, removeAsset, showRemove } = props;
  const [mode, setMode] = useState(false);
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
        <Card className={disabled ? 'forbidden' : "toggle-tag"} key={asset._id} style={{ border: `3px ${border} ${getFadedColor(asset.type)}`, minHeight: "20em", height: '100%' }} >
          <CardHeader>

            <Flex align={'center'} overflow='hidden' width='100%'>
              <Spacer />
              <Box>

                <div style={{ borderRadius: '10px', border: `2px solid ${getFadedColor(asset.type)}`, padding: '5px'  }} display="flex"  >
                  <Center >
                    {character && <CharacterNugget size='lg' character={character} />}

                    <Box textAlign={'left'} marginLeft={'5px'} >
                      {asset.name}
                      <br />
                      <Tag variant={'outline'} color={getFadedColor(asset.type)} >{asset.type}</Tag>
                      <Tag variant={'outline'} color={getFadedColor(asset.type)} >Uses: {asset.uses}</Tag>
                      {<CountDownTag timeout={asset.timeout} />}
                      <Wrap>
                        {asset.status.length > 0 && asset.status?.map(el => (
                          <NexusTag key={el} value={el}></NexusTag>
                        ))}
                        {asset.dice?.map(die => (
                          <Center
                            key={die._id}
                            style={{
                              textAlign: 'center',
                              padding: '2px',
                              width: '35px',
                              marginLeft: '5px', border: `2px solid ${getFadedColor(die.type)}`,
                              borderRadius: '8px'
                            }} >
                            {/* {<img style={{ maxHeight: '30px', backgroundColor: getFadedColor(die.type), height: 'auto', borderRadius: '5px', }} src={die ? `/images/d${die.amount}.png` : '/images/unknown.png'} alt={die.amount} />} */}
                            D{die.amount}
                          </Center>
                        ))}
                      </Wrap>
                    </Box>
                  </Center>





                  {asset.sharedWith.length > 0 && <p>Shared with:</p>}
                  {asset.sharedWith.length > 0 && asset.sharedWith.map(char =>
                    <Tag margin={'2px'} key={char._id} variant={'solid'} colorScheme='telegram' >
                      <Avatar
                        size={'xs'}
                        name={char?.characterName}
                        src={char?.profilePicture}
                        margin='1'
                      />
                      <TagLabel>
                        {char.characterName}</TagLabel>
                      {(character?._id === asset.ownerCharacter || character.account === asset.account) &&
                        <TagCloseButton onClick={() => {
                          const data = {
                            id: asset._id,
                            charId: char._id
                          };
                          socket.emit('request', {
                            route: 'asset',
                            action: 'removeShared',
                            data
                          });
                        }}
                        />}
                    </Tag>
                  )}

                  {!disabled && mode === 'lend' && <AddCharacter
                    characters={characters.filter(el => !asset.sharedWith.some(ass => ass?._id === el._id))}
                    isDisabled={asset.lendUses <= asset.sharedWith.length}
                    handleSelect={(character) => {
                      const data = {
                        id: asset._id,
                        charId: character._id
                      };
                      socket.emit('request', {
                        route: 'asset',
                        action: 'addShared',
                        data
                      });
                    }}
                  />}

                </div>

                {control && showButtons && <ButtonGroup isAttached>
                  <IconButton variant={'ghost'} onClick={() => setMode("modify")} colorScheme="orange" size={'sm'} icon={<BsPencil />} />
                  <IconButton variant={'ghost'} onClick={() => setMode("delete")} colorScheme="red" size={'sm'} icon={<Trash />} />
                </ButtonGroup>}

                {(character?._id === asset.ownerCharacter || character.account === asset.account) && showButtons && asset.status.some(el => el === 'lendable') &&
                  <Button
                    variant={'ghost'}
                    onClick={() => setMode(mode === 'lend' ? false : "lend")}
                    colorScheme={mode === 'lend' ? "red" : "blue"}
                    size={'sm'}
                    leftIcon={mode === 'lend' ? <CloseIcon /> : <FaHandshake />}
                  >{mode === 'lend' ? "Finish" : `Share (max ${asset.lendUses})`}</Button>}

              </Box>

              {removeAsset && showRemove && <IconButton variant={'outline'} onClick={removeAsset} colorScheme="red" size={'sm'} icon={<Close />} />}

              <Spacer />
            </Flex>


            <Flex align={'center'} overflow='hidden' width='100%' >
              <Spacer />

              <Spacer />
            </Flex>

            <Flex align={'center'} overflow='hidden' width='100%' >
              {asset.tags?.map(el => (
                <NexusTag key={el} value={el}></NexusTag>
              ))}
            </Flex>

          </CardHeader>
          <CardBody style={{ paddingTop: '0px' }} >
            {!compact && <div style={{ maxHeight: '10vh', overflow: 'auto', textOverflow: 'ellipsis', }} >
              {asset.description}
            </div>}
          </CardBody>

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

export default (AssetCard);