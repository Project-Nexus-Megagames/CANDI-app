import React from 'react';
import { Accordion, AccordionItem, AccordionPanel, Box, Flex } from "@chakra-ui/react";
import { getFadedColor } from "../../../../scripts/frontend";
import ActionHeader from "./ActionHeader";
import ActionResources from "./ActionResources";
import ActionMarkdown from "./ActionMarkdown";
import ActionEffort from "./ActionEffort";

const Action = (props) => {
    function getBorder() {
        const isUnpublishedAgenda = (props.action.tags.some((tag) => tag !== 'Published') || !props.action.tags.length > 0) && props.action.type === 'Agenda';
        return isUnpublishedAgenda
            ? `4px dotted ${getFadedColor(props.action.type)}`
            : `4px solid ${getFadedColor(props.action.type)}`;
    }

    const getTime = (date) => {
        const day = new Date(date).toDateString();
        const time = new Date(date).toLocaleTimeString();
        return `${day} - ${time}`;
    };


    return (
        <Flex
            style={{
                height: '100%',
                justifyContent: 'center',
                width: '100%',
            }}
        >
            <Box
                alignItems='middle'
                justifyContent="space-around"
                width='100%'
            >
                <Accordion
                    defaultIndex={[0]}
                    allowMultiple
                    allowToggle
                >
                    <AccordionItem
                        style={{
                            border: getBorder(),
                            borderRadius: '5px',
                            padding: '15px',
                            marginTop: '5rem',
                        }}
                    >
                        <ActionHeader
                            action={props.action}
                            time={getTime(props.action.submission.createdAt)}
                        />
                        <AccordionPanel>
                            <ActionMarkdown
                                header='Description'
                                markdown={props.action.submission.description}
                            />
                            <ActionMarkdown
                                tooltip='An out of character explanation of what you, the player, want to happen as a result.'
                                header='Intent'
                                markdown={props.action.submission.intent}
                            />
                            <ActionEffort
                                submission={props.action.submission}
                            />
                            <ActionResources
                                assets={props.action.submission.assets}
                            />
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Box>
        </Flex>
    );
};

export default Action;
