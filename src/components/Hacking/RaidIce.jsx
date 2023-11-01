import { Box, Flex } from "@chakra-ui/react";
import SubRoutine from "./SubRoutine";
import Dice from "./Dice";
import socket from "../../socket";
import { useDrag } from "react-dnd";

export const RaidIce = ({ subRotuine, raid, index, loading }) => {
  // const [{ isOver }, drop] = useDrag(() => ({
  //   accept: ["asset", "ice"],
  //   drop: (item) =>
  //   true ? socket.emit("request", {
  //       route: "location",
  //       action: "contribute",
  //       data: { raidID: raid._id, choiceIndex: index, asset: item.id },
  //     }) : console.log('nope'),
  //   // drop: (item) => console.log(item),
  //   collect: (monitor) => ({
  //     isOver: !!monitor.isOver(),
  //   }),
  // }));

  const stats = (assets, cost) => {
    const probs = [];
    let sum = 0;
    for (let asset of assets) {
      sum = 1;
      probs.push(1 - (asset.level+1 - cost) / asset.level)
    }

    for (let prob of probs.filter(el => el > 0)) {
      sum = sum * prob
    }

    if (sum >= 1 || sum == 0) return (sum*100);
    return (Math.trunc((1 - sum)*100));
  };

  return (
    <div>
      <SubRoutine loading={loading} subRotuine={subRotuine} index={index} />
      <div
        index={subRotuine._id}
        style={{ width: "100%", border: ".75px solid white" }}
      >
        
        <Flex>
          {subRotuine.contributed.map((die, index2) => (
            <Box key={index2} colSpan={4}>
              <Dice alt asset={die} />
            </Box>
          ))}
        </Flex>
        <Box>{stats(subRotuine.contributed, subRotuine.challengeCost.value)}% Chance of success</Box>
      </div>      
    </div>

  );
};