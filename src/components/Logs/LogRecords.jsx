import React from 'react';
import { connect, useSelector } from 'react-redux'
import { MarketLog, ProductionLog, TransactionLog } from './Logs';
import { Box, Stepper } from '@chakra-ui/react';

const LogRecords = (props) => {
	let { reports, owner, accounts, } = props;
	let s = reports.length !== 1 ? 's' : '';

	const renderReport = (report) => {
		switch (report.__t) {
			case 'TransactionLog':
				return (<TransactionLog key={report._id} report={report} {...props} />); 
			case 'MarketLog':
				return (<MarketLog key={report._id} report={report} {...props} />); 
			// case 'ProductionLog':
			// 	return (<ProductionLog key={report._id} report={report} {...props} />); 
			default: 
				return (<b>{report.__t}!!!</b>)
		}
	}

	return(
    <Box>
      <h4>{reports.length} Report{s}</h4>
      <Stepper index={reports.length} orientation='vertical' gap='0'>
       	{reports.map(report => 
          <div style={{ width: "20vw"}} >
            {renderReport(report)}
          </div>	 				
	 			)}
      </Stepper>

    </Box>
	// <Panel header={`${reports.length} Report${s}`} style={{ height: props.height }}>
	// 	{reports.length === 0 && <p>No service record available...</p>}
	// 	{reports.length >= 1 &&
	// 		<Timeline className='game-timeline'>
	// 			{reports.map(report => 
	// 				renderReport(report)
	// 			)}
	// 		<Divider>End of List</Divider>
	// 		</Timeline>}
	// </Panel>
	)
}

const mapStateToProps = (state, props)=> ({
	accounts: state.accounts.list,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LogRecords);