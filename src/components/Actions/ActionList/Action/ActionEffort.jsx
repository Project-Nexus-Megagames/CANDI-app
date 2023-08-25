import { Box, Progress, Text } from "@chakra-ui/react";
import React from "react";
import WordDivider from "../../../WordDivider";

function ActionEffort({submission}) {
    return (
      <Box
          marginBottom='1rem'
      >
          <WordDivider word={`Effort`}/>
          <Text
              textAlign='center'
              fontWeight='bolder'
              fontSize='20'
          >
              {submission.effort.amount}
          </Text>
          <Progress
              value={submission.effort.amount * 50}
              borderRadius='8'
              border='1px solid black'
              marginTop='0.5rem'
          />
      </Box>
    )
}

export default ActionEffort;