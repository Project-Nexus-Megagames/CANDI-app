import React, { useState } from 'react';
import { Box, Flex } from "@chakra-ui/react";
import { getFadedColor, getTime } from "../../../../scripts/frontend";
import ActionHeader from "./ActionHeader/ActionHeader";
import ActionResources from "./ActionResources";
import ActionMarkdown from "./ActionMarkdown";
import Feed from "./Feed";
import socket from '../../../../socket';
import ActionForm from '../../Forms/ActionForm';
import { useSelector } from 'react-redux';
import ActionDifficulty from './ActionDifficulty';

const Action = (props) => {
  const {action, toggleAssetInfo, toggleEdit, hidebuttons, editAction, handleEditSubmit} = props;
  const control = useSelector(state => state.auth.control);

    function getBorder() {
        const isUnpublishedAgenda = (action.tags.some((tag) => tag !== 'Published') || !action.tags.length > 0) && action.type === 'Agenda';
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
                        padding: '15px',
                        marginTop: '1rem',
                    }}
                >
                    <ActionHeader
                        action={action}
                        time={getTime(action.submission.createdAt)}
                        toggleEdit={toggleEdit}
                        creator={action.creator}
                        {...props}
                        handleDelete={handleDelete}
                    />
                    <Box>
                      {/* <ActionTag
                          tags={action.tags}
                          actionId={action._id}
                      /> */}
                        {/* {!hidebuttons && <ActionButtons
                            action={action}
                            toggleEdit={toggleEdit}
                            creator={action.creator}
                            handleDelete={handleDelete}
                        />} */}
                        {editAction && !editAction.show && <Box>
                            <ActionMarkdown
                                header='Description'
                                tooltip='A description of what your character is doing in this action and how you will use your assigned Assets to accomplish this.'
                                markdown={action.submission.description}
                            />
                            <ActionMarkdown
                                tooltip='An out of character explanation of what you, the player, want to happen as a result.'
                                header='Intent'
                                markdown={action.submission.intent}
                            />
                            {/* <ActionEffort 
                                submission={action.submission}
                            /> */}
                            {(action.submission.difficulty > 0 || control) && <ActionDifficulty action={action} submission={action.submission}/>}


                            <ActionResources
                                assets={action.submission.assets}
                                toggleAssetInfo={toggleAssetInfo}
                            />
                        </Box>}
                        {editAction && editAction.show && <ActionForm 
                          actionID={action._id} 
                          collabMode 
                          defaultValue={{ ...action.submission, name: action.name }} 
                          actionType={action.type} 
                          handleSubmit={(data) =>handleEditSubmit(data)} 
                          closeNew={() => toggleEdit()} />}
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
