import React, { useState } from 'react';
import { Icon } from '@components/icon';
import { Information } from '@components/information';
import { constantModule, IIndividualModule, IModule } from '.';

const IndividualModules: React.FC<IIndividualModule> = ({
    titleModule,
    dataModule,
    onClickIcon = (): void => {},
    sizeScreen,
}) => {
    const [activeMembership, setActiveMembership] = useState(false);

    return (
        <div className="flex flex-col mb-2.5 xs:w-full">
            <div
                className="max-w-sm h-15.75 xs:h-10 xs:max-w-full bg-green rounded-2.5xl flex items-center justify-center cursor-pointer relative xs:rounded-lg xs:justify-start pl-4.5"
                onClick={(): void => {
                    setActiveMembership(!activeMembership);
                }}
            >
                <h3 className="text-lg text-white font-poppinsbold xs:text-base">{titleModule}</h3>
                {sizeScreen < constantModule.sizeScreen && (
                    <Icon
                        name="arrowDownWhite"
                        className={`transition duration-200 transform absolute z-1 m-0 top-2 right-4 w-7 ${
                            activeMembership ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                )}
            </div>
            {(sizeScreen > constantModule.sizeScreen || activeMembership) && (
                <div className="rounded-2.5xl max-w-sm xs:max-w-full bg-white pr-5.5 pl-6 pt-6.70 pb-4 mt-3.5 xs:px-4.5">
                    {dataModule.map((module, index) => (
                        <div
                            className={`${0 === index ? 'pt-0' : 'pt-4'} ${
                                index !== dataModule.length - 1 ? 'border-b-2 border-green pb-4' : ''
                            }`}
                            key={index}
                        >
                            <Module onClickIcon={(title, description): void => onClickIcon(title, description)} {...module} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default IndividualModules;

const Module: React.FC<IModule> = ({
    isTitleIcon,
    title = '',
    descriptionModule,
    onClickIcon = (): void => {},
    descriptionModal = '',
}) => {
    return (
        <>
            <div className="flex items-center">
                <Information
                    classNameContainer="w-41 xs:w-3/5"
                    title={title}
                    onClickIcon={(): void => {
                        onClickIcon(title, descriptionModal);
                    }}
                    classNameTitle="lg:text-base md:text-base font-poppinssemibold ml-2.5 text-center mr-2 xs:text-sm xs:ml-0 w-full"
                    color="blue"
                    classNameIcon={`${isTitleIcon ? 'm-auto' : 'hidden'}`}
                />
                <div className="pl-2 border-l-2 border-green w-38.2 xs:w-2/5">
                    {descriptionModule?.map((description, index) => (
                        <div
                            key={index}
                            className={`${0 === index ? 'pt-0' : 'pt-1.5'} ${
                                description.separator && 'border-b-2 border-green pb-1.5'
                            }`}
                        >
                            <div className="flex items-start">
                                {description.descriptionIcon && <Icon alt="check" name="checkBlue" className="mr-2.5" />}
                                <p
                                    className={`text-tiny  w-full xs:text-xtiny ${
                                        (description.separator || description.textPositionCenter) &&
                                        !description.descriptionIcon &&
                                        'text-center'
                                    } ${description.textColor ? `text-${description.textColor}` : 'text-blue'}`}
                                >
                                    {description.description}{' '}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
