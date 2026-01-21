import React from 'react';

import { TextInput } from '@components/input';
import { Button } from '@components/button';
import { Form } from '@components/form';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import usePermissions from '@hooks/usePermissions';

import { MAIN_STEP_PAGINATOR } from '../..';
import { IConnectOwnDomainProps } from '.';
import './ConnectOwnDomain.scss';

export const ConnectOwnDomain: React.FC<IConnectOwnDomainProps> = ({
    invalidDomain,
    emptyDomain,
    value,
    onChange,
    currentPage,
    handleMainAction,
}) => {
    const handleOwnDomain = (event: React.ChangeEvent<HTMLInputElement>): void => {
        onChange(event.target.value);
    };
    const { disabledInputs } = usePermissions();

    return (
        <div className="connect-own-domain">
            <div className="domain-url__content">
                <div className="container__input">
                    <Form>
                        <TextInput
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: 'own-domain',
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            placeholder="nombrededominio.com"
                            classesWrapper="input--styles"
                            classesWrapperInput={invalidDomain || emptyDomain ? 'input--wrapper-styles' : ''}
                            value={value}
                            onChange={handleOwnDomain}
                            disabled={currentPage === MAIN_STEP_PAGINATOR.EIGHTH_PAGE || disabledInputs}
                        />
                    </Form>
                    {invalidDomain && <p className="is-valid">*El nombre &quot;{value}&quot; es incorrecto</p>}
                    {emptyDomain && <p className="is-valid">*Campo obligatorio</p>}
                </div>
                <div className="button__container">
                    <Button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: 'own-domain',
                            action: MAIN_STEP_PAGINATOR.FIRST_PAGE ? ActionElementType.CONNECT : ActionElementType.ACTIVATE,
                            elementType: ElementType.BTN,
                        })}
                        text={currentPage === MAIN_STEP_PAGINATOR.FIRST_PAGE ? 'Conectar' : 'Activar'}
                        onClick={(): void => handleMainAction()}
                        disabled={disabledInputs}
                    />
                </div>
            </div>
        </div>
    );
};
