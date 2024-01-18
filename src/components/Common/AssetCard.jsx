import React from 'react';
import { Box, ButtonGroup, Card, CardBody, CardHeader, Flex, IconButton, Spacer, Tag } from '@chakra-ui/react';
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

const AssetCard = (props) => {
  const { character, showButtons, handleSelect, compact, removeAsset, showRemove } = props;
  const [mode, setMode] = useState(false);
  const control = useSelector(state => state.auth.control);
  const teams = useSelector(state => state.teams.list);
  const assets = useSelector(state => state.assets.list);
  const accounts = useSelector(state => state.accounts.list);

  const deleteAssert = async () => {
    socket.emit('request', {
      route: 'asset',
      action: 'delete',
      data: { id: asset._id }
    });
  };

  const asset = props.asset._id? props.asset : assets.find(el => el._id === props.asset)

  const disabled = asset.status?.some(el => el === 'working') || undefined;
  const account = populateThisAccount(accounts, asset.account)
  const team = getThisTeam(teams, account.manager);

  if (asset)
  return (
    <div style={{ textAlign: 'center', width: "100%" }} onClick={() => (handleSelect && !disabled) ? handleSelect(asset) : console.log("Peekabo!")} >
      <Card className={disabled ? 'forbidden' : "toggle-tag"} key={asset._id} style={{ border: `3px solid ${getFadedColor(asset.type)}`,  }} >
        <CardHeader>

          <Flex align={'center'} overflow='hidden' width='100%'>
            <Spacer />
            {/* <TeamAvatar size='md' team={team} /> */}
            <Spacer />
            <Box>
              <div display="flex">
                { <h5 style={{ marginLeft: '5px' }}>{asset.name}
                  {<CountDownTag timeout={asset.timeout} />}
                </h5>}
                <Tag variant={'outline'} color={getFadedColor(asset.type)} >{asset.type}</Tag>
                <Tag variant={'outline'} color={getFadedColor(asset.type)} >Uses: {asset.uses}</Tag>
                {asset.status?.map(el => (
                  <NexusTag key={el} value={el}></NexusTag>
                ))}
              </div>

              {control && showButtons && <ButtonGroup isAttached>
                <IconButton variant={'ghost'} onClick={() => setMode("modify")} colorScheme="orange" size={'sm'} icon={<BsPencil />} />
                <IconButton variant={'ghost'} onClick={() => setMode("delete")} colorScheme="red" size={'sm'} icon={<Trash />} />
              </ButtonGroup>}
            </Box>


            {removeAsset && showRemove && <IconButton variant={'outline'} onClick={removeAsset} colorScheme="red" size={'sm'} icon={<Close />} />}

            <Spacer />

            <Spacer />
          </Flex>

          <Flex align={'center'} overflow='hidden' width='100%' >
            <Spacer />
            {asset.dice?.map(die => (
              <div key={die._id} style={{ textAlign: 'center' }} >
                {/* {<img style={{ maxHeight: '30px', backgroundColor: getFadedColor(die.type), height: 'auto', borderRadius: '5px', }} src={die ? `/images/d${die.amount}.png` : '/images/unknown.png'} alt={die.amount} />} */}
                + {die.amount}
              </div>
            ))}
            <Spacer />
          </Flex>

          <Flex align={'center'} overflow='hidden' width='100%' >
            {asset.tags?.map(el => (
              <NexusTag key={el} value={el}></NexusTag>
            ))}
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
    <b>{props.asset}</b>
  )
}

export default (AssetCard);