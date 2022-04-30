import React from "react";
import { useSelector } from "react-redux"; // Redux store provider
import { getCharacterById } from "../../redux/entities/characters";

const RenderCharName = (userId) => {
  const char = useSelector(getCharacterById(userId.userId));
  return <div>{char.characterName}</div>;
};

export default RenderCharName;
