/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import socket from '../../../socket';
import { Modal, Button, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton } from '@chakra-ui/react';
import { getMyCharacter } from '../../../redux/entities/characters';
import SelectPicker from '../../Common/SelectPicker';
import { getFadedColor } from '../../../scripts/frontend';
import MDEditor from '@uiw/react-md-editor';

const NewResult = (props) => {
  const { result, mode } = props;
  const myChar = useSelector(getMyCharacter);
  const [description, setDescription] = React.useState((result && result.description) ? result.description : '');
  const [diceresult, setDiceresult] = React.useState(result && result.diceresult ? result.diceresult : '');
  const [status, setStatus] = React.useState(result ? result.status : 'Temp-Hidden');

  const isDisabled = () => {
    const boolean = diceresult?.length < 1 && diceresult?.length < 1;
    if (description.length < 10 || boolean) return true;
    else return false;
  };

  const handleSubmit = async () => {
    const data = {
      result: {
        description: description,
        resolver: myChar._id,
        status: status,
        id: result?._id
      },
      dice: diceresult ? diceresult : '0',
      id: props.selected._id,
      creator: myChar._id
    };
    socket.emit('request', { route: 'action', action: mode, data });
    props.closeNew();
  };

  const statusTypes = [
    { name: 'Public', description: 'Anyone Can see this' },
    { name: 'Private', description: 'Only Control can see this' },
    { name: 'Temp-Hidden', description: 'Only Control can see this. Will be made public when the round is pushed' }];

  return (
    <div
      style={{
        border: `3px solid ${getFadedColor('Result')}`,
        borderRadius: '0px 0px 5px 5px',
        padding: '5px',
        width: '100%'
      }}>
      <form>
        Status
        <SelectPicker altLabel={"description"} label={'name'} valueKey={'name'} data={statusTypes} onChange={(ddd) => setStatus(ddd)} value={status} />

        <MDEditor
          height="100%"
          value={description}
          preview="edit"
          onChange={setDescription} />

        Dice Roll Result
        <textarea rows='2' value={diceresult} className='textStyle' onChange={(event) => setDiceresult(event.target.value)}></textarea>
      </form>

      <Button onClick={() => handleSubmit()} disabled={isDisabled()} appearance='primary'>
        {description.length < 11 ? (
          <b>Description text needs {11 - description.length} more characters</b>
        ) : diceresult.length < 1 && props.selected.diceresult?.length < 1 ? (
          <b>Dice text need {1 - diceresult.length} more characters</b>
        ) : (
          <b>Submit</b>
        )}
      </Button>
      <Button onClick={() => props.closeNew()} appearance='subtle'>
        Cancel
      </Button>
    </div>
  );
};

export default NewResult;
