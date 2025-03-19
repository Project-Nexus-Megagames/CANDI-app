import React, { useEffect } from 'react';
import { Avatar, Box, Button, ButtonGroup, Card, CardBody, CardHeader, Center, Flex, HStack, IconButton, SimpleGrid, Spacer, Stack, Tag, Text, Tooltip, Wrap, WrapItem } from '@chakra-ui/react';
import { getFadedColor, getTextColor } from '../../scripts/frontend';

const StatIcon = ({compact, stat}) => {

    return ( 
        <Tooltip hasArrow placement='top' label={stat.name}>
          <Avatar
            backgroundColor={getFadedColor(stat.code)}
            src={stat.code === "CON" ? "/images/stats/HP.png" :`/images/stats/${stat.code}.png`}
            name={stat.code}
            size='xs'
            ml={-1}
            mr={2}
          />             
      </Tooltip>
    );
}

export default (StatIcon);