import { Box, Button, ButtonGroup, Divider, Flex, Grid, GridItem, IconButton, Select, Spacer, Tag, Text, Tooltip, VStack } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor, getThisTeam, getThisTeamFromAccount } from '../../scripts/frontend';
import TeamAvatar from './TeamAvatar';
import NexusTag from './NexusTag';
import ResourceNugget from './ResourceNugget';

const TradeCard = (props) => {
	const { selectTrade, trade, isMine, size } = props;
	const teams = useSelector(s => s.teams.list);  
	const accounts = useSelector(s => s.accounts.list);

	return (
    <div key={trade._id} index={trade._id} className='trade-item' 
      style={{ borderColor: isMine ? 
        getFadedColor(trade.initiator.name) : 
        getFadedColor(trade.tradePartner.name)
        }} onClick={()=> selectTrade(trade)} >
    <Flex justify='space-around' >

    <div style={{ justifyContent: 'center', }} >
      <Text fontSize='sm'>{getThisTeamFromAccount(accounts, trade.initiator.account)}</Text>

      <TeamAvatar badge online={trade.initiator.ratified} account={trade.initiator.account} />
      <Flex justify={'space-between'} marginTop='2' >
        {trade.initiator.offer.assets.length >0 && <Tooltip placement="top" trigger="hover" label={<b>Assets Offered</b>}>
          <Tag variant={'outline'} colorScheme={'pink'} >Assets {trade.initiator.offer.assets.length} </Tag>
        </Tooltip>}
      </Flex>
    </div>

    {<div>status
      {true && trade.status.map((tag, index) => (
        <NexusTag variant='solid' value={tag} key={index} ></NexusTag>
      ))}				
    </div>}
      
    <div >
      <Text fontSize='sm'>{getThisTeamFromAccount(accounts, trade.tradePartner.account)}</Text>
      
      <TeamAvatar badge online={trade.tradePartner.ratified} account={trade.tradePartner.account} />
      <Flex marginTop='2' justify={'space-between'} >
        {trade.tradePartner.offer.assets.length > 0 && <Tooltip placement="top" trigger="hover" label={<b>Assets Offered</b>}>
          <Tag variant={'outline'} colorScheme={'pink'} >Assets {trade.tradePartner.offer.assets.length} </Tag>
        </Tooltip>  }                                         
      </Flex>
    </div>

    </Flex>		
      <Flex  style={{ width: '50%', }} >
        {trade.initiator.offer.resources.map((res, index) =>
          <ResourceNugget key={res._id} type={res.type} width={'50px'} />
        )}
      </Flex>			
      {trade.tradePartner.offer.resources.length > 0 && <Flex  style={{ width: '50%' }} >
        {trade.tradePartner.offer.resources.map((res, index) =>
          <ResourceNugget key={res._id} type={res.type} width={'50px'} />
        )}
      </Flex>	}								
  </div>	
	);
};

export default TradeCard;
