import React, { useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { getcharacter } from "../../redux/entities/characters";
import socket from "../../socket";
import { useNavigate } from "react-router-dom";
import { closeResult } from "../../redux/entities/raids";
import AssetInfo from "../Common/AssetInfo";
import { getMyAssets } from "../../redux/entities/assets";
import SubRoutine from "./SubRoutine";
import Dice from "./Dice";
import { getCharAccount } from "./../../redux/entities/accounts";
import { Box, Button, ButtonGroup, Divider, Flex, Grid, GridItem, Tag, VStack } from "@chakra-ui/react";
import Ice from "../Team/Ice";
import { RaidIce } from "./RaidIce";

const Raid = (props) => {
  const { myRaid, actionLogs } = props;
  const { login, team, character, control } = useSelector(s => s.auth)
  const myAssets = useSelector(getMyAssets);
  const myAccount = useSelector(getCharAccount);


  const navigate = useNavigate();

  const [hours, setHours] = React.useState(60);

  const [showInfo, setInfo] = React.useState(false);
  const [mode, setMode] = React.useState("raid");
  const [asset, setAsset] = React.useState(null);
  const [log, setLog] = React.useState(null);

  // useEffect(() => {
  //   //equivalent of comonentDidMount
  //   if (myRaid) {
  //     const log = actionLogs.find((el) => el.raid === myRaid._id);
  //     log ? setLog(log) : console.log(`Log not found for ${myRaid._id}`);
  //   }
  // }, [myRaid, actionLogs]);

  useEffect(() => {
    //calculate the amount of time till raid round expires
    if (myRaid && props.clock) {
      let countDownDate = new Date(myRaid.timeout).getTime();
      const now = new Date(props.clock.gametime).getTime();

      let distance = countDownDate - now;
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      distance <= 0 ? setHours(0) : setHours(hours);
    }
  }, [myRaid, props.clock]);

  const getReady = () => {
    const data = {
      character: character._id,
      raidID: myRaid._id,
      dungeon: myRaid._id,
    };
    socket.emit("request", { route: "location", action: "readyUp", data });
  };

  const leaveRaid = (raid) => {
    navigate("/location/dashboard");
    const data = {
      character: character._id,
      loc: myRaid._id,
      raidID: myRaid._id,
    };
    socket.emit("request", { route: "location", action: "leaveRaid", data });
  };

  const spendToken = (choice) => {
    const data = {
      raidID: myRaid._id,
      actor: character._id,
      account: myAccount._id,
    };
    socket.emit("request", { route: "location", action: choice, data });
  };

  const capitalize = (s) => {
    return s[0].toUpperCase() + s.slice(1);
  };

  // if (!login || !character || !myRaid) return <div />;
  const ice =
    myRaid && myRaid.currentIce
      ? myRaid.currentIce
      : { model: "Ice", description: "", name: "awaiting..." };

  const isMember = myRaid ? myRaid.members.some((el) => el._id === character._id) : false;

  return (
    <Grid
      templateRows='repeat(2, 1fr)'
      templateColumns='repeat(5, 1fr)'
      gap='1'
      h='calc(100vh - 120px)'
      fontWeight='bold'>
      <GridItem rowSpan={2} colSpan={1} bg='#0f131a'>
        <VStack divider={<Divider />}>
          {myAssets
            .filter(
              (el) => el.tags.some((tag) => tag === "dice") && !el.location
            )
            .map((asset, index) => (
              <Dice key={index} asset={asset} />
            ))}
        </VStack>
      </GridItem>

      <GridItem colSpan={2} bg='#0f131a'>
        <h5>{ice.name}</h5>
        <Ice ice={ice} />
      </GridItem>

      <GridItem colSpan={1} bg='#0f131a'>
        <h5>{myRaid.leader}'s Raid</h5>
        {control &&
          myRaid.status.map(
            (
              tag,
              index // left in for debugging
            ) => <Tag key={index}>{tag}</Tag>
          )}
        {!myRaid.status.some(
          (el) => el === "failed" || el === "successful"
        ) && (
            <div>
              Progress {myRaid.progress}
              <h4>{hours} hours left</h4>
              {new Date(myRaid.timeout).toDateString()}{" "}
              {new Date(myRaid.timeout).getHours()}:00
              <Divider />
              {isMember && !character.ready ? (
                <Button
                  variant="ghost"
                  color="green"
                  onClick={() => getReady()}
                >
                  Ready-Up
                </Button>
              ) : (
                <Button onClick={() => getReady()}>Un-Ready</Button>
              )}
            </div>
          )}
      </GridItem>

      <GridItem colSpan={1} bg='#0f131a'>
        Logs
      </GridItem>

      <GridItem colSpan={4} bg='#0f131a'>
        {myRaid.status.some((el) => el === "failed") && isMember && (
          <Button
            onClick={() => leaveRaid(myRaid)}
            appearance="primary"
            color="red"
          >
            Leave Raid
          </Button>
        )}

        {myRaid.status.some((el) => el === "successful") && isMember && (
          <div>
            <h2>Access tokens: {myRaid.access}</h2>
            <Button
              variant="solid"
              size="sm"
              colorScheme="green"
              onClick={() => spendToken("siphon")}
            >
              Siphon
            </Button>
            {myRaid.access <= 0 && (
              <Button
                onClick={() => leaveRaid(myRaid)}
                appearance="primary"
                colorScheme="red"
              >
                Leave Raid
              </Button>
            )}
          </div>
        )}

        {myRaid.status.some((el) => el === "working") && (
          <div>
            <Divider vertical />
            <Box>
              Subroutines
              {
                <Flex justify="center">
                  {ice.options &&
                    ice.options.map((subRotuine, index) => (
                      <Box
                        index={subRotuine._id}
                        colSpan={18 / ice.options.length}
                      >
                        <Divider vertical />
                        {subRotuine.description && (
                          <p>{subRotuine.description}</p>
                        )}
                        <Divider vertical />
                        <RaidIce
                          ice={ice}
                          loading={props.loading}
                          subRotuine={subRotuine}
                          raid={myRaid}
                          index={index}
                        />
                      </Box>
                    ))}
                </Flex>
              }
            </Box>
          </div>
        )}

      </GridItem>
    </Grid>
    // <Container style={{ height: 'calc(100vh - 110px)', textAlign: 'center'}}>

    //   <Content
    //     style={{
    //       backgroundColor: "#15181e",
    //       padding: "15px",
    //       width: "80%",
    //       position: "relative",
    //       display: "inline-block",
    //       textAlign: "center",
    //     }}
    //   >

    //     {mode === "log" && log && (
    //       <div>
    //         {log.rounds.length === 0 && <p>Nothing to report yet...</p>}
    //         {log.rounds.map((round) => (
    //           <div>
    //             Round: {round.round + 1}
    //             <FlexboxGrid align="middle">
    //               {round.subRoutines.map((subRoutine) => (
    //                 <FlexboxGrid.Item colSpan={24 / round.subRoutines.length}>
    //                   <div
    //                     style={{
    //                       padding: "5px",
    //                       width: "100%",
    //                       height: 200,
    //                       border: "2px solid white",
    //                     }}
    //                   >
    //                     {true && (
    //                       <div>
    //                         <p>Challenges</p>
    //                         {renderOptionDeets({
    //                           type: subRoutine.type,
    //                           value: subRoutine.value,
    //                         })}
    //                         <br />
    //                         <FlexboxGrid>
    //                           {subRoutine.rolls.map((die, index2) => (
    //                             <FlexboxGrid.Item colSpan={4}>
    //                               <Dice asset={die} />
    //                             </FlexboxGrid.Item>
    //                             // <Tag index={index2} color="blue">{die.dieName} - {die.result}</Tag>
    //                           ))}
    //                         </FlexboxGrid>
    //                       </div>
    //                     )}
    //                   </div>
    //                 </FlexboxGrid.Item>
    //               ))}
    //             </FlexboxGrid>
    //             <p>Consequences</p>
    //             {round.consequences.map((value) => renderOptionDeets(value))}
    //           </div>
    //         ))}
    //       </div>
    //     )}

    //     {mode === "raid" && (
    //       <div>
    //         <Divider vertical />

    //         {true && (
    //           <Panel style={{}}>
    //             {/* <img style={{ maxHeight: '200px', height: 'auto' }} src={ice ? `/images/ice/${ice.name}.jpg` : '/images/unknown.png'} alt={ice.name} /> */}
    //             <h3> {ice.name} </h3>
    //             <b>{ice.description}</b>
    //           </Panel>
    //         )}



    //   </Content>

    //   {showInfo && (
    //     <AssetInfo
    //       asset={asset}
    //       showInfo={showInfo}
    //       closeInfo={() => setInfo(false)}
    //     />
    //   )}
    // </Container>
  );
};

const mapStateToProps = (state) => ({
  // ice: state.locations.challenge,
  // control: state.auth.control,
  // clock: state.clock,
  // character: state.auth.user ? getcharacter(state) : undefined,
  // myAccount: state.auth.user ? getCharAccount(state) : undefined,
  // myAssets: state.auth.user ? getMyAssets(state) : undefined,
  // login: state.auth.login,
  // loading: state.gamestate.loading,
  // show: state.raids.show,
  // actionLogs: state.actionLogs.list,
});

const mapDispatchToProps = (dispatch) => ({
  closeResult: (data) => dispatch(closeResult(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Raid);
