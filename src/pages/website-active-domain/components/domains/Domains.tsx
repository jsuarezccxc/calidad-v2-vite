import React, { useState } from 'react';
import { Icon } from '@components/icon';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { IDomainsProps } from '.';
import './Domains.scss';

export const Domains: React.FC<IDomainsProps> = ({ domains, customAction = (): void => {} }) => {
    const [valueClipboard, setValueClipboard] = useState<string>('');

    const handleCopy = (domain: string): void => {
        navigator.clipboard.writeText(domain).then(() => {
            setValueClipboard(domain);
            customAction();
        });
    };

    return (
        <div className="domains">
            <div className="domains__header">
                <div className="header--item">
                    <label className="title">Nombres de dominios (DNS)</label>
                </div>
                <div className="space--blank" />
            </div>
            <div className="domains__body">
                {domains?.map((domain, index) => (
                    <div
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `domain-${index}`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.CRD,
                        })}
                        className="body--item"
                        key={`domain-${index}`}
                    >
                        <div className="name__container">
                            <label className="name__container--domain">{domain}</label>
                        </div>
                        <div className="icon__container" onClick={(): void => handleCopy(domain)}>
                            <Icon name="copyBorderBlue" className="icon--copy" />
                            {valueClipboard === domain && <label className="copy--text">Copiado</label>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
