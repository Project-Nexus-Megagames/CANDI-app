import { Box, Button, ButtonGroup, Divider, IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
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
    const myCharacter = useSelector(state => state.auth.character);
    const {isControl} = usePermissions();
    const [add, setAdd] = useState(false);
    const [support, setSupport] = useState(false);
    const [result, setResult] = useState(false);
    const [comment, setComment] = useState(false);
    const [effect, setEffect] = useState(false);

    const list = [...action.results,
        ...action.effects,
        ...action.comments
    ]

    const closeIt = () => {
        setAdd(false);
        setResult(false);
        setSupport(false);
        setComment(false);
        setEffect(false);
    };

    return (
        <Box
            marginTop={'1rem'}
        >
            <WordDivider word={'Feed'}/>
            {list.map((item, index) => 
              <ActionSubObject key={item._id} subObject={item} />
            )}
            <Divider vertical/>
            <div style={{transition: '3s ease', marginBottom: '30px', marginTop: '0.5rem'}}>
                {!add && (
                    <IconButton
                        onClick={() => setAdd(true)}
                        color="blue"
                        icon={<PlusSquareIcon icon="plus"/>}
                    ></IconButton>
                )}
                {add && (
                    <ButtonGroup
                        justified
                        style={{width: '100%', transition: '.5s'}}
                    >
                        {action && action.type === 'Agenda' &&
                            <Button
                                disabled={myCharacter.effort.find(el => el.type === 'Agenda').amount <= 0}
                                onClick={() => setSupport(true)}
                                color='green'
                            >
                                Support
                            </Button>
                        }
                        <Button
                            onClick={() => setComment(true)}
                            color="cyan"
                        >
                            Comment
                        </Button>
                        {isControl && (
                            <Button
                                onClick={() => setResult(true)}
                                color="blue"
                            >
                                Result
                            </Button>
                        )}
                        {isControl && (
                            <Button
                                onClick={() => setEffect(true)}
                                color="violet"
                            >
                                Effect
                            </Button>
                        )}
                    </ButtonGroup>
                )}
            </div>
            {action.submission &&
                <NewResult
                    show={result}
                    closeNew={() => closeIt()}
                    gamestate={gamestate}
                    submission={action.submission}
                    selected={action}
                />
            }

            <NewComment
                show={comment}
                closeNew={() => closeIt()}
                gamestate={gamestate}
                selected={action}
            />

            {action && action.creator &&
                <NewEffects
                    show={effect}
                    action={action}
                    selected={action}
                    hide={() => closeIt()}
                />
            }
        </Box>
    )
}

export default Feed;