import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from '@components/icon';
import { CAROUSEL_FIVE, ELEMENTS, SCREEN_WEBSITE, TEMPLATE } from '@constants/WebsiteNode';
import { IGenericRecord } from '@models/GenericRecord';
import { ElementOption, ElementType, IPageWebsite, StyleKey } from '@models/WebsiteNode';
import { getWebsite, getWebsites } from '@redux/website-node/actions';
import { RootState } from '@redux/rootReducer';
import { getCatalogWebsite, getCategories } from '@redux/product-catalog/actions';
import { PAGE_TEMPLATES } from '@utils/PageTemplates';
import { ElementType as ElementTypeId, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { DRAGGABLE_ELEMENT, DROP_ZONE, IDraggableElement, ZERO } from '../editor/components/drag-and-drop';
import { FOOTER_TOP_MOBILE, MOBILE_LOCAL_STORAGE } from '.';
import './Preview.scss';

export const Preview: React.FC = () => {
    const dispatch = useDispatch();

    const {
        websiteNode: { selectedWebsite, activePage, dataCarouselFive },
    } = useSelector(({ websiteNode }: RootState) => ({ websiteNode }));

    const [styleKey, setStyleKey] = useState<StyleKey>(
        localStorage.getItem(SCREEN_WEBSITE) === MOBILE_LOCAL_STORAGE ? StyleKey.MobileStyle : StyleKey.DesktopStyle
    );

    const [templateElements, setTemplateElements] = useState<IDraggableElement[]>([]);
    const [selectedElements, setSelectedElements] = useState<IDraggableElement[]>([]);

    const elements: IDraggableElement[] = JSON.parse(localStorage[ELEMENTS] ?? '[]').filter(
        (element: IDraggableElement) => !element.delete
    );
    const catalogElement = document.querySelector('.catalog');
    const footerElement = document.querySelector('.footer');

    useEffect(() => {
        (async (): Promise<void> => {
            await dispatch(getCatalogWebsite(true));
            await dispatch(getCategories());
            const websites: IGenericRecord = await dispatch(getWebsites());
            await dispatch(getWebsite(websites.find((item: IGenericRecord) => !item?.is_draft).id));
        })();
    }, []);

    useEffect(() => {
        const dataCarousel = JSON.parse(localStorage[CAROUSEL_FIVE] ?? '{}');
        if (!dataCarousel?.selectedPage) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const elementPages: any =
            selectedWebsite.pages.find(item => item.id === dataCarousel?.selectedPage)?.elements?.flatMap(item => item.value) ||
            [];

        const commonElement = elements.filter(item => item.type === ElementType.Footer || item.type === ElementType.Header);
        elementPages?.length && setSelectedElements([...commonElement, ...elementPages]);
    }, [dataCarouselFive]);

    useEffect(() => {
        getTemplateElements();
    }, []);

    const isMobile = styleKey === StyleKey.MobileStyle;

    const getTemplateElements = (): void => {
        const selectedTemplate: ElementOption = localStorage[TEMPLATE];
        if (selectedTemplate) setTemplateElements(PAGE_TEMPLATES[selectedTemplate]);
    };

    const getElementTop = (element: IDraggableElement, style: IGenericRecord): number => {
        if (element.type === ElementType.Footer && catalogElement?.clientHeight && footerElement?.clientHeight) {
            return catalogElement?.clientHeight + footerElement?.clientHeight;
        }
        return style?.top;
    };

    const handleRedirect = (data: IGenericRecord): void => {
        if (data?.style?.pageIdLink) {
            const selectPage: IPageWebsite | null =
                selectedWebsite?.pages?.find(item => item.id === data?.style?.pageIdLink) || null;
            const elementsSelect: IDraggableElement[] = selectPage?.elements?.flatMap(item => item.value[ZERO]) || [];
            const commonElement = selectedWebsite?.common_elements?.flatMap(item => item.value[0]) || [];
            setTemplateElements([...elementsSelect, ...commonElement]);
            return;
        }
        const link = data?.style?.link?.trim();
        if (typeof link === 'string' && link) {
            window.open(link, '_blank');
        }
    };

    return (
        <div
            className={`preview-page fixed ${isMobile ? 'bg-gray-smoke' : 'bg-white'} -left-0`}
            style={{ background: !isMobile && activePage?.style?.background }}
        >
            <div className="preview-page__header">
                <h3 className="preview-page__header-title">Previsualización sitio web</h3>
                <div className="preview-page__header-container-icons">
                    <Icon
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-desktop`,
                            action: ActionElementType.PREVIEW,
                            elementType: ElementTypeId.ICO,
                        })}
                        name={!isMobile ? 'desktopWhite' : 'desktopPreview'}
                        className={`w-1/2 border-r border-black py-0.5 rounded-l-lg cursor-pointer ${
                            !isMobile ? 'bg-blue' : 'bg-gray-light'
                        }`}
                        onClick={(): void => {
                            setStyleKey(StyleKey.DesktopStyle);
                        }}
                    />
                    <Icon
                        id={generateId({
                            module: ModuleApp.WEBSITE,
                            submodule: `editor-mobile`,
                            action: ActionElementType.PREVIEW,
                            elementType: ElementTypeId.ICO,
                        })}
                        name={isMobile ? 'mobileWhite' : 'mobilePreview'}
                        className={`w-1/2 py-0.5 rounded-r-lg cursor-pointer ${isMobile ? 'bg-blue' : 'bg-gray-light'}`}
                        onClick={(): void => {
                            setStyleKey(StyleKey.MobileStyle);
                        }}
                    />
                </div>
            </div>

            <div
                className={`${DROP_ZONE} w-full h-full ${isMobile ? 'preview-page__mobile-screen invisible-scroll-bar' : ''}`}
                style={{ background: activePage?.style?.background }}
            >
                <div className="relative flex flex-col justify-between w-full h-auto gap-y-5">
                    {(templateElements.length ? templateElements : selectedElements?.length ? selectedElements : elements)
                        .reverse()
                        .map(element => {
                            const Element = DRAGGABLE_ELEMENT[element.type];
                            const style =
                                element.type === ElementType.Header
                                    ? element.style || element[styleKey]
                                    : element[styleKey] || element.style;
                            return !element?.is_delete ? (
                                <Element
                                    styleKey={styleKey}
                                    key={element.id}
                                    isMobile={isMobile}
                                    data={{
                                        ...element,
                                        style: {
                                            ...style,
                                            position: 'absolute',
                                            top:
                                                element.type === ElementType.Footer && isMobile && catalogElement
                                                    ? FOOTER_TOP_MOBILE
                                                    : getElementTop(element, style),
                                        },
                                    }}
                                    isPreview
                                    onClickButton={handleRedirect}
                                />
                            ) : null;
                        })}
                </div>
            </div>
        </div>
    );
};
