import React from "react";
import usePermissions from "../../../../../hooks/usePermissions";
import { useSelector } from "react-redux";
import { Box, Button, ButtonGroup, Icon, IconButton, Tooltip, useBreakpointValue } from "@chakra-ui/react";
import { HiPencilAlt, HiSave, HiTrash, HiSpeakerphone } from 'react-icons/hi';
import socket from "../../../../../socket";
import { CandiWarning } from "../../../../Common/CandiWarning";
import { IoChevronBackCircleOutline } from "react-icons/io5";
import { ArrowLeftIcon, CloseIcon } from "@chakra-ui/icons";

function ActionButtons({ action, toggleEdit, closeAction, creator, handleDelete, edit }) {
  const [mode, setMode] = React.useState(false);

  const { isControl, characterId } = usePermissions();
  const game = useSelector(state => state.gamestate);
  const buttonDirection = useBreakpointValue({ base: 'column', md: 'row' });
  const buttonSpacing = useBreakpointValue({ base: 0, md: '0.5rem' });

  const isAccessible = characterId === creator._id || isControl;
  const isDisabled = (game.status !== 'Active' || game.round > action.round) && !isControl;
  const isUnpublishedAgenda = (!action.tags?.some((tag) => tag.toLowerCase() === 'published') && action.tags?.some((tag) => tag.toLowerCase() === 'public'));

  const handlePublish = async () => {
    const id = action._id;
    socket.emit('request', { route: 'action', action: 'publish', id });
  };

  return (
    <Box>
      {isAccessible && (
        <ButtonGroup
          flexDir={buttonDirection}
          spacing={buttonSpacing}
          isAttached
        >
          {closeAction &&
            <Tooltip
              label='Cancel'
              aria-label='Cancel tooltip'
            >
              <Button
                size="sm"
                onClick={(e) => {
                  closeAction(action)
                  e.stopPropagation();
                }}
                backgroundColor="teal"
                variant={'solid'}
                leftIcon={<Icon as={ArrowLeftIcon} />}
                marginTop='0.25rem'
                aria-label={'Close Action'}
              >Back</Button>
            </Tooltip>}

          {isUnpublishedAgenda && (
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
                icon={<Icon as={HiSpeakerphone} />}
                marginTop='0.25rem'
                aria-label={'Publish Action'}
              />
            </Tooltip>
          )}
          {!edit && <IconButton
            isDisabled={isDisabled}
            size="sm"
            onClick={(e) => {
              toggleEdit(action)
              e.stopPropagation();
            }}
            colorScheme="orange"
            variant={'solid'}
            icon={<Icon as={HiPencilAlt} />}
            marginTop='0.25rem'
            aria-label={'Edit Action'}
          />}
          {/* {edit && <Button
            isDisabled={isDisabled}
            size="sm"
            onClick={(e) => {
              handleEdit(false, 'submit')
              e.stopPropagation();
            }}
            colorScheme="green"
            variant={'solid'}
            leftIcon={<Icon as={HiSave} />}
            marginTop='0.25rem'
            aria-label={'Edit Action'}

          >Submit</Button>} */}
          {!edit && <IconButton
            isDisabled={isDisabled || edit || (action.tags?.includes('Published') && !isControl)}
            size="sm"
            onClick={(e) => {
              setMode("confirm");
              e.stopPropagation();
            }}
            backgroundColor="red"
            variant={'solid'}
            icon={<Icon as={HiTrash} />}
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
                rightIcon={<Icon as={CloseIcon} />}
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