/* eslint-disable @typescript-eslint/no-explicit-any */
//--- Libraries ---//
import React, { useContext, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
//--- Redux ---//
import { RootState } from '@redux/rootReducer';
import { createOrUpdateElement, getPageWebsite } from '@redux/website-node/actions';
//--- Constants ---//
import { ZERO } from '@constants/Numbers';
import { ELEMENTS } from '@constants/WebsiteNode';
//--- Models ---//
import { IGenericRecord } from '@models/GenericRecord';
import { ElementType, Screen } from '@models/WebsiteNode';
//--- Utils ---//
import { getCenterCoordinates } from '@utils/WebsiteNode';
import { specificPxToRecalculate } from '@utils/Size';
//--- Components ---//
import { separateElements } from '../components/save-buttons';
import { DEFAULT_DIMENSION, DROP_ZONE, IDraggableElement } from '../components/drag-and-drop';
//--- Root ---//
import {
    ElementsContext,
    ScreensContext,
    ISettingData,
    IStyleData,
    ICopyableElement,
    CopyableAction,
    updateElementStyles,
    DEFAULT_TOP_FOOTER,
    MARGIN_COMPOSITE_FOOTER,
} from '.';

export const ElementsProvider: React.FC = ({ children }) => {
    const dispatch = useDispatch();
    const { activePage, selectedWebsite } = useSelector((state: RootState) => state.websiteNode);
    const { styleKey, selectScreen, activeScreen } = useContext(ScreensContext);
    const [elements, setElements] = useState<IDraggableElement[]>([]);
    const [deletedElements, setDeletedElements] = useState<IDraggableElement[]>([]);
    const [copyElements, setCopyElements] = useState<IDraggableElement[][]>([]);
    const [copyableElement, setCopyableElement] = useState<ICopyableElement | null>(null);
    const [selectedElement, setSelectedElement] = useState<IDraggableElement | null>(null);
    const [elementsSave, setElementsSave] = useState<IDraggableElement[]>([]);
    const [logoSize, setLogoSize] = useState<IGenericRecord>({
        width: '',
        height: '',
    });

    const { Copy, Cut } = CopyableAction;

    useEffect(() => {
        setCopyElements([]);
        const element = getElementWithHighestBottom(
            activePage?.allElements?.filter(element => element.type !== ElementType.Footer) || []
        );
        const topElement = specificPxToRecalculate(Math.max(element?.style.top + element?.style.height + 25, DEFAULT_TOP_FOOTER));

        updateElements(
            (activePage?.allElements ?? []).map(
                (element): IDraggableElement => {
                    return {
                        ...element,
                        id: element.id ?? element.dbId,
                        desktopStyle: {
                            ...element.desktopStyle,
                            top: element?.type === ElementType.Footer && topElement ? topElement : element?.desktopStyle?.top,
                        },
                        mobileStyle: {
                            ...element.mobileStyle,
                            top: element?.type === ElementType.Footer && topElement ? topElement : element?.mobileStyle?.top,
                        },
                        style: {
                            ...element?.style,
                            ...(element?.type !== ElementType.Footer && element?.desktopStyle),
                            top: element?.type === ElementType.Footer && topElement ? topElement : element?.style?.top,
                        },
                    };
                }
            ),
            true
        );
        const elementHeader = activePage?.allElements?.find(element => element.type === ElementType.Header);
        const sizeLogo = elementHeader?.setting;
        const DEFAULT_LOGO_SIZE = '130';

        if (elementHeader) {
            const width = sizeLogo?.width?.toString() || DEFAULT_LOGO_SIZE;
            const height = sizeLogo?.height?.toString() || DEFAULT_LOGO_SIZE;
            setLogoSize({ width, height });
        } else {
            setLogoSize({ width: '', height: '' });
        }
    }, [activePage]);

    useEffect(() => {
        localStorage.setItem(ELEMENTS, JSON.stringify(elements));
        setElementsSave(elements);
    }, [elements]);

    const getElementWithHighestBottom = (elements: IDraggableElement[]): IDraggableElement | null => {
        return elements.reduce<IDraggableElement | null>((maxElement, element) => {
            const { top, height } = element.style;
            const bottom = (top || ZERO) + (height || ZERO);
            if (!maxElement || bottom > (maxElement.style.top || ZERO) + (maxElement.style.height || ZERO)) return element;

            return maxElement;
        }, null);
    };

    const addElement = (element: IDraggableElement): void => {
        if (element) {
            const topElement = element.style.top;
            const footerTopElement = elements.find(element => element.type === ElementType.Footer)?.style.top;
            let newTopFooter: number = footerTopElement;
            if (topElement && footerTopElement) {
                newTopFooter =
                    footerTopElement - topElement < MARGIN_COMPOSITE_FOOTER
                        ? footerTopElement + MARGIN_COMPOSITE_FOOTER
                        : footerTopElement;
            }

            updateElements([
                ...elements.map(element => {
                    return {
                        ...element,
                        ...(element.type === ElementType.Footer && {
                            style: {
                                ...element.style,
                                top: newTopFooter > element.style.top ? newTopFooter : element.style.top,
                            },
                        }),
                        ...(element.type === ElementType.Footer && {
                            desktopStyle: {
                                ...element.desktopStyle,
                                top: newTopFooter > element?.desktopStyle?.top ? newTopFooter : element?.desktopStyle?.top,
                            },
                            mobileStyle: {
                                ...element.mobileStyle,
                                top: newTopFooter > element?.mobileStyle?.top ? newTopFooter : element?.mobileStyle?.top,
                            },
                        }),
                    };
                }),
                element,
            ]);
        }
    };

    const updateDeletedElements = (id: string, add = true): void => {
        const deletedElement = elements.find(element => element.id === id);
        if (deletedElement) {
            const newData = add
                ? [...deletedElements, { ...deletedElement, isNew: true }]
                : deletedElements.filter(element => element.id !== id);
            setDeletedElements(newData);
        }
    };

    const getElementsInDbPage = async (): Promise<IGenericRecord[]> => {
        if (activePage?.website_id) {
            const pages: any = await dispatch(getPageWebsite(activePage?.website_id ?? ''));
            const elementsPage = pages?.find((pageWebsite: IGenericRecord) => pageWebsite.id === activePage?.id).elements;
            return elementsPage;
        }
        return [];
    };

    const formatElementsRequest = async (
        FormatElements: IGenericRecord[],
        includeWebsiteId = false
    ): Promise<IGenericRecord[]> => {
        const elementsInDbPage = await getElementsInDbPage();
        const { clientWidth } = document.querySelector(`#${DROP_ZONE}`) ?? { clientWidth: DEFAULT_DIMENSION };

        if (includeWebsiteId) {
            const firstHeader = FormatElements.find(item => {
                return item.type === ElementType.Header;
            });

            const firstFooter = FormatElements.find(item => {
                return item.type === ElementType.Footer;
            });

            return FormatElements.map(element => {
                const { type, dbId, delete: is_delete = false } = element;
                return {
                    name: type,
                    is_delete: firstHeader?.dbId === dbId || firstFooter?.dbId === dbId ? is_delete : true,
                    type,
                    value:
                        type === ElementType.Header
                            ? [{ ...element, style: { ...element.style, left: '0%', with: '100%' } }]
                            : [element],
                    class_name: 'element',
                    style_desktop: { color: 'black' },
                    style_mobile: { color: 'black' },
                    ...(includeWebsiteId && { website_id: selectedWebsite.id }),
                    ...(dbId && { id: dbId }),
                };
            });
        } else {
            let combinedElements: IGenericRecord[] = [];
            const newFormatElements = FormatElements.map(formatElement => {
                if (!formatElement.delete) delete formatElement.dbId;
                return { ...formatElement };
            });

            combinedElements = [...newFormatElements];

            elementsInDbPage.forEach(element => {
                combinedElements.push({ ...element, delete: false, dbId: element.id });
            });

            return combinedElements.map((element: IGenericRecord) => {
                const { type, dbId } = element;

                return {
                    name: type,
                    is_delete: element?.delete ?? false,
                    type,
                    value:
                        dbId && !element?.delete
                            ? element.value
                            : [
                                  {
                                      ...element,
                                      is_delete: element?.delete ?? false,
                                      style: {
                                          ...element.desktopStyle,
                                          ...(element?.style?.pageIdLink && { pageIdLink: element?.style?.pageIdLink }),
                                      },
                                      desktopStyle: element.desktopStyle,
                                      mobileStyle: element.mobileStyle,
                                      ...(activeScreen === Screen.Desktop && {
                                          desktopDropZoneWidth: clientWidth,
                                      }),
                                      ...(activeScreen === Screen.Mobile && {
                                          mobileDropZoneWidth: clientWidth,
                                      }),
                                  },
                              ],
                    class_name: 'element',
                    style_desktop: { color: 'black' },
                    style_mobile: { color: 'black' },
                    ...(dbId && { id: dbId }),
                };
            });
        }
    };

    const formatWebsiteRequest = async (): Promise<IGenericRecord> => {
        const { commonElements, individualElements } = separateElements(elementsSave);
        const individualElementsFormatted = Array.from(new Map(individualElements.map(obj => [obj.id, obj])).values());
        const formatCommonElements = await formatElementsRequest(commonElements, true);
        const formatIndividualElements = await formatElementsRequest(individualElementsFormatted);

        const page = selectedWebsite.pages.find(page => page.id === activePage?.id);

        return {
            common_elements: formatCommonElements,
            pages: [{ ...activePage, elements: formatIndividualElements, tab_name: page?.tab_name }],
        };
    };

    const saveChanges = async (): Promise<void> => {
        const screen: Screen = activeScreen;
        const formatElements = await formatWebsiteRequest();
        const create: any = await dispatch(createOrUpdateElement(formatElements));
        selectScreen(screen);
        return create;
    };

    const handleCopyElements = (elementsUpdate: IDraggableElement[]): void => {
        const newElements = [...copyElements];
        if (newElements.length > 19) {
            newElements.shift();
            newElements.push(elementsUpdate);
            setCopyElements(newElements);
        } else {
            newElements.push(elementsUpdate);
            setCopyElements(newElements);
        }
    };

    const deleteElement = (id: string): void => {
        updateDeletedElements(id);
        setElements(elements.filter(element => element.id !== id));
    };

    const selectElement = (element: IDraggableElement | null): void => setSelectedElement(element);

    const selectCopyableElement = (element: ICopyableElement | null): void => setCopyableElement(element);

    const updateElements = (elementsUpdate: IDraggableElement[], isCopy?: boolean): void => {
        if (!isCopy) handleCopyElements(elementsUpdate);
        setElements(elementsUpdate);
    };

    const handleSettingChange = ({ name, value }: ISettingData): void => {
        handleCopyElements(elements);
        if (selectedElement) {
            const newElement = { ...selectedElement, setting: { ...selectedElement?.setting, [name]: value } };
            saveElement(newElement);
        }
    };

    const handleStyleChange = ({ item, name, value }: IStyleData): void => {
        if (selectedElement) {
            const [style, screenStyle] = [selectedElement?.style, selectedElement?.[styleKey]];
            const newElement = {
                ...selectedElement,
                style: { ...style, [item]: { ...style?.[item], [name]: value } },
                [styleKey]: { ...screenStyle, [item]: { ...screenStyle?.[item], ...style?.[item], [name]: value } },
            };
            saveElement(newElement);
        }
    };

    const handleHeaderStyle = ({ height, width }: IGenericRecord): void => {
        if (selectedElement) {
            const [style, screenStyle] = [selectedElement?.style, selectedElement?.[styleKey]];
            const newElement = {
                ...selectedElement,
                setting: { ...selectedElement.setting, height: height, width: width },
                style: { ...style, height: height, top: 0 },
                [styleKey]: { ...screenStyle, height: height },
            };
            saveElement(newElement);
        }
    };

    const saveElement = (newElement: IDraggableElement | null): void => {
        setSelectedElement(newElement);
        if (newElement) {
            setElements(
                elements.map(({ style, ...element }) =>
                    element.id === newElement.id ? newElement : { ...element, style: { ...style, zIndex: style?.zIndex || 1 } }
                )
            );
        }
    };

    const getElementToPaste = (element: IDraggableElement): IDraggableElement => ({
        ...element,
        ...updateElementStyles(element, getCenterCoordinates(element.style)),
        ...(copyableElement?.action === Copy && { id: uuid() }),
    });

    const pasteElement = (): void => {
        if (!copyableElement) return;
        const element = elements.find(element => element.id === copyableElement.id);
        if (element) {
            selectCopyableElement(null);
            selectElement(null);
            const newElement = getElementToPaste(element);
            if (copyableElement.action === Copy) return addElement(newElement);
            if (copyableElement.action === Cut) newElement.delete = false;
            updateElements([...elements.filter(item => item.id !== element.id), newElement]);
        }
    };

    return (
        <ElementsContext.Provider
            value={{
                saveChanges,
                copyElements,
                addElement,
                updateDeletedElements,
                copyableElement,
                deleteElement,
                deletedElements,
                elements,
                handleSettingChange,
                handleStyleChange,
                saveElement,
                selectCopyableElement,
                selectElement,
                selectedElement,
                updateElements,
                pasteElement,
                handleHeaderStyle,
                logoSize,
                setLogoSize,
            }}
        >
            {children}
        </ElementsContext.Provider>
    );
};
