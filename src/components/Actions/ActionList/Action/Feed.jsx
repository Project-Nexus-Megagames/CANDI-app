import { Box, Button, ButtonGroup, Center, Divider, Flex, IconButton, Spacer } from "@chakra-ui/react";
import React from "react";
import WordDivider from "../../../WordDivider";
import NewResult from "../../Modals/NewResult";
import NewComment from "../../Modals/NewComment";
import NewEffects from "../../Modals/NewEffect";
import { useSelector } from "react-redux";
import usePermissions from "../../../../hooks/usePermissions";
import ActionSubObject from "./ActionSubobject";
import { PlusSquareIcon } from "@chakra-ui/icons";

function Feed({action}) {
    const gamestate = useSelector(state => state.gamestate);
    const myCharacter = useSelector(state => state.auth.myCharacter);
    const {isControl} = usePermissions();

    const [mode, setMode] = React.useState(false);

    const list = [...action.results,
        ...action.effects,
        ...action.comments
    ].sort((a, b) => {
      let da = new Date(a.createdAt),
        db = new Date(b.createdAt);
      return db - da;
    })

    const closeIt = () => {
        setMode(false);
    };

    return (
        <Box
            marginTop={'1rem'}
        >
            <WordDivider word={'Feed'}/>
            {list.map((item) => 
              <div key={item._id}>
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
                            <Button
                                disabled={myCharacter.effort.find(el => el.type === 'Agenda').amount <= 0}
                                onClick={() => setMode('support')}
                                colorScheme='green'
                            >
                                Support
                            </Button>
                        }
                        <Button
                            onClick={() => setMode('comment')}
                            colorScheme="cyan"
                        >
                            Comment
                        </Button>
                        {isControl && (
                            <Button
                                onClick={() => setMode('result')}
                                colorScheme="blue"
                            >
                                Result
                            </Button>
                        )}
                        {isControl && (
                            <Button
                                onClick={() => setMode('effect')}
                                colorScheme="purple"
                            >
                                Effect
                            </Button>
                        )}
                    </ButtonGroup>
                )}
              <Spacer />
            </Flex>

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