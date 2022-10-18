import React from 'react';
import { useSelector } from "react-redux";

function usePermissions() {
    const isControl = useSelector(state => state.auth?.character?.tags);
    return isControl.includes('Control');
}

export default usePermissions;