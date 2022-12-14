import { Button, ButtonGroup } from '@chakra-ui/react';
import { PlusSquareIcon, RepeatClockIcon, CalendarIcon } from '@chakra-ui/icons'
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux store provider
import { useHistory } from 'react-router-dom';
import { Steps } from 'rsuite';
import { CandiModal } from '../Common/Modal';

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
    <CandiModal className='styleCenter' title="Edit Gamestate" open={props.editConfig} onClose={() => props.onClose()} >
      <div className='styleCenter' >
        <div>				
          <Steps  vertical current={step}>
            <Steps.Item style={{ minHeight: '100px', cursor: 'pointer'}} onClick={() =>setStep(0)} title="Effort Types" />
            <Steps.Item style={{ minHeight: '100px', cursor: 'pointer'}} onClick={() =>setStep(1)} title="Action Types"  />
            <Steps.Item style={{ minHeight: '100px', cursor: 'pointer'}} onClick={() =>setStep(2)} title="Global Stats"/>
            <Steps.Item  onClick={() =>setStep(3)} title="Character Stats" />
          </Steps>		
          <Button style={{ minHeight: '100px'}} disabled={false} rightIcon={<CalendarIcon />} onClick={submitConfig} colorScheme={'blue'}  className="btn btn-primary mr-1">
						Save
					</Button>
        </div>

          {step === 0 && <GameConfigStep1 />}
          {step === 1 && <GameConfig2 />}
          {step === 2 && <GameConfig3 />} 
          {step === 3 && <GameConfigStep4 />} 
      </div>
   
    </CandiModal>

	);
}
export default GameConfig;
