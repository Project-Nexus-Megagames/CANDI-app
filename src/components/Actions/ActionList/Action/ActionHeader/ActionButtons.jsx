import React from "react";
import usePermissions from "../../../../../hooks/usePermissions";
import { useSelector } from "react-redux";
import { Box, ButtonGroup, Icon, IconButton, Tooltip, useBreakpointValue } from "@chakra-ui/react";
import { HiPencilAlt, HiTrash } from 'react-icons/hi';
import socket from "../../../../../socket";
import { CandiWarning } from "../../../../Common/CandiWarning";

function ActionButtons({action, toggleEdit, creator, handleDelete}) {
	const [mode, setMode] = React.useState(false);

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

    return (
        <Box>
            {isAccessible && (
                <ButtonGroup
                    flexDir={buttonDirection}
                    spacing={buttonSpacing}
                    isAttached
                >
                    {isPublishable && (
                        <Tooltip
                            label='Publish'
                            aria-label='Publish tooltip'
                        >
                            <IconButton
                                disabled={isDisabled}
                                size="sm"
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
                        size="sm"
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
                        size="sm"
                        onClick={(e) => {
                            setMode("confirm");
                            e.stopPropagation();
                        }}
                        backgroundColor="red"
                        icon={<Icon as={HiTrash}/>}
                        marginTop='0.25rem'
                        aria-label={'Delete Action'}
                    />
                </ButtonGroup>
            )}
        <CandiWarning open={mode === "confirm"} title={"You sure about that?"} onClose={() => setMode(false)} handleAccept={() => { handleDelete(); setMode(false); }}>
          Are ya sure?
        </CandiWarning>
        </Box>
    );
}

export default ActionButtons;