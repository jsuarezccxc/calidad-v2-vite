import React, { useState, ChangeEvent, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import { Link, LinkColor } from '@components/button';
import { Icon } from '@components/icon';
import { SearchInput } from '@components/input';
import { Form } from '@components/form';
import CoincidencesTextSearch from '@components/coincidences-text-search';
import { ITEMS, separateItems } from '@components/operations-table';
import { toggleMenu } from '@redux/menu/actions';
import { RootState } from '@redux/rootReducer';
import { clearSession, setAuthorizationModal } from '@redux/session/actions';
import { getAllNotifications, updateNotifications } from '@redux/notifications/actions';
import { removeAccents, lowerCase } from '@utils/Text';
import { getRoute } from '@utils/Paths';
import { lengthGreaterThanZero } from '@utils/Length';
import { getDateFromUnix } from '@utils/Date';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import Logo from '@assets/images/logo-header.svg';
import { INotifications } from '@models/Notification';
import { IGenericRecord } from '@models/GenericRecord';
import useUnreadNotifications from '@hooks/useUnreadNotifications';
import usePermissions from '@hooks/usePermissions';
import { PATHS, Routes } from '@constants/Paths';
import { DNS_FAILED_CONNECT, KARDEX_INVENTORY, MODULE_PAYMENT_PLANS, WARNING_LIMIT_INVOICE } from '@constants/Notifications';
import { CardUser } from './components';
import {
    OPTIONS,
    SEARCH_INITIAL_STATE,
    HelpCenterItem,
    DirectAccessItem,
    MORE_NOTIFICATIONS,
    NO_NOTIFICATIONS,
    MAX_NOTIFICATIONS,
} from '.';
import './Header.scss';

export const Header: React.FC = (): React.ReactElement => {
    const dispatch = useDispatch();
    const history = useHistory();
    const {
        menu: { show },
        session: { accessToken, user, is_administration_customer = false },
        company: { information, employees },
        notifications: { allNotifications = [], numberNotifications },
    } = useSelector(({ menu, session, company, notifications }: RootState) => ({ menu, session, company, notifications }));
    const [showCard, setShowCard] = useState<boolean>(false);
    const [options, setOptions] = useState<string[]>([]);
    const [search, setSearch] = useState<IGenericRecord>(SEARCH_INITIAL_STATE);
    const [showToggle, setShowToggle] = useState('');
    const [showNotifications, setShowNotifications] = useState<boolean>(false);
    const [loadingNotifications, setLoadingNotifications] = useState<boolean>(false);
    const notificationsRef = useRef<HTMLDivElement | null>(null);
    const iconNotificationRef = useRef<HTMLDivElement | null>(null);

    const { unreadNotifications } = useUnreadNotifications();
    const { validationPermissionsMenu } = usePermissions();

    useEffect(() => {
        if (!showNotifications) return;

        const handleClickOutside = (event: MouseEvent): void => {
            if (iconNotificationRef?.current?.contains(event.target as Node)) return;

            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                onClickBellNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return (): void => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications]);

    const goToUrl = (url: string): void => {
        history.push(url);
    };

    const updateShowMenu = (): void => {
        dispatch(toggleMenu());
    };

    const logOut = (item: string): void => {
        if (accessToken) {
            if (item === OPTIONS.LOGOUT) {
                history.push(getRoute(Routes.HOME));
                dispatch(clearSession());
                setShowCard(false);
                setSearch(SEARCH_INITIAL_STATE);
                setOptions([]);
                const elementHeader = document.querySelector('*');
                elementHeader?.classList.remove('screen-scroll-smooth');
                elementHeader?.classList.add('screen-smooth-logout');
            } else {
                history.push(item);
            }
        }
    };

    const handleSearch = ({ target }: ChangeEvent<HTMLInputElement>): void => {
        const { value } = target;
        const itemsSearch: IGenericRecord[] = separateItems(ITEMS(lengthGreaterThanZero(employees)));

        const resultSearch = itemsSearch
            .filter(item => {
                const { title } = PATHS[item?.routeIndex] ?? { title: item?.name || item?.module, route: '#' };
                const letter = title && title[removeAccents(lowerCase(title)).indexOf(lowerCase(value.trim())) - 1];

                if (
                    (letter === undefined || letter === ' ') &&
                    removeAccents(lowerCase(title)).includes(removeAccents(lowerCase(value.trim())))
                )
                    return item;
            })
            .map(element => {
                const { title, route } = PATHS[element?.routeIndex] ?? {
                    title: element?.name || element?.module,
                    route: element?.route || '#',
                };
                return {
                    ...element,
                    module: element?.parentItem || element.module,
                    parentModule: element?.parentModule || element.module,
                    text: title,
                    route,
                };
            });

        setSearch(!value ? { ...SEARCH_INITIAL_STATE, show: true } : { ...search, word: value, results: resultSearch });
    };

    const redirectResult = (path: string): void => {
        setSearch(SEARCH_INITIAL_STATE);
        history.push(path);
    };

    const toggleOptions = (option: string): void => {
        setShowToggle(option);
        if (user?.company_id || option === OPTIONS.PROFILE) {
            if (options.includes(option)) {
                return setOptions(options.filter(item => item !== option));
            }
            return setOptions([...options, option]);
        }
    };

    const showOptions = (option: string): string => (options.includes(option) && showToggle === option ? 'show-options' : '');

    const onClickBellNotifications = async (show?: boolean): Promise<void> => {
        if (!loadingNotifications) {
            setLoadingNotifications(true);
            try {
                if (numberNotifications > NO_NOTIFICATIONS && !showNotifications) {
                    dispatch(getAllNotifications());
                }
                if (lengthGreaterThanZero(unreadNotifications) && showNotifications) {
                    dispatch(updateNotifications(unreadNotifications.map((notification: IGenericRecord) => notification.id)));
                }
            } finally {
                toggleOptions(OPTIONS.NOTIFICATIONS);
                setShowNotifications(prev => show ?? !prev);
                setLoadingNotifications(false);
            }
        }
    };

    const validatePath = (item = '', module = '', path = ''): boolean => {
        const validationMenu = validationPermissionsMenu(item, module);
        if (validationMenu) {
            path && history.push(path);
        } else {
            dispatch(setAuthorizationModal());
        }

        return validationMenu;
    };

    const renderSearch = (): React.ReactElement =>
        !search.show ? (
            <Icon
                id={generateId({
                    module: ModuleApp.HEADER,
                    submodule: 'search',
                    action: ActionElementType.INPUT,
                    elementType: ElementType.ICO,
                })}
                name="searchWhite"
                className="my-auto cursor-pointer tooltip--icon-width"
            />
        ) : (
            <Form>
                <SearchInput
                    id={generateId({
                        module: ModuleApp.HEADER,
                        submodule: 'search',
                        action: ActionElementType.INPUT,
                        elementType: ElementType.TXT,
                    })}
                    name="search"
                    classesWrapperInput="search-input relative"
                    value={search.word}
                    iconClassName={search.word && 'cursor-pointer'}
                    onChange={handleSearch}
                    clearSearch={(): void => {
                        if (search.word) setSearch(SEARCH_INITIAL_STATE);
                    }}
                    headerSearch
                />
            </Form>
        );

    const renderOptionsSearch = (results: IGenericRecord[]): React.ReactElement | null =>
        results.length ? (
            <div className="items-start tooltip-display tooltip-options search-results bg-green-scrollbar">
                {results?.map((item: IGenericRecord, index: number) => (
                    <div
                        key={Symbol(`result-${index}`).toString()}
                        className="relative block px-1 m-auto tooltip-options__item"
                        onClick={(): void => {
                            validatePath(item.text, item?.parentModule) && redirectResult(item.route);
                        }}
                    >
                        <CoincidencesTextSearch
                            text={item.text}
                            search={search.word}
                            primaryColor="text-gray-dark"
                            secondaryColor="text-purple"
                            isSelect
                        />
                        <span className="block w-full text-left">{item.module}</span>
                    </div>
                ))}
            </div>
        ) : null;

    const renderNotifications = (
        allNotifications: INotifications[],
        unreadNotifications: IGenericRecord[]
    ): React.ReactElement[] | React.ReactElement =>
        lengthGreaterThanZero(allNotifications) && lengthGreaterThanZero(unreadNotifications) ? (
            unreadNotifications.slice(0, 7).map((item: IGenericRecord, index) => {
                const dateNotification = getDateFromUnix(item.date, 'DD/MM').dateFormat;
                const isWarningInvoices = item.type_notification.id === WARNING_LIMIT_INVOICE;
                const hour = item?.hour?.replace(/\s/g, '').toLowerCase();
                return (
                    <>
                        <div
                            id={generateId({
                                module: ModuleApp.HEADER,
                                submodule: `notification-${item.id}`,
                                action: ActionElementType.INFO,
                                elementType: ElementType.CONT,
                            })}
                            key={item.id}
                            className="relative flex flex-col tooltip-options__item-notification"
                            onClick={(): void => {
                                setShowToggle('');
                                history.push(`${PATHS[Routes.CONSULT_ELECTRONIC_DOCUMENT].route}?id=${item.reference}`);
                            }}
                        >
                            {item.type_notification.id === KARDEX_INVENTORY ||
                            item.type_notification.id === MODULE_PAYMENT_PLANS ||
                            item.type_notification.id === DNS_FAILED_CONNECT ||
                            isWarningInvoices ? (
                                <>
                                    <div className="flex justify-between w-full">
                                        <h3 className="text-sm text-left break-words w-45 font-allerbold">
                                            {isWarningInvoices ? 'Paquete de facturación' : item.type_notification.name}
                                        </h3>
                                        <span className="date-notification">{dateNotification}</span>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <div
                                            className="self-start justify-start text-sm leading-4 text-left w-45"
                                            dangerouslySetInnerHTML={{
                                                __html: item.description,
                                            }}
                                        />
                                        <span className="date-notification">{hour}</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-between w-full">
                                        <h3 className="text-sm text-left break-words w-45 font-allerbold">{item.consecutive}</h3>
                                        <span className="date-notification">{dateNotification}</span>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <div
                                            className="self-start justify-start text-sm leading-4 text-left w-45"
                                            dangerouslySetInnerHTML={{
                                                __html: item.description,
                                            }}
                                        />
                                        <span className="date-notification">{hour}</span>
                                    </div>
                                </>
                            )}
                        </div>
                        {index !== unreadNotifications.length - 1 && <div className="border__item-notification" />}
                    </>
                );
            })
        ) : (
            <div className="relative flex flex-col w-full">
                <div className="flex flex-row items-start w-full py-4.5 px-5">
                    <Icon
                        id={generateId({
                            module: ModuleApp.HEADER,
                            submodule: 'without-notification',
                            action: ActionElementType.REDIRECT,
                            elementType: ElementType.ICO,
                        })}
                        name="warningBlue"
                    />
                    <p className="ml-3 text-sm leading-4 text-left text-blue">
                        Hasta el momento no tiene notificaciones pendientes.
                    </p>
                </div>
                <div className="w-full mb-4.5 text-sm leading-4 text-left text-blue px-5">
                    Hasta el momento no tiene notificaciones pendientes por verificar.
                </div>
            </div>
        );

    return (
        <>
            {showToggle !== '' && <div className={`overlay-close`} onClick={(): void => setShowToggle('')}></div>}
            <div
                id={generateId({
                    module: ModuleApp.HEADER,
                    submodule: 'main-container',
                    action: ActionElementType.CONTAINER,
                    elementType: ElementType.CONT,
                })}
                className="sticky top-0 z-10 flex justify-between h-16 xs:z-30 xs:grid-cols-2 xs:h-11 bg-blue"
            >
                <div className="my-auto ml-8 xs:ml-2.5 relative flex justify-between">
                    <NavLink to="/">
                        <img src={Logo} alt="logo" className="w-20 h-10 xs:h-9" />
                    </NavLink>
                    {user?.company_id && (
                        <span className="relative self-end italic text-white text-tiny">
                            {lowerCase(information?.logo_extension)}
                        </span>
                    )}
                </div>
                {accessToken ? (
                    <div className="flex justify-around my-auto justify-items-center mr-14 xs:mr-0 gap-x-14 xs:gap-x-6">
                        {!is_administration_customer && (
                            <>
                                <div className="relative tooltip">
                                    <Icon
                                        id={generateId({
                                            module: ModuleApp.HEADER,
                                            submodule: 'home',
                                            action: ActionElementType.REDIRECT,
                                            elementType: ElementType.ICO,
                                        })}
                                        name="home"
                                        className="my-auto cursor-pointer tooltip--icon-width"
                                        onClick={(): void => {
                                            setSearch(SEARCH_INITIAL_STATE);
                                            goToUrl(getRoute(Routes.HOME));
                                        }}
                                    />
                                    <span className="tooltip-item -left-3">{OPTIONS.HOME}</span>
                                </div>

                                <div
                                    className={`${!search.show ? 'tooltip' : 'mt-2'} relative`}
                                    onClick={(): void => {
                                        if (!search.show && user?.company_id) setSearch({ ...search, show: true });
                                    }}
                                >
                                    <span className="tooltip-item -left-2">{OPTIONS.SEARCH}</span>
                                    {renderSearch()}
                                    {renderOptionsSearch(search?.results)}
                                </div>
                                <div className="tooltip">
                                    <Icon
                                        id={generateId({
                                            module: ModuleApp.HEADER,
                                            submodule: 'trash',
                                            action: ActionElementType.REDIRECT,
                                            elementType: ElementType.ICO,
                                        })}
                                        name="trashWhite"
                                        className="w-5.5 h-5.5 my-auto cursor-pointer"
                                        onClick={(): void => {
                                            setSearch(SEARCH_INITIAL_STATE);
                                            !user?.company_id && dispatch(setAuthorizationModal());
                                            goToUrl(getRoute(Routes.BIN));
                                        }}
                                    />
                                    <span className="tooltip-item -left-4">{OPTIONS.BIN}</span>
                                </div>
                                <DirectAccessItem validatePath={validatePath} />
                                <div className="tooltip">
                                    <div className="flex justify-center" ref={iconNotificationRef}>
                                        <Icon
                                            id={generateId({
                                                module: ModuleApp.HEADER,
                                                submodule: 'notification',
                                                action: ActionElementType.REDIRECT,
                                                elementType: ElementType.ICO,
                                            })}
                                            name="notifications"
                                            className="relative my-auto cursor-pointer tooltip--icon-width"
                                            onClick={(): void => {
                                                if (!loadingNotifications) {
                                                    setSearch(SEARCH_INITIAL_STATE);
                                                    onClickBellNotifications();
                                                }
                                            }}
                                        />
                                        {numberNotifications > NO_NOTIFICATIONS && (
                                            <div className="current-notification">
                                                {numberNotifications > MAX_NOTIFICATIONS
                                                    ? MORE_NOTIFICATIONS
                                                    : numberNotifications}
                                            </div>
                                        )}
                                    </div>
                                    <span className="tooltip-item">{OPTIONS.NOTIFICATIONS}</span>
                                    <div
                                        ref={notificationsRef}
                                        className={`tooltip-options justify-center w-73 ${showOptions(OPTIONS.NOTIFICATIONS)}`}
                                    >
                                        {showToggle === OPTIONS.NOTIFICATIONS ? (
                                            <>
                                                <div className="relative flex w-full">
                                                    <div className="tooltip-options__notification">{OPTIONS.NOTIFICATIONS}</div>
                                                </div>
                                                <div className="overflow-y-auto bg-green-scrollbar max-h-96">
                                                    {renderNotifications(allNotifications, unreadNotifications)}
                                                </div>
                                            </>
                                        ) : null}
                                        <div className="relative w-full">
                                            <Link
                                                id={generateId({
                                                    module: ModuleApp.HEADER,
                                                    submodule: 'all-notifications',
                                                    action: ActionElementType.ACTION,
                                                    elementType: ElementType.LNK,
                                                })}
                                                href="#"
                                                text="Ver todas las notificaciones"
                                                onClick={(): void => {
                                                    setShowToggle('');
                                                    goToUrl(getRoute(Routes.NOTIFICATION_CENTER));
                                                }}
                                                classes="link-option"
                                                linkColor={LinkColor.PURPLE}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <HelpCenterItem history={history} />
                            </>
                        )}
                        {user ? (
                            <CardUser
                                user={user}
                                toggleOptions={toggleOptions}
                                showToggle={showToggle}
                                showOptions={showOptions}
                                logOut={logOut}
                            />
                        ) : null}
                        <Icon
                            id={generateId({
                                module: ModuleApp.HEADER,
                                submodule: 'menu',
                                action: show ? ActionElementType.CLOSE : ActionElementType.OPEN,
                                elementType: ElementType.ICO,
                            })}
                            name={show ? 'closeHeader' : 'menu'}
                            className="my-auto cursor-pointer tooltip--icon-width md:hidden"
                            onClick={updateShowMenu}
                            hoverIcon={show ? 'closeHeader' : 'menu'}
                        />
                    </div>
                ) : null}
            </div>
            {showCard ? (
                <div
                    className="absolute w-full h-full wrapper"
                    onClick={({ target }: React.MouseEvent<HTMLDivElement>): void => {
                        if ((target as HTMLDivElement).classList.contains('wrapper')) {
                            setShowCard(false);
                        }
                    }}
                />
            ) : null}
        </>
    );
};
