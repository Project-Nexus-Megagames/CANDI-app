import { Button, ButtonGroup, Flex, IconButton, Stat, StatArrow, StatHelpText, StatLabel, StatNumber, Tag, Tooltip } from '@chakra-ui/react';
import { Edit } from '@rsuite/icons';
import React from 'react';
import { useSelector } from 'react-redux';
import { getFadedColor } from '../../scripts/frontend';
import { InfoIcon } from '@chakra-ui/icons';

const MarketNugget = (props) => {
	const { tracker, loading, type, credits, matching, control, setModal, modal } = props; 
	/**
		tracker: the market tracker to be displayed
		type:  name of the resource. 
		loading: if the game is loading or not
	*/


	return (
		<div className='styleCenter' 
      style={{	
        opacity: loading ? .5 : 1, 
        display: 'flex', 
        border: `3px solid ${getFadedColor(type)}`, 
        minHeight: "45px", 
        borderRadius: '10px',  
        backgroundColor: props.selected ? getFadedColor(tracker.resource, 0.7) : props.backgroundColor 
        }}>
			
        <Flex align={'center'} >
          <img src={`/images/Icons/${tracker.resource}.png`} style={{ width: '40%', color: getFadedColor(tracker.resource), margin: '5px' }} alt='oops' />
            <Stat size={'md'} >              
              <StatLabel>{tracker.name}</StatLabel>
              <Flex justify={'center'}>
                <StatNumber>${(tracker.currentPrice)} </StatNumber>
                <Tooltip hasArrow delay={50} placement="top" label={`Tax`} >
                  <Tag style={{ margin: '5px' }} size={'sm'} variant={'solid'} colorScheme={"red"}>%{tracker.tax*100}</Tag>
                </Tooltip>
                
              </Flex>              
              
              <StatHelpText>
                <StatArrow type={tracker.lastChange >= 0 ?'increase' : 'decrease'} />
                <Tooltip hasArrow delay={50} placement="top" label={`Quantity available on Market`} >
                  <b>{Math.abs(tracker.lastChange)} ({tracker.quantity})</b>                 
                </Tooltip>                
              </StatHelpText>

              {props.button && <div>
                <ButtonGroup isAttached>
                  <Tooltip hasArrow delay={50} placement="top" label={<div>
                    <b>{matching} {tracker.name.toUpperCase()}S owned</b>
                    {matching <= 0 && <p>No {tracker.name.toUpperCase()}S to sell</p>}
                  </div>} >
                    <Button disabled={matching <= 0 || typeof(matching) === 'string'} size='md' variant={modal=== 'sell' ? "solid" : "outline"} colorScheme='orange' onClick={() => setModal('sell')} >
                      Sell ${(tracker.currentPrice - Math.floor(tracker.currentPrice * tracker.tax))} ({matching})
                    </Button>
                  </Tooltip>

                  <Tooltip hasArrow delay={50} placement="top" label={<div>
                      <b>{tracker.quantity} available</b>
                      {credits < tracker.currentPrice + Math.floor(tracker.currentPrice * tracker.tax) && <p>Less than {tracker.currentPrice + Math.floor(tracker.currentPrice * tracker.tax)} credits in account</p>}
                    </div>} >
                  <Button disabled={credits < tracker.currentPrice + Math.floor(tracker.currentPrice * tracker.tax) || typeof(credits) === 'string' || tracker.quantity <= 0} size='md' variant={modal=== 'buy' ? "solid" : "outline"} colorScheme='green' onClick={() => setModal('buy')} >
                    Buy ${(tracker.currentPrice + Math.floor(tracker.currentPrice * tracker.tax))} ({tracker.quantity})
                  </Button>
                  </Tooltip>                  
                </ButtonGroup>
                {<IconButton onClick={() => setModal('info')} appearance='outline' colorScheme='orange' size="sm" icon={<InfoIcon/>} /> }
                {control && <IconButton onClick={() => setModal('control')} appearance='outline' colorScheme='orange' size="sm" icon={<Edit/>} /> }
              </div>}
            </Stat>          
        </Flex>


		</div>
	);
};

export default MarketNugget;



