import React from 'react';
import { VerticalArrow, ITitleProps } from '.';

export const Title: React.FC<ITitleProps> = ({
    activateArrow = false,
    includeArrow = true,
    title,
    amount,
    wrapperClassName = '',
    titleClassName = '',
    selectCategory = (): void => {},
    id = '',
    onClick = (): void => {},
}) => (
    <section
        className={`flex cursor-pointer items-center justify-between ${wrapperClassName}`}
        onClick={(): void => selectCategory(id)}
    >
        <h2 className={`filters-title w-5/6 text-blue ${titleClassName} ${amount ? 'mr-auto' : ''}`}>{title}</h2>
        {amount && <label className={`filters-title w-1/12 text-blue ml-auto ${titleClassName}`}>({amount})</label>}
        <div className="w-1/12 pl-2">{includeArrow && <VerticalArrow rotate={activateArrow} onClick={onClick} />}</div>
    </section>
);
