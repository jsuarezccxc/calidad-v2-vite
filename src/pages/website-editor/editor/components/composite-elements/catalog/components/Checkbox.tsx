import React from 'react';
import { v4 as uuid } from 'uuid';
import { lengthGreaterThanZero } from '@utils/Length';
import { ElementOption } from '@models/WebsiteNode';
import { ICheckboxProps, VerticalArrow } from '.';

export const Checkbox: React.FC<ICheckboxProps> = ({
    name,
    option,
    withoutCheck = false,
    isActive = false,
    handleChange = (): void => {},
    checked = false,
}) => {
    const id = uuid();
    const subcategories = option?.subcategories;

    return (
        <>
            <label
                htmlFor={id}
                className={`filter-selector ${withoutCheck ? 'pl-8' : ''} ${name === ElementOption.Three ? 'items-center' : ''}`}
            >
                {withoutCheck ? (
                    <div className="flex w-full">
                        <span className={`mr-auto text-gray-dark ${name === ElementOption.Three ? 'text-tiny' : ''}`}>
                            {option.name}
                        </span>
                        &nbsp;
                        <span className={`ml-auto' text-secondary ${name === ElementOption.Three ? 'text-tiny' : ''}`}>
                            ({option.amount})
                        </span>
                    </div>
                ) : (
                    <>
                        <span
                            className={`filter-selector__checkbox ${name === ElementOption.Three ? 'bg-white check-three' : ''} ${
                                checked ? 'bg-blue' : ''
                            }`}
                        />
                        <input
                            className="hidden"
                            id={id}
                            type="checkbox"
                            name={name}
                            onChange={(e): void => handleChange(e, option.id || id)}
                        />
                        <p>
                            <span className={`text-gray-dark ${name === ElementOption.Three ? 'text-tiny' : ''}`}>
                                {option.name} &nbsp;
                            </span>

                            <span className={`text-secondary ${name === ElementOption.Three ? 'text-tiny' : ''}`}>
                                ({option.amount})
                            </span>
                        </p>
                    </>
                )}
                {withoutCheck && (
                    <div className="filter-selector__arrow">
                        {subcategories && lengthGreaterThanZero(subcategories) && <VerticalArrow rotate={isActive} />}
                    </div>
                )}
            </label>
            {subcategories && (
                <section className={`filter-selector__subcategory${!isActive ? '--hidden' : ''}`}>
                    {subcategories?.map((subcategory, index) => (
                        <Checkbox key={`sub-${index}`} option={subcategory} withoutCheck name={`${subcategory.name}${index}`} />
                    ))}
                </section>
            )}
        </>
    );
};
