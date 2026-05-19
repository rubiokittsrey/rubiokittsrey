'use client';

import { useEffect, type ReactNode } from 'react';
import { usePopUpStage, type PopUpPosition } from './pop-up-stage';

export function PopUp({
    id,
    position,
    children,
}: {
    id: string;
    position: PopUpPosition;
    children: ReactNode;
}) {
    const { registerPopUp } = usePopUpStage();
    useEffect(() => {
        return registerPopUp(id, { node: children, position });
    }, [id, position, children, registerPopUp]);
    return null;
}
