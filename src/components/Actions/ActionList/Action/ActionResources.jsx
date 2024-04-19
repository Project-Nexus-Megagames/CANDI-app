import React, { useEffect } from "react";
import { Box, Flex, Heading, IconButton, SimpleGrid, Tag, useBreakpointValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import usePermissions from "../../../../hooks/usePermissions";
import { CloseIcon } from "@chakra-ui/icons";
import WordDivider from "../../../Common/WordDivider";
import AssetCard from "../../../Common/AssetCard";

function ActionResources({ assets, toggleAssetInfo, actionType }) {
    const assetList = useSelector(state => state.assets.list);
    const {isControl} = usePermissions();
    const [slots, setSlots] = React.useState([]);

    const breakpoints = useBreakpointValue({
      sm: {columns: 1, rows: actionType.maxAssets, width: '', bottom: '1.0rem', left: '7.5rem'},
        base: {columns: 1, rows: actionType.maxAssets, bottom: '1.0rem', left: '7.5rem'},
        md: {columns: 2, rows: 0, bottom: '1.0rem', left: '5rem'},
        lg: {columns: actionType.maxAssets, rows: 0, width: '22vw', bottom: '1.0rem', left: '7.5rem'}
    })

    useEffect(() => {
      newMap(actionType.maxAssets);
    }, [ actionType ])

    function getAsset(assetID) {
        return assetID ? assetList.find((el) => el._id === assetID) : null;
    }

    function newMap(number) {
      let arr = [];
      for (let i = 0; i < number; i++) {
        arr.push(undefined);
      }
      setSlots(arr);
    }

    const renderAsset = (assetID) => {
        const retrievedAsset = getAsset(assetID);
        let inner;
        if (retrievedAsset) {
            inner = (
              <AssetCard asset={retrievedAsset} disabled />
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
                minH={'25vh'}
            >
                {inner}
            </Flex>
        )
    };

    return (
        <Box>
            <WordDivider word={`Assets(${assets.length})` }/>
            <SimpleGrid
              columns={breakpoints.columns}
              rows={breakpoints.rows}
            >
                {slots.map((slot, index) => (
                        renderAsset(assets[index])
                ))}
            </SimpleGrid>
        </Box>
    );
}

export default ActionResources;