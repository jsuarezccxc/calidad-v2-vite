import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Arrow from '@assets/images/arrow-down-blue.svg';
import paymentPlans from '@assets/images/plans/payment-plans.svg';
import { ElectronicDocuments, Website, Soon } from './components';
import { IGenericRecord } from '@models/GenericRecord';
import { RootState } from '@redux/rootReducer';
import { Plan, PLANS } from '.';
import './Plans.scss';

export const Plans: React.FC<{
    data: IGenericRecord;
    updateData: (data: IGenericRecord) => void;
    toggleLogin?: () => void;
}> = ({ data, updateData, toggleLogin }) => {
    const { userPlans } = useSelector(({ membership }: RootState) => membership);

    const [activePlan, setActivePlan] = useState<string>(Plan.All);
    const [isOpen, setIsOpen] = useState(false);

    const showPlan = (plan: string): boolean => activePlan === Plan.All || activePlan === plan;

    const handleSelect = (option: string): void => {
        setActivePlan(option);
        setIsOpen(false);
    };

    return (
        <div className="plans">
            <h2 className="plans__title">
                <img className="icon--title inline" src={paymentPlans} alt="Payment plans" />
                Planes de pago
            </h2>
            <div className="select-plan-container">
                <div className="select-plan">
                    <button className="select-plan__button" onClick={(): void => setIsOpen(!isOpen)}>
                        {activePlan}
                        <img src={Arrow} alt="arrow" className={`arrow ${isOpen ? 'open' : ''}`} />
                    </button>
                    {isOpen && (
                        <div className="select-plan__dropdown">
                            {PLANS.map((plan, index) => (
                                <>
                                    <div
                                        key={plan.key}
                                        className="select-plan__option"
                                        onClick={(): void => handleSelect(plan.value)}
                                    >
                                        {plan.value}
                                    </div>
                                    {index !== PLANS.length - 1 && <div className="max-w-full mx-2 border-t border-gray"></div>}
                                </>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <p className="text-center text-2lg text-gray-dark mb-4.5 font-poppins">
                Planes a su medida, para cada necesidad empresarial, descubra la solución perfecta.
            </p>
            {showPlan(Plan.Website) && (
                <Website data={data} submodules={userPlans.website} updateData={updateData} toggleLogin={toggleLogin} />
            )}
            {showPlan(Plan.ElectronicDocuments) && (
                <ElectronicDocuments
                    data={data}
                    submodules={userPlans.electronicDocuments}
                    updateData={updateData}
                    toggleLogin={toggleLogin}
                />
            )}
            {showPlan(Plan.Soon) && <Soon />}
        </div>
    );
};
