import React from 'react';
import { getAlphabet } from '@utils/Search';
import { IAlphabetFilter } from '.';

const AlphabetFilter: React.FC<IAlphabetFilter> = ({ onLetterClick }) => {
    const alphabet = getAlphabet();

    return (
        <div className="flex flex-wrap justify-center w-full my-0 rounded border-1 border-gray">
            {alphabet.map(letter => (
                <button key={letter} className="px-1.25 py-1.5 text-gray-dark" onClick={(): void => onLetterClick(letter)}>
                    {letter}
                </button>
            ))}
        </div>
    );
};

export default AlphabetFilter;
