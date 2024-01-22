import { Button, ButtonGroup, Divider, VStack } from '@chakra-ui/react';
import { PlusSquareIcon, RepeatClockIcon, CalendarIcon } from '@chakra-ui/icons';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux store provider

import GameConfigStepResources from './GameConfigStepResources';
import GameConfigStepActions from './GameConfigStepActions';
import GameConfig3 from './GameConfigStep3';
import GameConfigStep4 from './GameConfigStep4';
import GameConfigStepAssets from './GameConfigStepAssets';
import socket from '../../socket';
import GameConfigLayout from './GameConfigLayout';

function GameConfig(props) {
	const config = useSelector((state) => state.gameConfig);
	const oldConfig = useSelector((state) => state.gameConfig);
	// const dispatch = useDispatch();
	// const history = useHistory();
	const [step, setStep] = React.useState('action');

	function submitConfig() {
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
		<div className='styleCenter'>
			<div>
				<VStack divider={<Divider orientation='vertical' />}>
          <Button colorScheme={'teal'} variant={step === 'layout' ? 'solid' : 'outline'} onClick={() => setStep('layout')}>
						CANDI Layout
					</Button>
					<Button colorScheme={'teal'} variant={step === 'effort' ? 'solid' : 'outline'} onClick={() => setStep('effort')}>
						Resource Types
					</Button>
					<Button colorScheme={'teal'} variant={step === 'resource' ? 'solid' : 'outline'} onClick={() => setStep('resource')}>
						Asset Types
					</Button>
					<Button colorScheme={'teal'} variant={step === 'action' ? 'solid' : 'outline'} onClick={() => setStep('action')}>
						Action Types
					</Button>
					<Button colorScheme={'teal'} variant={step === 'globalstat' ? 'solid' : 'outline'} onClick={() => setStep('globalstat')}>
						Global Stats
					</Button>
					<Button colorScheme={'teal'} variant={step === 'charstat' ? 'solid' : 'outline'} onClick={() => setStep('charstat')}>
						Character Stats
					</Button>
				</VStack>
				<Button disabled={false} rightIcon={<CalendarIcon />} onClick={submitConfig} colorScheme={'blue'} className='btn btn-primary mr-1'>
					Submit
				</Button>
			</div>

			{step === 'layout' && <GameConfigLayout />}
			{step === 'effort' && <GameConfigStepResources />}
			{step === 'resource' && <GameConfigStepAssets />}
			{step === 'action' && <GameConfigStepActions />}
			{step === 'globalstat' && <GameConfig3 />}
			{step === 'charstat' && <GameConfigStep4 />}
		</div>
	);
}
export default GameConfig;
