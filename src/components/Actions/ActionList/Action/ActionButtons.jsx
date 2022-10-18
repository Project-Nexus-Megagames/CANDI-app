import React from "react";
import usePermissions from "../../../../hooks/usePermissions";
import { useSelector } from "react-redux";
import { Box, ButtonGroup, Icon, IconButton, Tooltip, useBreakpointValue } from "@chakra-ui/react";
import { HiPencilAlt, HiTrash } from 'react-icons/hi';

function ActionButtons({action}) {
    const {isControl, characterId} = usePermissions();
    const game = useSelector(state => state.gamestate);
    const buttonDirection = useBreakpointValue({base: 'column', md: 'row'});
    const buttonSpacing = useBreakpointValue({base: 0, md: '0.5rem'});

    const isAccessible = characterId === action.creator._id || isControl;
    const isDisabled = (game.status !== 'Active' || game.round > action.round) && !isControl;
    const isPublishable = (action.tags.some((tag) => tag !== 'Published') || !action.tags.length > 0)
        && action.type === 'Agenda';

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
                                // onClick={() => handlePublish()}
                                backgroundColor="green"
                                icon={<Icon as={HiPencilAlt}/>}
                                marginTop='0.25rem'
                            />
                        </Tooltip>
                    )}
                    <IconButton
                        disabled={isDisabled}
                        size="md"
                        // onClick={() => setShow('edit')}
                        backgroundColor="orange"
                        icon={<Icon as={HiPencilAlt}/>}
                        marginTop='0.25rem'
                    />
                    <IconButton
                        disabled={isDisabled}
                        size="md"
                        // onClick={() => setShow('delete')}
                        backgroundColor="red"
                        icon={<Icon as={HiTrash}/>}
                        marginTop='0.25rem'
                    />
                </ButtonGroup>
            )}
        </Box>
    );
}

export default ActionButtons;