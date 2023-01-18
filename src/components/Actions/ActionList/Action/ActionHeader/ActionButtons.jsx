import React from "react";
import usePermissions from "../../../../../hooks/usePermissions";
import { useSelector } from "react-redux";
import { Box, ButtonGroup, Icon, IconButton, Tooltip, useBreakpointValue } from "@chakra-ui/react";
import { HiPencilAlt, HiTrash } from 'react-icons/hi';
import socket from "../../../../../socket";

function ActionButtons({action, toggleEdit, creator}) {
    const {isControl, characterId} = usePermissions();
    const game = useSelector(state => state.gamestate);
    const buttonDirection = useBreakpointValue({base: 'column', md: 'row'});
    const buttonSpacing = useBreakpointValue({base: 0, md: '0.5rem'});

    const isAccessible = characterId === creator._id || isControl;
    const isDisabled = (game.status !== 'Active' || game.round > action.round) && !isControl;
    const isPublishable = (action.tags?.some((tag) => tag !== 'Published') || !action.tags?.length > 0)
        && action.type === 'Agenda';

    const handlePublish = async () => {
        const id = action._id;
        socket.emit('request', {route: 'action', action: 'publish', id});
    };

    const deleteAction = async () => {
        socket.emit('request', {
            route: 'action',
            action: 'delete',
            data: {id: action._id}
        });
    };

    //TODO: add logic for modal toggling when buttons are pressed

    return (
        <Box>
            {isAccessible && (
                <ButtonGroup
                    flexDir={buttonDirection}
                    spacing={buttonSpacing}
                >
                    {isPublishable && (
                        <Tooltip
                            label='Publish'
                            aria-label='Publish tooltip'
                        >
                            <IconButton
                                disabled={isDisabled}
                                size="md"
                                onClick={(e) => {
                                    handlePublish();
                                    e.stopPropagation();
                                }}
                                backgroundColor="green"
                                icon={<Icon as={HiPencilAlt}/>}
                                marginTop='0.25rem'
                                aria-label={'Publish Action'}
                            />
                        </Tooltip>
                    )}
                    <IconButton
                        disabled={isDisabled}
                        size="md"
                        onClick={(e) => {
                            toggleEdit(action)
                            e.stopPropagation();
                        }}
                        colorScheme="orange"
                        icon={<Icon as={HiPencilAlt}/>}
                        marginTop='0.25rem'
                        aria-label={'Edit Action'}
                    />
                    <IconButton
                        disabled={isDisabled}
                        size="md"
                        onClick={(e) => {
                            deleteAction();
                            e.stopPropagation();
                        }}
                        backgroundColor="red"
                        icon={<Icon as={HiTrash}/>}
                        marginTop='0.25rem'
                        aria-label={'Delete Action'}
                    />
                </ButtonGroup>
            )}
        </Box>
    );
}

export default ActionButtons;