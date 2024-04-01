import React from "react";
import {
  Box,
  Flex,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
} from '@chakra-ui/react'
import { getFadedColor } from "../../scripts/frontend";
import ResourceNugget from "../Common/ResourceNugget";
import { CheckCircleIcon } from "@chakra-ui/icons";

const getTime = (date) => {
  let countDownDate = new Date(date).getTime();
  const now = new Date().getTime();
  let distance = now - countDownDate;
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

  const formatted = hours > 0 ? `${hours} hours, ${minutes}, minutes ago` : `${minutes} minutes ago`
  return (<b>{formatted}</b>)
}

const getTeamCode = (accounts, id) => {
  if (id) {
    const account = accounts.find(el => el._id === id);
    return account ? `${account.name}` : '???';
  }
  else return ('Control')
}

// TIMELINE - Log for Transactions for a timeline component
const TransactionLog = props => {
  let { report } = props;

  const getEnglish = (report) => {
    switch (report.transaction) {
      case 'Deposit': return `Deposited ${report.amount} ${report.resource} from`;
      case 'Expense': return `Spent ${report.amount} ${report.resource} from`;
      case 'Withdrawal': return `Withdrew ${report.amount} ${report.resource} from`;
      default: return 'did something'
    }
  }

  return (
    <Step key={report._id} >
      <StepIndicator >
        <StepStatus
          complete={<CheckCircleIcon />}
          incomplete={<StepNumber />}
          active={<StepNumber />}
        />
      </StepIndicator>

      <Box flexShrink='0' style={{ margin: "2px", padding: "5px", border: `2px solid ${getFadedColor(report.transaction)}` }}  >
        <StepTitle>{report.transaction}</StepTitle>
        <StepDescription>
          <b>({getTime(report.createdAt)})</b>
          {/* <p>{report.note}</p> */}

        </StepDescription>

        <Flex>
          <ResourceNugget value={report.amount} type={report.resource} />
        </Flex>

      </Box>

      <StepSeparator />
    </Step>
  );
};

// TODO - Research log should be fleshed out for March.
// const ResearchLog = props => {
//   let { outcomes, rolls, _id, team, type, timestamp, lab, funding, stats, progress, project } = props.report;
//   if (props.report.project === null) console.log(props.report)
//   let date = new Date(props.report.date);
//   if (timestamp === undefined) timestamp = {turn: 'void', phase: 'uncertian', clock: '00:00'};

//   let results = [];
//   for (let i = 0; i < rolls.length; i++) {
//     let outcome = `Roll #${i + 1} | ${outcomes[i]} - Die Result: ${rolls[i]}`;
//     results.push(outcome);
//   }
//   return (
//     <Timeline.Item key={_id} dot={<Icon icon="flask" size="2x" />}>
//       <Panel
//         style={{
//           padding: "0px",
//           backgroundImage: "linear-gradient(to bottom right, #d6eaf8, #fff)"
//         }}
//         header={`${type} - ${team.code} | ${timestamp.turn} ${timestamp.phase} - ${timestamp.clock} Date: ${date.toLocaleTimeString()} - ${date.toDateString()}`}
//         collapsible
//       >
// 				<FlexboxGrid>
//           <FlexboxGrid.Item colSpan={12}>
//             <div>
//               {/* <Whisper placement="top" speaker={teamSpeaker} trigger="click">
//                 <IconButton size="xs" icon={<Icon icon="info-circle" />} />
//               </Whisper> */}
//               <b> Team:</b> {team.name} | <b>Science Rate:</b> {team.sciRate}
//             </div>
//             <div>
//               {/* <Whisper placement="top" speaker={labSpeaker} trigger="click">
//                 <IconButton size="xs" icon={<Icon icon="info-circle" />} />
//               </Whisper> */}
//               <b> Lab:</b> {lab.name} | <b>Science Rate:</b> {lab.sciRate}
//             </div>
//             <div>
//               {/* <Whisper placement="top" speaker={fundingSpeaker} trigger="click">
//                 <IconButton size="xs" icon={<Icon icon="info-circle" />} />
//               </Whisper> */}
//               <b>Funding Level:</b> {funding}
//             </div>
//           </FlexboxGrid.Item>
//           <FlexboxGrid.Item colSpan={12}>
//           <div>
//               {/* <Whisper placement="top" speaker={amountSpeaker} trigger="click">
//                 < size="xs" icon={<Icon icon="info-circle" />} />
//               </Whisper> */}
//               <b> Multiplyer:</b> {stats.finalMultiplyer}
//             </div> 
//             <div>
//               {/* <Whisper placement="top" speaker={noteSpeaker} trigger="click">
//                 <IconButton size="xs" icon={<Icon icon="info-circle" />} />
//               </Whisper> */}
//               <b> Breakthroughs:</b> {stats.breakthroughCount}</div>
//               <div>
//               {/* <Whisper placement="top" speaker={noteSpeaker} trigger="click">
//                 <IconButton size="xs" icon={<Icon icon="info-circle" />} />
//               </Whisper> */}
//               <b> Progress:</b> {progress.endingProgress}</div>
//           </FlexboxGrid.Item>
//         </FlexboxGrid>
//         <p><b>Active Project:</b> {project.name}</p>
//           <ul>
//             {results.map(el => (
//               <li key={el}>{el}</li>
//             ))}
//           </ul>
//       </Panel>
//     </Timeline.Item>
//   );
// };

