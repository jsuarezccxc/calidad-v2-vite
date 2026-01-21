import React from 'react';
import { Button } from '@components/button';
import { CardButtonText } from '@utils/Plans';

export const DetailButton: React.FC<{ id: string; open: boolean; toggleOpening: () => void }> = ({
    id,
    children,
    toggleOpening,
}) => (
    <>
        <Button id={id} text={CardButtonText.ViewDetails} classes="memberships-section__button-details" onClick={toggleOpening} />
        {children}
    </>
);
