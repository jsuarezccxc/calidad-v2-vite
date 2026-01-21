import React from 'react';
import { ITableErrorProps } from '.';

export const TableError: React.FC<ITableErrorProps> = ({ mistakes = 0, customText = '', className = '' }) => {
    const error = mistakes > 1 ? '* Los campos resaltados son necesarios' : '* El campo resaltado es necesario';

    return (
        <p className={`leading-4 text-purple text-tiny ${className}`}>
            {customText ? customText : <>{error}, agregue datos para continuar.</>}
        </p>
    );
};
