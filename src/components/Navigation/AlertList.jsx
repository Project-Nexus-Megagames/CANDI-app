import React from 'react';
import { useSelector } from 'react-redux';
import { ChevronLeftIcon, PlusSquareIcon, ChatIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  IconButton,
  Badge,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import { CandiAlert } from '../Common/CandiAlert';
import store from '../../redux/store';
import { alertsReceived } from '../../redux/entities/alerts';


export const AlertList = () => {
	let alerts = useSelector((state) => state.alerts.list);
	let socket = useSelector((state) => state.auth.socket);
  
  const { onOpen, onClose, isOpen } = useDisclosure()
  
	let total = alerts.length;

	return (
		<div>
      <Popover 
      closeOnBlur={false}
        onClose={onClose}>
          <IconButton
            size="xs"
            variant={'outline'}
            onClick={() => { store.dispatch(alertsReceived([])); onClose();  } }
            icon={<CloseIcon/>}
            aria-label={'Remove Asset'}
            
        />
        <PopoverTrigger>
          <Button variant={'outline'} colorScheme={total > 0 ? "yellow" : "gray"} leftIcon={<ChatIcon color={total > 0 ? 'yellow' : 'gray'} />} circle size="md"><Badge>{alerts.length}</Badge></Button>
        </PopoverTrigger>
        <PopoverContent style={{ backgroundColor: '#5a4b5c' }}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverHeader>
            <Button onClick={() => { store.dispatch(alertsReceived([])); onClose();  } } size={'sm'} variant={'outline'} >Alerts: {total} (Clear)</Button>
          </PopoverHeader>
          <PopoverBody  >
              {alerts.length > 0 && (
                <div style={{ maxHeight: '80vh', msOverflowY: 'scroll' }} >
                    {alerts.map((alert, index) => (
                      <CandiAlert key={index} alert={alert} />
                    ))}
                </div>
              )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
		</div>
	);
};
