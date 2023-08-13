import React from 'react';
import { AccordionItem, AccordionPanel, Box, Flex, Tag } from "@chakra-ui/react";
import { getFadedColor, getTime } from "../../../../scripts/frontend";
import ActionHeader from "./ActionHeader/ActionHeader";
import ActionResources from "./ActionResources";
import ActionMarkdown from "./ActionMarkdown";
import ActionEffort from "./ActionEffort";
import Feed from "./Feed";
import ActionButtons from './ActionHeader/ActionButtons';
import socket from '../../../../socket';
import ActionTag from '../ActionTag';

const Action = ({action, toggleAssetInfo, toggleEdit, hidebuttons}) => {
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
                <AccordionItem
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
                    />
                    <AccordionPanel>
                      {/* <ActionTag
                          tags={action.tags}
                          actionId={action._id}
                      /> */}
                        {!hidebuttons && <ActionButtons
                            action={action}
                            toggleEdit={toggleEdit}
                            creator={action.creator}
                            handleDelete={handleDelete}
                        />}
                        <Box>
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
                            {/* <ActionEffort TODO update this for multi-effort games
                                submission={action.submission}
                            /> */}
                            <ActionResources
                                assets={action.submission.assets}
                                toggleAssetInfo={toggleAssetInfo}
                            />
                        </Box>
                        <Feed
                            action={action}
                        />
                    </AccordionPanel>
                </AccordionItem>
            </Box>
        </Flex>
    );
};

export default Action;
