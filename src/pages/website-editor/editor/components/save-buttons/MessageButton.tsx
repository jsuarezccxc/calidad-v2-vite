import React from 'react';
import { IMessageButtonProps, MESSAGE_SAVE_KEY, actionButtons, propMessage } from '.';
import './MessageButton.scss';

export const MessageButton: React.FC<IMessageButtonProps> = ({ statusSave, isDraft, publish, messagePublish }) => {
    const getMessageSave = (): string => {
        return MESSAGE_SAVE_KEY[statusSave];
    };

    return (
        <div className="message-button__container">
            {actionButtons.map((_, index) => (
                <div className="message-button" key={`text-${index}`}>
                    <div className="container__message">
                        {!index && (
                            <span
                                className={`mr-2 mt-1.5 w-1.5 h-1.5 rounded-full ${
                                    statusSave ? (statusSave === propMessage.error ? 'bg-red ' : 'bg-green-neutral') : ''
                                }`}
                            />
                        )}
                        <p className={`text--date ${index ? 'cursor-default tracking-tight' : ''}`}>
                            {!index ? getMessageSave() : !isDraft && messagePublish}
                        </p>
                    </div>
                    {!!index && <p className="message-publish">{publish.toLocaleDateString()}</p>}
                </div>
            ))}
        </div>
    );
};
