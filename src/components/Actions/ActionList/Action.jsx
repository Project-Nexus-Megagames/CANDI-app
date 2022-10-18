import React from 'react';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Avatar,
    Box,
    Flex,
    Heading,
    Tag,
    TagCloseButton,
    TagLabel
} from "@chakra-ui/react";
import { getFadedColor } from "../../../scripts/frontend";
import socket from "../../../socket";
import usePermissions from "../../../hooks/usePermissions";

const Action = (props) => {
    const isControl = usePermissions();

    console.log('props.action', props.action);

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

    const handleTagRemove = (tag) => {
        const nextTags = props.action.tags.filter((item) => item !== tag);
        const data = {
            id: props.action._id,
            tags: nextTags
        };
        socket.emit('request', {route: 'action', action: 'update', data});
    };

    //TODO: render tag add logic
    const renderTagAdd = () => {
    };

    if (isControl) {
        //TODO: render tag display here
        if (props.action.tags.length === 0) {
            let tags = <b>No Tags</b>
        } else {
            let tags = props.action.tags.map((item, index) => (
                <Tag
                    key={index}
                >
                    <TagLabel>{item}</TagLabel>
                    <TagCloseButton onClick={() => handleTagRemove(item, 'tags')}/>
                </Tag>
            ))
        }
    }

    return (
        <Flex
            style={{
                overflow: 'auto',
                height: '100%',
                justifyContent: 'center',
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
                        <h5>
                            <AccordionButton>
                                <Avatar
                                    name={props.action.creator.characterName}
                                    src={props.action.creator.profilePicture}
                                />
                                <Box
                                    alignItems={'center'}
                                    width='100%'
                                >
                                    <Heading
                                        as='h5'
                                    >
                                        {props.action.name}
                                    </Heading>
                                    <div>{props.action.creator.playerName} - {props.action.creator.characterName}</div>
                                    <div>{getTime(props.action.submission.createdAt)}</div>
                                </Box>
                                <AccordionIcon/>
                            </AccordionButton>
                        </h5>
                        <AccordionPanel>
                            Foobar
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
            </Box>
        </Flex>
    );
};

export default Action;
