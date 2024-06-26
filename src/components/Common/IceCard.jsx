import React from 'react';
import { Avatar, Box, Button, ButtonGroup, Card, CardBody, CardHeader, Center, Flex, IconButton, Spacer, Tag, TagCloseButton, TagLabel, VStack, Wrap } from '@chakra-ui/react';
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
import ResourceNugget from './ResourceNugget';
import { getTeamIce } from '../../redux/entities/ice';
import { ActionIce } from '../Actions/ActionList/Action/ActionIce';

const IceCard = (props) => {
  const { showButtons, handleSelect, compact, removeAsset, showRemove, selected } = props;
  const [mode, setMode] = useState(false);
  const control = useSelector(state => state.auth.control);
  const teamIce = useSelector(getTeamIce);


  const deleteAssert = async () => {
    socket.emit('request', {
      route: 'ice',
      action: 'delete',
      data: { id: ice._id }
    });
  };

  const ice = props.ice._id ? props.ice : teamIce.find(el => el._id === props.ice)

  const disabled = true;

  if (ice)
    return (
      <div style={{ textAlign: 'center', width: "100%", height: "100%", border: selected ? `3px solid white` : undefined, borderRadius: '10px', }} onClick={() => (handleSelect && !disabled) ? handleSelect(ice) : console.log((handleSelect && !disabled))} >
        <Card className={disabled ? 'forbidden' : "toggle-tag"} key={ice._id} style={{ border: `3px solid ${getFadedColor('ice')}`, height: '100%' }} >
          <CardHeader>

            <Flex align={'left'} overflow='hidden' width='100%'>
              {ice.imageUrl &&
                <img
                  src={`${ice.imageUrl}`}
                  alt='Img could not be displayed'
                  style={{ maxHeight: "20vh", width: '40%' }}
                />
              }
              <Spacer />
              <Box>

                <div display="flex">

                  <h3>{ice.name}</h3>                    <br />
                  {/* {<CountDownTag timeout={asset.timeout} />} */}
                  {mode !== 'addDice' && <Button variant={'solid'} colorScheme="green"
                    onClick={() => socket.emit("request", {
                      route: "action",
                      action: "roll",
                      data: { ice: ice._id },
                    })}>Roll</Button>}

                  <Center>
                    {ice.status?.map(el => (
                      <NexusTag key={el} value={el}></NexusTag>
                    ))}
                    {ice.tags?.map(el => (
                      <NexusTag key={el} value={el}></NexusTag>
                    ))}
                  </Center>
                </div>

                <br />

                {control && showButtons && <ButtonGroup isAttached>
                  <IconButton variant={'ghost'} onClick={() => setMode("modify")} colorScheme="orange" size={'sm'} icon={<BsPencil />} />
                  <IconButton variant={'ghost'} onClick={() => setMode("delete")} colorScheme="red" size={'sm'} icon={<Trash />} />
                </ButtonGroup>}

              </Box>

              {removeAsset && showRemove && <IconButton variant={'outline'} onClick={removeAsset} colorScheme="red" size={'sm'} icon={<Close />} />}

              <Spacer />
            </Flex>

          </CardHeader>

          <CardBody style={{ paddingTop: '0px' }} >
            <Wrap justify="space-around">

              {ice.options &&
                ice.options.map((subRotuine, index) => (
                  <Box width={"30vw"} minWidth={'250px'} key={subRotuine._id}>
                    <ActionIce
                      show={mode === 'addDice'}
                      ice={ice}
                      mode={mode}
                      loading={props.loading}
                      subRotuine={subRotuine}
                      index={index}
                    />
                  </Box>

                ))}

            </Wrap>

          </CardBody>

        </Card>

        {ice && <CandiWarning open={mode === 'delete'} title={`Delete "${ice.name}"?`} onClose={() => setMode(false)} handleAccept={() => deleteAssert()}>
          This can never be undone.
        </CandiWarning>}

        <CandiModal onClose={() => { setMode(false); }} open={mode === "modify"} title={`${mode} Ice`}>
          {/* <AssetForm closeModal={() => { setMode(false); }} character={character} asset={asset} mode={mode} /> */}
        </CandiModal>

      </div>
    );
  return (
    <b>Cannot Render Ice {props.ice}</b>
  )
}

export default (IceCard);