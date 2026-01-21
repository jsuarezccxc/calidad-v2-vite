import React from 'react';
import { INFORMATION_DETAIL } from '@information-texts/DatabaseEmployees';
import { ICardDetailProps } from '@pages/database-employee-detail/models/DatabaseEmployeeDetail';
import { OptionsField } from '@constants/DatabaseEmployees';
import { lowerCase } from '@utils/Text';

const PreviewInfo: React.FC<{ title: string; text: string }> = ({ title, text }) => {
    return (
        <div className="flex flex-col border-b-1 border-green-extraLight w-40.60 xlg:w-full pb-1.5">
            <label className="text-base text-blue font-allerbold">{title}</label>
            <label className="text-tiny text-gray font-allerbold">{text}</label>
        </div>
    );
};

export const CardDetails: React.FC<ICardDetailProps> = ({ data }) => {
    const { BASIC_INFORMATION, CONTACT_INFORMATION, AFFILIATIONS, CONTRACT } = INFORMATION_DETAIL;
    const {
        name,
        document_type,
        document_number,
        contract,
        birthday,
        code,
        phone_number,
        address,
        country,
        department,
        city,
        postal_code,
        email,
        contributor_type,
        contributor_subtype,
        eps,
        severance_pay,
        pension,
        compensation_fund,
        risk_level,
    } = data;
    const {
        area,
        position,
        contract_type,
        initial_date,
        final_date,
        payment_frequency,
        salary,
        salary_type,
        has_transportation_assistance,
        payment_method,
    } = contract;
    const frequency = 'Mensual';

    const applyTypeSalary = (salary_type: string, current_type: string): string =>
        lowerCase(salary_type) === lowerCase(current_type) ? OptionsField.APPLY : OptionsField.NO_APPLY;

    return (
        <div className="flex flex-col bg-white rounded-lg p-4.5 shadow-templateDesign my-4.5">
            <div className="flex flex-col border-b-1 border-green-extraLight">
                <h2 className="text-base text-green font-allerbold">{BASIC_INFORMATION.TITLE}</h2>
                <div className="grid grid-cols-4 gap-x-12 gap-y-4.5 py-4.5">
                    <PreviewInfo title={BASIC_INFORMATION.NAME} text={name} />
                    <PreviewInfo title={BASIC_INFORMATION.TYPE_DOCUMENT} text={document_type} />
                    <PreviewInfo title={BASIC_INFORMATION.NUMBER_DOCUMENT} text={document_number} />
                    <div />
                    <PreviewInfo title={BASIC_INFORMATION.AREA} text={area} />
                    <PreviewInfo title={BASIC_INFORMATION.ROL} text={position} />
                    <PreviewInfo title={BASIC_INFORMATION.BIRTHDAY} text={birthday || '...'} />
                    <div />
                    <PreviewInfo title={BASIC_INFORMATION.CODE} text={code} />
                </div>
            </div>
            <div className="flex flex-col border-b-1 border-green-extraLight pt-4.5">
                <h2 className="text-base text-gray-dark font-allerbold">{CONTACT_INFORMATION.TITLE}</h2>
                <div className="grid grid-cols-4 gap-x-12 gap-y-4.5 py-4.5">
                    <PreviewInfo title={CONTACT_INFORMATION.PHONE} text={phone_number} />
                    <PreviewInfo title={CONTACT_INFORMATION.ADDRESS} text={address} />
                    <PreviewInfo title={CONTACT_INFORMATION.COUNTRY} text={country} />
                    <div />
                    <PreviewInfo title={CONTACT_INFORMATION.DEPARTMENT} text={department} />
                    <PreviewInfo title={CONTACT_INFORMATION.CITY} text={city} />
                    <PreviewInfo title={CONTACT_INFORMATION.ZIP_CODE} text={postal_code} />
                    <PreviewInfo title={CONTACT_INFORMATION.EMAIL} text={email} />
                </div>
            </div>
            <div className="flex flex-col border-b-1 border-green-extraLight pt-4.5">
                <h2 className="text-base text-gray-dark font-allerbold">{AFFILIATIONS.TITLE}</h2>
                <div className="grid grid-cols-4 gap-x-12 gap-y-4.5 py-4.5">
                    <PreviewInfo title={AFFILIATIONS.TYPE_CONTRIBUTOR} text={contributor_type} />
                    <PreviewInfo title={AFFILIATIONS.SUBTYPE_CONTRIBUTOR} text={contributor_subtype} />
                    <PreviewInfo title={AFFILIATIONS.EPS} text={eps} />
                    <div />
                    <PreviewInfo title={AFFILIATIONS.SEVERANCE_FUND} text={severance_pay} />
                    <PreviewInfo title={AFFILIATIONS.PENSION_FUND} text={pension} />
                    <PreviewInfo title={AFFILIATIONS.COMPENSATION_FUND} text={compensation_fund} />
                    <PreviewInfo title={AFFILIATIONS.RISK_CLASS} text={risk_level} />
                </div>
            </div>
            <div className="flex flex-col pt-4.5">
                <h2 className="text-base text-gray-dark font-allerbold">{CONTRACT.TITLE}</h2>
                <div className="grid grid-cols-4 gap-x-12 gap-y-4.5 py-4.5">
                    <PreviewInfo title={CONTRACT.TYPE_CONTRACT} text={contract_type} />
                    <PreviewInfo title={CONTRACT.START_DATE} text={initial_date || '...'} />
                    <PreviewInfo title={CONTRACT.END_DATE} text={final_date || '...'} />
                    <div />
                    <PreviewInfo title={CONTRACT.PAYMENT_FREQUENCY} text={frequency || payment_frequency} />
                    <PreviewInfo title={CONTRACT.SALARY} text={salary || '...'} />
                    <PreviewInfo title={CONTRACT.TRANSPORTATION_ASSISTANCE} text={has_transportation_assistance || '...'} />
                    <div />
                    <PreviewInfo title={CONTRACT.INTEGRAL_SALARY} text={applyTypeSalary(CONTRACT.INTEGRAL_SALARY, salary_type)} />
                    <PreviewInfo title={CONTRACT.VARIABLE_SALARY} text={applyTypeSalary(CONTRACT.VARIABLE_SALARY, salary_type)} />
                    <PreviewInfo title={CONTRACT.PAYMENT_METHOD} text={payment_method} />
                </div>
            </div>
        </div>
    );
};
