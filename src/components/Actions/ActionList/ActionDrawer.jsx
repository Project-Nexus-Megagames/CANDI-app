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
    useDisclosure
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from '@chakra-ui/icons'

function ActionDrawer(props) {
    const {isOpen, onClose} = useDisclosure({defaultIsOpen: true});
    const drawerSize = useBreakpointValue({base: 'full', sm: 'sm'})

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
                    <Center>
                        Action List
                    </Center>
                    <Flex>
                        <InputGroup>
                            <InputLeftElement
                                pointerEvents='none'
                            >
                                <SearchIcon/>
                            </InputLeftElement>
                            <Input
                                onChange={() => {
                                    onClose();
                                    props.onChange();
                                }}
                                value={props.value}
                                placeholder="Search"
                                color='white'
                            />
                        </InputGroup>
                        <Tooltip
                            label='Add New Action'
                            aria-label='a tooltip'
                        >
                            <IconButton
                                icon={<AddIcon/>}
                                onClick={props.onClick}
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
                        actions={props.control ? props.filteredActions : props.myActions}
                        actionTypes={props.actionTypes}
                        selected={props.selected}
                        handleSelect={props.handleSelect}
                    />
                </DrawerBody>
                <DrawerFooter/>
            </DrawerContent>
        </Drawer>
    );
}

export default ActionDrawer;