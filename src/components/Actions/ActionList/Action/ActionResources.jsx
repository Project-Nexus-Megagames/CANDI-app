import React, { useEffect } from "react";
import { Box, Flex, Heading, IconButton, SimpleGrid, Tag, useBreakpointValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import usePermissions from "../../../../hooks/usePermissions";
import { CloseIcon } from "@chakra-ui/icons";
import WordDivider from "../../../Common/WordDivider";
import AssetCard from "../../../Common/AssetCard";
import socket from "../../../../socket";

function ActionResources({ assets, toggleAssetInfo, actionType, action }) {
  const assetList = useSelector(state => state.assets.list);
  const { isControl } = usePermissions();
  const [slots, setSlots] = React.useState([]);

  const breakpoints = useBreakpointValue({
    base: { columns: 0, rows: actionType.maxAssets, width: '15rem', bottom: '1.75rem', left: '7.5rem' },
    md: { columns: actionType.maxAssets, rows: 0, width: '15rem', bottom: '1.75rem', left: '5rem' },
    lg: { columns: actionType.maxAssets, rows: 0, width: '25rem', bottom: '1.75rem', left: '7.5rem' }
  })

  useEffect(() => {
    newMap(actionType.maxAssets);
  }, [actionType])

  function getAsset(assetID) {
    return assetID ? assetList.find((el) => el._id === assetID) : null;
  }

  const rejectAsset = async (asset) => {
    socket.emit('request', {
      route: 'action',
      action: 'controlReject',
      data: { asset: asset, id: action }
    });
  };


  function newMap(number) {
    let arr = [];
    for (let i = 0; i < number; i++) {
      arr.push(undefined);
    }
    setSlots(arr);
  }

  const renderAsset = (assetID) => {
    console.log("Scott: ", assetID)
    const retrievedAsset = getAsset(assetID);
    let inner;
    if (assetID && assetID._id)
      inner = (
        <AssetCard
          removeAsset={() => isControl ? rejectAsset(assetID._id) : undefined}
          showRemove={isControl}
          asset={assetID}
          disabled
        />
      );
    if (retrievedAsset) {
      inner = (
        <AssetCard
          removeAsset={() => isControl ? rejectAsset(retrievedAsset._id) : undefined}
          showRemove={isControl}
          asset={retrievedAsset}
          disabled
        />
      );
    } else {
      inner = 'Empty Slot'
    }

    return (
      <Flex
        backgroundColor={'#0e1013'}
        textAlign={'center'}
        justifyContent={'center'}
        alignItems={'center'}
        width={breakpoints.width}
        border={'1px solid white'}
        borderRadius={'10'}
        marginTop={'2rem'}
        minH="10vh"
        onClick={() => retrievedAsset && toggleAssetInfo(retrievedAsset)}
      >
        {inner}
      </Flex>
    )
  };

  return (
    <Box>
      <WordDivider word={`Assets(${assets.length})`} />
      <SimpleGrid
        columns={breakpoints.columns}
        rows={breakpoints.rows}
      >
        {slots.map((slot, index) => (
          <Flex
            key={index}
            justifyContent={'center'}
          >
            {renderAsset(assets[index])}
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default ActionResources;