import React, { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deletePage, createOrUpdateElement, setActivePage } from '@redux/website-node/actions';
import { RootState } from '@redux/rootReducer';
import { IPageWebsite, IWebsite } from '@models/WebsiteNode';
import usePopper from '@hooks/usePopper';
import { ONE } from '@constants/Numbers';
import { lengthGreaterThanOne } from '@utils/Length';
import { ElementType, generateId, ModuleApp, ActionElementType } from '@utils/GenerateId';
import { Icon } from '@components/icon';
import { Popper } from '@components/popper';
import { Modal } from '@components/modal';
import { Button as ButtonModal } from '@components/button';
import { IGenericRecord } from '@models/GenericRecord';
import { PageTitlePopper } from './PageTitlePopper';
import { ElementsContext } from '../../context';
import { ZERO } from '../drag-and-drop';
import { IButtonProps, isPageLimitBasicPlan, TWO } from '.';

export const Button: React.FC<IButtonProps> = ({ page, onClick, id }) => {
    const titleRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const { elements, updateElements, saveChanges } = useContext(ElementsContext);
    const { selectedWebsite, activePage } = useSelector((state: RootState) => state.websiteNode);
    const { planWebsiteActive } = useSelector((state: RootState) => state.membership);

    const {
        anchorEl: anchorModifier,
        mouseProps: { onMouseLeave },
        togglePopper,
    } = usePopper();

    const [anchorTitle, setAnchorTitle] = useState<null | HTMLElement>(null);
    const [PageName, setPageName] = useState<string>('');
    const [disablePage, setDisablePage] = useState<boolean>(true);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

    useEffect(() => {
        setPageName(page.tab_name);
    }, [page]);

    const handleClickModifier = (event: React.MouseEvent<HTMLElement>): void => {
        event.stopPropagation();
        togglePopper(event);
    };

    const handleNextPage = (selectedWebsiteNext: IWebsite, page: IPageWebsite): void => {
        const deletePageIndex = selectedWebsiteNext.pages.findIndex(websitePage => websitePage.id === page.id);
        lengthGreaterThanOne(selectedWebsiteNext.pages) &&
            deletePageIndex > ZERO &&
            dispatch(setActivePage(selectedWebsiteNext.pages[deletePageIndex - ONE]));
        lengthGreaterThanOne(selectedWebsiteNext.pages) &&
            deletePageIndex === ZERO &&
            dispatch(setActivePage(selectedWebsiteNext.pages[deletePageIndex + ONE]));
    };

    const handleDeletePage = async (): Promise<void> => {
        setAnchorTitle(null);
        setIsOpenModal(false);
        if (activePage?.id === page.id) {
            updateElements([], true);
            handleNextPage(selectedWebsite, page);
        }
        await dispatch(deletePage(page.id, selectedWebsite.id));
    };

    const handleDuplicatePage = (): void => {
        if (isPageLimitBasicPlan(selectedWebsite?.pages?.length, planWebsiteActive)) return;
        setAnchorTitle(null);

        const baseName = page?.tab_name.replace(/ copia \(\d+\)$/g, '');

        const existingCopies = selectedWebsite?.pages
            ?.map(obj => {
                const match = obj.tab_name.match(new RegExp(`^${baseName} copia \\((\\d+)\\)$`));
                return match ? parseInt(match[1], 10) : null;
            })
            .filter((num): num is number => num !== null);

        const nextCopyNumber = existingCopies.length > 0 ? Math.max(...existingCopies) + 1 : 1;

        const websiteData = {
            id: selectedWebsite.id,
            is_draft: selectedWebsite.is_draft,
            is_template: false,
            pages: [
                {
                    ...page,
                    tab_name: `${baseName} copia (${nextCopyNumber})`,
                    id: null,
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    elements: page?.elements?.map(({ id, ...item }) => item),
                },
            ],
        };

        dispatch(createOrUpdateElement(websiteData));
    };

    const handleChangePageName = (event: IGenericRecord): void => {
        setPageName(event?.target?.value);
    };

    const handleSaveTitle = async (): Promise<void> => {
        if (!selectedWebsite.pages.some(pageWebsite => pageWebsite.tab_name === PageName)) {
            await saveChanges();
            const websiteData = {
                id: selectedWebsite.id,
                is_draft: selectedWebsite.is_draft,
                is_template: false,
                pages: [
                    {
                        ...page,
                        elements: [],
                        tab_name: PageName,
                    },
                ],
            };
            await dispatch(createOrUpdateElement(websiteData));
            setDisablePage(true);
        }
    };

    const handlePageTitle = (): void => {
        onMouseLeave();
        setAnchorTitle(null);
        setDisablePage(false);
        setTimeout(() => {
            titleRef.current?.focus();
        }, 10);
    };

    return (
        <>
            <Modal
                id={generateId({
                    module: ModuleApp.WEBSITE,
                    submodule: `editor-page-carousel-${page.id}-delete`,
                    action: ActionElementType.INFO,
                    elementType: ElementType.MDL,
                })}
                handleClose={(): void => setIsOpenModal(false)}
                open={isOpenModal}
            >
                <div className="page-carousel__delete-modal">
                    <Icon name="recycleBin" className="mb-2" />
                    <p className="mb-2 text-xl font-bold text-blue font-allerbold">Eliminar</p>
                    <p className="text-base text-center text-gray-dark">
                        ¿Está seguro de eliminar la pagina <span className="font-allerbold">{PageName}?</span> Actualmente tiene
                        elementos en el espacio de trabajo?
                    </p>
                    <div className="flex justify-center w-full mt-7">
                        <ButtonModal
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `editor-page-carousel-${page.id}-delete`,
                                action: ActionElementType.OMIT,
                                elementType: ElementType.BTN,
                            })}
                            onClick={(): void => setIsOpenModal(false)}
                            text="Omitir"
                            classes="mr-6"
                        />
                        <ButtonModal
                            id={generateId({
                                module: ModuleApp.WEBSITE,
                                submodule: `editor-page-carousel-${page.id}-delete`,
                                action: ActionElementType.DELETE,
                                elementType: ElementType.BTN,
                            })}
                            text="Eliminar"
                            onClick={handleDeletePage}
                        />
                    </div>
                </div>
            </Modal>
            <div
                id={id}
                onMouseEnter={(event: React.MouseEvent<HTMLElement>): void => {
                    setAnchorTitle(event.currentTarget);
                }}
                onMouseLeave={(): void => {
                    onMouseLeave();
                    setAnchorTitle(null);
                }}
                className={`page-carousel__button ${
                    activePage?.id === page.id
                        ? !disablePage
                            ? 'bg-transparent text-blue'
                            : 'bg-green-ultraLight white-svg'
                        : 'text-blue'
                }`}
            >
                <button className="flex items-center justify-center">
                    <Popper
                        wrapperClassName="z-50 flex items-center justify-center rounded-lg shadow-md bg-gray-light"
                        anchorEl={anchorTitle}
                        placement="bottom-start"
                    >
                        <span className="text-blue h-6 px-3.5 py-1 text-xs font-bold font-allerbold">{PageName}</span>
                    </Popper>

                    {disablePage ? (
                        <p
                            onClick={(): void => onClick(page)}
                            className={`text-xs text-center font-bold font-allerbold overflow-hidden outline-none cursor-pointer w-27 overflow-ellipsis whitespace-nowrap ${
                                activePage?.id === page.id ? '' : 'bg-transparent'
                            }`}
                        >
                            {PageName}
                        </p>
                    ) : (
                        <input
                            ref={titleRef}
                            value={PageName}
                            onBlur={handleSaveTitle}
                            onChange={handleChangePageName}
                            className="overflow-hidden text-xs font-bold text-center bg-transparent outline-none font-allerbold w-29 overflow-ellipsis whitespace-nowrap cursor-text"
                        />
                    )}
                    <span onClick={handleClickModifier} className="w-5.5 h-5.5 flex justify-center items-center">
                        <Icon name="trueArrowDownGreen" className="cursor-pointer icon-arrow--page " />
                    </span>
                </button>
                <PageTitlePopper
                    anchorEl={anchorModifier}
                    handlePageTitle={handlePageTitle}
                    handleDeletePage={async (): Promise<void> => {
                        if (elements.length <= TWO) {
                            if (activePage?.id === page.id) {
                                updateElements([], true);
                                handleNextPage(selectedWebsite, page);
                            }
                            await dispatch(deletePage(page.id, selectedWebsite.id));
                            return;
                        }
                        setAnchorTitle(null);
                        setIsOpenModal(true);
                    }}
                    closePopper={onMouseLeave}
                    handleDuplicatePage={handleDuplicatePage}
                />
            </div>
        </>
    );
};
