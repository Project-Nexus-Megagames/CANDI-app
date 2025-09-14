import { Box, Center, Progress, Text } from "@chakra-ui/react";
import React from "react";
import WordDivider from "../../../Common/WordDivider";
import ResourceNugget from "../../../Common/ResourceNugget";

function ActionEffort({effort}) {
    return (
        <Center>
            {effort.map(eff => (
                <Box
                    marginBottom='1rem'
                >
                    <WordDivider word='Effort'/>
                    <ResourceNugget 
                        type={eff.type} 
                        value={eff.amount} 
                    />
                </Box>                
            ))}
        </Center>
    )
}

export default ActionEffort;