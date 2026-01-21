import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ElementsContext } from '@pages/website-editor/editor/context';
import { lengthGreaterThanZero } from '@utils/Length';
import { ActionElementType, generateId, ElementType, ModuleApp } from '@utils/GenerateId';
import { RootState } from '@redux/rootReducer';
import { postSocialNetworks } from '@redux/website-node/actions';
import { Icon } from '@components/icon';
import { SimpleButton } from '@components/button';
import { Form } from '@components/form';
import { ChangeEvent, IOptionSelect, SelectInput } from '@components/input';
import { ISocialNetwork as ISocialNetworkLink } from '@models/WebsiteNode';
import { optionSocialNetworks, SOCIAL_NETWORKS_EXAMPLES } from '@constants/SocialNetworks';
import { validateLink } from '@utils/SocialNetworks';
import { EditInput } from './EditInput';
import { ISocialNetwork, SOCIAL_NETWORKS, SOCIAL_NETWORK_OPTIONS, SOCIAL_NETWORKS_LIMIT } from '.';

export const AddSocialNetwork: React.FC = () => {
    const {
        websiteNode: { socialNetworks: socialNetworkLinks },
    } = useSelector((state: RootState) => state);
    const dispatch = useDispatch();
    const { handleSettingChange, selectedElement } = useContext(ElementsContext);
    const [socialNetworks, setSocialNetworks] = useState<ISocialNetwork[]>(
        selectedElement?.setting?.socialNetworks?.map((social: ISocialNetwork) => ({
            name: social.name,
            url: '',
            icon: social.icon,
        })) ?? []
    );

    useEffect(() => {
        socialNetworkLinks.forEach(socialNetworkLink => {
            SOCIAL_NETWORKS.forEach(socialNetworkName => {
                if (socialNetworkName.toLowerCase() === socialNetworkLink.network_type.toLowerCase()) {
                    setSocialNetworks(prevState => {
                        const newState = prevState.map(socialNetwork => ({
                            ...socialNetwork,
                            url:
                                socialNetwork.name.toLowerCase() === socialNetworkLink.network_type.toLowerCase()
                                    ? socialNetworkLink.network_account
                                    : socialNetwork.url,
                        }));

                        return newState;
                    });
                }
            });
        });
    }, [socialNetworkLinks]);

    useEffect(() => {
        handleSettingChange({ name: 'socialNetworks', value: socialNetworks });
    }, [socialNetworks]);

    const handleInputChange = ({ target: { name, value } }: ChangeEvent): void => {
        setSocialNetworks(
            socialNetworks.map(socialNetwork => ({
                ...socialNetwork,
                ...(socialNetwork.name === name && {
                    url: value,
                    error: !validateLink(value, name),
                    errorMessage: !validateLink(value, name)
                        ? `El link debe contener ${SOCIAL_NETWORKS_EXAMPLES[name.toUpperCase()]}`
                        : '',
                }),
            }))
        );
    };

    const options = useMemo(() => (selectedElement?.type ? SOCIAL_NETWORK_OPTIONS[selectedElement?.type] : {}), [
        selectedElement,
    ]);

    const addSocialNetwork = (): void => {
        if (socialNetworks?.length < SOCIAL_NETWORKS_LIMIT) {
            const newSocialNetwork = SOCIAL_NETWORKS.find(name => socialNetworks.every(item => item.name !== name));
            if (newSocialNetwork)
                setSocialNetworks([
                    ...socialNetworks,
                    {
                        name: newSocialNetwork,
                        url:
                            socialNetworkLinks.find(
                                socialNetworkLink =>
                                    socialNetworkLink.network_type.toLowerCase() === newSocialNetwork.toLowerCase()
                            )?.network_account || '',
                        icon: options[newSocialNetwork],
                    },
                ]);
        }
    };

    const deleteSocialMedia = (socialMediaTitle: string): void => {
        setSocialNetworks(socialNetworks.filter(socialNetworks => socialNetworks.name !== socialMediaTitle));
    };

    const handleBlurChange = (e: ChangeEvent): void => {
        e.preventDefault();

        const newSocialNetworkLinks: ISocialNetworkLink[] = [];

        if (socialNetworks.some(socialNetwork => socialNetwork.error)) return;
        socialNetworks.forEach(socialNetwork => {
            if (lengthGreaterThanZero(socialNetwork.url)) {
                newSocialNetworkLinks.push({
                    network_type:
                        socialNetworkLinks.find(
                            socialNetworkLink => socialNetworkLink.network_type.toLowerCase() === socialNetwork.name.toLowerCase()
                        )?.network_type || socialNetwork.name.charAt(0).toUpperCase() + socialNetwork.name.slice(1),
                    network_account: socialNetwork.url,
                    id:
                        socialNetworkLinks.find(
                            socialNetworkLink => socialNetworkLink.network_type.toLowerCase() === socialNetwork.name.toLowerCase()
                        )?.id || undefined,
                });
            }
        });

        dispatch(postSocialNetworks(newSocialNetworkLinks));
    };
    const onSelectNameSocialNetwork = (option: IOptionSelect, name: string): void => {
        const newSocialNetworks = socialNetworks.map(socialNetwork => {
            const sameName: boolean = socialNetwork.name === name;

            return {
                ...socialNetwork,
                name: sameName ? option.value : socialNetwork.name,
                url: sameName
                    ? socialNetworkLinks?.find(socialNetworkLink => socialNetworkLink.network_type === option.value)
                          ?.network_account ?? ''
                    : socialNetwork.url,
                icon: options[sameName ? option.value : socialNetwork.name],
            };
        });
        setSocialNetworks(newSocialNetworks);
    };

    const listOptions = useMemo(() => {
        const filteredKeys = new Set(socialNetworks.map(item => item.name));
        return optionSocialNetworks.filter(item => !filteredKeys.has(item.value));
    }, [socialNetworks]);

    return (
        <div className="add-social-network">
            <p className="mb-1 text-tiny text-blue font-allerbold">Vincular redes sociales:</p>
            <div className="add-social-network__items">
                <Form>
                    {socialNetworks?.map((item: ISocialNetwork, index) => {
                        return (
                            <React.Fragment key={item.name}>
                                <div className={`add-social-network__item ${item?.error ? 'mb-1' : 'mb-2'}`}>
                                    <SelectInput
                                        id={generateId({
                                            module: ModuleApp.WEBSITE,
                                            submodule: `editor-composite-element-header-footer-social-network-${index}`,
                                            action: ActionElementType.INPUT,
                                            elementType: ElementType.DRP,
                                        })}
                                        name="newSocialNetwork"
                                        placeholder="Seleccionar"
                                        classesWrapper="add-social-network__item-container"
                                        classesInput="add-social-network__item-name"
                                        options={listOptions}
                                        value={item.name}
                                        optionSelected={(option: IOptionSelect): void =>
                                            onSelectNameSocialNetwork(option, item.name)
                                        }
                                    />
                                    <EditInput
                                        handleBlurChange={handleBlurChange}
                                        placeholder="Agregar link"
                                        name={item.name}
                                        value={item.url}
                                        handleChange={handleInputChange}
                                    />
                                    <Icon
                                        id={generateId({
                                            module: ModuleApp.WEBSITE,
                                            submodule: `editor-composite-element-header-footer-social-network-${index}`,
                                            action: ActionElementType.TRASH,
                                            elementType: ElementType.ICO,
                                        })}
                                        name="trashBlue"
                                        className="cursor-pointer"
                                        onClick={(): void => {
                                            deleteSocialMedia(item.name);
                                        }}
                                    />
                                </div>
                                {item?.error && (
                                    <p className="text-right text-purple text-tiny w-52.5 leading-3 mb-2">{item.errorMessage}</p>
                                )}
                            </React.Fragment>
                        );
                    })}
                </Form>
                <SimpleButton
                    id={generateId({
                        module: ModuleApp.WEBSITE,
                        submodule: `editor-composite-element-header-footer-social-network`,
                        action: ActionElementType.ADD,
                        elementType: ElementType.BTN,
                    })}
                    className={`w-27 underline text-tiny ${
                        socialNetworks?.length < SOCIAL_NETWORKS_LIMIT ? 'cursor-pointer text-green ' : 'text-gray'
                    }`}
                    onClick={addSocialNetwork}
                >
                    + Agregar red social
                </SimpleButton>
            </div>
        </div>
    );
};
