import React from 'react';
import { Avatar, Box, Button, ButtonGroup, Card, CardBody, CardHeader, Center, Flex, IconButton, Spacer, Tag, TagCloseButton, TagLabel } from '@chakra-ui/react';
import { useState } from 'react';
import socket from '../../socket';
import { CandiWarning } from './CandiWarning';
import NexusTag from './NexusTag';
import AssetForm from './AssetForm';
import { useSelector } from 'react-redux';
import { CandiModal } from './CandiModal';
import { BsPencil } from 'react-icons/bs';
import { Close, Trash } from '@rsuite/icons';
import CountDownTag from './CountDownTag';
import { getFadedColor, getThisTeam, populateThisAccount } from '../../scripts/frontend';
import CharacterNugget from './CharacterNugget';
import { FaHandshake } from 'react-icons/fa';
import { AddCharacter } from './AddCharacter';
import { CloseIcon } from '@chakra-ui/icons';

const AssetCard = (props) => {
  const { showButtons, handleSelect, compact, removeAsset, showRemove, selected } = props;
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

  if (asset)
    return (
      <div style={{ textAlign: 'center', width: "100%", border: selected ? `3px solid white` : undefined, borderRadius: '10px', }} onClick={() => (handleSelect && !disabled) ? handleSelect(asset) : console.log((handleSelect && !disabled))} >
        <Card className={disabled ? 'forbidden' : "toggle-tag"} key={asset._id} style={{ border: `3px solid ${getFadedColor(asset.type)}`, height: '100%' }} >
          <CardHeader>

            <Flex align={'left'} overflow='hidden' width='100%'>
              <Spacer />
              {character && <CharacterNugget size='lg' character={character} />}
              <Box>

                <div display="flex">

                  <h5 style={{ marginLeft: '5px' }}>{asset.name}
                    <br />
                    {/* {<CountDownTag timeout={asset.timeout} />} */}
                    {asset.type && <Tag variant={'outline'} color={getFadedColor(asset.type)} >{asset.type}</Tag>}
                    <Tag variant={'outline'} color={getFadedColor(asset.type)} >Uses: {asset.uses}</Tag>
                    <Center>
                      {asset.status?.map(el => (
                        <NexusTag key={el} value={el}></NexusTag>
                      ))}
                      {asset.tags?.map(el => (
                        <NexusTag key={el} value={el}></NexusTag>
                      ))}
                    </Center>
                  </h5>
                </div>

                {asset.sharedWith && asset.sharedWith.length > 0 && <b>Shared with:</b>}
                {asset.sharedWith && asset.sharedWith.length > 0 && asset.sharedWith.map(char =>
                  <Tag margin={'2px'} key={char._id} variant={'solid'} colorScheme='telegram' >
                    <Avatar
                      size={'xs'}
                      name={char?.characterName}
                      src={char?.profilePicture}
                      margin='1'
                    />
                    <TagLabel>{char.characterName}</TagLabel>
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
                <br />

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
                  >{mode === 'lend' ? "Finish" : "Share"}</Button>}

              </Box>

              {removeAsset && showRemove && <IconButton variant={'outline'} onClick={removeAsset} colorScheme="red" size={'sm'} icon={<Close />} />}

              <Spacer />
            </Flex>


            Dice Pool:
            <Flex align={'center'} overflow='hidden' width='100%' >
              <Spacer />
              {asset.dice?.map(die => (
                <div key={die._id} style={{ textAlign: 'center', alignItems: 'center', display: 'flex', margin: '5px' }} >
                  <Tag variant={'outline'} color={getFadedColor(die.type)} >{die.type}</Tag>
                  {<img style={{ maxHeight: '30px', backgroundColor: getFadedColor(die.type), height: 'auto', borderRadius: '5px', }} src={die ? `/images/d${die.amount}.png` : '/images/unknown.png'} alt={die.amount} />}

                </div>
              ))}
              <Spacer />
            </Flex>

          </CardHeader>
          <CardBody style={{ paddingTop: '0px' }} >
            {!compact && <div style={{ maxHeight: '20vh', overflow: 'auto', textOverflow: 'ellipsis', }} >
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