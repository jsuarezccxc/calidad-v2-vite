import React, { Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from 'react';

// Vite dynamic imports for country flags
const flagImages = import.meta.glob<{ default: string }>('/src/assets/images/flags-countries/*.svg', { eager: true });
const getFlagImage = (code: string): string => {
    const path = `/src/assets/images/flags-countries/${code.trim()}.svg`;
    return flagImages[path]?.default || '';
};
import { useDispatch, useSelector } from 'react-redux';
import ReactPlayer from 'react-player';
import { useHistory } from 'react-router';
import WhatsappExample from '@assets/images/whatsapp-example.svg';
import { BreadCrumb } from '@components/bread-crumb';
import { Form } from '@components/form';
import { ChangeEvent, DEFAULT_REQUIRED_TEXT, IOptionSelect, SelectInput } from '@components/input';
import { Icon } from '@components/icon';
import { Link } from '@components/button';
import { ModalCustom } from '@components/modal-custom';
import { ISharedModalProps, SharedModal } from '@components/modal';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { WEBSITE_DESIGN_AND_ADMINISTRATION } from '@constants/website';
import { optionSocialNetworks, SOCIAL_NETWORKS_EXAMPLES } from '@constants/SocialNetworks';
import { COLOMBIA, COLOMBIA_ID } from '@constants/Location';
import { TitleButtons } from '@constants/Buttons';
import { Source } from '@constants/Onboarding';
import { Routes } from '@constants/Paths';
import usePermissions from '@hooks/usePermissions';
import { MODAL_TEXTS } from '@information-texts/Modal';
import { ISocialNetwork } from '@models/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';
import {
    deleteSocialNetworkById,
    getAllSocialNetworks,
    getVideoTutorials,
    postSocialNetworks,
} from '@redux/website-node/actions';
import { getUtils } from '@redux/utils/actions';
import { RootState } from '@redux/rootReducer';
import { lengthGreaterThanZero } from '@utils/Length';
import { validateOnlyNumbers } from '@utils/Validation';
import { getRoute } from '@utils/Paths';
import { ActionElementType, ElementType, generateId, ModuleApp } from '@utils/GenerateId';
import { validateLink } from '@utils/SocialNetworks';
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import {
    IGNORE_SOCIAL,
    INITIAL_SOCIAL,
    INITIAL_VALUE_PREFIX,
    MaxLengthPhone,
    PREFIX_COUNTRIES,
    RefMap,
    SYMBOL_PREFIX,
    WHATSAPP_URL_BASE,
    buttonProps,
    routes,
    WHATSAPP_URL,
    Modal,
    TEXT_ADD_SOCIAL_NETWORKS,
    CONSTANTS,
    IDataFrame,
    IModalVideo,
} from '.';
import './WebsiteSocial.scss';

const WebsiteSocial: React.FC = () => {
    const dispatch = useDispatch();
    const historyHook = useHistory();
    const { disabledInputs } = usePermissions();
    const { socialNetworks: socialNetworkList, videoTutorials, utils } = useSelector(({ utils, websiteNode }: RootState) => ({
        ...utils,
        ...websiteNode,
    }));

    const [socialNetworks, setSocialNetworks] = useState<ISocialNetwork[]>([]);
    const [showAddSocialNetwork, setShowAddSocialNetwork] = useState(false);
    const [optionsPrefix, setOptionsPrefix] = useState<IOptionSelect[]>([]);
    const [prefix, setPrefix] = useState<IOptionSelect>(INITIAL_VALUE_PREFIX);
    const [editedFields, setEditedFields] = useState<string[]>([]);
    const [activeModal, setActiveModal] = useState('');
    const [newSocialNetwork, setNewSocialNetwork] = useState<ISocialNetwork>({
        network_type: '',
        network_account: '',
    });
    const [whatsappValues, setWhatsappValues] = useState<ISocialNetwork>({
        network_type: '',
        network_account: '',
    });
    const [whatsappValuesErrors, setWhatsappValuesErrors] = useState<IGenericRecord>({});
    const [dataModalSelect, setDataModalSelect] = useState<IDataFrame>({
        title: '',
        content: '',
        url: '',
    });
    const [showModalVideo, setShowModalVideo] = useState(false);

    const currentWhatsapp = useMemo(() => socialNetworkList.find(socialNetwork => socialNetwork.is_button), [socialNetworkList]);

    const { handlePostConfirmation } = useOnboardingNavigation(Source.Website);

    useEffect(() => {
        Promise.all([dispatch(getAllSocialNetworks()), dispatch(getUtils(PREFIX_COUNTRIES)), dispatch(getVideoTutorials())]);
    }, []);

    const listOptions = useMemo(() => {
        const filteredKeys = new Set(socialNetworks.map(item => item.network_type));
        return optionSocialNetworks.filter(item => !filteredKeys.has(item.value));
    }, [socialNetworks]);

    useEffect(() => {
        if (socialNetworkList.length) {
            const existWhatsapp = socialNetworkList.find(
                socialNetworks => socialNetworks.is_button && socialNetworks.network_type
            );
            if (existWhatsapp) {
                const newData = handleFormatDataWhatsapp(existWhatsapp);

                newData?.prefix?.value && setPrefix(newData.prefix);
            }
            const newSocialNetwork = socialNetworkList.filter(socialNetwork => !socialNetwork.is_button);
            const networkTypes = newSocialNetwork.map(item => item.network_type);

            INITIAL_SOCIAL.map(social => {
                !networkTypes.includes(social.network_type) && newSocialNetwork.push(social);
            });

            setSocialNetworks(newSocialNetwork);
        } else {
            setSocialNetworks(INITIAL_SOCIAL);
        }
        setEditedFields([]);
    }, [socialNetworkList, utils]);

    useEffect(() => {
        if (!Object.values(whatsappValuesErrors).length) return;
        validateFields(whatsappValues, setWhatsappValuesErrors);
    }, [whatsappValues, prefix]);

    useEffect(() => {
        getPrefixFromCountry();
    }, [utils]);

    useEffect(() => {
        if (currentWhatsapp) {
            setWhatsappValues({
                network_account: currentWhatsapp?.network_account?.replace(WHATSAPP_URL, ''),
                network_type: currentWhatsapp?.network_type,
            });
        }
    }, [currentWhatsapp]);

    const isNewOrEditedSocialNetwork = ({ id, network_account }: ISocialNetwork): boolean => {
        return socialNetworkList.some(item =>
            id ? item.id === id && item.network_account !== network_account : network_account
        );
    };

    const networksToSave = useMemo(() => socialNetworks.filter(isNewOrEditedSocialNetwork), [
        socialNetworks,
        isNewOrEditedSocialNetwork,
    ]);

    const saveSocialNetworks = async (): Promise<void> => {
        if (networksToSave.length) await Promise.all(networksToSave.map(sendSocialNetwork));
    };

    const inputRef = useRef<RefMap>({});

    const handleFormatDataWhatsapp = (data: ISocialNetwork): { data: ISocialNetwork; prefix: IOptionSelect } | undefined => {
        const whatsapp = data?.network_account.replace(WHATSAPP_URL_BASE, '') || '';

        if (!whatsapp) return;
        if (whatsapp?.substring(0, 1) !== SYMBOL_PREFIX) return;
        const currentPrefix = whatsapp?.substring(0, 3) || '';

        const prefixNumber = optionsPrefix.find(option => option.value === currentPrefix) || INITIAL_VALUE_PREFIX;
        const phoneNumber = prefixNumber?.value ? whatsapp.replace(prefixNumber.value, '') : whatsapp.replace(currentPrefix, '');
        return {
            data: {
                ...data,
                network_account: phoneNumber,
            },
            prefix: prefixNumber || INITIAL_VALUE_PREFIX,
        };
    };


    const getPrefixFromCountry = (): void => {
        const optionsPrefix: IOptionSelect[] = [];
        const countries = utils?.countries;

        if (countries && lengthGreaterThanZero(countries)) {
            const currentCountry = countries?.find((country: IGenericRecord) => country?.name === COLOMBIA);
            const otherOptions = countries?.filter((country: IGenericRecord) => country?.name !== COLOMBIA);
            currentCountry &&
                optionsPrefix.push({
                    key: currentCountry.id,
                    value: currentCountry.prefix_number,
                    code: getFlagImage(currentCountry.code),
                });
            otherOptions?.map((country: IGenericRecord) =>
                optionsPrefix.push({
                    key: country.id,
                    value: country.prefix_number,
                    code: getFlagImage(country.code),
                })
            );
        }

        setOptionsPrefix(optionsPrefix);
    };

    const onInputLinkExistSocialNetwork = (e: ChangeEvent, social: ISocialNetwork): void => {
        let errorMessage = '';
        setEditedFields([...editedFields, social.network_type]);

        if (!e.target.value) {
            errorMessage = DEFAULT_REQUIRED_TEXT;

            setSocialNetworks(
                socialNetworks.map(socialNetwork => ({
                    ...socialNetwork,
                    ...(socialNetwork.network_type === social.network_type && { network_account: e.target.value, errorMessage }),
                }))
            );

            return;
        }

        if (!validateLink(e.target.value, social.network_type)) {
            errorMessage = `El link debe contener ${SOCIAL_NETWORKS_EXAMPLES[social.network_type.toUpperCase()]}`;
        }

        setSocialNetworks(
            socialNetworks.map(socialNetwork => ({
                ...socialNetwork,
                ...(socialNetwork.network_type === social.network_type && { network_account: e.target.value, errorMessage }),
            }))
        );
    };

    const onDeleteSocialNetwork = (networkType: string): void => {
        const socialNetworkToDelete = socialNetworks.find(socialNetwork => socialNetwork.network_type === networkType);
        if (socialNetworkToDelete) {
            if (socialNetworkToDelete.id) {
                dispatch(deleteSocialNetworkById(socialNetworkToDelete));
            } else {
                const newSocialNetwork = socialNetworks.filter(socialNetwork => socialNetwork.network_type !== networkType);
                setSocialNetworks(newSocialNetwork);
            }
        }
    };

    const onAddSocialNetwork = (): void => {
        if (socialNetworks.some(socialNetwork => socialNetwork.network_type === newSocialNetwork.network_type)) {
            setNewSocialNetwork({
                ...newSocialNetwork,
                errorMessage: 'Seleccione otra red social',
            });

            return;
        }

        if (!newSocialNetwork.network_type) {
            setNewSocialNetwork({
                ...newSocialNetwork,
                errorMessage: 'Seleccione una red social',
            });

            return;
        }

        setSocialNetworks([...socialNetworks, { ...newSocialNetwork, errorMessage: '' }]);
        setNewSocialNetwork({ network_type: '', network_account: '', errorMessage: '' });
        setShowAddSocialNetwork(false);
    };

    const onSelectNameSocialNetwork = (option: IOptionSelect): void => {
        setNewSocialNetwork({
            ...newSocialNetwork,
            network_type: option.value,
        });
    };

    const onInputWhatsappChange = (e: ChangeEvent): void => {
        const { name, value } = e.target;

        setWhatsappValues({
            ...whatsappValues,
            [name]: value,
        });
        setEditedFields([...editedFields, name]);
        validateFields(whatsappValues, setWhatsappValuesErrors);
    };

    const handleChangePrefixSelect = (option: IOptionSelect): void => {
        setPrefix(option);
    };

    const validateFields = (data: IGenericRecord, setErrors: Dispatch<SetStateAction<IGenericRecord>>): boolean => {
        let errors: IGenericRecord = {};
        Object.keys(data).forEach(key => {
            if (!data[key]) {
                errors[key] = DEFAULT_REQUIRED_TEXT;
            }
        });

        if (!prefix.value) errors = { ...errors, prefix: DEFAULT_REQUIRED_TEXT };

        setErrors(errors);

        return !Object.keys(errors).length;
    };

    const sendSocialNetwork = (social: ISocialNetwork): void => {
        const { network_type, network_account } = social;
        const socialNetworkDb = socialNetworkList.find(socialNetwork => socialNetwork.network_type === network_type);

        if (
            !(socialNetworkDb && socialNetworkDb.network_account === network_account) &&
            validateLink(network_account, network_type)
        ) {
            dispatch(postSocialNetworks([social]));
        }
    };

    const validateChangeWhatsapp = (newWhatsapp: IGenericRecord): boolean => {
        const existWhatsapp = socialNetworkList.find(socialNetworks => socialNetworks.is_button);
        if (!existWhatsapp) return true;
        const { network_account, network_type } = newWhatsapp;
        return network_account !== existWhatsapp?.network_account || network_type !== existWhatsapp?.network_type;
    };

    const hasWhatsappChanged = (currentValue: ISocialNetwork, newValue: ISocialNetwork): boolean => {
        return (
            currentValue.network_type !== newValue.network_type ||
            `${WHATSAPP_URL_BASE}${prefix.value}${newValue.network_account}` !== currentValue.network_account
        );
    };

    const isEditedWhatsapp = useMemo(() => currentWhatsapp && hasWhatsappChanged(currentWhatsapp, whatsappValues), [
        currentWhatsapp,
        whatsappValues,
    ]);

    const isNewWhatsapp = useMemo(() => !currentWhatsapp && !!(whatsappValues.network_type || whatsappValues.network_account), [
        currentWhatsapp,
        whatsappValues,
    ]);

    const sendWhatsapp = (): void => {
        if (currentWhatsapp) {
            if (!whatsappValues.network_type && !whatsappValues.network_account) return;
            if (isEditedWhatsapp) {
                dispatch(
                    postSocialNetworks([
                        {
                            ...currentWhatsapp,
                            network_type: whatsappValues.network_type,
                            network_account: `${WHATSAPP_URL_BASE}${prefix.value}${whatsappValues.network_account}`,
                        },
                    ])
                );
            }
            return;
        }

        const newWhatsappValues = {
            ...whatsappValues,
            network_account: `${WHATSAPP_URL_BASE}${prefix.value}${whatsappValues.network_account}`,
        };

        if (!validateChangeWhatsapp(newWhatsappValues)) return;
        if (whatsappValues.id) {
            dispatch(postSocialNetworks([newWhatsappValues]));
        } else {
            dispatch(
                postSocialNetworks([
                    {
                        ...newWhatsappValues,
                        is_button: true,
                    },
                ])
            );
        }
    };

    const focusInput = (networkType: string): void => {
        const input = inputRef.current[networkType];
        if (input) {
            input.focus();
        }
    };

    const handleModalInfo = (network_type: string): void => {
        const tutorial = videoTutorials.find(video => video.name.toUpperCase() === network_type.toUpperCase())?.url;
        if (tutorial) {
            setDataModalSelect({
                ...dataModalSelect,
                url: tutorial ?? '',
            });
            setShowModalVideo(true);
        }
    };

    const saveChanges = async (): Promise<void> => {
        await Promise.all([saveSocialNetworks(), sendWhatsapp()]);
        setActiveModal(Modal.Success);
    };

    const changePage = (): void => {
        if (!!networksToSave.length || isEditedWhatsapp || isNewWhatsapp) return setActiveModal(Modal.NotSaved);
        historyHook.push(getRoute(Routes.PRODUCT_SHIPPING_COST));
    };

    const getModalProps = (): ISharedModalProps => {
        if (activeModal === Modal.NotSaved) {
            return {
                moduleId: ModuleApp.WEBSITE,
                text: MODAL_TEXTS.NOT_SAVED,
                leftButton: { action: saveChanges, text: 'Guardar' },
                finishButtonText: TitleButtons.NEXT,
                finalAction: (): void => historyHook.push(getRoute(Routes.PRODUCT_SHIPPING_COST)),
                open: true,
            };
        }
        return {
            moduleId: ModuleApp.WEBSITE,
            finalAction: async (): Promise<void> => await handlePostConfirmation(() => setActiveModal('')),
            open: true,
        };
    };

    const deleteSocial = async (): Promise<void> => {
        await Promise.all(socialNetworkList.filter(item => item.is_button).map(item => dispatch(deleteSocialNetworkById(item))));
    };

    return (
        <div className="mt-7 xs:px-2">
            <p className="text-base title-social text-blue font-allerbold">{WEBSITE_DESIGN_AND_ADMINISTRATION}</p>
            <BreadCrumb routes={routes()} />

            <div className="layout">
                <h1 className="layout__title" onClick={deleteSocial}>
                    Cómo promocionar y optimizar el sitio web
                </h1>
            </div>

            <p className="text-lg font-allerbold text-blue" onClick={deleteSocial}>
                Agregue las redes sociales de su empresa en el sitio web
            </p>

            <p className="text-base font-aller text-gray-dark mt-4.5">
                Vincule las redes sociales de su empresa agregando el link de cada una en el espacio correspondiente, para saber
                como encontrar el link haga click en el icono de información (i) de cada red social para ver el video instructivo.
            </p>

            <div className="mb-7 mt-7.3">
                {lengthGreaterThanZero(socialNetworks) && (
                    <div className="flex items-center xs:items-start">
                        <div className="flex flex-col mb-2 xs:w-full gap-y-2">
                            {socialNetworks.map((social, idx) => (
                                <div key={idx} className="flex w-full gap-x-2 xs:flex-col">
                                    <div className="rounded-md social-card">
                                        {!IGNORE_SOCIAL.includes(social.network_type.toUpperCase()) && (
                                            <Icon
                                                name="infoGreen"
                                                onClick={(): void => handleModalInfo(social.network_type)}
                                                className="cursor-pointer"
                                            />
                                        )}
                                        <p className="text-sm font-aller text-gray-dark">{social.network_type}</p>
                                    </div>
                                    <div className="flex items-center xs:w-full">
                                        <Form className="flex xs:w-full">
                                            <div className="flex flex-col xs:w-full">
                                                <div
                                                    className="flex bg-white social-input"
                                                    onClick={(): void => focusInput(social.network_type)}
                                                >
                                                    <input
                                                        id={generateId({
                                                            module: ModuleApp.WEBSITE,
                                                            submodule: `social-network-${social.id}-url`,
                                                            action: ActionElementType.INPUT,
                                                            elementType: ElementType.TXT,
                                                        })}
                                                        placeholder="Agregar link"
                                                        ref={(input): HTMLInputElement | null =>
                                                            (inputRef.current[social.network_type] = input)
                                                        }
                                                        value={social.network_account}
                                                        {...(!disabledInputs && {
                                                            onChange: (e): void => onInputLinkExistSocialNetwork(e, social),
                                                        })}
                                                        required={!!social.errorMessage}
                                                        className="flex-1 pr-1 outline-none"
                                                        disabled={disabledInputs}
                                                    />
                                                    {social.network_account.length > 34 && <span>...</span>}
                                                    {!editedFields.includes(social.network_type) && (
                                                        <Icon name="checkSocial" classIcon="w-5 h-5" />
                                                    )}
                                                </div>
                                                {social.errorMessage && (
                                                    <span className="text-tiny text-purple">{social.errorMessage}</span>
                                                )}
                                            </div>
                                            <Icon
                                                id={generateId({
                                                    module: ModuleApp.WEBSITE,
                                                    submodule: `social-network-${social.id}-url`,
                                                    action: ActionElementType.TRASH,
                                                    elementType: ElementType.ICO,
                                                })}
                                                name="trashBlue"
                                                hoverIcon="trashGreen"
                                                className="self-start w-5.5 mt-1 ml-2 cursor-pointer"
                                                onClick={(): void => {
                                                    if (disabledInputs) return;
                                                    onDeleteSocialNetwork(social.network_type);
                                                }}
                                            />
                                        </Form>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {showAddSocialNetwork ? (
                    <Form className="flex items-center xs:flex-col">
                        <SelectInput
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `new-social-network-type`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name="newSocialNetwork"
                            placeholder="Seleccionar"
                            selectIconType="arrowDownGreen"
                            options={listOptions}
                            optionSelected={(option: IOptionSelect): void => onSelectNameSocialNetwork(option)}
                            required={!!newSocialNetwork.errorMessage}
                            requiredText={newSocialNetwork.errorMessage}
                        />
                        <div className="flex">
                            <Icon
                                name="checkBlue"
                                hoverIcon="checkGreen"
                                className="self-start w-6 mt-1 ml-2 mr-2 cursor-pointer"
                                onClick={onAddSocialNetwork}
                            />
                            <Icon
                                name="cancelBlue"
                                hoverIcon="cancelGreen"
                                className="self-start w-6 mt-1 cursor-pointer"
                                onClick={(): void => {
                                    setShowAddSocialNetwork(false);
                                    setNewSocialNetwork({
                                        network_account: '',
                                        network_type: '',
                                        errorMessage: '',
                                    });
                                }}
                            />
                        </div>
                    </Form>
                ) : (
                    <Link
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `new-social-network`,
                            action: ActionElementType.ADD,
                            elementType: ElementType.LNK,
                        })}
                        href="#"
                        text={socialNetworks.length ? TEXT_ADD_SOCIAL_NETWORKS.ADD_OTHER : TEXT_ADD_SOCIAL_NETWORKS.ADD}
                        classes="text-base"
                        onClick={(): void => setShowAddSocialNetwork(!showAddSocialNetwork)}
                        disabled={!listOptions.length || disabledInputs}
                    />
                )}
            </div>

            <p className="text-base font-allerbold text-blue ">Agregue el botón de Whatsapp de su empresa en el sitio web</p>

            <p className="mt-2 text-base font-aller text-gray-dark">
                Ingrese el número de WhatsApp de su empresa y edite el texto que se visualizará el botón en su sitio web y este lo
                redireccionará al chat de su empresa.
            </p>

            <Form className="social-content">
                <div className="whatsapp-inputs">
                    <div className="mt-4.5 rounded-md social-card">
                        <p className="text-sm font-aller text-gray-dark">Whatsapp</p>
                    </div>
                    <div className="flex items-center mt-4.5 cursor-pointer xs:w-full">
                        <SelectInput
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `social-network-prefix-country`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            name="prefix_country"
                            selectTextClass="text-size"
                            selectIconType="arrowDownGreen"
                            placeholder="..."
                            classesWrapperInput="select-prefix"
                            classesWrapper="xs:w-full"
                            classNameMain="xs:w-full"
                            value={prefix.value}
                            required={whatsappValuesErrors?.prefix}
                            requiredText="* req"
                            options={optionsPrefix}
                            optionSelected={(option): void => {
                                handleChangePrefixSelect(option);
                            }}
                            disabled={disabledInputs}
                            iconName
                            valueIconName={prefix.code || ''}
                        />
                    </div>
                    <div className="flex flex-col xs:w-full">
                        <div
                            className="flex mt-4.5 bg-white social-input"
                            onClick={(): void => focusInput(whatsappValues.network_account)}
                        >
                            <input
                                id={generateId({
                                    module: ModuleApp.WEBSITE,
                                    submodule: `social-network-number-phone`,
                                    action: ActionElementType.INPUT,
                                    elementType: ElementType.TXT,
                                })}
                                type="text"
                                placeholder="Número de celular"
                                value={whatsappValues.network_account}
                                onChange={(e): void => onInputWhatsappChange(e)}
                                name="network_account"
                                required={whatsappValuesErrors?.network_account}
                                className={`flex-1 outline-none`}
                                onKeyPress={(e): void => {
                                    validateOnlyNumbers(e);
                                }}
                                maxLength={
                                    Number(prefix.key) === COLOMBIA_ID ? MaxLengthPhone.Colombia : MaxLengthPhone.OtherCountries
                                }
                                ref={(input): HTMLInputElement | null =>
                                    (inputRef.current[whatsappValues?.network_account] = input)
                                }
                                disabled={disabledInputs}
                            />
                            {!editedFields.includes('network_account') && <Icon name="checkSocial" classIcon="w-5 h-5" />}
                        </div>
                    </div>
                    <div className="flex flex-col mb-4 w-full md:w-57.4 xs:mt-4.5">
                        <label className="text-blue text-tiny font-allerbold pl-1.5">Texto para el botón:</label>
                        <input
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `social-network-text-btn-whatsapp`,
                                action: ActionElementType.INPUT,
                                elementType: ElementType.TXT,
                            })}
                            type="text"
                            placeholder="Whatsapp"
                            value={whatsappValues.network_type}
                            onChange={onInputWhatsappChange}
                            name="network_type"
                            required={whatsappValuesErrors?.network_type}
                            className="text-whatsapp"
                            maxLength={50}
                            disabled={disabledInputs}
                        />
                    </div>
                </div>
                <div>
                    <p className="text-blue text-tiny font-allerbold">Por ejemplo: </p>
                    <img src={WhatsappExample} alt="whatsapp" className="img-whatsapp-example" />
                </div>
            </Form>

            <PageButtonsFooter
                {...buttonProps(history, changePage, () => history.back())}
                threeButtons
                onClickButtonCenter={saveChanges}
                disabledCenter={disabledInputs}
            />

            {showModalVideo && (
                <ModalVideo
                    show={showModalVideo}
                    showModal={(): void => {
                        setShowModalVideo(!showModalVideo);
                    }}
                    dataModal={dataModalSelect}
                    backModal={(): void => {
                        setShowModalVideo(!showModalVideo);
                    }}
                    size={751}
                />
            )}
            {activeModal && <SharedModal {...getModalProps()} />}
        </div>
    );
};

const ModalVideo: React.FC<IModalVideo> = ({ show = false, showModal, dataModal, size }) => {
    const [playStopVideo, setPlayStopVideo] = useState(false);

    return (
        <ModalCustom
            id={generateId({
                module: ModuleApp.WEBSITE,
                submodule: `${ModuleApp.MODALS}-social-network-video`,
                action: ActionElementType.INFO,
                elementType: ElementType.MDL,
            })}
            show={show}
            showModal={(): void => {
                showModal();
                setPlayStopVideo(false);
            }}
            classesModal="modal-social-example"
            classesWrapper="wrapper-modal-social"
            removeMinWidth
        >
            <div className="w-full h-full">
                <ReactPlayer
                    url={show ? dataModal.url : ''}
                    width={size < CONSTANTS.sizeResponsive ? '300px' : '100%'}
                    height={size < CONSTANTS.sizeResponsive ? '50%' : '100%'}
                    onPlay={(): void => {
                        setPlayStopVideo(true);
                    }}
                    playing={playStopVideo}
                    controls
                />
            </div>
        </ModalCustom>
    );
};

export default WebsiteSocial;
