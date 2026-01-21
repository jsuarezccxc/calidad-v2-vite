import React, { useContext } from 'react';
import { Icon } from '@components/icon';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { ElementsContext } from '../../context';
import { SCREENS, IScreensProps } from '.';
import './WorkSpace.scss';

export const Screens: React.FC<IScreensProps> = ({ activeScreen, handleScreenChange }) => {
    const { selectElement } = useContext(ElementsContext);
    return (
        <div className="flex justify-center">
            {SCREENS.map(({ activeIcon, idleIcon, className, text, type, iconClassNames }, index) => {
                const isActive = activeScreen === type;
                return (
                    <button
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-screen-${type}`,
                            action: ActionElementType.PREVIEW,
                            elementType: ElementType.BTN,
                        })}
                        key={type}
                        className={`${className} ${isActive ? 'work-space__tab--active' : 'bg-gray-light'}`}
                        onClick={(): void => {
                            selectElement(null);
                            handleScreenChange(type);
                        }}
                    >
                        {isActive && <span className={`order-${index}`}>{text}</span>}
                        <Icon name={isActive ? activeIcon : idleIcon} className={`${iconClassNames} cursor-pointer`} />
                    </button>
                );
            })}
        </div>
    );
};
