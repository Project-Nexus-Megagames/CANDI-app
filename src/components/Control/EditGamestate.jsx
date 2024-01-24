import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import { HStack, VStack, Flex, FormControl, Box, FormLabel, Input, Text, Modal, ModalHeader, ModalContent, ModalBody, ButtonGroup, Button, ModalFooter, Spacer, Switch, Grid } from '@chakra-ui/react';
import InputNumber from '../Common/InputNumber';
import SelectPicker from '../Common/SelectPicker';
import { CandiModal } from '../Common/CandiModal';
import socket from '../../socket';

const EditGamestate = (props) => {
  const { onClose, show } = props;
	const gamestate = useSelector((state) => state.gamestate);
  const [status, setStatus] = useState(gamestate.status);
  const [date, setDate] = useState(gamestate.endTime);
  const [round, setRound] = useState(gamestate.round);

  
	function onSubmit() {
    const data = { status: status, endTime: date, round: round };
    socket.emit('request', { route: 'gamestate', action: 'modify', data });
	}

	const handleError = (errors) => {
		console.log('ERROR', errors);
	};

	return (
    <CandiModal open={show} title="" onClose={onClose} >
      <form onSubmit={onSubmit}>
        <Box>
          <VStack spacing="24px" w="100%">
              <Flex >
              <Spacer />
              <FormControl>
                <FormLabel>Status </FormLabel>
                <SelectPicker label={'type'} valueKey={'type'} data={[ { type: 'Active' }, { type: 'Resolution' }, { type: 'Down' } ]} onChange={(ddd) => setStatus(ddd) } value={status}/>
              </FormControl>

              <Spacer />
              </Flex>

              <FormLabel>Round</FormLabel>
              <InputNumber
                defaultValue={round}
                onChange={(value) => setRound(value)}
              />
 
              <Flex >
              <Spacer />
              <FormControl>
                <FormLabel>Round End (Time is Localized)</FormLabel>
                <Input type="datetime-local" onChange={(event) => setDate(event.target.value)} />
              </FormControl>
              <Spacer />
              </Flex>
          </VStack>
        </Box>

        <ButtonGroup>
          <Button type="submit" colorScheme="teal" className="btn btn-primary mr-1">
            Submit
          </Button>

        </ButtonGroup>
      </form>        
    </CandiModal>

	);
};

export default EditGamestate;