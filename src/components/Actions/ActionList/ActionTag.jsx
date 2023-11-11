import { Tag } from "@chakra-ui/react";
import { getFadedColor } from "../../../scripts/frontend";
import React from "react";

const ActionTag = ({color, action, text}) => (
    <Tag
        style={{
            marginLeft: '0.25rem',
            color: 'white',
            textTransform: 'capitalize',
            backgroundColor: action ? getFadedColor(action.type) : color,
        }}
        variant='solid'
    >
        {text}
    </Tag>
)

export default ActionTag;