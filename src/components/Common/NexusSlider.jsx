
import React from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from '@chakra-ui/react'

function NexusSlider(props) {
  const { defaultValue, max, min, onChange } = props;

  return (
    <Slider max={max} onChange={onChange} aria-label='slider-ex-1' defaultValue={defaultValue}>
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  );
}

export default NexusSlider;