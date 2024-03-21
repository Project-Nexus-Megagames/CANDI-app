import { Tooltip } from '@chakra-ui/react';
import React from 'react';
import { getFadedColor, getTextColor } from '../../scripts/frontend';

const NexusTag = (props) => {
	const { value, variant, children, width } = props; 

  const renderIcon = (icon) => {
    switch(icon.toLowerCase()) {  
      case 'draft':
        return(
          <Tooltip bg={'#343a40'} hasArrow delay={100} placement='top' trigger='hover'
            label={(
            <div>
              <h4 style={{ textTransform: 'capitalize', color: 'white' }}>{icon}</h4>
              <h5>{icon}</h5>
            </div>)}>
              <div style={{	display: 'flex', backgroundColor: variant === "ghost" ? `${getFadedColor("background")}` : `${getFadedColor(value)}`, borderRadius: '8px',  padding: '1px', margin: '3px', width: 'fit-content' }}>
                <img style={{ fill: 'red', margin: '4px', }} src={`/images/${icon}.png`} width={'20px'} alt={`${icon}???`} />
              </div>              
          </Tooltip>
          )
          case 'used':
      case 'working':
        return(
          <Tooltip bg={'#343a40'} hasArrow delay={100} placement='top' trigger='hover'
            label={(
            <div>
              <h4 style={{ textTransform: 'capitalize', color: 'white' }}>{icon}</h4>
              <h5>This Asset is on cooldown and cannot be used for other Actions</h5>
            </div>)}>
              <div style={{	display: 'flex', backgroundColor: variant === "ghost" ? `${getFadedColor("background")}` : `${getFadedColor(value)}`, borderRadius: '8px',  padding: '1px', margin: '3px', width: 'fit-content' }}>
                <img style={{ fill: 'red', margin: '4px', }} src={`/images/clock.png`} width={'20px'} alt={`${icon}???`} />
              </div>              
          </Tooltip>
          )
      case 'brain':
        return(
          <Tooltip bg={'#343a40'} hasArrow delay={100} placement='top' trigger='hover'
            label={(
            <div>
              <h4 style={{ textTransform: 'capitalize', color: 'white' }}>{icon}</h4>
              <h5>{icon}</h5>
            </div>)}>
              <div style={{	display: 'flex', backgroundColor: variant === "ghost" ? `${getFadedColor("background")}` : `${getFadedColor(value)}`, borderRadius: '8px',  padding: '1px', margin: '3px', width: 'fit-content' }}>
                <img style={{ margin: '4px', }} src={`/images/${icon}.png`} width={'20px'} alt={`${icon}???`} />
              </div>              
          </Tooltip>
          )
      case 'brawn':
        return(
          <Tooltip bg={'#343a40'} hasArrow delay={100} placement='top' trigger='hover'
            label={(
            <div>
              <h4 style={{ textTransform: 'capitalize', color: 'white' }}>{icon}</h4>
              <h5>{icon}</h5>
            </div>)}>
              <div style={{	display: 'flex', backgroundColor: variant === "ghost" ? `${getFadedColor("background")}` : `${getFadedColor(value)}`, borderRadius: '8px',  padding: '1px', margin: '3px', width: 'fit-content' }}>
                <img style={{ margin: '4px', }} src={`/images/${icon}.png`} width={'20px'} alt={`${icon}???`} />
              </div>              
          </Tooltip>
        )
      case 'stealth':
        return(
          <Tooltip bg={'#343a40'} hasArrow delay={100} placement='top' trigger='hover'
            label={(
            <div>
              <h4 style={{ textTransform: 'capitalize', color: 'white' }}>{icon}</h4>
              <h5>{icon}</h5>
            </div>)}>
              <div style={{	display: 'flex', backgroundColor: variant === "ghost" ? `${getFadedColor("background")}` : `${getFadedColor(value)}`, borderRadius: '8px',  padding: '1px', margin: '3px', width: 'fit-content' }}>
                <img style={{ margin: '4px', }} src={`/images/${icon}.png`} width={'20px'} alt={`${icon}???`} />
              </div>              
          </Tooltip>
        )
      case 'auto':
        return(
          <Tooltip bg={'#343a40'} hasArrow delay={100} placement='top' trigger='hover'
            label={(
            <div>
              <h4 style={{ textTransform: 'capitalize', color: 'white' }}>{icon}</h4>
              <h5>This Contract will not go away when it expires. It will simply restart after punishing you. There is no escape.</h5>
            </div>)}>
              <div style={{	display: 'flex', backgroundColor: variant === "ghost" ? `${getFadedColor("background")}` : `${getFadedColor(value)}`, borderRadius: '8px',  padding: '1px', margin: '3px', width: 'fit-content' }}>
                <img style={{ margin: '4px', }} src={`/images/${icon}.png`} width={'20px'} alt={`${icon}???`} />
              </div>              
          </Tooltip>
        )
      case 'tradable':
        return(
          <Tooltip bg={'#343a40'} hasArrow delay={100} placement='top' trigger='hover'
            label={(
            <div>
              <h4 style={{ textTransform: 'capitalize', color: 'white' }}>{icon}</h4>
              <h5>This Asset can be traded</h5>
            </div>)}>
              <div style={{	display: 'flex', backgroundColor: variant === "ghost" ? `${getFadedColor("background")}` : `${getFadedColor(value)}`, borderRadius: '8px',  padding: '1px', margin: '3px', width: 'fit-content' }}>
                <img style={{ margin: '4px', }} src={`/images/${icon}.png`} width={'20px'} alt={`${icon}???`} />
              </div>              
          </Tooltip>
          )
      case 'completed':
        return(
          <Tooltip bg={'#343a40'} hasArrow delay={100} placement='top' trigger='hover'
            label={(
            <div>
              <h4 style={{ textTransform: 'capitalize', color: 'white' }}>{icon}</h4>
              <h5>This Contract has been completed</h5>
            </div>)}>
              <div style={{	display: 'flex', backgroundColor: variant === "ghost" ? `${getFadedColor("background")}` : `${getFadedColor(value)}`, borderRadius: '8px',  padding: '1px', margin: '3px', width: 'fit-content' }}>
                <img style={{ margin: '4px', }} src={`/images/${icon}.png`} width={'20px'} alt={`${icon}???`} />
              </div>              
          </Tooltip>
          )
      default:
        return
    }
};



	return (
    renderIcon(value)
	);
};

export default NexusTag;



