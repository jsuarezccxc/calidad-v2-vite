import React, { createContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { loginSession, setAccountCreatedModal, setLoginModal, setDataCompanyLanding } from '@redux/session/actions';

export const LandingContext = createContext<IGenericRecord>({});

const ContextProvider: React.FC<IGenericRecord> = ({ children }) => {
    const dispatch = useDispatch();

    const { login = false, dataCompanyLanding } = useSelector(({ session }: RootState) => ({
        ...session,
    }));

    const [openScheduling, setOpenScheduling] = useState<boolean>(false);

    const toggleLogin = (): void => {
        if (openScheduling) setOpenScheduling(false);
        if (dataCompanyLanding) dispatch(setDataCompanyLanding());
        dispatch(loginSession(!login));
        dispatch(setLoginModal());
    };

    const toggleCreateAccount = (): void => {
        if (openScheduling) setOpenScheduling(false);
        if (dataCompanyLanding) dispatch(setDataCompanyLanding());
        dispatch(loginSession(!login));
        dispatch(setAccountCreatedModal());
    };

    const toggleCompanyDataLanding = (): void => {
        if (openScheduling) setOpenScheduling(false);
        dispatch(setDataCompanyLanding());
    };

    return (
        <LandingContext.Provider
            value={{ toggleLogin, toggleCreateAccount, setOpenScheduling, openScheduling, toggleCompanyDataLanding }}
        >
            {children}
        </LandingContext.Provider>
    );
};

export default ContextProvider;
