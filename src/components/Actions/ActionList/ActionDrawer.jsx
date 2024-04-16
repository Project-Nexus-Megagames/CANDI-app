import React, { useState } from "react";
import ActionList from "./ActionList";
import {    Center,    Drawer,    DrawerBody,    DrawerCloseButton,    DrawerContent,    DrawerFooter,    DrawerHeader,    DrawerOverlay,    Flex,    IconButton,    Input,    InputGroup,    InputLeftElement,    Tooltip,    useBreakpointValue,} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from '@chakra-ui/icons'

function ActionDrawer({actions, onClick, handleSelect, isOpen, onClose, rounds, renderRounds, handleRoundToggle}) {
    const drawerSize = useBreakpointValue({base: 'full', sm: 'sm'});
    const [filter, setFilter] = useState('');

    return (
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
            isFullHeight
            size={drawerSize}
            isLazy
        >
            <DrawerOverlay/>
            <DrawerContent
                style={{
                    backgroundColor: "#0f131a"
                }}
            >
                <DrawerCloseButton/>
                <DrawerHeader>
                    <Center
                        marginBottom='1rem'
                    >
                        Action List
                    </Center>
                    <Flex align={'center'}>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents='none'
                            >
                                <SearchIcon/>
                            </InputLeftElement>
                            <Input
                                onChange={(e) => setFilter(e.target.value)}
                                value={filter}
                                placeholder="Search"
                                color='white'
                            />
                        </InputGroup>
                        <Tooltip
                            label='Add New Action'
                            aria-label='a tooltip'>
                            <IconButton
                                icon={<AddIcon/>}
                                onClick={onClick}
                                colorScheme={'green'}
                                style={{
                                    marginLeft: '1rem'
                                }}
                                aria-label='Add New Action'
                            />
                        </Tooltip>
                    </Flex>
                </DrawerHeader>
                <DrawerBody>
                    <ActionList
                        actions={actions.filter(action => action.submission.description.toLowerCase().includes(filter.toLowerCase()) ||
                          action.creator.characterName.toLowerCase().includes(filter.toLowerCase())  ||
                          action.name.toLowerCase().includes(filter.toLowerCase()))}
                        handleSelect={handleSelect}
                        renderRounds={renderRounds}
                        rounds={rounds}
                        handleRoundToggle={handleRoundToggle}
                    />
                </DrawerBody>
                <DrawerFooter/>
            </DrawerContent>
        </Drawer>
    );
}

export default ActionDrawer;