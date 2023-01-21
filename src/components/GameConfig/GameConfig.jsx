import { Button, ButtonGroup, Divider, VStack } from '@chakra-ui/react';
import { PlusSquareIcon, RepeatClockIcon, CalendarIcon } from '@chakra-ui/icons'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux store provider

import GameConfigStep1 from './GameConfigStep1';
import GameConfig2 from './GameConfigStep2';
import GameConfig3 from './GameConfigStep3';
import GameConfigStep4 from './GameConfigStep4';
import socket from '../../socket';

function GameConfig(props) {
	const config = useSelector((state) => state.gameConfig);
	const oldConfig = useSelector((state) => state.gameConfig);
	// const dispatch = useDispatch();
	// const history = useHistory();
	const [step, setStep] = React.useState(1);

  function submitConfig() {
		console.log('DATA', config);
		try {
			socket.emit('request', {
				route: 'gameConfig',
				action: 'create',
				data: config
			});
		} catch (err) {
			console.log('catch block called', err);
		}
  }



	return (    

      <div className='styleCenter' >
        <div>				
          <VStack divider={<Divider orientation='vertical' />} >
            <Button colorScheme={"teal"} variant={step === 0 ? "solid" : "outline"} onClick={() =>setStep(0)}  >Effort Types</Button>
            <Button colorScheme={"teal"} variant={step === 1 ? "solid" : "outline"} onClick={() =>setStep(1)}   >Action Types</Button>
            <Button colorScheme={"teal"} variant={step === 2 ? "solid" : "outline"} onClick={() =>setStep(2)} > Global Stats</Button>
            <Button colorScheme={"teal"} variant={step === 3 ? "solid" : "outline"} onClick={() =>setStep(3)}  >Character Stats</Button>
          </VStack>		
          <Button disabled={false} rightIcon={<CalendarIcon />} onClick={submitConfig} colorScheme={'blue'}  className="btn btn-primary mr-1">
						Submit
					</Button>
        </div>

          {step === 0 && <GameConfigStep1 />}
          {step === 1 && <GameConfig2 />}
          {step === 2 && <GameConfig3 />} 
          {step === 3 && <GameConfigStep4 />} 
      </div>
   


	);
}
export default GameConfig;
