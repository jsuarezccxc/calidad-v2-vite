import React from 'react';
import WaveSoon from '@assets/images/wave-soon.svg';
import { items } from '.';
import './Soon.scss';

export const Soon: React.FC = () => {
    return (
        <div className="electronic-documents">
            <h2 className="mb-8 text-1.5xl font-allerbold text-center text-blue">Próximamente</h2>
            <div className="flex flex-wrap justify-center gap-6 mb-12">
                {items.map(item => (
                    <div key={item.title} className="relative flex flex-col items-center bg-white card-soon">
                        <img
                            src={WaveSoon}
                            alt="wave soon"
                            className="absolute top-0 left-0 object-cover w-full card-soon__wave"
                        />
                        <div className="relative z-10 flex flex-col items-center p-4">
                            <div className="flex items-center justify-center mb-2">
                                <img alt="Module" className="cursor-pointer card-soon__icon" src={item.icon} />
                            </div>
                            <div className="text-center font-poppinsbold card-soon__title">{item.title}</div>
                        </div>
                        <div className="absolute flex justify-center w-full bottom-4">
                            <button className={`card-soon__button card-soon__${item.color}`}>Próximamente</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
