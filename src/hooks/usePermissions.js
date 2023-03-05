import React from 'react';
import { useSelector } from "react-redux";

function usePermissions() {
    const isControl = useSelector(state => state.auth?.myCharacter?.tags);
    const isTech = useSelector(state => state.auth?.myCharacter?.tags);
    const characterId = useSelector(state => state.auth?.myCharacter?._id);

    return {
        isControl: isControl && isControl.includes('Control'),
        isTech: isTech && isTech.includes('Tech'),
        characterId
    };
}

export default usePermissions;