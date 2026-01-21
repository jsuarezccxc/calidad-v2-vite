import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextInput } from '@components/input';
import { Button } from '@components/button';
import { CurrentStep } from '@components/current-step';
import { Form } from '@components/form';
import { CommonProperty } from '@models/WebsiteNode';
import { AVAILABLE_DOMAIN, REQUIRED_SUBDOMAIN } from '@constants/Domain';
import { PRODUCT_NAME } from '@constants/ProductName';
import { createSubdomain, getUrl } from '@utils/Domain';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { postSubdomain } from '@redux/website/actions';
import { deleteHostedZone } from '@redux/domain/actions';
import { getCommonProperties } from '@redux/website-node/actions';
import usePermissions from '@hooks/usePermissions';
import { ActiveDomainModal } from '..';
import { CURRENT_STEP, IConnectDomainProps, getSubdomainMessage, getVerificationMessage } from '.';
import './ConnectDomain.scss';

export const ConnectDomain: React.FC<IConnectDomainProps> = ({
    commonProperties,
    domain,
    isDomain,
    updateSecurityDomain,
    url,
    setUrl,
    message,
    setMessage,
    setIsVerifiedParent,
}) => {
    const dispatch = useDispatch();
    const { disabledInputs } = usePermissions();
    const [isValid, setIsValid] = useState<boolean>(false);
    const [isVerified, setIsVerified] = useState<boolean>(false);

    const [showActiveModal, setShowActiveModal] = useState<boolean>(false);

    useEffect(() => setUrl(isDomain ? '' : getUrl(domain)), [domain, isDomain]);

    const handleUrlChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
        setIsVerified(false);
        setUrl(value);
        setIsValid(true);
    };

    const verifyDomain = async (): Promise<void> => {
        if (!url) return setMessage(REQUIRED_SUBDOMAIN);
        const subdomain = createSubdomain(url);
        const isValid = String(await dispatch(postSubdomain(subdomain, true))) === AVAILABLE_DOMAIN;
        setMessage(getVerificationMessage(url, isValid));
        setIsValid(isValid);
        setIsVerified(isValid);
    };

    const handleShowActiveModal = (): void => {
        setShowActiveModal(!showActiveModal);
    };

    const saveSubdomain = async (): Promise<void> => {
        if (message && !isValid) return;
        if (!url || !isVerified) return setMessage(getSubdomainMessage(url, isVerified));
        const subdomain = createSubdomain(url);
        const isCreated = Boolean(await dispatch(postSubdomain(subdomain, false)));

        if (isCreated) {
            if (isDomain && domain) {
                await dispatch(
                    deleteHostedZone({
                        domain_name: commonProperties.domain,
                        hosted_zone_id: commonProperties?.hosted_zone?.hostedZoneId,
                    })
                );
            }
            await updateSecurityDomain(subdomain);
            await dispatch(getCommonProperties([CommonProperty.Domain]));
            handleShowActiveModal();
            setIsVerifiedParent(true);
            setMessage('');
            setIsValid(false);
            setIsVerified(false);
        }
    };

    return (
        <div className="connect-domain">
            <ActiveDomainModal show={showActiveModal} showModal={handleShowActiveModal} />
            <div className="connect-domain__title">
                <h3 className="title">Cómo escoger y activar el dominio</h3>
            </div>
            <div className="connect-domain__content">
                <div className="subtitle__container">
                    <label className="title title--bold">Conectar dominio con {PRODUCT_NAME}</label>
                </div>
                <CurrentStep title={CURRENT_STEP.title} description={CURRENT_STEP.description} />
            </div>
            <div className="connect-domain__info">
                <p className="mb-2 step--description">
                    Este dominio le permite seleccionar el <span className="step--text-italic text-purple">Nombre</span> que
                    quiera añadir a la extensión {process.env.REACT_APP_AWS_ROOT_DOMAIN}, una vez seleccionado debe verificar que
                    esté disponible.
                </p>
                <label className="step--bold">
                    ejemplo: <span className="step--text-italic text-purple">Margaritarosa.</span>
                    <span className="text-black step--text-italic">{process.env.REACT_APP_AWS_ROOT_DOMAIN}</span>
                </label>
                <div className="container__input">
                    <Form className="verify__content">
                        <TextInput
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `connect-domain-url`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            value={url}
                            placeholder="..."
                            labelText="Escriba el nombre"
                            onChange={handleUrlChange}
                            required={!!message}
                            requiredText={message}
                            classesLabel="label-input"
                            classesWrapper={`name-domain ${message ? 'with--message' : ''}`}
                            classesWrapperInput="wrapper--border"
                            classesInput="text-input"
                            disabled={disabledInputs}
                        />
                        <TextInput
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `connect-domain`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.TXT,
                            })}
                            value={`.${process.env.REACT_APP_AWS_ROOT_DOMAIN ?? ''}`}
                            classesWrapperInput="bg-white"
                            classesWrapper="domain"
                            disabled
                        />
                        <Button
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `connect-domain`,
                                action: ActionElementType.VERIFY,
                                elementType: ElementType.BTN,
                            })}
                            text="Verificar"
                            disabled={disabledInputs}
                            onClick={verifyDomain}
                        />
                    </Form>
                </div>
                <p className="step--description-gray mb-7">
                    Una vez haya sido verificado que el nombre de su dominio &nbsp;
                    <span className="step--text-italic text-purple">Nombre</span>
                    <span className="text-black step--text-italic">.{process.env.REACT_APP_AWS_ROOT_DOMAIN}</span> está disponible
                    asegúrese que el nombre verificado es el correcto, de tener algún error corríjalo y haga click nuevamente en
                    “verificar”.
                </p>
                <p className="step--description-gray">
                    Con el nombre correcto y verificado haga click en “activar”. Cuando el dominio este activado será debidamente
                    notificado.
                </p>
                <div className="active__container">
                    <Button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `connect-domain`,
                            action: ActionElementType.ACTIVATE,
                            elementType: ElementType.BTN,
                        })}
                        text="Activar"
                        background="blue"
                        disabled={(message && !isValid) || !url || !isVerified || disabledInputs}
                        onClick={saveSubdomain}
                    />
                </div>
            </div>
        </div>
    );
};
