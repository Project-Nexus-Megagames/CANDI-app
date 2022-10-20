import { Button, CheckPicker, FlexboxGrid, Icon, Loader, Modal, Slider, Tag } from "rsuite";
import { getFadedColor, getThisEffort } from "../../../scripts/frontend";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import socket from "../../../socket";
import { getMyAssets } from "../../../redux/entities/assets";

function EditAction({action, showEdit, handleClose}) {
    if (!showEdit) {
        return <></>;
    }

    const actionLoading = useSelector(state => state.actions.loading);
    const myCharacter = useSelector(state => state.auth.character);
    const actionType = useSelector(state => {
        return state.gameConfig.actionTypes?.find((el) => el.type.toLowerCase() === action.type.toLowerCase());
    });
    const myAssets = useSelector(state => getMyAssets(state));

    const [description, setDescription] = useState(action.submission.description);
    const [intent, setIntent] = useState(action.submission.intent);
    const [name, setName] = useState(action.name);
    const [effort, setEffort] = useState(action.submission.effort);

    const characterEffort = getThisEffort(myCharacter.effort, actionType.type) + action.submission.effort.amount;

    const [max, setMax] = useState(characterEffort < actionType.maxEffort ? characterEffort : actionType.maxEffort)
    const [resources, setResources] = React.useState([]);

    const editEffort = (incoming, type) => {
        let thing;
        switch (type) {
            case 'effort':
                thing = {...effort};
                if (typeof incoming === 'number') {
                    thing.amount = parseInt(incoming);
                } else {
                    thing.effortType = incoming;
                    thing.amount = 0;

                    setMax(characterEffort < actionType.maxEffort ? characterEffort : actionType.maxEffort);
                }
                setEffort(thing);
                break;
            default:
                console.log('UwU Scott made an oopsie doodle!');
        }
    };

    const handleSubmit = async () => {
        const data = {
            id: action._id,
            name: name,
            tags: action.tags,
            submission: {
                effort,
                assets: resources,
                description,
                intent
            }
        };
        socket.emit('request', {route: 'action', action: 'update', data});
        handleClose();
    };

    function formattedUsedAssets(submissionAssets) {
        let temp = [];
        let assets = myAssets;
        assets = assets.filter((el) => el.uses <= 0 || el.status.used);
        assets = assets.filter((el) => !submissionAssets.some((sub) => sub === el._id));
        for (const asset of assets) {
            temp.push(asset._id);
        }
        return temp;
    }

    return (
        <Modal
            overflow
            style={{width: '90%'}}
            size="md"
            show={showEdit}
            onHide={handleClose}
        >
            <Modal.Header>
                <Modal.Title>
                    Edit {action.type} action {name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
                border: `4px solid ${getFadedColor(action.type)}`,
                borderRadius: '5px',
                padding: '15px'
            }}
            >
                {actionLoading &&
                    <Loader
                        backdrop
                        content="loading..."
                        vertical
                    />
                }
                <form>
                    Name:
                    {10 - name.length > 0 && (
                        <Tag
                            style={{color: 'black'}}
                            color={'orange'}
                        >
                            {10 - name.length} more characters...
                        </Tag>
                    )}
                    {10 - name.length <= 0 && (
                        <Tag color={'green'}>
                            <Icon icon="check"/>
                        </Tag>
                    )}
                    <textarea
                        rows="1"
                        value={name}
                        className="textStyle"
                        onChange={(event) => setName(event.target.value)}
                    ></textarea>
                    Description:
                    {10 - description.length > 0 && (
                        <Tag
                            style={{color: 'black'}}
                            color={'orange'}
                        >
                            {10 - description.length} more characters...
                        </Tag>
                    )}
                    {10 - description.length <= 0 && (
                        <Tag color={'green'}>
                            <Icon icon="check"/>
                        </Tag>
                    )}
                    <textarea
                        rows="6"
                        value={description}
                        className="textStyle"
                        onChange={(event) => setDescription(event.target.value)}
                    />
                    <br/>
                    <FlexboxGrid>
                        Intent:
                        {10 - intent.length > 0 && (
                            <Tag
                                style={{color: 'black'}}
                                color={'orange'}
                            >
                                {10 - intent.length} more characters...
                            </Tag>
                        )}
                        {10 - intent.length <= 0 && (
                            <Tag color={'green'}>
                                <Icon icon="check"/>
                            </Tag>
                        )}
                        <textarea
                            rows="6"
                            value={intent}
                            className="textStyle"
                            onChange={(event) => setIntent(event.target.value)}
                        />
                    </FlexboxGrid>
                    {(
                        <FlexboxGrid>
                            <FlexboxGrid.Item
                                style={{
                                    paddingTop: '25px',
                                    paddingLeft: '10px',
                                    textAlign: 'left'
                                }}
                                align="middle"
                                colspan={6}
                            >
                                <h5 style={{textAlign: 'center'}}>
                                    Effort {effort.amount} / {max}
                                    {effort === 0 && (
                                        <Tag
                                            style={{color: 'black'}}
                                            color={'orange'}
                                        >
                                            Need Effort
                                        </Tag>
                                    )}
                                </h5>

                                <Slider
                                    graduated
                                    min={0}
                                    max={max}
                                    defaultValue={action.submission.effort.amount}
                                    progress
                                    value={effort.amount}
                                    onChange={(event) => editEffort(parseInt(event), 'effort')}
                                ></Slider>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item
                                style={{
                                    paddingTop: '25px',
                                    paddingLeft: '10px',
                                    textAlign: 'left'
                                }}
                                colspan={2}
                            >
                                {/* <InputNumber value={effort} max={this.myCharacter.effort} min={0} onChange={(event)=> this.setState({effort: event})}></InputNumber>								 */}
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={4}></FlexboxGrid.Item>
                            <FlexboxGrid.Item
                                style={{
                                    paddingTop: '5px',
                                    paddingLeft: '10px',
                                    textAlign: 'left'
                                }}
                                colspan={10}
                            >
                                {' '}
                                Resources
                                <CheckPicker
                                    labelKey="name"
                                    valueKey="_id"
                                    data={myAssets.filter((el) => actionType.assetType.some((ty) => ty === el.type.toLowerCase()))}
                                    style={{width: '100%'}}
                                    defaultValue={action.submission.assets}
                                    disabledItemValues={formattedUsedAssets(action.submission.assets)}
                                    onChange={(event) => setResources(event)}
                                />
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    )}
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    loading={actionLoading}
                    onClick={() => handleSubmit()}
                    disabled={effort.amount <= 0 || description.length < 10 || intent.length < 10 || name.length < 10}
                    color={description.length > 10 && intent.length > 10 ? 'green' : 'red'}
                    appearance="primary"
                >
                    <b>Submit</b>
                </Button>
                <Button
                    onClick={handleClose}
                    appearance="subtle"
                >
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditAction;