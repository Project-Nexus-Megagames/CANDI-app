import React, { Component } from 'react';
import { Content, FlexboxGrid, Header } from 'rsuite';

const NotFound = () => {
	return ( 
		<React.Fragment>
      <Header>
      </Header>
      <Content>
        <FlexboxGrid justify="center">
          <FlexboxGrid.Item key={1} colspan={12} style={{marginTop: '80px'}}>
            <img src={'https://steamuserimages-a.akamaihd.net/ugc/798744098479460748/5E7BF755F4F27E6876BD38BE11571E2C9952FCDA/'} alt={'No Character Found...'} />  
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Content> <b>Could not find a character with your username. Please contact Tech Support if you think this was in error.</b>
         </React.Fragment>
	)
}
 
export default NotFound;