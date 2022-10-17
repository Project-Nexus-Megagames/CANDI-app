import React from "react";
import { Button, Icon, Input, InputGroup, PanelGroup, Sidebar, Tooltip, Whisper } from "rsuite";
import ActionList from "./ActionList";

function ActionSidebar(props) {
    return (
        <Sidebar>
            <PanelGroup>
                <div
                    style={{
                        height: "40px",
                        borderRadius: "0px",
                        backgroundColor: "#000101"
                    }}
                >
                    <InputGroup>
                        <Input
                            size="lg"
                            style={{height: "42px"}}
                            onChange={props.onChange}
                            value={props.value}
                            placeholder="Search"></Input>

                        <Whisper
                            placement="top"
                            trigger="hover"
                            speaker={
                                <Tooltip>
                                    <b>{`Create New Action`}</b>
                                </Tooltip>
                            }
                        >
                            <Button
                                style={{color: "black", borderRadius: "0px"}}
                                color="green"
                                onClick={props.onClick}>
                                <Icon icon="plus"/>
                            </Button>
                        </Whisper>
                    </InputGroup>
                </div>
                <div
                    style={{
                        height: "calc(100vh - 80px)",
                        overflow: "auto",
                        borderRadius: "0px",
                        borderRight: "1px solid rgba(255, 255, 255, 0.12)"
                    }}
                >
                    <ActionList
                        actions={props.control ? props.filteredActions : props.myActions}
                        actionTypes={props.actionTypes}
                        selected={props.selected}
                        handleSelect={props.handleSelect}
                    />
                </div>
                ActionList
            </PanelGroup>
        </Sidebar>
    );
}

export default ActionSidebar;