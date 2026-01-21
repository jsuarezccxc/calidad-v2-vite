//--- Libraries ---//
import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
//--- Components ---//
import { Icon } from '@components/icon';
import { Link } from '@components/button';
import { Table } from '@components/table';
import { PageTitle } from '@components/page-title';
import { ModalType } from '@components/modal-custom';
import ModalSaveNext from '@components/modal-save-next';
import { BreadCrumb } from '@components/bread-crumb';
import { Information } from '@components/information';
import { PageButtonsFooter } from '@components/page-buttons-footer';
import { TableProvisionServices } from './components';
//--- Redux ---//
import { RootState } from '@redux/rootReducer';
import { getDynamicRequest } from '@redux/dynamic-data/actions';
import {
    deleteProvisionServices,
    getInformationProvisionServices,
    postInformationProvisionServices,
} from '@redux/inventory/actions';
//--- Models ---//
import { IGenericRecord } from '@models/GenericRecord';
//--- Utils ---//
import { useOnClickOutside } from '@utils/ClickOutside';
import { buttonsFooterProps } from '@utils/Button';
import { getRoute, getRouteName } from '@utils/Paths';
import { lengthGreaterThanZero, lengthGreaterThanOne, lengthEqualOne, lengthEqualToZero } from '@utils/Length';
import { ModuleApp, ActionElementType, generateId, ElementType } from '@utils/GenerateId';
//--- Constants ---//
import { Routes } from '@constants/Paths';
import { SUCCESS_RESPONSE } from '@constants/StatusCodes';
import { CITIES, DEPARTMENTS } from '@constants/DynamicRequest';
import { Source } from '@constants/Onboarding';
//--- Information Texts ---//
import { PROVISION_SERVICES } from '@information-texts/InformationProvisionServices';
//--- Hooks ---//
import useOnboardingNavigation from '@hooks/useOnboardingNavigation';
import usePermissions from '@hooks/usePermissions';
//--- Root ---//
import {
    routes,
    DATA_CITIES_INITIAL_SERVICES,
    headersTableServices,
    constants,
    ILocation,
    formatDataTable,
    optionsToAssign,
    IDataCities,
    IDepartment,
    orderInputsCities,
} from '.';
//--- Styles ---//
import './InformationProvisionOfServices.scss';

