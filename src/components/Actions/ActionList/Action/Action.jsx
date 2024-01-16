import React, { useState } from 'react';
import { AccordionItem, AccordionPanel, Box, Button, ButtonGroup, Center, Flex, HStack, Stack, Wrap } from "@chakra-ui/react";
import ActionHeader from "./ActionHeader/ActionHeader";
import ActionResources from "./ActionResources";
import ActionMarkdown from "./ActionMarkdown";
import ActionEffort from "./ActionEffort";
import Feed from "./Feed";
import ActionButtons from './ActionHeader/ActionButtons';
import socket from '../../../../socket';
import { getFadedColor, getTime } from '../../../../scripts/frontend';
import ActionOptions from './ActionOptions';
import { useSelector } from 'react-redux';
import ActionDifficulty from './ActionDifficulty';
import HexLocation from '../../../Locations/HexLocation';
import ActionForm from '../../Forms/ActionForm';
import WordDivider from '../../../Common/WordDivider';

const Action = ({ action, toggleAssetInfo, hidebuttons, actionType }) => {
  const control = useSelector(state => state.auth.control);
  const [mode, setMode] = React.useState(false);
  const [name, setName] = useState(action.name);
  const [description, setDescription] = useState(action.submission.description);
  const [intent, setIntent] = useState(action.submission.intent);
  const [choiceType, setChoiceType] = React.useState('binary');

  const isUnpublishedAgenda = (action.tags.some((tag) => tag.toLowerCase() !== 'published') || !action.tags.length > 0) && action.type.toLowerCase() === 'agenda';


  function getBorder() {
    return isUnpublishedAgenda
      ? `4px dotted ${getFadedColor(action.type)}`
      : `4px solid ${getFadedColor(action.type)}`;
  }

  const handleDelete = async () => {
    const data = {
      id: action._id,
      action: action._id
    };
    socket.emit('request', {
      route: 'action',
      action: 'delete',
      data
    });
  };

  const handleSubmit = (data0) => {
    const data = {
			submission: {
				assets: data0.assets,
				description: data0.description,
				intent: intent,
        facility: data0.facility,
        //location: data0.destination ? data0.destination : undefined,
			},
      ...data0
		};
    //console.log(data0)
    socket.emit('request', { route: 'action', action: 'update', data });
    setMode(false);
  };


  const handleEdit = (incoming, type) => {
    switch (type) {
      case 'name':
        setName(incoming)
        break;
      case 'intent':
        setIntent(incoming)
        break;
      case 'description':
        setDescription(incoming)
        break;
      case 'submit':
        handleSubmit()
        break;
      default:
        console.log('UwU Scott made an oopsie doodle!');
    }
  };

  return (
    <Flex
      style={{
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Box
        alignItems='middle'
        justifyContent="space-around"
        width='100%'
      >
        <Box
          style={{
            border: getBorder(),
            borderRadius: '5px',
            padding: '6px',
            marginTop: '1rem',
          }}
        >
          <ActionHeader
            action={action}
            time={getTime(action.createdAt)}
            creator={action.creator}
            handleEdit={handleEdit}
            edit={mode === 'edit'}
            isUnpublishedAgenda={isUnpublishedAgenda}
          />
          <Box>
            <Center>
              {!hidebuttons && <ActionButtons
                action={action}
                toggleEdit={() => setMode(mode === 'edit' ? false : 'edit')}
                creator={action.creator}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
                edit={mode === 'edit'}
                name={name}
              />}</Center>
            {mode !== 'edit' && <Box>

              {/* <Wrap align={'center'} justify={'space-evenly'} >
                {(action.submission.difficulty > 0 || control) && <ActionDifficulty action={action} submission={action.submission} />}
                {action.location && action.location._id && action.location.name !== "No Where" && <Box>
                  <WordDivider word={`Location: ${action.location.name}`}/>
                  <HexLocation location={action.location} />
                </Box>}
              </Wrap> */}

              <ActionMarkdown
                header='Description'
                tooltip='A description of what your character is doing in this action and how you will use your assigned Assets to accomplish this.'
                markdown={action.submission.description}
                data={description}
                handleEdit={handleEdit}
                edit={false}
              />

              {action.location && <ActionMarkdown
                header='Location'
                tooltip='Where this action takes place'
                textAlign='center'
                markdown={action.location.name}
                edit={false}
              />}

              {actionType.type !== 'Agenda' && actionType.maxAssets > 0 && <ActionResources
                actionType={actionType}
                assets={action.submission.assets}
                toggleAssetInfo={toggleAssetInfo}
              />}

              {control && actionType.type === 'Agenda' && action.options.length == 0 &&
                <Box>
                  Choice Type: {choiceType} (Control Only)<br />
                  <ButtonGroup>
                    {['binary', 'multiple'].map(choice => (
                      <Button key={choice} onClick={() => setChoiceType(choice)} isDisabled={choiceType === choice} >{choice}</Button>
                    ))}
                  </ButtonGroup>
                </Box>}

              {action.options && action.options.length > 1 && <ActionOptions
                action={action}
                options={action.options}
                actionType={actionType}
              />}
            </Box>}

            {mode === 'edit' && <Box> 
              <ActionForm 
              defaultValue={{ ...action.submission, name: action.name, location: action.location._id }} 
              handleSubmit={(action) =>handleSubmit(action)} 
              actionType={action.type}
              actionID={action._id} 
              closeNew={() => setMode(false)} />
            </Box>}



            <Feed
              action={action}
            />
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

export default Action;
