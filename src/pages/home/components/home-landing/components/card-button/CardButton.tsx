import React from 'react';
import { ICardButton } from '.';
import './CardButton.scss';

const CardButton: React.FC<ICardButton> = ({ title, onClick }) => {
    return (
        <button className="CardButton" onClick={onClick}>
            <span className="CardButton__text"> {title}</span>
        </button>
    );
};

export default React.memo(
    CardButton,
    (prepProps: Readonly<React.PropsWithChildren<ICardButton>>, nextProps: Readonly<React.PropsWithChildren<ICardButton>>) =>
        prepProps.title === nextProps.title
);
