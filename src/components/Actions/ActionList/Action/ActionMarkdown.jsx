import { Box, Text } from "@chakra-ui/react";
import React from "react";
import WordDivider from "../../../Common/WordDivider";
import { getFadedColor } from "../../../../scripts/frontend";

function ActionMarkdown({ header, markdown, tooltip, edit, handleEdit, data, textAlign, fontSize }) {
  return (
    <Box style={{ backgroundColor: getFadedColor('card', 0.5), width: '100%' }} >
      {header && <WordDivider
        word={header}
        tooltip={tooltip}
        minWidth={'80vw'}
      />}
      <Box
        //maxHeight={'20vh'}
        textAlign={textAlign ? textAlign : 'left'}
        whiteSpace='pre-line'
        wordBreak='breakword'
      >
        {!edit && <Text
          marginLeft='0.6rem'
          marginRight='0.6rem'
          overflow={'auto'}
          fontSize={fontSize || 'lg'}>{markdown}
        </Text>}

        {edit && <textarea rows='5' value={data} className='textStyle' onChange={(event) => handleEdit(event.target.value, header.toLowerCase())}></textarea>}

      </Box>
    </Box>
  );
}

export default ActionMarkdown;