// TODO - This trade log needs to be filled out...
const TradeLog = props => {
  let { report } = props;
  let date = new Date(report.date);

  return (
    <Step key={report._id} >
      <StepIndicator >
        <StepStatus
          complete={<CheckCircleIcon />}
          incomplete={<StepNumber />}
          active={<StepNumber />}
        />
      </StepIndicator>

      <Box flexShrink='0' style={{ margin: "2px", padding: "5px", border: `2px solid ${getFadedColor(report.transaction)}` }}  >
        <StepTitle>{report.transaction}</StepTitle>
        <StepDescription>{<b>({getTime(report.createdAt)})</b>}</StepDescription>

        <Flex>
          <ResourceNugget value={report.amount} type={report.resource} />
        </Flex>

      </Box>

      <StepSeparator />
    </Step>
    // <Timeline.Item key={report._id} dot={<AdvancedAnalytics/>}>
    //   <Panel
    //     style={{
    //       padding: "0px",
    //       backgroundImage: "linear-gradient(to bottom right, #eaeded, #fff)"
    //     }}
    //     header={`Placeholder Trade - ${report.team.code} | ${
    //       report.timestamp.turn
    //     } ${report.timestamp.phase} - ${report.timestamp.clock} Date:${date.toLocaleTimeString()} - ${date.toDateString()}`}
    //     collapsible
    //   >
    //     <p>
    //       {report.timestamp.clock} {report.timestamp.turn} - {report.timestamp.phase} -
    //       Turn {report.timestamp.turnNum}
    //     </p>
    //     <p>
    //       <b>Team:</b> {report.team.name}
    //     </p>
    //     <p>
    //       <b>Location:</b> {report.organization.name} - {report.zone.name}
    //     </p>
    //   </Panel>
    // </Timeline.Item>
  );
};

