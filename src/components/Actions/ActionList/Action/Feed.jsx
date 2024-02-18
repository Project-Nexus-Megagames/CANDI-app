import { Box, Button, ButtonGroup, Center, Divider, Flex, IconButton, Spacer, StatDownArrow, Wrap, WrapItem } from "@chakra-ui/react";
import React, { useEffect } from "react";
import WordDivider from "../../../Common/WordDivider";
import NewResult from "../../Modals/NewResult";
import NewComment from "../../Modals/NewComment";
import NewEffects from "../../Modals/NewEffect";
import { useSelector } from "react-redux";
import usePermissions from "../../../../hooks/usePermissions";
import ActionSubObject from "./ActionSubobject";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { CandiModal } from "../../../Common/CandiModal";
import NewContractForm from "../../../Common/NewContractForm";
import socket from "../../../../socket";
import Server from "../../../Team/Server";
import ActionForm from "../../Forms/ActionForm";
import { getIce } from "../../../../redux/entities/blueprints";
import Ice from "../../../Team/Ice";
import { ActionIce } from "./ActionIce";
import IceForm from "../../../Common/IceForm";

function Feed({ action }) {
  const gamestate = useSelector(state => state.gamestate);
  const facilities = useSelector(state => state.facilities.list);
  const myCharacter = useSelector(state => state.auth.myCharacter);
  const iceBlueprints = useSelector(getIce);
  const { isControl } = usePermissions();
  const isCollaborator = action.collaborators.some(el => el._id === myCharacter._id)
  const roundActive = gamestate.status === 'Active';

  const [mode, setMode] = React.useState(false);
  const [feed, setFeed] = React.useState([]);

  useEffect(() => {
    let list = [];
    for (const comment of action.comments) {
      sortThisIn(comment, list)
    }

    for (const comment of action.results) {
      sortThisIn(comment, list)
    }

    for (const comment of action.effects) {
      sortThisIn(comment, list)
    }


    for (const comment of action.submissions) {
      sortThisIn(comment, list)
    }

    for (const ice of action.ice) {
      sortThisIn(ice, list)
    }

    for (const contract of action.contracts) {
      sortThisIn(contract, list)
    }

    // if (!isControl) {
    //   list = list.filter(el => (el.status && el.status === 'Public') || el.commentor?._id === myCharacter._id || el.creator?._id === myCharacter._id)
    // }

    setFeed(list)
  }, [action.comments, action.results, action.effects, action.submissions,]);

  function sortThisIn(incoming, targetArray) {
    let index = 0
    for (const item of targetArray) {
      if (item.createdAt > incoming.createdAt) {
        break;
      }
      index++;
    }
    targetArray.splice(index, 0, incoming);
    return;
  }

  const closeIt = () => {
    setMode(false);
  };

  const handleCreate = (data) => {
    socket.emit('request', { route: 'action', action: 'addContract', data: { ...data, id: action._id } })
  }

  const handleSubmit = async (incoming) => {
    const { effort, assets, description, intent, name, type, creator, numberOfInjuries, collaborators } = incoming;
    const data = {
      name,
      type,
      effort: effort,
      assets,
      description: description,
      intent: intent,
      creator,
      action: action
    };
    socket.emit('request', { route: 'action', action: 'collab', data });
  };

  return (
    <Box
      marginTop={'1rem'}
    >
      <WordDivider word={
        <div>
          {feed.length > 0 && <Button
            leftIcon={<StatDownArrow />}
            rightIcon={<StatDownArrow />}
            variant='ghost'
            onClick={() => {
              const element = document.getElementById(feed[feed.length - 1]._id);
              element.scrollTop = element.scrollIntoView(true);
            }
            } >Feed</Button>}
        </div>
      } />


      {feed.map((item) =>
        <div key={item._id} id={item._id}>
          <Center height='20px'>
            <Divider orientation='vertical' style={{ color: 'red', margin: '100px' }} />
          </Center>
          <ActionSubObject action={action} subObject={item} />
        </div>
      )}

      <Center justify="center" style={{ transition: '3s ease', marginBottom: '30px', marginTop: '0.5rem', }}>
        <Spacer />
        {!mode && (
          <IconButton
            variant={'outline'}
            onClick={() => setMode('add')}
            colorScheme="blue"
            icon={<PlusSquareIcon icon="plus" />}
          ></IconButton>
        )}
        {mode === 'add' && (
          <Center
            style={{ width: '100%', }}
          >
            <Button
              variant={'solid'}
              onClick={() => setMode('comment')}
              colorScheme="cyan"
            >
              Comment
            </Button>
            {isControl && (
              <Button
                variant={'solid'}
                onClick={() => setMode('result')}
                colorScheme="blue"
              >
                Result
              </Button>
            )}
            {isControl && (
              <Button
                variant={'solid'}
                onClick={() => setMode('effect')}
                colorScheme="purple"
              >
                Effect
              </Button>
            )}
            {isControl && (
              <Button
                variant={'solid'}
                onClick={() => setMode('contract')}
                colorScheme="green"
              >
                Contract
              </Button>
            )}
            {/* {isControl && (
                            <Button
                              variant={'solid'}
                                onClick={() => socket.emit('request', { route: 'action', action: 'ice', data: { id: action._id} })}
                                colorScheme="red"
                            >
                                Get Random Ice
                            </Button>
                        )} */}
            {isControl && (
              <Button
                variant={'solid'}
                onClick={() => setMode('getIce')}
                colorScheme="yellow"
              >
                Challenge
              </Button>
            )}
            {isCollaborator && (
              <Button variant={'solid'}
                onClick={() => setMode('collab')}
                colorScheme="pink"
                isDisabled={!roundActive && !isControl}
              >
                Collaborate
              </Button>
            )}
            <Button
              variant={'outline'}
              onClick={() => setMode(false)}
              colorScheme="black"
            >
              Cancel
            </Button>
          </Center>
        )}
        <Spacer />
      </Center>

      {mode === 'collab' && <ActionForm header="Submit new collab on Action" handleSubmit={handleSubmit} actionType={action.type} collabMode closeNew={() => closeIt()} />}

      <NewResult
        show={mode === 'result'}
        mode={mode}
        closeNew={() => closeIt()}
        selected={action}
      />

      <CandiModal open={mode === 'contract'} onClose={() => closeIt()}  >
        <NewContractForm statusDefault={["action"]} onClose={() => closeIt()} handleCreate={handleCreate} />
      </CandiModal>

      <CandiModal open={mode === 'getIce'} onClose={() => closeIt()}  >
        <IceForm mode={mode} action={action} />
      </CandiModal>


      <NewComment
        show={mode === 'comment'}
        closeNew={() => closeIt()}
        gamestate={gamestate}
        mode={mode}
        selected={action}
      />

      {action && action.creator &&
        <NewEffects
          show={mode === 'effect'}
          action={action}
          selected={action}
          hide={() => closeIt()}
        />
      }
    </Box>
  )
}

export default Feed;