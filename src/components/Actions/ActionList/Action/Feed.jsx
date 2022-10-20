import { Box } from "@chakra-ui/react";
import Comment from "../../Comment";
import Result from "../../Result";
import Effect from "../../Effect";
import React, { useState } from "react";
import { Button, ButtonGroup, Divider, Icon, IconButton } from "rsuite";
import WordDivider from "../../../WordDivider";
import NewResult from "../../Modals/NewResult";
import NewComment from "../../Modals/NewComment";
import NewEffects from "../../Modals/NewEffect";
import { useSelector } from "react-redux";
import usePermissions from "../../../../hooks/usePermissions";

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

    const renderSwitch = (item, index) => {
        switch (item.model) {
            case 'Comment':
                return (
                    <div>
                        <Comment
                            selected={action}
                            index={index}
                            comment={item}
                        />
                    </div>
                );
            case 'Result':
                return (
                    <div>
                        <Divider vertical/>
                        <Result
                            index={index}
                            result={item}
                            selected={action}
                            submission={action.submission}
                        />
                    </div>
                );
            case 'Effect':
                return (
                    <div>
                        <Divider vertical/>
                        <Effect
                            selected={action}
                            index={index}
                            effect={item}
                        />
                    </div>
                );
            default:
                return <b> Oops </b>;
        }
    };

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
            {list.map((item, index) => renderSwitch(item, index))}
            <Divider vertical/>
            <div style={{transition: '3s ease', marginBottom: '30px', marginTop: '0.5rem'}}>
                {!add && (
                    <IconButton
                        onClick={() => setAdd(true)}
                        color="blue"
                        icon={<Icon icon="plus"/>}
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