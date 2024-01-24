import React from 'react';
import { useSelector } from "react-redux";

function usePermissions() {
    const auth = useSelector(state => state.auth);
    const isControl = useSelector(state => state.auth?.myCharacter?.tags);
    const isTech = useSelector(state => state.auth?.myCharacter?.tags);
    const characterId = useSelector(state => state.auth?.myCharacter?._id);

    return {
        isControl: isControl && (isControl.includes('Control') || isControl.includes('control') || auth.isControl ),
        isTech: isTech && isTech.includes('Tech'),
        characterId
    };
}

export default usePermissions;