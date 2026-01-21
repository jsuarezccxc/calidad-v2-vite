import React from 'react';

// Vite dynamic imports for sidebar images
const sidebarImages = import.meta.glob<{ default: string }>('/src/assets/images/sidebar/*.svg', { eager: true });
const getSidebarImage = (name: string): string => {
    const path = `/src/assets/images/sidebar/${name}.svg`;
    return sidebarImages[path]?.default || '';
};
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { RootState } from '@redux/rootReducer';
import { WEBSITE_PLANS } from '@constants/WebsiteNode';
import { CLASS_OPTION_MAP, idModalTabElement, IOptionParam, IOptionsProps, OPTIONS_BASIC_PLAN, TAB_WEBSITE } from '..';

export const Options: React.FC<IOptionsProps> = ({ options = [], module = '' }) => {
    const { planWebsiteActive } = useSelector((state: RootState) => state.membership);

    const getClassOption = (name: string): string => CLASS_OPTION_MAP[name] ?? '';

    const getOptions = (): IOptionParam[] => {
        if (module === TAB_WEBSITE && [WEBSITE_PLANS.BASIC_PLAN, WEBSITE_PLANS.ADVANCED_PLAN].includes(planWebsiteActive || '')) {
            return options.filter(item => OPTIONS_BASIC_PLAN.includes(item.name));
        }

        return options;
    };

    return (
        <>
            <div id={idModalTabElement} className="option-content" />
            <div className="sidebar-options">
                {getOptions().map(({ name, icon, route }) => (
                    <NavLink to={route} className={`option ${getClassOption(name)}`} key={name}>
                        <img
                            className="cursor-pointer option__img"
                            src={getSidebarImage(icon)}
                        />
                        <p className="option__name">{name}</p>
                    </NavLink>
                ))}
            </div>
        </>
    );
};