// TIMELINE - Log for Transactions for a timeline component
const MarketLog = props => {
  let { report } = props;
  const creator = report.creator ? report.creator.characterName : 'Someone';
  const getEnglish = (report) => {
    switch (report.action) {
      case 'buy': return `${creator} bought ${report.amount} ${report.resource} from the market for ${report.price * report.amount} credits`;
      case 'sell': return `${creator} sold ${report.amount} ${report.resource} to the market for ${report.price * report.amount} credits`;
      default: return 'did something'
    }
  }

  return (
    <Step key={report._id} >
      <StepIndicator >
        <StepStatus
          complete={<CheckCircleIcon />}
          incomplete={<StepNumber />}
          active={<StepNumber />}
        />
      </StepIndicator>
      <Box
        style={{
          padding: "0px",
          backgroundColor: report.action === 'buy' ? "#445183" : "#1a2656", color: 'white'
        }}
      >
        <div style={{ color: 'white', textTransform: 'capitalize' }}><b>{report.action} -  {getEnglish(report)} ({getTime(report.createdAt)})</b></div>
        <Flex justify="space-around" align="middle">

          <ResourceNugget value={report.amount} type={report.resource} />


          <h1>x</h1>

          <ResourceNugget value={report.price} type={'credit'} />

          <h1> = </h1>

          <ResourceNugget value={report.price * report.amount} type={'credit'} />

        </Flex>
      </Box>
    </Step>
  );
};

const ProductionLog = props => {
  let { report } = props;

  const getEnglish = (report) => {
    switch (report.transaction) {
      case 'Deposit': return `Deposited ${report.amount} ${report.resource} from`;
      case 'Expense': return `Spent ${report.amount} ${report.resource} from`;
      case 'Withdrawal': return `Withdrew ${report.amount} ${report.resource} from`;
      default: return 'did something'
    }
  }

  return (
    <Step key={report._id} >
      <StepIndicator >
        <StepStatus
          complete={<CheckCircleIcon />}
          incomplete={<StepNumber />}
          active={<StepNumber />}
        />
      </StepIndicator>

      <Box flexShrink='0' style={{ margin: "2px", padding: "5px", border: `2px solid ${getFadedColor(report.transaction)}` }}  >
        <StepTitle>{report.transaction}</StepTitle>
        <StepDescription>{<b>({getTime(report.createdAt)})</b>}</StepDescription>

        <Flex>
          <ResourceNugget value={1} type={report.produced.code} />

        </Flex>

      </Box>

      <StepSeparator />
    </Step>
    // <Timeline.Item
    //   key={report._id}
    //   dot={<Numbers/>}
    // >
    //   <Panel
    //     style={{
    //       padding: "0px",
    //       border: `3px solid ${getFadedColor(report.facility.type, .5)}`,
    //       backgroundColor: getFadedColor(report.facility.type, .1), color: 'white',
    //     }}
    // 		header={
    //       <FlexboxGrid  align='space-between' justify="start">
    //       <FlexboxGrid.Item style={{ margin: '5px' }} >
    //        <ResourceNugget  value={1} type={report.produced.code} />
    //       </FlexboxGrid.Item>

    //       <FlexboxGrid.Item >
    // 				<div className={"container"}>
    // 					<img className={''} src={`/images/arrow.png`} height="60" alt='Failed to load img' />
    // 					<div className="centerLog" >{report.__t}</div>
    // 				</div>
    // 				</FlexboxGrid.Item>

    //         <FlexboxGrid.Item colSpan={4}>

    //         </FlexboxGrid.Item>

    //       <FlexboxGrid.Item colSpan={8}>
    //        <b>({getTime(report.createdAt)})</b>
    //       </FlexboxGrid.Item>
    //     </FlexboxGrid>
    //   }
    //     collapsible
    //   >
    //     <FlexboxGrid>
    //       <FlexboxGrid.Item colSpan={12}>
    //         <div>
    //           <b> Resource:</b> <ResourceNugget  value={1} type={report.produced.code} />
    //         </div> 
    //         <div>
    //           <b> Account:</b> {report.account}</div>
    //       </FlexboxGrid.Item>
    //       <FlexboxGrid.Item colSpan={12}>
    //       <div>
    //           <b> facility:</b> {report.facility.name}
    //         </div> 
    //         <div>
    //           <b> Note:</b> {report.note}</div>
    //       </FlexboxGrid.Item>
    //     </FlexboxGrid>
    //   </Panel>
    // </Timeline.Item>
  );
};

export { TransactionLog, MarketLog, TradeLog, ProductionLog };
