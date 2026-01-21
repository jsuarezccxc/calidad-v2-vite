import React, { useContext } from 'react';
import { Button } from '@components/button';
import { Direction, DocsInstructionContext } from '../context';
import { IButtonRedirect } from '.';

export const ButtonRedirect: React.FC<IButtonRedirect> = ({ text = '', className = '' }) => {
    const { getNextStepRoute } = useContext(DocsInstructionContext);

    const handleRedirectRoute = (): void => {
        getNextStepRoute(Direction.NEXT);
    };
    return <Button classes={className} text={text} onClick={handleRedirectRoute} />;
};
