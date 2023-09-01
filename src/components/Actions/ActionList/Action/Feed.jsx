import { Box, Button, ButtonGroup, Center, Divider, Flex, IconButton, Spacer, StatDownArrow } from "@chakra-ui/react";
import React from "react";
import WordDivider from "../../../WordDivider";
import NewResult from "../../Modals/NewResult";
import NewComment from "../../Modals/NewComment";
import NewEffects from "../../Modals/NewEffect";
import { useSelector } from "react-redux";
import usePermissions from "../../../../hooks/usePermissions";
import ActionSubObject from "./ActionSubobject";
import { PlusSquareIcon } from "@chakra-ui/icons";
import ActionForm from "../../Forms/ActionForm";
import socket from "../../../../socket";

function Feed({action}) {
    const gamestate = useSelector(state => state.gamestate);
    const myCharacter = useSelector(state => state.auth.myCharacter);
    const {isControl} = usePermissions();
    const isCollaborator = action.collaborators.some(el => el._id === myCharacter._id)

    const [mode, setMode] = React.useState(false);

    let list = [...action.results,
        ...action.effects,
        ...action.comments,
        ...action.submissions
    ].sort((a, b) => {
      let da = new Date(a.createdAt),
        db = new Date(b.createdAt);
      return db + da;
    })

    if (!isControl) {
      list = list.filter(el => el.status === 'Public' || el.commentor?._id === myCharacter._id || el.creator?._id === myCharacter._id)
    }

    const closeIt = () => {
        setMode(false);
    };

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
        action: action._id
      };

      socket.emit('request', { route: 'action', action: 'collab', data });
    };
    return (
        <Box
            marginTop={'1rem'}
        >
            <WordDivider word={
              <div>
                {list.length > 0 && <Button 
                leftIcon={<StatDownArrow />}
                rightIcon={<StatDownArrow />}
                variant='ghost'
                onClick={() => 
                {
                  const element = document.getElementById(list[list.length - 1]._id);
                  element.scrollTop = element.scrollIntoView(true);
                }
              } >Feed</Button>}
              </div>
            }/>
            {list.map((item) => 
              <div autoFocus key={item._id} id={item._id}>
                <Center height='20px'>
                  <Divider orientation='vertical' />
                </Center>
                <ActionSubObject action={action} subObject={item} />
              </div>              
            )}
            
            <Flex style={{transition: '3s ease', marginBottom: '30px', marginTop: '0.5rem'}}>
              <Spacer />
                {!mode && (
                    <IconButton
                      variant={'solid'}
                        onClick={() => setMode('add')}
                        colorScheme="blue"
                        icon={<PlusSquareIcon icon="plus"/>}
                    ></IconButton>
                )}
                {mode === 'add' && (
                    <ButtonGroup isAttached                       
                        style={{width: '100%', transition: '.5s'}}
                    >
                        {action && action.type === 'Agenda' &&
                            <Button variant={'solid'}
                                disabled={myCharacter.effort.find(el => el.type === 'Agenda').amount <= 0}
                                onClick={() => setMode('support')}
                                colorScheme='green'
                            >
                                Support
                            </Button>
                        }
                        <Button variant={'solid'}
                            onClick={() => setMode('comment')}
                            colorScheme="cyan"
                        >
                            Comment
                        </Button>
                        {isControl && (
                            <Button variant={'solid'}
                                onClick={() => setMode('result')}
                                colorScheme="blue"
                            >
                                Result
                            </Button>
                        )}
                        {isControl && (
                            <Button variant={'solid'}
                                onClick={() => setMode('effect')}
                                colorScheme="purple"
                            >
                                Effect
                            </Button>
                        )}

                        {isCollaborator && (
                            <Button variant={'solid'}
                                onClick={() => setMode('collab')}
                                colorScheme="pink"
                            >
                                Collaborate
                            </Button>
                        )}
                    </ButtonGroup>
                )}
              <Spacer />
            </Flex>

            {mode === 'collab' && <ActionForm handleSubmit={handleSubmit} actionType={action.type} collabMode closeNew={() => closeIt()} />}

            <NewResult
              show={mode === 'result'}
              mode={mode}
              closeNew={() => closeIt()}
              selected={action}
            />

            <NewComment
                show={mode === 'comment'}
                closeNew={() => closeIt()}
                gamestate={gamestate}
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