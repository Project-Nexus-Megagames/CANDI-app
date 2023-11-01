import React, { useState } from 'react';
import { AccordionItem, AccordionPanel, Box, Center, Flex } from "@chakra-ui/react";
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

const Action = ({ action, toggleAssetInfo, hidebuttons, actionType }) => {
  const control = useSelector(state => state.auth.control);
	const [mode, setMode] = React.useState(false);
	const [name, setName] = useState(action.name);
  const [description, setDescription] = useState(action.submission.description);
	const [intent, setIntent] = useState(action.submission.intent);

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

    const handleSubmit = async () => {
      const data = {
        id: action._id,
        name: name,
        tags: action.tags,
        submission: {
          assets: action.assets,
          description,
          intent
        }
      };
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
                        hidebuttons
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
                        <Box>
                            <ActionMarkdown
                                header='Description'
                                tooltip='A description of what your character is doing in this action and how you will use your assigned Assets to accomplish this.'
                                markdown={action.submission.description}
                                data={description}
                                handleEdit={handleEdit}
                                edit={mode === 'edit'}
                            />
                            {/* <ActionMarkdown
                                tooltip='An out of character explanation of what you, the player, want to happen as a result.'
                                header='Intent'
                                markdown={action.submission.intent}
                                data={intent}
                                handleEdit={handleEdit}
                                edit={mode === 'edit'}
                            /> */}

                            {(action.submission.difficulty > 0 || control) && <ActionDifficulty action={action} submission={action.submission}/>}??

                            {actionType.type !== 'Agenda' && <ActionResources
                              actionType={actionType}
                              assets={action.submission.assets}
                              toggleAssetInfo={toggleAssetInfo}
                            />}

                            {action.options && action.options.length > 1 && <ActionOptions 
                              action={action}
                              options={action.options}
                              actionType={actionType}
                            />}
                        </Box>

                        

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
