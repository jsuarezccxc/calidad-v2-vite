import React from 'react';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
import type { ICreateQuoteButtonProps } from '..';
import '../QuoteList.scss';

export const CreateQuoteButton: React.FC<ICreateQuoteButtonProps> = ({ onClick, disabled = false }) => {
    return (
        <button
            id={generateId({
                module: ModuleApp.QUOTES,
                action: ActionElementType.CREATE,
                elementType: ElementType.BTN,
            })}
            type="button"
            aria-label="Crear cotización"
            onClick={onClick}
            disabled={disabled}
            className={`quote-list__create-button ${disabled ? 'quote-list__create-button--disabled' : ''}`}
        >
            <div className="quote-list__icon-container">
                <svg className="quote-list__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
            <span className="quote-list__button-text">Crear cotización</span>
        </button>
    );
};
