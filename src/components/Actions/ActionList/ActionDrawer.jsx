import React from "react";
import ActionList from "./ActionList";
import {
    Center,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Tooltip,
    useBreakpointValue,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from '@chakra-ui/icons'

function ActionDrawer({actions, value, onChange, onClick, handleSelect, isOpen, onClose}) {
    const drawerSize = useBreakpointValue({base: 'full', sm: 'sm'});

    return (
        <Drawer
            isOpen={isOpen}
            placement='left'
            onClose={onClose}
            isFullHeight
            size={drawerSize}
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
                                onChange={onChange}
                                value={value}
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
                        actions={actions}
                        handleSelect={handleSelect}
                    />
                </DrawerBody>
                <DrawerFooter/>
            </DrawerContent>
        </Drawer>
    );
}

export default ActionDrawer;