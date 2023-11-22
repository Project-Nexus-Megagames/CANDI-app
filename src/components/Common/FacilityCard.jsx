import React from 'react';
import { Box, ButtonGroup, Card, CardBody, CardHeader, Flex, IconButton, Spacer } from '@chakra-ui/react';
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

const FacilityCard = (props) => {
  const { facility, character, showButtons, handleSelect, compact, } = props;
  const [mode, setMode] = useState(false);
  const control = useSelector(state => state.auth.control);
  const teams = useSelector(state => state.teams.list);
  const accounts = useSelector(state => state.accounts.list);

  const deleteAssert = async () => {
    socket.emit('request', {
      route: 'facility',
      action: 'delete',
      data: { id: facility._id }
    });
  };

  const disabled = facility.status?.some(el => el === 'working') || undefined;
  const account = populateThisAccount(accounts, facility.account)
  const team = getThisTeam(teams, account.manager);

  return (
    <div style={{ textAlign: 'center', width: "100%" }} onClick={() => (handleSelect && !disabled) ? handleSelect(facility) : console.log("Peekabo!")} >
      <Card className={disabled ? 'forbidden' : "toggle-tag"} key={facility._id}  >
        <CardHeader>

          <Flex align={'center'} overflow='hidden' width='100%'>
            <Spacer />
            {/* <TeamAvatar size='md' team={team} /> */}
            <Spacer />
            <Box>
              {facility.name}


              {control && showButtons && <ButtonGroup isAttached>
                <IconButton variant={'ghost'} onClick={() => setMode("modify")} colorScheme="orange" size={'sm'} icon={<BsPencil />} />
                <IconButton variant={'ghost'} onClick={() => setMode("delete")} colorScheme="red" size={'sm'} icon={<Trash />} />
              </ButtonGroup>}

            </Box>

            <Spacer />

            <Spacer />
          </Flex>

          <Flex align={'center'} overflow='hidden' width='100%' >
            <Spacer />
            {facility.producing?.map(die => (
              <div key={die._id} style={{ textAlign: 'center' }} >
                <ResourceNugget value={die.amount} type={die.type} />
              </div>
            ))}
            <Spacer />
          </Flex>


        </CardHeader>
        <CardBody style={{ paddingTop: '0px' }} >
          {!compact && <div style={{ maxHeight: '20vh', overflow: 'auto', textOverflow: 'ellipsis', }} >
            {facility.description}
          </div>}
        </CardBody>

      </Card>

      {facility && <CandiWarning open={mode === 'delete'} title={`Delete "${facility.name}"?`} onClose={() => setMode(false)} handleAccept={() => deleteAssert()}>
        This can never be undone.
      </CandiWarning>}

      <CandiModal onClose={() => { setMode(false); }} open={mode === "modify"} title={`${mode} Asset`}>

      </CandiModal>

    </div>
  );
}

export default (FacilityCard);