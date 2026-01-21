//--- Libraries ---//
import React, { Fragment, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
//--- Redux ---//
import { RootState } from '@redux/rootReducer';
import { getFilesCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
//--- Components ---//
import { Icon, IconsNames } from '@components/icon';
import { OPTIONS, PROFILE_ADMIN_USER_OPTIONS, PROFILE_OPTIONS } from '@components/header';
//--- Enums ---//
import { TypeFile } from '@constants/ElectronicInvoice';
//--- Utils ---//
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
//--- Root ---//
import { ICardUserProps, LETTER_PROFILE } from '.';

export const CardUser: React.FC<ICardUserProps> = ({ toggleOptions, user, showToggle, showOptions, logOut }) => {
    const dispatch = useDispatch();
    const {
        parameterizationInvoice: { filesRut },
        session: { is_administration_customer = false },
    } = useSelector(({ parameterizationInvoice, session }: RootState) => ({ parameterizationInvoice, session }));

    const profile = useMemo(() => filesRut.url, [filesRut]);

    useEffect(() => {
        dispatch(getFilesCompanyAction(TypeFile.LOGO));
    }, []);

    return (
        <div
            id={generateId({
                module: ModuleApp.HEADER,
                submodule: 'user-menu',
                action: ActionElementType.CONTAINER,
                elementType: ElementType.CONT,
            })}
            className="pb-2 tooltip top-1"
        >
            <div className="tooltip-options__profile" onClick={(): void => toggleOptions(OPTIONS.PROFILE)}>
                {filesRut.url ? (
                    <img src={profile} alt="profile" className="object-contain w-full h-full max-w-full max-h-full rounded-xl" />
                ) : (
                    user?.name[LETTER_PROFILE] || user?.email[LETTER_PROFILE]
                )}
            </div>

            <span className="tooltip-item -left-2">{OPTIONS.PROFILE}</span>

            <div className={`tooltip-display tooltip-options w-57 z-30 profile-options ${showOptions(OPTIONS.PROFILE)}`}>
                {showToggle === OPTIONS.PROFILE ? (
                    <>
                        <p className="pt-4 pb-2 pl-4 tooltip-options__title">
                            <span className="font-allerbold h-4.23">{user?.name} &nbsp;</span>
                            <span>/ {user.email}</span>
                        </p>
                        {(is_administration_customer ? PROFILE_ADMIN_USER_OPTIONS : PROFILE_OPTIONS).map((item, index) => (
                            <Fragment key={item.name}>
                                <div
                                    id={generateId({
                                        module: ModuleApp.HEADER,
                                        submodule: `user-menu-${item.name}`,
                                        action: ActionElementType.CONTAINER,
                                        elementType: ElementType.CONT,
                                    })}
                                    className={`flex tooltip-options__item ${index === PROFILE_OPTIONS.length - 1 ? 'pb-4' : ''}`}
                                    onClick={(): void => {
                                        logOut(item.name === OPTIONS.LOGOUT ? item.name : item.path);
                                        toggleOptions(OPTIONS.PROFILE);
                                    }}
                                >
                                    <div
                                        className={`flex items-center ${
                                            item.isBorder ? 'border-t-0.5 border-gray-smoke w-full pt-2' : ''
                                        }`}
                                    >
                                        <Icon
                                            id={generateId({
                                                module: ModuleApp.HEADER,
                                                submodule: `user-menu-${item.name}`,
                                                action: ActionElementType.INFO,
                                                elementType: ElementType.ICO,
                                            })}
                                            name={item.icon as IconsNames}
                                            className={`menu--icon-width initial-icon ${!item.isBorder ? 'mt-1' : ''}`}
                                        />
                                        <Icon
                                            id={generateId({
                                                module: ModuleApp.HEADER,
                                                submodule: `user-menu-${item.name}`,
                                                action: ActionElementType.INFO,
                                                elementType: ElementType.ICO,
                                            })}
                                            name={item.hoverIcon as IconsNames}
                                            className={`menu--icon-width hidden finish-icon ${!item.isBorder ? 'mt-1' : ''}`}
                                        />
                                        <span
                                            className={`ml-2 text-left font-allerbold text-tiny ${!item.isBorder ? 'pt-1' : ''}`}
                                        >
                                            {item.name}
                                        </span>
                                    </div>
                                </div>
                            </Fragment>
                        ))}
                    </>
                ) : null}
            </div>
        </div>
    );
};
