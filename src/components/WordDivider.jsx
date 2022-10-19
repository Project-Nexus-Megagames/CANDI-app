import { Divider, Flex, Heading, Tooltip } from "@chakra-ui/react";
import React from "react";

function WordDivider({word, tooltip, size = 'md'}) {

    function getHeading() {
        const minWidth = size === 'xl' && '13rem';

        return tooltip !== '' ? (
            <Tooltip
                label={tooltip}
                aria-label='a tooltip'
            >
                <Heading
                    as='h8'
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
                as='h8'
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