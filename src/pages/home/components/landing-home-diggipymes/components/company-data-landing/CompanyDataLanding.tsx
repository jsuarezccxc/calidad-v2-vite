import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Title } from '@components/table-input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import Footer from '@components/footer';
import { getRoute } from '@utils/Paths';
import { generateId, ModuleApp, ElementType, ActionElementType } from '@utils/GenerateId';
import { TitleButtons } from '@constants/Buttons';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { Routes } from '@constants/Paths';
import { RootState } from '@redux/rootReducer';
import { updateDataCompanyAccountCreated } from '@redux/session/actions';
import { clearSession, setComesToAccountCreated, setComesToCreateAccount, setDataCompanyLanding } from '@redux/session/actions';
import { FormCompanyData } from './components';
import './CompanyDataLanding.scss';

const CompanyDataLanding: React.FC = () => {
    const { accessToken, information } = useSelector(({ session, company }: RootState) => ({
        ...session,
        ...company,
    }));

    const [dispatch, history] = [useDispatch(), useHistory()];

    const [formData, setFormData] = useState({
        name: information?.name || '',
        company_representative_name: information?.company_representative_name || '',
        phone: information?.phone || '',
    });

    const handleInputChange = (key: keyof typeof formData, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleNext = async (): Promise<void> => {
        if (!formData.name) return;
        const status = await dispatch(updateDataCompanyAccountCreated(formData));

        if (SUCCESS_RESPONSE.includes(Number(status))) {
            dispatch(setDataCompanyLanding());
            dispatch(setComesToAccountCreated());
            dispatch(setComesToCreateAccount());
        }
    };

    const logOutCompany = (): void => {
        if (accessToken) {
            history.push(getRoute(Routes.HOME));
            dispatch(clearSession());
            const elementHeader = document.querySelector('*');
            elementHeader?.classList.remove('screen-scroll-smooth');
            elementHeader?.classList.add('screen-smooth-logout');
        }
        return;
    };

    return (
        <div className="h-full px-2 py-10 container-company-data-landing bg-gray-background sm:px-28">
            <Title
                id={generateId({
                    module: ModuleApp.LANDING,
                    submodule: 'company-data-title',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TXT,
                })}
                text="Datos de la empresa"
                className="my-7 text-title-company-landing"
                disabled
            />
            <div
                id={generateId({
                    module: ModuleApp.LANDING,
                    submodule: 'company-data-description',
                    action: ActionElementType.INFO,
                    elementType: ElementType.TXT,
                })}
                className="flex flex-col justify-center w-full text-center"
            >
                <div className="flex flex-col justify-center w-full text-center">
                    <p className="text-gray-dark text-2lg leading-2lg font-aller">
                        Para continuar con su proceso de compra, revise que la siguiente información está correcta. Si la
                        información es correcta haga click en el botón &nbsp;
                        <span className="text-green font-allerbold">Continuar</span>.
                    </p>
                </div>
            </div>
            <FormCompanyData formData={formData} onInputChange={handleInputChange} />
            <PageButtonsFooter
                moduleId={ModuleApp.LANDING}
                titleButtonLeft={TitleButtons.BACK}
                className="container-button xs:mb-0"
                classButton="shadow-templateDesign container-button__button-footer"
                onClickButtonLeft={logOutCompany}
                titleButtonRight={TitleButtons.CONTINUE}
                onClickButtonRight={handleNext}
            />
            <Footer className="text-center bg-gray-background" />
        </div>
    );
};

export default CompanyDataLanding;
