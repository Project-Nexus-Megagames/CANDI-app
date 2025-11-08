import { Box, Text } from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { forwardRef } from "react";
import WordDivider from "../../../Common/WordDivider";
import { getFadedColor } from "../../../../scripts/frontend";
import MDEditor from "@uiw/react-md-editor";

const ActionMarkdown = ({ header, markdown, tooltip, edit, handleEdit, data, textAlign }, ref) => {
    return (
        <Box ref={ref} style={{ backgroundColor: getFadedColor('card', 0.5), width: '100%' }} >
            {header && <WordDivider
                word={header}
                tooltip={tooltip}
            />}
            <Box
                textAlign={textAlign ? textAlign : 'left'}
                whiteSpace='pre-line'
                wordBreak='breakword'
                marginTop='0.5rem'
                marginBottom='0.5rem'
            >
                <div data-color-mode="dark">
                <MDEditor.Markdown source={markdown} style={{ backgroundColor: '#1a1d24' }} />

                </div>
              {edit && <textarea rows='5' value={data} className='textStyle' onChange={(event) => handleEdit(event.target.value, header?.toLowerCase())}></textarea>}

            </Box>
        </Box>
    );
}

export default forwardRef(ActionMarkdown);