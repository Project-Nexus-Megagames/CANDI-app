import { Box, Flex, Heading, Tooltip } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";

function ActionMarkdown({header, markdown, tooltip}) {

    function getHeading() {
        return tooltip !== '' ? (
            <Tooltip
                label={tooltip}
                aria-label='A tooltip'
            >
                <Heading
                    as='h5'
                    size='md'
                >
                    {header}
                </Heading>
            </Tooltip>
        ) : (
            <Heading
                as='h5'
                size='md'
            >
                {header}
            </Heading>
        );

    }

    return (
        <Box>
            <Flex
                justifyContent='center'
            >
                <Box>
                    {getHeading()}
                </Box>
            </Flex>
            <Box
                textAlign='left'
                whiteSpace='pre-line'
                wordBreak='breakword'
            >
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                >
                    {markdown}
                </ReactMarkdown>
            </Box>
        </Box>
    );
}

export default ActionMarkdown;