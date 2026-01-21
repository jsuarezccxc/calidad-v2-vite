import React from 'react';
import electronicDocuments from '@assets/images/plans/electronic-documents.svg';
import { IGenericRecord } from '@models/GenericRecord';
import { Card, Details, IElectronicDocumentsProps } from '.';
import './ElectronicDocuments.scss';

export const ElectronicDocuments: React.FC<IElectronicDocumentsProps> = ({ data, submodules, updateData, toggleLogin }) => {
    const selectPlan = (plan: IGenericRecord): void => {
        if (plan.isActive) return;
        updateData({ ...data, documentPlan: plan });
    };

    return (
        <div className="electronic-documents">
            <h2 className="plans__plan-title">
                <img className="icon--section inline" src={electronicDocuments} alt="Electronic documents" />
                Documentos electrónicos
            </h2>
            <div className="flex gap-4.5 justify-center mt-7 grid__documents">
                {submodules.map((item, index) => (
                    <Card
                        key={item.name}
                        card={{ ...item, index }}
                        selectedPlan={data?.documentPlan}
                        selectPlan={(): void => selectPlan(item)}
                        hasActivePlan={submodules.some(submodule => submodule.isActive)}
                        toggleLogin={toggleLogin}
                    />
                ))}
            </div>
            <Details />
        </div>
    );
};
