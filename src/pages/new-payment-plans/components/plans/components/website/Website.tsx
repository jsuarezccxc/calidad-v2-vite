import React from 'react';
import website from '@assets/images/plans/website.svg';
import { IGenericRecord } from '@models/GenericRecord';
import { getActiveIndex, ToggleSwitch } from '..';
import { Card, Details, IWebsiteProps } from '.';
import './Website.scss';

export const Website: React.FC<IWebsiteProps> = ({ data, updateData, submodules, toggleLogin }) => {
    const selectPlan = (plan: IGenericRecord): void => {
        if (plan.isActive) return;
        updateData({ ...data, websitePlan: { ...plan, isWebsite: true } });
    };

    const showAllButtons = submodules.every((item: IGenericRecord) => !item.isActive);

    return (
        <div className="website">
            <h2 className="plans__plan-title">
                <img className="icon--section inline" src={website} alt="Website" />
                Sitio web y tienda virtual
            </h2>
            <ToggleSwitch
                checked={data.annualPlan}
                handleChange={({ target: { checked } }): void => updateData({ ...data, annualPlan: checked })}
            />
            <div className="flex gap-4.5 justify-center mt-4.5 flex-wrap">
                {submodules.map((item, index) => (
                    <Card
                        key={item.name}
                        data={data}
                        card={{ ...item, index }}
                        selectPlan={(): void => selectPlan(item)}
                        showAllButtons={showAllButtons}
                        hideButton={index < getActiveIndex(submodules)}
                        hasActivePlan={submodules?.some(submodule => submodule?.isActive)}
                        toggleLogin={toggleLogin}
                    />
                ))}
            </div>
            <Details />
        </div>
    );
};
