import React from "react";
import { AccordionButton, AccordionIcon, Avatar, background, Box, Flex, Heading, Tag } from "@chakra-ui/react";
import ActionTags from "./ActionTags";
import { getFadedColor } from "../../../../../scripts/frontend";

function ActionHeader({action, time, toggleEdit, creator}) {
    return (
        <h5 style={{ backgroundColor: getFadedColor(action.type) }} >
            <AccordionButton>
                <Box
                    display='flex'
                    flex={1}
                    justifyContent='center'
                >
                    <Avatar
                        name={creator.characterName}
                        src={creator.profilePicture}
                        marginRight='auto'
                    />
                </Box>
                <Flex flex={3}>
                    <Box
                        alignItems='center'
                        justifyContent='center'
                        width='100%'
                    >
                        <Heading
                            size={'md'}
                            textAlign={'center'}
                        >
                            {action.name}
                        </Heading>
                        <Box
                            fontSize={'.9rem'}
                            fontWeight={'normal'}
                        >
                          <Tag margin={'2px'} variant={'solid'} colorScheme='purple' >{creator.playerName} - {creator.characterName}</Tag>
                            
                            {action.collaborators.length > 0 && action.collaborators.map(char =>
                              <Tag margin={'2px'} key={char._id} variant={'solid'} colorScheme='telegram' >{char.characterName}</Tag>)}
                        </Box>
                        <Box
                            fontSize={'.9rem'}
                            fontWeight={'normal'}
                        >
                            {time}
                        </Box>
                    </Box>
                </Flex>
                <Flex flex={1}>
                    <Box marginLeft='auto'>
                        <AccordionIcon marginTop='1rem'/>
                    </Box>
                </Flex>
            </AccordionButton>
        </h5>
    );
}

export default ActionHeader;