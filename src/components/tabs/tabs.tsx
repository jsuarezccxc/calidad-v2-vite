import React from 'react';
import { ITabs } from '.';

export const Tabs: React.FC<ITabs> = ({ id, tabs, indexTab, setIndexTab }) => {
    return (
        <>
            <div className="flex">
                {tabs.map((tab, index) => (
                    <button
                        id={`${id}-${index}`}
                        key={index}
                        className={`p-2 focus:outline-none font-allerbold rounded-t-lg text-lg leading-5 border-1 border-white border-b-0 ${
                            indexTab === index ? 'bg-white text-blue' : 'bg-green text-white'
                        }`}
                        onClick={(): void => setIndexTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="p-4.5 bg-white w-full h-full">{tabs[indexTab].content}</div>
        </>
    );
};
