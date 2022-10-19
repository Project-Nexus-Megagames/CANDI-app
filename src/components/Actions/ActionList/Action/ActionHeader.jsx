import React from "react";
import { AccordionButton, AccordionIcon, Avatar, Box, Flex, Heading } from "@chakra-ui/react";
import usePermissions from "../../../../hooks/usePermissions";
import ActionTags from "./ActionTags";
import ActionButtons from "./ActionButtons";

function ActionHeader({action, time}) {
    const {isControl} = usePermissions();

    const creator = action.creator;
    return (
        <h7>
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
                <Flex flex={1}>
                    <Box
                        alignItems='center'
                        justifyContent='center'
                    >
                        <Heading
                            as="h8"
                            size={'lg'}
                        >
                            {action.name}
                        </Heading>
                        <Box as={'p'}>{creator.playerName} - {creator.characterName}</Box>
                        <Box>{time}</Box>
                        <ActionTags
                            tags={action.tags}
                            actionId={action._id}
                        />
                    </Box>
                </Flex>
                <Flex flex={1}>
                    <Box marginLeft='auto'>
                        <ActionButtons action={action}/>
                        <AccordionIcon marginTop='1rem'/>
                    </Box>
                </Flex>
            </AccordionButton>
        </h7>
    );
}

export default ActionHeader;