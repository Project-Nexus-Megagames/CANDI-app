import { CreditCardPlus } from "@rsuite/icons";
import React from "react";
import {
  Box,
  Flex,
  Step,
  StepDescription,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
} from '@chakra-ui/react'
import { getFadedColor, getFadedHexColor } from "../../scripts/frontend";
import ResourceNugget from "../Common/ResourceNugget";
import { StarIcon } from "@chakra-ui/icons";
import AthleteCard from "../Assets/AthleteCard";

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
          complete={<CreditCardPlus />}
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

const TradeLog = props => {
  let { report } = props;
  let date = new Date(report.date);

  return (
    <Step key={report._id} >
      <StepIndicator >
        <StepStatus
          complete={<CreditCardPlus />}
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
          complete={<CreditCardPlus />}
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
          complete={<CreditCardPlus />}
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
  );
};

const EventLog = props => {
  let { report, index } = props;

  return (
    <Step key={report._id} width={'100%'} >
      <StepIndicator >
        <StepStatus
          complete={<StarIcon />}
          incomplete={<StepNumber />}
          active={<StepNumber />}
        />
      </StepIndicator>

      <Box
        // backgroundColor={getFadedColor('blue', (0.2 * Math.floor(report.round)))}
        backgroundColor={getFadedHexColor(report.color, 0.3)}
        flexShrink='0'
        style={{
          margin: "2px",
          padding: "5px",
          border: `2px solid ${report.color}`,
          width: '95%',
        }}
      >
        <StepTitle>Round {report.round}) {report.text}</StepTitle>
        <StepDescription color={'whiteAlpha.800'} >{<b>({getTime(report.createdAt)})</b>}</StepDescription>
        {report.athlete && <Flex alignItems={'center'}  >
          {report.injurer && <AthleteCard asset={report.injurer} compact stats={false} />}
          {report.injurer && <img src={`/images/${report.type}.png`} width={'30%'} alt={report.type} />}
          {report.type === "lucky" && <img src={`/images/stats/LUK.png`} width={'10%'} alt={report.type} />}
 
          <AthleteCard asset={report.athlete} compact stats={false} />

        </Flex>
        }
      </Box>

      <StepSeparator />
    </Step>
  );
};

export { TransactionLog, MarketLog, TradeLog, ProductionLog, EventLog };
