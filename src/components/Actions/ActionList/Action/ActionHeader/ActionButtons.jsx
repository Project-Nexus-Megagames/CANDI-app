import React from "react";
import usePermissions from "../../../../../hooks/usePermissions";
import { useSelector } from "react-redux";
import { Box, Button, ButtonGroup, Icon, IconButton, Tooltip, useBreakpointValue } from "@chakra-ui/react";
import { HiPencilAlt, HiSave, HiTrash } from 'react-icons/hi';
import socket from "../../../../../socket";
import { CandiWarning } from "../../../../Common/CandiWarning";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { CloseIcon } from "@chakra-ui/icons";

function ActionButtons({ action, toggleEdit, handleEdit, creator, handleDelete, edit}) {
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
                    {!edit && <IconButton
                        disabled={isDisabled}
                        size="sm"
                        onClick={(e) => {
                            toggleEdit(action)
                            e.stopPropagation();
                        }}
                        colorScheme="orange"
                        variant={'solid'}
                        icon={<Icon as={HiPencilAlt}/>}
                        marginTop='0.25rem'
                        aria-label={'Edit Action'}
                    />}
                    {edit && <Button
                        disabled={isDisabled}
                        size="sm"
                        onClick={(e) => {
                          handleEdit(false, 'submit')
                            e.stopPropagation();
                        }}
                        colorScheme="green"
                        variant={'solid'}
                        leftIcon={<Icon as={HiSave}/>}
                        marginTop='0.25rem'
                        aria-label={'Edit Action'}

                    >Submit</Button>}
                    {!edit && <IconButton
                        disabled={isDisabled || edit}
                        size="sm"
                        onClick={(e) => {
                            setMode("confirm");
                            e.stopPropagation();
                        }}
                        backgroundColor="red"
                        variant={'solid'}
                        icon={<Icon as={HiTrash}/>}
                        marginTop='0.25rem'
                        aria-label={'Delete Action'}
                    />}
                    {edit && 
                      <Tooltip
                        label='Cancel'
                        aria-label='Cancel tooltip'
                      >
                        <Button
                          size="sm"
                          onClick={(e) => {
                            toggleEdit(action)
                            e.stopPropagation();
                          }}
                          backgroundColor="red"
                          variant={'solid'}
                          rightIcon={<Icon as={CloseIcon}/>}
                          marginTop='0.25rem'
                          aria-label={'Delete Action'}
                        >Cancel</Button>                        
                      </Tooltip>}
                </ButtonGroup>
            )}
        <CandiWarning open={mode === "confirm"} title={"You sure about that?"} onClose={() => setMode(false)} handleAccept={() => { handleDelete(); setMode(false); }}>
          Are ya sure?
        </CandiWarning>
        </Box>
    );
}

export default ActionButtons;