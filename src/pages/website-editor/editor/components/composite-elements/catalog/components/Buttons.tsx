import React from 'react';
import filter from '@assets/images/filter.svg';
import sort from '@assets/images/sort.svg';
import { Filter } from '../../../element-editor';
import { ActiveButton } from '..';

export const Buttons: React.FC<{
    activeButton: ActiveButton | null;
    activateButton: (button: ActiveButton) => void;
    filters?: string;
}> = ({ activeButton, activateButton, filters }) => {
    const getBackground = (button: ActiveButton): string => (button === activeButton ? 'bg-gray-neutral' : 'bg-white');

    return (
        <div className="flex mt-4.5">
            <button
                className={`mobile-button ${getBackground(ActiveButton.Filter)}`}
                type="button"
                onClick={(): void => activateButton(ActiveButton.Filter)}
            >
                <img src={filter} alt="filter" />
                Filtrar por
            </button>
            {filters && (filters?.includes(Filter.DATE) || filters?.includes(Filter.VALUE)) && (
                <button
                    className={`mobile-button ${getBackground(ActiveButton.Sort)}`}
                    type="button"
                    onClick={(): void => activateButton(ActiveButton.Sort)}
                >
                    <img src={sort} alt="sort" />
                    Ordenar por
                </button>
            )}
        </div>
    );
};
