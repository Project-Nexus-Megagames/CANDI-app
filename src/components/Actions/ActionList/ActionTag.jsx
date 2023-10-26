import { Tag } from "@chakra-ui/react";
import { getFadedColor } from "../../../scripts/frontend";
import React from "react";

const ActionTag = ({color, action, text}) => (
    <Tag
        style={{
            marginLeft: '0.25rem',
            color: color,
            textTransform: 'capitalize',
            backgroundColor: action ? getFadedColor(action.type) : 'inherit',
            border: `1px solid ${getFadedColor('gold', 0.8)}`
        }}
        variant='solid'
    >
        {text}
    </Tag>
)

export default ActionTag;