import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TextInput } from '@components/input';
import { Form } from '@components/form';
import { Button, Link, LinkColor } from '@components/button';
import { Icon } from '@components/icon';
import { Tooltip } from '@components/tooltip';
import { createSubdomain, getUrl } from '@utils/Domain';
import { ModuleApp, ActionElementType, ElementType, generateId } from '@utils/GenerateId';
import { CommonProperty } from '@models/WebsiteNode';
import { getCommonProperties } from '@redux/website-node/actions';
import { postSubdomain } from '@redux/website/actions';
import { deleteSubdomain } from '@redux/domain/actions';
import { AVAILABLE_DOMAIN, REQUIRED_SUBDOMAIN } from '@constants/Domain';
import { PRODUCT_NAME } from '@constants/ProductName';
import usePermissions from '@hooks/usePermissions';
import usePopper from '@hooks/usePopper';
import {
    ActiveDomainModal,
    Domains,
    getSubdomainMessage,
    getVerificationMessage,
    INVALID_DOMAIN_MESSAGE,
    ISummaryDomainProps,
    urlProtocols,
} from '..';
import './SummaryDomain.scss';

export const SummaryDomain: React.FC<ISummaryDomainProps> = ({
    domain,
    subdomain,
    commonProperties,
    handleAction,
    updateSecurityDomain,
    setIsEditActionModal,
    isEditActionModal,
    setNewDomainEdit,
}) => {
    const dispatch = useDispatch();
    const { disabledInputs } = usePermissions();
    const [nameDomain, setNameDomain] = useState('');
    const { anchorEl, mouseProps } = usePopper();
    const domains = useMemo(() => commonProperties?.hosted_zone?.dns?.map((item: string) => item), [commonProperties]);
    const [isEditDomain, setIsEditDomain] = useState(false);
    const [message, setMessage] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [showActiveModal, setShowActiveModal] = useState<boolean>(false);

    useEffect(() => {
        async (): Promise<void> => {
            await dispatch(getCommonProperties([CommonProperty.Domain, CommonProperty.HostedZone]));
        };
    }, []);

    useEffect(() => {
        handleGetNameDomain();
    }, [domain, subdomain]);

    useEffect(() => {
        if (isEditActionModal) handleShowActiveModal();
    }, [isEditActionModal]);

    const handleGetNameDomain = (): void => {
        const subdomainName = getUrl(subdomain);
        domain ? setNameDomain(domain) : setNameDomain(subdomainName || '');
    };

    const handleGoWebsite = (): void => {
        let containProtocol = false;
        const currentUrl = domain || subdomain;

        urlProtocols.forEach(protocol => {
            if (currentUrl.includes(protocol)) return (containProtocol = true);
        });

        window.open(containProtocol ? currentUrl : `http://${currentUrl}`);
    };

    const verifyDomain = async (): Promise<void> => {
        if (!nameDomain) return setMessage(REQUIRED_SUBDOMAIN);
        if (!isValidString(nameDomain)) return setMessage(INVALID_DOMAIN_MESSAGE);
        const subdomain = createSubdomain(nameDomain);
        const isValid = String(await dispatch(postSubdomain(subdomain, true))) === AVAILABLE_DOMAIN;
        setMessage(getVerificationMessage(nameDomain, isValid));
        setIsValid(isValid);
        setIsVerified(isValid);
    };

    const handleNameDomainChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
        setIsVerified(false);
        setNameDomain(value);
        setIsValid(true);
    };

    const handleShowActiveModal = (): void => {
        setShowActiveModal(!showActiveModal);
    };

    const saveSubdomain = async (): Promise<void> => {
        if (message && !isValid) return;
        if (!nameDomain || !isVerified) return setMessage(getSubdomainMessage(nameDomain, isVerified));

        dispatch(deleteSubdomain(subdomain));

        const newSubdomain = createSubdomain(nameDomain);
        const isCreated = Boolean(await dispatch(postSubdomain(newSubdomain, false)));

        if (isCreated) {
            setNewDomainEdit(newSubdomain);
            await updateSecurityDomain(newSubdomain);
            await dispatch(getCommonProperties([CommonProperty.Domain]));
            setIsEditDomain(false);
            setIsEditActionModal(true);
            setMessage('');
            setIsValid(false);
            setIsVerified(false);
        }
    };

    const isValidString = (str: string): boolean => {
        const hasSpecial = /[^a-zA-Z0-9-]/.test(str);
        const startsOrEndsWithDash = str.startsWith('-') || str.endsWith('-');
        return !hasSpecial && !startsOrEndsWithDash;
    };

    const textDomainLink = `Si desea conectar a un dominio ${domain ? `con ${PRODUCT_NAME}` : 'propio'}`;
    const textDomain = `Tenga en cuenta que al conectar un nuevo dominio ${
        domain ? `con ${PRODUCT_NAME}` : 'propio'
    }, el dominio ${domain ? 'propio' : `con ${PRODUCT_NAME}`} que tenía
                    previamente será eliminado.`;

    return (
        <div className="summary-domain">
            <ActiveDomainModal
                show={showActiveModal}
                showModal={handleShowActiveModal}
                onClick={(): void => {
                    setShowActiveModal(false);
                    setIsEditActionModal(false);
                }}
            />
            <div className="summary-domain__title">
                <h3 className="title">Cómo escoger y activar el dominio</h3>
            </div>
            {!domain && (
                <div className="mb-7">
                    <h4 className="font-allerbold text-blue mb-4.5">Actualizar dominio</h4>
                    <p className="font-aller text-gray-dark ">
                        Desde esta pantalla edite y actualice el dominio de su sitio web en {PRODUCT_NAME}.
                    </p>
                </div>
            )}
            <div className="summary-domain__info">
                <div className={`${domain ? 'domains__container' : 'domain__container'}`}>
                    <label className="title">Su dominio actual es</label>
                    <Form>
                        <div className="input__container">
                            <TextInput
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `name-domain`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                value={nameDomain}
                                disabled={!isEditDomain}
                                classesWrapper="input--styles"
                                classesWrapperInput="wrapper--border"
                                classesInput="text-input"
                                onChange={handleNameDomainChange}
                                required={!!message}
                                requiredText={message}
                            />
                            {!domain && (
                                <TextInput
                                    id={generateId({
                                        module: ModuleApp.WEBSITE,
                                        submodule: `name-domain-aws-root`,
                                        action: ActionElementType.INPUT,
                                        elementType: ElementType.TXT,
                                    })}
                                    value={`.${process.env.REACT_APP_AWS_ROOT_DOMAIN}`}
                                    disabled
                                    classesWrapperInput="bg-white"
                                    classesWrapper="domain--styles"
                                />
                            )}
                            {!domain && (
                                <>
                                    {!isEditDomain ? (
                                        <Icon
                                            id={generateId({
                                                module: ModuleApp.WEBSITE,
                                                submodule: `domain`,
                                                action: ActionElementType.EDIT,
                                                elementType: ElementType.ICO,
                                            })}
                                            name="editBlue"
                                            className="w-5.5 h-5.5"
                                            onClick={(): void => setIsEditDomain(true)}
                                        />
                                    ) : (
                                        <button
                                            id={generateId({
                                                module: ModuleApp.WEBSITE,
                                                submodule: `domain`,
                                                action: ActionElementType.VERIFY,
                                                elementType: ElementType.BTN,
                                            })}
                                            className="verify-btn"
                                            onClick={verifyDomain}
                                            type="button"
                                        >
                                            <span {...mouseProps}>
                                                <Icon name="infoGreen" className="w-4 h-4 cursor-pointer" />
                                            </span>
                                            <span className="flex items-center justify-center w-full h-full font-allerbold">
                                                Verificar
                                            </span>

                                            <Tooltip
                                                id={generateId({
                                                    module: ModuleApp.WEBSITE,
                                                    submodule: `domain-disponibility`,
                                                    action: ActionElementType.INFO,
                                                    elementType: ElementType.TOOL,
                                                })}
                                                anchorEl={anchorEl}
                                                iconName="infoBlue"
                                                title="Verificar:"
                                                description="Consulte la disponibilidad y validez del nombre del dominio"
                                                placement="top-start"
                                                textStyles="text-blue"
                                                wrapperClassName="rounded-lg"
                                            />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </Form>
                    <div className="button__container">
                        {!isEditDomain ? (
                            <Button
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `go-to-website`,
                                    action: ActionElementType.REDIRECT,
                                    elementType: ElementType.BTN,
                                })}
                                disabled={disabledInputs}
                                text="Ir al sitio web"
                                onClick={(): void => handleGoWebsite()}
                            />
                        ) : (
                            <Button
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `domain`,
                                    action: ActionElementType.ACTIVATE,
                                    elementType: ElementType.BTN,
                                })}
                                text="Activar"
                                background="blue"
                                disabled={(message && !isValid) || !nameDomain || !isVerified || disabledInputs}
                                onClick={saveSubdomain}
                            />
                        )}
                    </div>
                </div>
                {domain && (
                    <div>
                        <Domains domains={domains} />
                    </div>
                )}
            </div>
            <div className="summary-domain__description">
                <p className="description">
                    {textDomainLink}, &nbsp;
                    <Link
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `domain`,
                            action: ActionElementType.ACTION,
                            elementType: ElementType.LNK,
                        })}
                        href={'#'}
                        onClick={(): void => handleAction(!!domain)}
                        text="haga click aquí,"
                        classes="text-base"
                        linkColor={LinkColor.PURPLE}
                        disabled={disabledInputs}
                    />
                    &nbsp; {textDomain}
                </p>
            </div>
        </div>
    );
};
