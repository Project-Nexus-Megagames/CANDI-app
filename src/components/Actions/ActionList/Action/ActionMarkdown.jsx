import { Box } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";
import WordDivider from "../../../WordDivider";

function ActionMarkdown({header, markdown, tooltip}) {
    return (
        <Box backgroundColor={'#202124'} >
            <WordDivider
                word={header}
                tooltip={tooltip}
            />
            <Box
                textAlign='left'
                whiteSpace='pre-line'
                wordBreak='breakword'
                marginTop='0.5rem'
                marginBottom='0.5rem'
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