/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/jsx-max-props-per-line */
import React from 'react';
import { Modal, Button, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Spinner, Switch, ButtonGroup, IconButton, } from '@chakra-ui/react'
import socket from '../../../socket';
import { useDispatch, useSelector } from 'react-redux';
import { getMyCharacter } from '../../../redux/entities/characters';
import { playerActionsRequested } from '../../../redux/entities/playerActions';
import { getFadedColor } from '../../../scripts/frontend';
import { FaBold, FaEye, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import ActionMarkdown from '../ActionList/Action/ActionMarkdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import MDEditor from '@uiw/react-md-editor';


const NewComment = (props) => {
  const { comment, mode } = props;
  const reduxAction = useDispatch();
  const { myCharacter, control } = useSelector(s => s.auth);
  const [body, setBody] = React.useState(props.comment?.body || props.comment?.description || '');
  const [isPrivate, setIsPrivate] = React.useState(false);
  const [preview, setPreview] = React.useState(false);

  const handleSubmit = async () => {
    reduxAction(playerActionsRequested());
    // 1) make a new action
    const data = {
      id: props.selected._id,
      comment: {
        body,
        status: isPrivate ? 'Private' : 'Public',
        commentor: myCharacter._id,
        _id: comment?._id
      },
    };
    socket.emit('request', { route: 'action', action: mode, data });
    props.closeNew();
  };

  const textStyle = {
    backgroundColor: '#1a1d24',
    border: '1.5px solid #3c3f43',
    borderRadius: '5px',
    width: '100%',
    padding: '5px',
    overflow: 'auto',
    scrollbarWidth: 'none'
  };

  function replaceSubstring(original, replacement, startIndex, endIndex) {
    // Ensure startIndex and endIndex are within the bounds of the original string
    if (startIndex < 0 || startIndex >= original.length || endIndex < 0 || endIndex > original.length) {
      throw new Error("startIndex or endIndex is out of bounds");
    }

    // Ensure startIndex is less than endIndex
    if (startIndex >= endIndex) {
      throw new Error("startIndex must be less than endIndex");
    }

    // Perform the replacement
    const modifiedString = original.slice(0, startIndex) + replacement + original.slice(endIndex, original.length);

    return modifiedString;
  }

  function insertMarkdown(type) {
    const activeEl = document.getElementById("sel");
    let text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd).trim();

    switch (type) {
      case 'bold':
        setBody(replaceSubstring(body, `**${text}** `, activeEl.selectionStart, activeEl.selectionEnd));
        return;
      case 'italic':
        setBody(replaceSubstring(body, `*${text}* `, activeEl.selectionStart, activeEl.selectionEnd));
        return;
      case 'strike':
        setBody(replaceSubstring(body, `~~${text}~~ `, activeEl.selectionStart, activeEl.selectionEnd));
        return;
      default: console.log("Oops")
    }

  }

  return (
    <div
      style={{
        border: `3px solid ${getFadedColor('Comment')}`,
        borderRadius: '0px 0px 5px 5px',
        padding: '5px',
        width: '100%'
      }}>
      <form>
        {control && (
          <Switch defaultChecked={isPrivate} onChange={() => setIsPrivate(!isPrivate)} >
            {isPrivate ? "Hidden" : "Revealed"}
          </Switch>
        )}

        <MDEditor
          height="100%"
          value={body}
          preview="edit"
          onChange={setBody} />

      </form>

      <Button colorScheme={'green'} onClick={() => (handleSubmit())} disabled={body.length < 11} variant="solid">
        {body.length < 11 ? <b>Text needs {11 - body.length} more characters</b> : <b>Submit</b>}
      </Button>
      <Button onClick={() => props.closeNew()} variant="subtle">
        Cancel
      </Button>
    </div>
  );
}

export default (NewComment);