import { Box, Button, ButtonGroup, Center, Divider, Flex, IconButton, Spacer } from "@chakra-ui/react";
import React from "react";
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

function Feed({action}) {
    const gamestate = useSelector(state => state.gamestate);
    const facilities = useSelector(state => state.facilities.list);
    const myCharacter = useSelector(state => state.auth.myCharacter);
    const {isControl} = usePermissions();

    const [mode, setMode] = React.useState(false);

    const list = [...action.results,
        ...action.effects,
        ...action.comments, 
        ...action.ice, 
        ...action.contracts, 
    ].sort((a, b) => {
      let da = new Date(a.createdAt),
        db = new Date(b.createdAt);
      return db - da;
    })

    const closeIt = () => {
        setMode(false);
    };

    const handleCreate = (data) => {
      console.log(data)
      socket.emit('request', { route: 'action', action: 'addContract', data:  { ...data, id: action._id }})
    }

    return (
        <Box
            marginTop={'1rem'}
        >
            <WordDivider word={'Feed'}/>
            {list.map((item) => 
              <div key={item._id}>
                <Center height='20px'>
                  <Divider orientation='vertical' style={{ color: 'red', margin: '100px' }} />
                </Center>
                <ActionSubObject action={action} subObject={item} />
              </div>              
            )}
            
            <Center justify="center" style={{transition: '3s ease', marginBottom: '30px', marginTop: '0.5rem',  }}>
              <Spacer />
                {!mode && (
                    <IconButton
                        variant={'outline'}
                        onClick={() => setMode('add')}
                        colorScheme="blue"
                        icon={<PlusSquareIcon icon="plus"/>}
                    ></IconButton>
                )}
                {mode === 'add' && (
                    <Center                       
                        style={{width: '100%',}}
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
                                onClick={() => setMode('contract')}
                                colorScheme="green"
                            >
                                Contract
                            </Button>
                        )}
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
                                onClick={() => socket.emit('request', { route: 'action', action: 'ice', data: { id: action._id} })}
                                colorScheme="red"
                            >
                                Get Random Ice
                            </Button>
                        )}
                        {isControl && (
                          <Button
                            variant={'solid'}
                            onClick={() => setMode('getIce')}
                              colorScheme="yellow"
                          >
                              Get Specific Ice
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

            <NewResult
              show={mode === 'result'}
              mode={mode}
              closeNew={() => closeIt()}
              selected={action}
            />
            

            <CandiModal open={mode==='contract'} onClose={() => closeIt() }  >
              <NewContractForm statusDefault={["action"]} onClose={() => closeIt() } handleCreate={handleCreate} />
            </CandiModal>

            <CandiModal open={mode==='getIce'} onClose={() => closeIt() }  >
              {action.submission.facility && <Server server={ facilities.find(el => el._id === action.submission.facility)} />}
            </CandiModal>


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