import React from "react";
import { Box, Flex, Heading, IconButton, SimpleGrid, Tag, useBreakpointValue } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import usePermissions from "../../../../hooks/usePermissions";
import { CloseIcon } from "@chakra-ui/icons";
import WordDivider from "../../../WordDivider";

function ActionResources({assets}) {
    const assetList = useSelector(state => state.assets.list);
    const {isControl} = usePermissions();
    const breakpoints = useBreakpointValue({
        base: {columns: 0, rows: 3, width: '15rem', bottom: '1.75rem', left: '7.5rem'},
        md: {columns: 3, rows: 0, width: '10rem', bottom: '1.75rem', left: '5rem'},
        lg: {columns: 3, rows: 0, width: '15rem', bottom: '1.75rem', left: '7.5rem'}
    })

    function getAsset(assetID) {
        return assetID ? assetList.find((el) => el._id === assetID) : null;
    }

    const renderAsset = (assetID) => {
        const retrievedAsset = getAsset(assetID);
        let inner;
        if (retrievedAsset) {
            inner = (
                <Box>
                    {isControl &&
                        <IconButton
                            size="xs"
                            onClick={(e) => {
                                //TODO: add remove asset logic
                                console.log('im clicked instead');
                                e.stopPropagation()
                            }}
                            icon={<CloseIcon/>}
                            backgroundColor="red"
                            aria-label={'Remove Asset'}
                            position='relative'
                            bottom={breakpoints.bottom}
                            left={breakpoints.left}
                            isRound
                        />
                    }
                    <Box>
                        <Heading
                            as='h6'
                            size={'sm'}
                            marginTop={isControl ? '-1.5rem' : 0}
                            marginBottom={'1rem'}
                            wordBreak={'break-word'}
                        >
                            {retrievedAsset.type}
                        </Heading>
                        <Box
                            wordBreak={'break-word'}
                        >{retrievedAsset.name}</Box>
                        <Box
                            height={'1.5rem'}
                            marginTop={'1rem'}
                        >
                            {retrievedAsset.status.used && <Tag colorScheme='whiteAlpha'>Used</Tag>}
                        </Box>
                    </Box>
                </Box>
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
                padding={'1rem'}
                border={'1px solid white'}
                borderRadius={'10'}
                marginTop={'2rem'}
                cursor={retrievedAsset ? 'pointer' : 'initial'}
                onClick={() => {
                    //TODO: add show info logic
                    //retrievedAsset &&
                    console.log('am clicked');
                }}
            >
                {inner}
            </Flex>
        )
    };

    return (
        <Box>
            <WordDivider word='Resources'/>
            <SimpleGrid
                columns={breakpoints.columns}
                rows={breakpoints.rows}
            >
                {[1, 2, 3].map(index => (
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