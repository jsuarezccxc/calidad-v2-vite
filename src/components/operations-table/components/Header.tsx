import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import signUp from '@assets/images/sign-up-blue.svg';
import home from '@assets/images/home-blue.svg';
import trash from '@assets/images/trash-blue.svg';
import notification from '@assets/images/sidebar/bell.svg';
import question from '@assets/images/sidebar/question.svg';
import { PATHS, Routes } from '@constants/Paths';
import { RootState } from '@redux/rootReducer';
import { clearSession } from '@redux/session/actions';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';

export const Header: React.FC = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { user, is_administration_customer = false } = useSelector((state: RootState) => state.session);

    const signOff = (): void => {
        dispatch(clearSession());
    };

    const getUserInitial = (): string => (user?.name || user?.email).slice(0, 1);

    return (
        <div className="sidebar-header">
            <img className="ml-auto" src={signUp} alt="Sign up" onClick={signOff} />
            <div className="sidebar-header__initial">{getUserInitial()}</div>
            <div className="flex gap-4.5 justify-center items-center">
                {!is_administration_customer && (
                    <>
                        <img
                            id={generateId({
                                module: ModuleApp.HEADER,
                                submodule: 'home',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.ICO,
                            })}
                            alt="Home"
                            src={home}
                            onClick={(): void => history.push('/')}
                        />
                        <img
                            id={generateId({
                                module: ModuleApp.HEADER,
                                submodule: 'trash',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.ICO,
                            })}
                            alt="Trash"
                            src={trash}
                            onClick={(): void => history.push(PATHS[Routes.BIN].route)}
                        />
                        <img
                            id={generateId({
                                module: ModuleApp.HEADER,
                                submodule: 'notification',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.ICO,
                            })}
                            alt="Notification"
                            src={notification}
                            onClick={(): void => history.push(PATHS[Routes.NOTIFICATION_CENTER].route)}
                        />
                        <img
                            id={generateId({
                                module: ModuleApp.HEADER,
                                submodule: 'question',
                                action: ActionElementType.REDIRECT,
                                elementType: ElementType.ICO,
                            })}
                            alt="Question"
                            src={question}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
