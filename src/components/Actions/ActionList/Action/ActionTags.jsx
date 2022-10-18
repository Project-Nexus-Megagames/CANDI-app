//TODO: render tag add logic
import { Tag, TagCloseButton, TagLabel } from "@chakra-ui/react";
import React from "react";
import usePermissions from "../../../../hooks/usePermissions";
import socket from "../../../../socket";

function ActionTags({actionId, tags}) {
    const {isControl} = usePermissions();

    const handleTagRemove = (tag) => {
        const nextTags = tags.filter((item) => item !== tag);
        const data = {
            id: actionId,
            tags: nextTags
        };
        socket.emit('request', {route: 'action', action: 'update', data});
    };

    const renderTagAdd = () => {
    };

    let display;

    if (isControl) {
        //TODO: render tag display here
        if (tags.length === 0) {
            display = <b>No Tags</b>
        } else {
            display = tags.map((item, index) => (
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
        <div>{display}</div>
    );
}

export default ActionTags;