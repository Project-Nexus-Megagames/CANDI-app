import React, { useEffect } from 'react';
import { Avatar, Box, Button, ButtonGroup, Card, CardBody, CardHeader, Center, Flex, HStack, IconButton, SimpleGrid, Spacer, Stack, Tag, Text, Tooltip, Wrap, WrapItem } from '@chakra-ui/react';
import { getFadedColor, getTextColor } from '../../scripts/frontend';

const StatIcon = ({preferredCurrency, stat, size='xs'}) => {
  let src;
  let additionalText = '';
  
  switch (stat.code) {
    case 'CON':
      src = "/images/stats/HP.png";
      break;
    case 'SAL':
      src = `/images/${preferredCurrency}.png`;
      if (preferredCurrency) additionalText = ` (${preferredCurrency})`
      break;
    default:
      src = `/images/stats/${stat.code}.png`
  }

    return ( 
        <Tooltip hasArrow placement='top' label={stat.name+additionalText}>
          <Avatar
            backgroundColor={getFadedColor(stat.code)}
            src={src}
            name={stat.code}
            size={size}
            ml={-1}
            mr={2}
          />             
      </Tooltip>
    );
}

export default (StatIcon);