import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { changeIsInstructions, getCompanyPaymentGateway, storeCompanyPaymentGateway } from '@redux/payment-gateway/action';
import { getRoute, getRouteName } from '@utils/Paths';
import { lengthEqualToZero } from '@utils/Length';
import { buttonsFooterProps } from '@utils/Button';
import { currentDateInUnix } from '@utils/Date';
import { ModuleApp } from '@utils/GenerateId';
import { PageTitle } from '@components/page-title';
import { BreadCrumb } from '@components/bread-crumb';
import { Form } from '@components/form';
import { TextInput } from '@components/input';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { Link } from '@components/button';
import { Routes } from '@constants/Paths';
import { TitleButtons } from '@constants/Buttons';
import { ACCOUNT_ID, API_KEY, API_LOGIN, MERCHANT_ID, PUBLIC_KEY } from '@constants/PaymentGateway';
import { IPaymentGateway } from '@models/PaymentGateway';
import usePermissions from '@hooks/usePermissions';
import { routesSynchronizePayu } from '.';

const SynchronizePayu: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const { disabledInputs } = usePermissions();
    const {
        paymentGateway: { dataCompanyPaymentGateway },
    } = useSelector((state: RootState) => state);
    const [informationPayment, setInformationPayment] = useState<IPaymentGateway>({
        payment_gateway_id: 1,
        credentials: {
            api_login: '',
            public_key: '',
            account_id: '',
            api_key: '',
            merchant_id: '',
        },
        date: currentDateInUnix().toString(),
    });
    const [clickSaveBtn, setClickSaveBtn] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getCompanyPaymentGateway());
    }, []);

    useEffect(() => {
        dataCompanyPaymentGateway?.credentials &&
            setInformationPayment({ ...informationPayment, credentials: dataCompanyPaymentGateway?.credentials });
    }, [dataCompanyPaymentGateway]);

    const updateTextField = (text: string, key: string): void => {
        const credentials = informationPayment.credentials;

        switch (key) {
            case API_LOGIN:
                credentials.api_login = text;
                break;
            case API_KEY:
                credentials.api_key = text;
                break;
            case ACCOUNT_ID:
                credentials.account_id = text;
                break;
            case MERCHANT_ID:
                credentials.merchant_id = text;
                break;
            case PUBLIC_KEY:
                credentials.public_key = text;
                break;
        }
        setInformationPayment({ ...informationPayment, credentials: credentials });
    };

    const updateCredentials = (): void => {
        setClickSaveBtn(true);

        setInformationPayment({
            ...informationPayment,
            date: currentDateInUnix().toString(),
        });

        const constraintTextInput = Object.keys(informationPayment.credentials).filter(item => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return !informationPayment.credentials[item];
        });

        if (lengthEqualToZero(constraintTextInput)) {
            dispatch(storeCompanyPaymentGateway(informationPayment));
        }
    };
    return (
        <>
            <main className="flex-1">
                <PageTitle title={getRouteName(Routes.WEBSITE_MENU)} />
                <BreadCrumb routes={routesSynchronizePayu()} />
                <h2 className="text-center mb-4.5 text-26lg text-blue font-allerbold">Cómo armar el sitio web</h2>
                <h3 className="text-base text-blue font-allerbold mb-4.5">{getRouteName(Routes.SYNCHRONIZE_PAYU)}</h3>
                <div className="flex-1">
                    <section className="mt-9.5 flex flex-col sm:flex-row bg-white pt-3.5 pl-6 pr-6 md:pr-0 rounded pb-5">
                        <Form className="sm:mr-9.5">
                            <div className="mb-5">
                                <TextInput
                                    labelText="*API KEY:"
                                    value={informationPayment.credentials.api_key}
                                    placeholder="..."
                                    classesWrapper="sm:w-73"
                                    onChange={(e): void => {
                                        updateTextField(e.target.value, API_KEY);
                                    }}
                                    disabled={disabledInputs}
                                    required={clickSaveBtn && !informationPayment.credentials.api_key}
                                />
                            </div>
                            <div className="mb-5">
                                <TextInput
                                    labelText="*Llave pública:"
                                    value={informationPayment.credentials.public_key}
                                    placeholder="..."
                                    classesWrapper="sm:w-73"
                                    onChange={(e): void => {
                                        updateTextField(e.target.value, PUBLIC_KEY);
                                    }}
                                    disabled={disabledInputs}
                                    required={clickSaveBtn && !informationPayment.credentials.public_key}
                                />
                            </div>
                            <div className="mb-0 xs:mb-5">
                                <TextInput
                                    labelText="*Account ID:"
                                    value={informationPayment.credentials.account_id}
                                    placeholder="..."
                                    classesWrapper="sm:w-73"
                                    onChange={(e): void => {
                                        updateTextField(e.target.value, ACCOUNT_ID);
                                    }}
                                    disabled={disabledInputs}
                                    required={clickSaveBtn && !informationPayment.credentials.account_id}
                                />
                            </div>
                        </Form>
                        <Form>
                            <div className="mb-5">
                                <TextInput
                                    labelText="*API LOGIN:"
                                    value={informationPayment.credentials.api_login}
                                    placeholder="..."
                                    classesWrapper="sm:w-73"
                                    onChange={(e): void => {
                                        updateTextField(e.target.value, API_LOGIN);
                                    }}
                                    disabled={disabledInputs}
                                    required={clickSaveBtn && !informationPayment.credentials.api_login}
                                />
                            </div>
                            <div className="mb-5 sm:mb-0">
                                <TextInput
                                    labelText="*id del negocio (Merchant ID):"
                                    value={informationPayment.credentials.merchant_id}
                                    placeholder="..."
                                    classesWrapper="sm:w-73"
                                    onChange={(e): void => {
                                        updateTextField(e.target.value, MERCHANT_ID);
                                    }}
                                    disabled={disabledInputs}
                                    required={clickSaveBtn && !informationPayment.credentials.merchant_id}
                                />
                            </div>
                        </Form>
                    </section>
                </div>
                <p
                    className="text-gray-dark mt-2.5"
                    onClick={(): void => {
                        dispatch(changeIsInstructions(true));
                    }}
                >
                    Para conocer como conectar PayU con su sitio web, &nbsp;
                    <Link classes="text-purple text-base" text="haga click aquí" href={getRoute(Routes.INSTRUCTIONS_PAYU)} />
                </p>
            </main>
            <PageButtonsFooter
                threeButtons
                disabledCenter={disabledInputs}
                onClickButtonCenter={(): void => updateCredentials()}
                {...buttonsFooterProps(
                    ModuleApp.PAYMENT_GATEWAY_WEBSITE,
                    history,
                    getRoute(Routes.WEBSITE_VISIBILITY),
                    {
                        name: getRouteName(Routes.HOME),
                        moduleName: getRouteName(Routes.HOME),
                    },
                    TitleButtons.NEXT
                )}
            />
        </>
    );
};

export default SynchronizePayu;
