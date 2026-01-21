import React, { KeyboardEvent } from 'react';
import { IFormProps, ENTER } from '.';

export const Form: React.FC<IFormProps> = React.memo(({ children, sendWithEnter = false, className, id = '', onScroll }) => (
    <form
        autoComplete="off"
        className={className}
        id={id}
        {...(!sendWithEnter && { onKeyDown: (e: KeyboardEvent): void => (e.key == ENTER ? e.preventDefault() : undefined) })}
        onScroll={onScroll}
    >
        {children}
    </form>
));
