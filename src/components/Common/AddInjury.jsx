import React, { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux store provider
import socket from '../../socket';
import _ from 'lodash';
import { getCharacterById } from '../../redux/entities/characters';
import { Box } from '@chakra-ui/layout';
import { Button, ButtonGroup } from '@chakra-ui/button';
import SelectPicker from '../Common/SelectPicker';
import { CandiModal } from '../Common/CandiModal';
import { Checkbox, CheckboxGroup } from '@chakra-ui/checkbox';
import { Input } from '@chakra-ui/react';
import InputNumber from './InputNumber';

export const AddInjury = ({ character, closeModal, show }) => {
  const [selected, setSelected] = useState({
    name: '',
    duration: '0',
    character: character,
    received: 69,
    permanent: false
  });

	const handleExit = () => {
		closeModal();
	};

  const handleAddInjury = (type, change) => {
    console.log(type, change)
    let temp = { ...selected };
    temp[type] = change;
    console.log(temp)
    setSelected(temp);
  };

	const handleSubmit = () => {
		const data = selected;
		try {
			socket.emit('request', {
				route: 'character',
				action: 'addInjury',
				data
			});
			// eslint-disable-next-line no-empty
		} catch (err) {
      console.log(err)
    }
		handleExit();
	};


	return (
    <CandiModal open={show} title={"Play God and Hurt a Character"} 
    onHide={() => {
      handleExit();
    }}>
     						<div>
							<div>Title:</div>
							<Input
								onChange={(e) => handleAddInjury('name', e.target.value)}
								style={{ marginBottom: ' 10px' }}
							></Input>
							{!selected.permanent && (
								<div>
									Duration:
									<InputNumber
										min={0}
										onChange={(e) => handleAddInjury('duration', e)}
										style={{ marginBottom: ' 10px' }}
									/>
								</div>
							)}
              <Button                
                onClick={() => handleSubmit(selected)}
                variant="solid"
              >
                Submit
              </Button>
						</div>
  </CandiModal>
	);
};
