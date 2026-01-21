import React from 'react';
import { Help } from '@models/HelpCenter';
import { INSTRUCTIONS } from '.';

export const InstructionCards: React.FC<{ selectHelp: (help: Help) => void }> = ({ selectHelp }) => {
    return (
        <div className="instructions">
            {INSTRUCTIONS.map(({ image, title, description, help }) => (
                <div className="card" key={title} onClick={(): void => selectHelp(help)}>
                    <img className="m-auto" src={image} alt="Help" />
                    <h3 className="card__title">{title}</h3>
                    <p className="card__description">{description}</p>
                </div>
            ))}
        </div>
    );
};