const InformationProvisionOfServices: React.FC = () => {
    const [history, dispatch] = [useHistory(), useDispatch()];

    const selectParentRef = useRef(null);

    const {
        inventory: { provisionService },
        dynamicData: { dynamicData },
    } = useSelector((state: RootState) => state);
    const [openShowModal, setOpenShowModal] = useState(false);
    const [openShowModalDelete, setOpenShowModalDelete] = useState(false);
    const [idDeleteCity, setIdDeleteCity] = useState<IGenericRecord[]>([]);
    const [idDeleteDepartment, setIdDeleteDepartment] = useState<IGenericRecord[]>([]);
    const [dataProvisonServices, setDataProvisonServices] = useState<ILocation>(DATA_CITIES_INITIAL_SERVICES);
    const [citySave, setCitySave] = useState(false);
    const [validationCities, setValidationCities] = useState(false);
    const [validateCityCount, setValidateCityCount] = useState<string[]>([]);
    const [openShowModalSave, setOpenShowModalSave] = useState(false);
    const [validateModalSave, setValidateModalSave] = useState(false);
    const [totalValidate, setTotalValidate] = useState<IGenericRecord>([]);
    const [openSelect, setOpenSelect] = useState({ number: 0, name: '' });

    const { disabledInputs } = usePermissions();
    const { handlePostConfirmation } = useOnboardingNavigation(Source.Website);

    useEffect(() => {
        (async (): Promise<void> => {
            await dispatch(getDynamicRequest([DEPARTMENTS, CITIES]));
            await dispatch(getInformationProvisionServices());
        })();
    }, []);

    useEffect(() => {
        if (lengthGreaterThanZero(provisionService))
            setDataProvisonServices({
                location: formatDataTable(provisionService, dynamicData),
            });
    }, [provisionService, dynamicData]);

    useEffect(() => {
        const filterValidateCities: IDataCities[] = [];
        const validateCountCities: string[] = [];
        dataProvisonServices.location.forEach((itemCities: IDepartment) => {
            if (lengthEqualOne(itemCities.cities)) validateCountCities.push(itemCities.department_name);
            filterValidateCities.push(...itemCities.cities);
        });
        const validateCities = filterValidateCities.filter((city: IDataCities) => {
            if (city.name === '' && !city.link) return city;
        });
        const validateDepartment = dataProvisonServices.location.filter((department: IGenericRecord) => {
            if (department.department_name === '') return department;
        });
        setValidateCityCount(validateCountCities);

        setTotalValidate([...validateCities, ...validateDepartment]);
        lengthGreaterThanZero(validateCities) || lengthGreaterThanZero(validateDepartment)
            ? setValidationCities(true)
            : setValidationCities(false);
    }, [dataProvisonServices]);

    const handleChangeSelectDepartment = (option: IGenericRecord | ChangeEvent<HTMLInputElement>, item: string): void => {
        const { code, id = '', name } = option.target ? option.target : option;
        setDataProvisonServices({
            ...dataProvisonServices,
            location: optionsToAssign(
                dataProvisonServices?.location?.map(iteDepartment => {
                    if (iteDepartment.id === item) {
                        return {
                            ...iteDepartment,
                            id: iteDepartment.id,
                            department_name: name,
                            department_id: id.toString(),
                            department_code: code.toString(),
                            cities: iteDepartment.cities,
                        };
                    }
                    return iteDepartment;
                }),
                dynamicData
            ),
        });
        setValidateModalSave(true);
    };

    const handleChangeSelectCity = (
        option: IGenericRecord | ChangeEvent<HTMLInputElement>,
        itemCity: string,
        itemDepartment: string
    ): void => {
        const { code, id = '', name } = option.target ? option.target : option;
        setDataProvisonServices({
            ...dataProvisonServices,
            location: optionsToAssign(
                dataProvisonServices?.location?.map(iteDepartment => {
                    if (iteDepartment.id === itemDepartment) {
                        return {
                            ...iteDepartment,
                            cities: iteDepartment.cities.map(city => {
                                if (city.id === itemCity) {
                                    return {
                                        id: city.id,
                                        name: name,
                                        city_id: id.toString(),
                                        code: code,
                                        options: [],
                                        link: false,
                                    };
                                }
                                return city;
                            }),
                        };
                    }
                    return iteDepartment;
                }),
                dynamicData
            ),
        });
        setValidateModalSave(true);
    };

    const addCity = (idItem: string): void => {
        setCitySave(false);
        setDataProvisonServices({
            ...dataProvisonServices,
            location: optionsToAssign(
                dataProvisonServices?.location?.map(iteDepartment => {
                    if (iteDepartment.id === idItem) {
                        iteDepartment.cities.push({
                            id: uuid(),
                            name: '',
                            city_id: 0,
                            code: '',
                            options: [],
                            link: false,
                        });
                        iteDepartment.cities = orderInputsCities(iteDepartment.cities);
                        return {
                            ...iteDepartment,
                        };
                    }
                    return iteDepartment;
                }),
                dynamicData
            ),
        });
        setValidateModalSave(true);
    };

    const addDepartment = (): void => {
        setCitySave(false);
        setDataProvisonServices({
            ...dataProvisonServices,
            location: optionsToAssign(
                [
                    ...dataProvisonServices.location,
                    {
                        id: uuid(),
                        department_name: '',
                        department_id: '',
                        department_code: '',
                        options: [],
                        cities: [
                            {
                                id: uuid(),
                                name: '',
                                city_id: 0,
                                code: '',
                                options: [],
                                link: false,
                            },
                            {
                                id: uuid(),
                                name: '',
                                city_id: 0,
                                code: '',
                                options: [],
                                link: true,
                            },
                        ],
                    },
                ],
                dynamicData
            ),
        });
        setValidateModalSave(true);
    };

    const deleteItem = async (idDelete: IGenericRecord[], type: string): Promise<void> => {
        await dispatch(deleteProvisionServices(idDelete, type));
    };

    const handleDeleteItem = async (): Promise<void> => {
        let location = dataProvisonServices.location.slice();
        if (lengthGreaterThanZero(idDeleteDepartment)) {
            await deleteItem(idDeleteDepartment, constants.DEPARTMENT);
            const idItemDelete = idDeleteDepartment.map(idDepartment => idDepartment.id);
            location = location.filter(departments => !idItemDelete.includes(departments.id));
        }
        if (lengthGreaterThanZero(idDeleteCity)) {
            await deleteItem(idDeleteCity, constants.CITY);
            const idItemDelete = idDeleteCity.map(idCity => idCity.id);
            const departmentsZeroCities: string[] = [];
            location = location.map(itemDepartment => {
                const citiesByDepartment = itemDepartment.cities.filter(city => !idItemDelete.includes(city.id));
                if (lengthEqualToZero(citiesByDepartment)) departmentsZeroCities.push(itemDepartment.id);
                return {
                    ...itemDepartment,
                    cities: citiesByDepartment,
                };
            });
            location = location.filter(departments => !departmentsZeroCities.includes(departments.id));
        }
        setDataProvisonServices({ location: optionsToAssign(location, dynamicData) });
        setOpenShowModalDelete(!openShowModalDelete);
        setIdDeleteDepartment([]);
        setIdDeleteCity([]);
    };

    const saveCities = async (): Promise<void> => {
        setCitySave(true);
        if (!validationCities && lengthGreaterThanZero(dataProvisonServices?.location) && lengthEqualToZero(validateCityCount)) {
            const dataSave: IDepartment[] = [];
            dataProvisonServices.location.slice().forEach(item => {
                item.cities = item.cities.filter(itemCity => !itemCity.link);
                dataSave.push(item);
            });
            const status = await dispatch(postInformationProvisionServices(dataSave));
            if (SUCCESS_RESPONSE.includes(Number(status))) {
                setOpenShowModal(true);
                setCitySave(false);
                setDataProvisonServices({ location: [] });
                dispatch(getInformationProvisionServices());
            }
        }
    };

    const selectOpen = (id: string, name: string): void => {
        const obj = document.getElementById(id.toString());
        const number = obj?.getElementsByTagName('div').length;
        number && setOpenSelect({ ...openSelect, number: name === 'blur' ? 0 : number, name: name });
    };

    useOnClickOutside(selectParentRef, () => {
        setOpenSelect({ ...openSelect, number: 0 });
    });

    return (
        <div className="xs:px-2">
            <ModalType
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-info-provision-services`,
                    action: ActionElementType.SAVE,
                    elementType: ElementType.MDL,
                })}
                type="save"
                show={openShowModal}
                closeIcon={false}
                showModal={(): void => handlePostConfirmation(() => setOpenShowModal(!openShowModal))}
                title="Información guardada"
                text="¡Su información ha sido guardada con éxito!"
                classesWrapper="w-min-mi"
            />
            <ModalType
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-info-provision-services`,
                    action: ActionElementType.DELETE,
                    elementType: ElementType.MDL,
                })}
                type="delete"
                show={openShowModalDelete}
                closeIcon={false}
                showModal={(): void => {
                    setOpenShowModalDelete(!openShowModalDelete);
                }}
                title="Eliminar"
                text={PROVISION_SERVICES.MODAL_DELETE}
                classesWrapper="w-min-mi"
                mainAction={(): void => {
                    handleDeleteItem();
                }}
            />
            <ModalSaveNext
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `${ModuleApp.MODALS}-info-provision-services-save`,
                    action: ActionElementType.NEXT,
                    elementType: ElementType.MDL,
                })}
                show={openShowModalSave}
                closeIcon={false}
                showModal={(): void => {
                    setOpenShowModalSave(!openShowModalSave);
                }}
                data={(): void => {
                    saveCities();
                    setCitySave(true);
                }}
                setOpenShowModal={(): void => {
                    setValidateModalSave(false);
                }}
                onClick={(): void => {
                    setOpenShowModalSave(!openShowModalSave);
                }}
            />
            <div className="h-full lg:p-0 ">
                <PageTitle title={getRouteName(Routes.WEBSITE_MENU)} />
                <BreadCrumb routes={routes()} />
                <PageTitle title="Cómo promocionar y optimizar el sitio web" classTitle="mb-4 text-center text-26lg" />
                <Information
                    title="Ubicación de la prestación de servicios"
                    color="blue"
                    isList
                    customText={PROVISION_SERVICES.DESCRIPTION_INFORMATION_PROVISION_SERVICES}
                    classNameTitle="lg:text-base xs:text-base"
                />
                <div
                    className={`xs:relative ${!dataProvisonServices.location.length && 'ml-8.5'} ${
                        openSelect.name === constants.CITY &&
                        openSelect.number < constants.NUMBRE_MAX_DIV_SIX &&
                        openSelect.number !== 0
                            ? 'xs:-left-56 '
                            : ''
                    }`}
                    ref={selectParentRef}
                >
                    <div className="flex justify-end mb-2 overflow-x-visible lg:w-164 xs:w-full">
                        <Icon
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `info-provision-services-city-department`,
                                action: ActionElementType.TRASH,
                                elementType: ElementType.ICO,
                            })}
                            name="trashBlue"
                            className="w-5.5 h-5.5 mt-2 ml-2 cursor-pointer xs:mt-1 "
                            hoverIcon="trashGreen"
                            onClick={(): void => {
                                (idDeleteCity.length || idDeleteDepartment.length) && setOpenShowModalDelete(true);
                            }}
                        />
                    </div>
                    <Table
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `info-provision-services-city-department`,
                            action: ActionElementType.INFO,
                            elementType: ElementType.TBL,
                        })}
                        data={[]}
                        headersTable={headersTableServices}
                        customTable
                        sendFormWithEnter
                        className="mb-2 max-w-min"
                        wrapperClassName={`mb-2 lg:overflow-y-visible ${
                            (openSelect.name === constants.DEPARTMENT &&
                                openSelect.number < constants.NUMBRE_MAX_DIV_SIX &&
                                openSelect.number !== 0) ||
                            (openSelect.name === constants.CITY &&
                                openSelect.number < constants.NUMBRE_MAX_DIV_SIX &&
                                openSelect.number !== 0)
                                ? 'xs:overflow-y-visible xs:mb-3.5 '
                                : ''
                        }`}
                    >
                        <TableProvisionServices
                            dataLocation={dataProvisonServices.location}
                            addCity={addCity}
                            handleChangeSelectDepartment={handleChangeSelectDepartment}
                            handleChangeSelectCity={handleChangeSelectCity}
                            idDeleteCity={idDeleteCity}
                            idDeleteDepartment={idDeleteDepartment}
                            setIdDeleteDepartment={setIdDeleteDepartment}
                            setIdDeleteCity={setIdDeleteCity}
                            onClickSelect={selectOpen}
                            validationCities={citySave && validationCities}
                            citiesRequest={dynamicData?.cities}
                            validateCitiesZero={validateCityCount}
                        />
                    </Table>
                    {validateCityCount.map((item, index) => (
                        <p key={index} className="mb-2 ml-8 text-xs text-purple">
                            * El departamento {item} debe de tener por lo menos una ciudad
                        </p>
                    ))}
                    {citySave && validationCities && lengthGreaterThanOne(totalValidate) ? (
                        <p className="mb-2 ml-8 text-xs text-purple">* Los campos resaltados son obligatorios.</p>
                    ) : (
                        citySave &&
                        validationCities &&
                        lengthEqualOne(totalValidate) && (
                            <p className="mb-2 ml-8 text-xs text-purple">* El campo resaltado es obligatorio.</p>
                        )
                    )}
                    <Link
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `info-provision-services-department`,
                            action: ActionElementType.ADD,
                            elementType: ElementType.LNK,
                        })}
                        href="#"
                        text="+ Agregar departamento"
                        classes={`text-base lg:w-40 mt-2  ${!dataProvisonServices.location.length ? '' : 'ml-0 sm:ml-8.5'}`}
                        onClick={(): void => {
                            addDepartment();
                        }}
                        disabled={disabledInputs}
                    />
                </div>
                <div className="flex flex-col w-full mt-4.5 xs:mt-2">
                    <p className=" font-aller text-gray-dark">Una vez haya agregado la información, haga click en Guardar.</p>
                </div>
            </div>

            <PageButtonsFooter
                threeButtons
                titleButtonCenter="Guardar"
                onClickButtonCenter={(): void => {
                    saveCities();
                    setValidateModalSave(false);
                }}
                {...buttonsFooterProps(
                    ModuleApp.WEBSITE,
                    history,
                    validateModalSave
                        ? (): void => {
                              setOpenShowModalSave(true);
                          }
                        : getRoute(Routes.WEBSITE_INVENTORY),
                    {
                        name: getRouteName(Routes.HOME),
                        moduleName: getRouteName(Routes.HOME),
                    }
                )}
                disabledCenter={disabledInputs}
            />
        </div>
    );
};

export default InformationProvisionOfServices;
