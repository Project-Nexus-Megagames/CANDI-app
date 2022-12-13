import React from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Redux store provider
import { useHistory } from 'react-router-dom';
import { Steps } from 'rsuite';
import { CandiModal } from '../Common/Modal';

import GameConfigStep1 from './GameConfigStep1';
import GameConfig2 from './GameConfigStep2';
import GameConfig3 from './GameConfigStep3';

function GameConfig(props) {
	const config = useSelector((state) => state.gameConfig);
	// const dispatch = useDispatch();
	// const history = useHistory();
	const [step, setStep] = React.useState(1);


	return (    
    <CandiModal title="Edit Gamestate" open={props.editConfig} onClose={() => props.onClose()} >
      <div className='styleCenter' >
        <Steps  vertical current={step}>
          <Steps.Item style={{ minHeight: '100px'}} onClick={() =>setStep(0)} title="Effort Types" />
          <Steps.Item style={{ minHeight: '100px'}} onClick={() =>setStep(1)} title="Action Types"  />
          <Steps.Item style={{ minHeight: '100px'}} onClick={() =>setStep(2)} title="Global Stats"/>
          <Steps.Item style={{ minHeight: '100px'}} onClick={() =>setStep(3)} title="Character Stats" />
        </Steps>
          {step === 0 && <GameConfigStep1 />}
          {step === 1 && <GameConfig2 />}
          {step === 2 && <GameConfig3 />} 
      </div>
   
    </CandiModal>

	);
}
export default GameConfig;
