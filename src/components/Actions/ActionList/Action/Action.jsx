import React from 'react';
import { AccordionItem, AccordionPanel, Box, Flex } from "@chakra-ui/react";
import { getFadedColor } from "../../../../scripts/frontend";
import ActionHeader from "./ActionHeader/ActionHeader";
import ActionResources from "./ActionResources";
import ActionMarkdown from "./ActionMarkdown";
import ActionEffort from "./ActionEffort";
import Feed from "./Feed";

const Action = ({action, toggleAssetInfo, toggleEdit}) => {
    function getBorder() {
        const isUnpublishedAgenda = (action.tags.some((tag) => tag !== 'Published') || !action.tags.length > 0) && action.type === 'Agenda';
        return isUnpublishedAgenda
            ? `4px dotted ${getFadedColor(action.type)}`
            : `4px solid ${getFadedColor(action.type)}`;
    }

    const getTime = (date) => {
        const day = new Date(date).toDateString();
        const time = new Date(date).toLocaleTimeString();
        return `${day} - ${time}`;
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
                        <Box>
                            <ActionMarkdown
                                header='Description'
                                markdown={action.submission.description}
                            />
                            <ActionMarkdown
                                tooltip='An out of character explanation of what you, the player, want to happen as a result.'
                                header='Intent'
                                markdown={action.submission.intent}
                            />
                            <ActionEffort
                                submission={action.submission}
                            />
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
