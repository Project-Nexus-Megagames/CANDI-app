import { Divider, Flex, Heading, Tooltip } from "@chakra-ui/react";
import React from "react";

function WordDivider({word, tooltip}) {

    function getHeading() {
        return tooltip !== '' ? (
            <Tooltip
                label={tooltip}
                aria-label='a tooltip'
            >
                <Heading
                    as='h8'
                    size={'md'}
                    marginLeft='1rem'
                    marginRight='1rem'
                >
                    {word}
                </Heading>
            </Tooltip>
        ) : (
            <Heading
                as='h8'
                size={'md'}
                marginLeft='1rem'
                marginRight='1rem'
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