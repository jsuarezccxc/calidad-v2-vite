import React, { useEffect } from 'react';
import { RootState } from '@redux/rootReducer';
import { setPlanWebsiteActive } from '@redux/membership/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Tab } from './Tab';
import { TABS } from '.';
import './Sidebar.scss';

export const Sidebar: React.FC = React.memo(() => {
    const {
        membership: { planWebsiteActive },
        company: { membershipWebsiteDetails },
    } = useSelector((state: RootState) => state);
    const dispatch = useDispatch();

    useEffect(() => {
        if (membershipWebsiteDetails) {
            const [, plan] = membershipWebsiteDetails.name.split(' - ');
            dispatch(setPlanWebsiteActive(plan.toUpperCase()));
        }
    }, [membershipWebsiteDetails]);

    return (
        <aside className="sidebar ">
            <div className="sidebar__plan">
                <span className="mt-8 ml-5 pt-0.5 font-allerbold font-bold text-xl text-blue">
                    {planWebsiteActive?.toUpperCase()}
                </span>
            </div>
            <div className="sidebar__tabs overflow-y-auto bg-green-scrollbar">
                {TABS.map(tab => (
                    <Tab key={tab} type={tab} />
                ))}
            </div>
        </aside>
    );
});
