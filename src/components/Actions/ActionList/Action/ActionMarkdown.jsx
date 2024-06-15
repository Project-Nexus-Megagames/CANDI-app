import { Box, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";
import WordDivider from "../../../Common/WordDivider";
import { getFadedColor } from "../../../../scripts/frontend";

function ActionMarkdown({ header, markdown, tooltip, edit, handleEdit, data, textAlign }) {
    return (
        <Box style={{ backgroundColor: getFadedColor('card', 0.5), width: '100%' }} >
            {header && <WordDivider
                word={header}
                tooltip={tooltip}
            />}
            <Box
              //maxHeight={'20vh'}
                textAlign={textAlign ? textAlign : 'left'}
                whiteSpace='pre-line'
                wordBreak='breakword'
                marginTop='0.5rem'
                marginBottom='0.5rem'
            >
              {!edit && <ReactMarkdown 
                marginLeft='0.6rem'
                marginRight='0.6rem'
                remarkPlugins={[remarkGfm]}

                overflow={'auto'}
                fontSize='lg'>{markdown}
              </ReactMarkdown>}

              {edit && <textarea rows='5' value={data} className='textStyle' onChange={(event) => handleEdit(event.target.value, header.toLowerCase())}></textarea>}

            </Box>
        </Box>
    );
}

export default ActionMarkdown;