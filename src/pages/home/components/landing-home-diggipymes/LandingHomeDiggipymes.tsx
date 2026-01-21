import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { sendContactMessage } from '@redux/notifications/actions';
import type { IGenericRecord } from '@models/GenericRecord';
import type { IFormatContactData } from '@models/ContactUs';
import { ScheduleDemo } from '@components/schedule-demo';
import { LandingContext } from '@pages/home/context/LandingContext';
import PurchasingProcess from '@pages/purchasing-process';
import { DIGGIPYMES } from '@constants/AppConstants';
import { FooterLanding } from './components/footer-landing';
import { LandingHeader } from './components/header-landing';
import CompanyDataLanding from './components/company-data-landing/CompanyDataLanding';
import { useSwitchModules } from './hooks/useSwitchModules';
import { SectionsHash } from './constants/sections';
import { IHomeLandingDiggipymes } from '../home-landing';
import { ModalConfirmData, ModalSuccessRegistration, PARAM_MODAL, PREFIX_NUMBER_DEFAULT } from '../modal-confirm-data';
import './LandingHomeDiggipymes.scss';

export const LandingHomeDiggipymes: React.FC<IHomeLandingDiggipymes> = () => {
    const { accessToken, dataCompanyLanding, comesCreateAccount, comesAccountCreated } = useSelector(
        ({ session }: RootState) => ({
            ...session,
        })
    );

    const location = useLocation();
    const { pathname, search } = useLocation();

    const { openScheduling, setOpenScheduling } = useContext(LandingContext);
    const dispatch = useDispatch();

    const [confimData, setConfimData] = useState<boolean>(false);
    const [successRegistration, setSuccessRegistration] = useState<boolean>(false);

    const module = useSwitchModules();

    const formatData = (data: IGenericRecord): IFormatContactData => {
        const format = {
            name_surname: data.name,
            email: data.email,
            company_name: 'CCXC',
            type: DIGGIPYMES,
            prefix_number: PREFIX_NUMBER_DEFAULT,
            phone: data.phoneNumber || '2222222222',
            affair: 'Interesado en diggi pymes',
            description: 'Interesado en diggi pymes',
        };

        return (format as unknown) as IFormatContactData;
    };

    const handleShowConfirmModal = (): void => {
        setConfimData(prev => !prev);
    };

    const handleShowSuccessRegistration = (): void => {
        setSuccessRegistration(prev => !prev);
    };

    const handleRegisterCompany = (data: IGenericRecord): void => {
        dispatch(sendContactMessage(formatData(data), handleShowSuccessRegistration));
        window.history.replaceState(null, '', `${location.pathname}${location.hash}`);
    };

    useEffect(() => {
        if (!location.hash) {
            window.location.hash = SectionsHash.HOME;
        }

        setTimeout(() => {
            if (location.hash) {
                const elemento = document.querySelector(location.hash);
                if (elemento) {
                    elemento.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, 2500);
    }, [location]);

    useEffect(() => {
        const params = new URLSearchParams(search);
        const getInvitation = params.get(PARAM_MODAL);

        if (getInvitation) handleShowConfirmModal();
    }, [pathname, search]);

    if (comesCreateAccount && accessToken && !comesAccountCreated && !dataCompanyLanding) {
        return <PurchasingProcess />;
    }

    if (!comesCreateAccount && accessToken && comesAccountCreated && dataCompanyLanding) {
        return <CompanyDataLanding />;
    }

    return (
        <>
            <ModalConfirmData show={confimData} showModal={handleShowConfirmModal} handleMainAction={handleRegisterCompany} />
            <ModalSuccessRegistration show={successRegistration} showModal={handleShowSuccessRegistration} />

            <div className="relative landing" id={SectionsHash.HOME}>
                <div className="content">
                    {openScheduling && (
                        <>
                            <LandingHeader darkMode={false} />
                            <ScheduleDemo toggleScheduling={setOpenScheduling} />
                        </>
                    )}
                    {!openScheduling && !dataCompanyLanding && !comesCreateAccount && <>{module}</>}
                </div>
                <FooterLanding openScheduling={openScheduling} setOpenScheduling={setOpenScheduling} />
            </div>
        </>
    );
};
