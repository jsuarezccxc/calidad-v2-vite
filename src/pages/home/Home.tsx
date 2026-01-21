import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactPlayer from 'react-player';
import { Button } from '@components/button';
import { ModalCustom } from '@components/modal-custom';
import { RootState } from '@redux/rootReducer';
import { loginSession, setCreateAccountModal, setLoginModal } from '@redux/session/actions';
import { getEconomicData, getUserData, setIsNotFirstLogin } from '@redux/home-landing/action';
import { setModalRedirectPlans } from '@redux/menu/actions';
import { IGenericRecord } from '@models/GenericRecord';
import { lengthEqualToZero, lengthGreaterThanZero } from '@utils/Length';
import { PLANS } from '@constants/Memberships';
import HomeLanding from './components/home-landing';
import './Home.scss';

/**
 * Home view of the application
 * @returns Element with the home view, it changes according to the user status.
 */
const Home: React.FC = () => {
    const dispatch = useDispatch();
    const {
        session: { accessToken, login = false },
        membership: { membership_selected },
        company: { information },
        homeLanding: { trm, userData },
    } = useSelector((state: RootState) => state);

    const [demo, setDemo] = useState(userData?.is_first_login || false);
    const [modules, setModules] = useState<IGenericRecord>(membership_selected || {});
    const [isVideoDispatch, setIsVideoDispatch] = useState(false);
    const [playStopVideo, setPlayStopVideo] = useState(false);
    const [haveMembership, setHaveMembership] = useState<boolean>(lengthEqualToZero(information?.active_memberships || []));

    const toggleDemo = (): void => {
        dispatch(setIsNotFirstLogin());
        dispatch(getUserData());
        setIsVideoDispatch(!isVideoDispatch);
    };

    useEffect(() => {
        if (localStorage.getItem(PLANS)) {
            dispatch(setModalRedirectPlans());
        }
        accessToken && (refreshEconomicIndicators(), dispatch(getUserData()));
        setHaveMembership(lengthEqualToZero(information?.active_memberships || []));
    }, [accessToken]);

    useEffect(() => {
        setModules(membership_selected || []);
    }, [accessToken, membership_selected]);

    useEffect(() => {
        dispatch(getUserData());
    }, [isVideoDispatch]);

    useEffect(() => {
        userData && setDemo(userData?.is_first_login);
    }, [userData]);

    const refreshEconomicIndicators = (): void => {
        dispatch(getEconomicData());
    };

    return (
        <>
            <HomeLanding
                haveMembership={haveMembership}
                economicData={{ trm: trm }}
                accessToken={accessToken}
                toggleAccount={(): void => {
                    dispatch(setCreateAccountModal());
                    dispatch(loginSession(false));
                    setDemo(false);
                }}
                toggleLogin={(): void => {
                    dispatch(loginSession(!login));
                    dispatch(setLoginModal());
                }}
                modules={modules?.filter((module: IGenericRecord) => lengthGreaterThanZero(module?.modules) && module?.is_active)}
                refreshEconomicIndicators={refreshEconomicIndicators}
                information={information}
            />
            {accessToken && (
                <ModalCustom
                    show={demo}
                    showModal={(): void => {
                        toggleDemo();
                        setPlayStopVideo(false);
                    }}
                    classesWrapper="modal--full w-202.5"
                    classesModal="w-202.5"
                >
                    <div className="home__modal-content w-202.5 h-118">
                        <div className="w-full">
                            <p className="home__modal-title">Video inicial</p>
                            <ReactPlayer
                                url="https://www.youtube.com/embed/7CQ9Nds5CFk"
                                height="400px"
                                width="100%"
                                onPlay={(): void => {
                                    setPlayStopVideo(true);
                                }}
                                playing={playStopVideo}
                                controls
                            />
                            <div className="flex justify-center mt-5 lg:hidden">
                                <Button text="Atrás" onClick={toggleDemo} classes="m-auto" />
                            </div>
                        </div>
                    </div>
                </ModalCustom>
            )}
        </>
    );
};

export default Home;
