import React from 'react';
import { Icon } from '@components/icon';
import { IIconTitleProps, IPageTitleProps } from './';

/**
 * Component for all title pages with breadcrumb
 *
 * @returns A react element
 */
export const PageTitle: React.FC<IPageTitleProps> = ({
    title,
    classContainer = '',
    classTitle = '',
    pageContent,
}: IPageTitleProps): React.ReactElement => {
    return (
        <div className={`mb-1 xs:mb-6 mt-7 ${classContainer}`}>
            <h1 className={`text-base text-blue font-allerbold ${classTitle}`}>{title}</h1>
            {pageContent && <p className="mb-2 text-blue">({pageContent})</p>}
        </div>
    );
};

/**
 * Component for all new title pages with breadcrumb
 *
 * @returns A react element
 */
export const PageTitleCustom: React.FC<IPageTitleProps> = ({
    title,
    classContainer = '',
    classTitle = '',
}: IPageTitleProps): React.ReactElement => {
    return (
        <div className={`mb-1 xs:mb-6 mt-9 ${classContainer}`}>
            <p className={`text-blue ${classTitle} font-allerbold`}>{title}</p>
        </div>
    );
};

/**
 * Component for all title pages with icons
 *
 * @returns A react element
 */
export const IconTitle: React.FC<IIconTitleProps> = ({ id, icon, label, size, classContainer }) => {
    const sizeStyles = {
        small: {
            icon: 'w-6 h-6',
            label: 'text-base',
        },
        medium: {
            icon: 'w-8 h-8',
            label: 'text-1.5xl',
        },
        large: {
            icon: 'w-14 h-14',
            label: 'text-4xl',
        },
    };

    const { icon: iconSize, label: labelSize } = size ? sizeStyles[size] : { icon: '', label: 'text-3xl' };

    return (
        <div id={id} className={`flex items-center justify-center text-center flex-row xs:flex-col ${classContainer}`}>
            {icon && <Icon id={`${id}-ico`} name={icon} classIcon={`mr-2 ${iconSize}`} />}
            <h1 className={`text-blue font-bold ${labelSize}`}>{label}</h1>
        </div>
    );
};
