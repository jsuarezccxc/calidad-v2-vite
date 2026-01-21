import React, { useState } from 'react';
import { ModuleApp, generateId, ActionElementType, ElementType } from '@utils/GenerateId';
import { ITabs } from '.';

export const Tabs: React.FC<ITabs> = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div>
            <div className="flex">
                {tabs.map((tab, index) => (
                    <button
                        id={generateId({
                            module: ModuleApp.ELECTRONIC_DOCUMENTS,
                            submodule: `number-range-tab-${tab.label}-${index}`,
                            action: ActionElementType.ACTION,
                            elementType: ElementType.BTN,
                        })}
                        key={index}
                        className={`p-2 focus:outline-none font-allerbold rounded-t-lg text-lg leading-5 border-1 border-white border-b-0 ${
                            activeTab === index ? 'bg-white text-blue' : 'bg-green text-white'
                        }`}
                        onClick={(): void => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="p-4.5 bg-white w-full">{tabs[activeTab].content}</div>
        </div>
    );
};
