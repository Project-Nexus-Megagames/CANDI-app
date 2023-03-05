import { Divider, Flex, Heading, Tooltip } from "@chakra-ui/react";
import React from "react";
import { InfoTip } from "./Common/InfoTip";

function WordDivider({word, tooltip, size = 'md'}) {

    function getHeading() {
        const minWidth = size === 'xl' && '13rem';

        return tooltip !== '' ? (
            <Tooltip
                label={tooltip}
                aria-label='a tooltip'
            >
                <Heading
                    as='h5'
                    size={size}
                    marginLeft='1rem'
                    marginRight='1rem'
                    justifyContent='center'
                    minWidth={minWidth}
                >
                    {word}                    
                </Heading>
            </Tooltip>
        ) : (
            <Heading
                as='h5'
                size={size}
                marginLeft='1rem'
                marginRight='1rem'
                justifyContent='center'
                minWidth={minWidth}
            >
                {word}
            </Heading>
        );
    }

    return (
        <Flex align="center">
            <Divider/>
            {getHeading()}
            <Divider/>
        </Flex>
    );
}

export default WordDivider;