import React from "react";
import { AccordionButton, AccordionIcon, Avatar, Box, Heading, Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import usePermissions from "../../../../hooks/usePermissions";
import socket from "../../../../socket";

function ActionHeader({action, time}) {
    const isControl = usePermissions();

    const handleTagRemove = (tag) => {
        const nextTags = action.tags.filter((item) => item !== tag);
        const data = {
            id: action._id,
            tags: nextTags
        };
        socket.emit('request', {route: 'action', action: 'update', data});
    };

    //TODO: render tag add logic
    const renderTagAdd = () => {
    };

    function renderTags() {
        let tags;

        if (isControl) {
            //TODO: render tag display here
            if (action.tags.length === 0) {
                tags = <b>No Tags</b>
            } else {
                tags = action.tags.map((item, index) => (
                    <Tag
                        key={index}
                    >
                        <TagLabel>{item}</TagLabel>
                        <TagCloseButton onClick={() => handleTagRemove(item, 'tags')}/>
                    </Tag>
                ))
            }
        }

        return tags;
    }

    const creator = action.creator;
    return (
        <h5>
            <AccordionButton>
                <Avatar
                    name={creator.characterName}
                    src={creator.profilePicture}
                />
                <Box
                    alignItems={"center"}
                    width="100%"
                >
                    <Heading
                        as="h5"
                    >
                        {action.name}
                    </Heading>
                    <div>{creator.playerName} - {creator.characterName}</div>
                    <div>{time}</div>
                    <div>{renderTags()}</div>
                </Box>
                <AccordionIcon/>
            </AccordionButton>
        </h5>
    );
}

export default ActionHeader;