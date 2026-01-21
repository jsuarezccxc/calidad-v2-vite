import React from 'react';
import { IGenericRecord } from '@models/GenericRecord';
export * from './Icon';

/**
 * @typeParam is using for icons name
 */
export type IconsNames =
    | 'addWarehouses'
    | 'addGreen'
    | 'addPage'
    | 'arrowInstructions'
    | 'arrowDownBlue'
    | 'arrowDecreases'
    | 'arrowIncreases'
    | 'arrowDownGray'
    | 'arrowDownBlack'
    | 'arrowDownGreen'
    | 'arrowDownWhite'
    | 'arrowLeftGreen'
    | 'arrowRightGreen'
    | 'arrowUpPurple'
    | 'arrowUpCircleWhite'
    | 'advertisementMulticolor'
    | 'checkBlue'
    | 'cancelMulticolor'
    | 'checkGreen'
    | 'checkWhite'
    | 'clickDocumentMulticolor'
    | 'copyBorderBlue'
    | 'documentMulticolor'
    | 'checkSocial'
    | 'searchBlue'
    | 'searchGreen'
    | 'searchGray'
    | 'searchWhite'
    | 'trashBlue'
    | 'trashGreen'
    | 'trashWhite'
    | 'trashMulticolor'
    | 'arrowLeftCatalog'
    | 'arrowLeftCurvedBlue'
    | 'arrowLeftDGray'
    | 'arrowLeftGray'
    | 'arrowRightCurvedBlue'
    | 'arrowRightDGray'
    | 'arrowRightGray'
    | 'arrowRightWhite'
    | 'arrowUpDGray'
    | 'arrowUpGreen'
    | 'arrowUpWhite'
    | 'arrowStepLeft'
    | 'bannerEditor'
    | 'blogBlue'
    | 'calendarDGray'
    | 'calendarGray'
    | 'calendarGreen'
    | 'cancelBlue'
    | 'cancelGray'
    | 'cancelGreen'
    | 'carouselBlue'
    | 'catalogBlue'
    | 'check'
    | 'circleButton'
    | 'closeSlimBlue'
    | 'closeBlue'
    | 'closeGray'
    | 'closeGreen'
    | 'closeHeader'
    | 'collageBlue'
    | 'checkGradient'
    | 'desktopBlue'
    | 'desktopPreview'
    | 'desktopWhite'
    | 'editBlue'
    | 'editGreen'
    | 'editWhite'
    | 'eyeBlue'
    | 'eyeFullBlue'
    | 'eyeDisabledGray'
    | 'eyeDisabledGreen'
    | 'eyeGreen'
    | 'email'
    | 'facebookBlue'
    | 'facebookGreen'
    | 'facebookWhite'
    | 'faviconWhite'
    | 'finalStepVectorThreeOther'
    | 'footerEditor'
    | 'formEditor'
    | 'hamburger'
    | 'headerEditor'
    | 'home'
    | 'homeBlue'
    | 'iconOrganizationPlanning'
    | 'imageBlue'
    | 'imageModalLanding'
    | 'infoBlue'
    | 'infoEditWhite'
    | 'infoGreen'
    | 'infoWhite'
    | 'infoPurple'
    | 'instagramBlue'
    | 'instagramGreen'
    | 'instagramWhite'
    | 'instructionStepOne'
    | 'instructionStepThree'
    | 'instructionStepTwo'
    | 'lightBlue'
    | 'lightPurple'
    | 'linkedinBlue'
    | 'linkedinGreen'
    | 'linkedinWhite'
    | 'loader'
    | 'logoCcxc'
    | 'management'
    | 'messengerBlue'
    | 'messengerGreen'
    | 'messengerWhite'
    | 'mobileBlue'
    | 'mobilePreview'
    | 'mobileWhite'
    | 'moneyDGray'
    | 'moneyGray'
    | 'newPdf'
    | 'newXls'
    | 'notifications'
    | 'notificationsBlue'
    | 'pdf'
    | 'pencilMulticolor'
    | 'phoneBlue'
    | 'pinterestBlue'
    | 'pinterestWhite'
    | 'print'
    | 'purpleLight'
    | 'plusMulticolor'
    | 'question'
    | 'questionGreen'
    | 'questionRoundedGreen'
    | 'reloadPurple'
    | 'recycleBin'
    | 'salesBox'
    | 'shapeBlue'
    | 'shareBlue'
    | 'shareWhite'
    | 'signUpBlue'
    | 'signUpWhite'
    | 'snapchatBlue'
    | 'snapchatWhite'
    | 'starBlue'
    | 'starGray'
    | 'starYellow'
    | 'textBlue'
    | 'trash'
    | 'trueArrowDownGreen'
    | 'twitterWhite'
    | 'uploadBlue'
    | 'user'
    | 'videoBlue'
    | 'viewsBlue'
    | 'warning'
    | 'warningBlue'
    | 'www'
    | 'xls'
    | 'xml'
    | 'xmlShadow'
    | 'xTwitterBlue'
    | 'xTwitterWhite'
    | 'graphic'
    | 'separatorPurple'
    | 'womanBlue'
    | 'menBlue'
    | 'screenBlue'
    | 'cellphoneBlue'
    | 'people'
    | 'checkOnBox'
    | 'abandonedCart'
    | 'medal'
    | 'upArrowPurple'
    | 'colombiaPurple'
    | 'purpleLinePoints'
    | 'youtubeBlue'
    | 'successRoundedMulticolor'
    | 'newPrint'
    | 'newMail'
    | 'menu'
    | 'rejectedBlue'
    | 'reuseDocumentMulticolor'
    | 'websiteWhite'
    | 'alertMulticolor'
    | 'successMulticolor'
    | 'youtubeWhite'
    | 'closeKeyword'
    | 'visibilityStepOne'
    | 'visibilityStepTwo'
    | 'visibilityStepThree'
    | 'visibilityStepFour'
    | 'arrowRightKeyword'
    | 'deleteModal'
    | 'dnsMulticolor'
    | 'navigationMulticolor'
    | 'urlMulticolor'
    | 'websiteMulticolor'
    | 'tikTokBlue'
    | 'tikTokWhite'
    | 'telegramBlue'
    | 'telegramWhite'
    | 'linkedInWhite'
    | 'linkedInBlue'
    | 'salesReport'
    | 'shoppingReport'
    | 'dailyEndingInventory'
    | 'endingInventoryMonth'
    | 'totalInventoryCalculation'
    | 'newWrong'
    | 'searchPlusBlue'
    | 'revision'
    | 'fileCheckGreen'
    | 'blueLightBulb'
    | 'helpCenter'
    | 'modificationHistory'
    | 'userMenu'
    | 'databaseClientsEmployees'
    | 'databaseProductsServices'
    | 'databaseSuppliers'
    | 'databaseWarehouse'
    | 'modificationHistoryWhite'
    | 'mailInstruction'
    | 'userMenuWhite'
    | 'finalStepVector'
    | 'finalStepVectorTwo'
    | 'finalStepVectorThree'
    | 'plusWhite'
    | 'sheetMulticolor'
    | 'editMulticolor'
    | 'organizationChart'
    | 'addMoneyInvoice'
    | 'moneyInvoice'
    | 'addUser'
    | 'userBox'
    | 'addBox'
    | 'userBurgerPurple'
    | 'userBurgerGreen'
    | 'userBurgerBlue'
    | 'addWhite'
    | 'documentAddMulticolor'
    | 'checkMulticolor'
    | 'cancel'
    | 'sumIcon'
    | 'shoppingPaper'
    | 'pencilColor'
    | 'triangleInfoMulticolor'
    | 'clockMulticolor'
    | 'closeMulticolor'
    | 'purchasingProcess'
    | 'purchaseResume'
    | 'radiobutton'
    | 'purchasePlans'
    | 'iconWebsiteMulticolor'
    | 'iconElectronicDocumentsMulticolor'
    | 'iconOrganizationPlanningMulticolor'
    | 'iconDiggitalSeller'
    | 'iconCrm'
    | 'iconFilter'
    | 'starBlueBg'
    | 'starGreenBg'
    | 'shoppingBagGreen'
    | 'debitNote'
    | 'creditNote';

/**
 * These interfaces are used to icon component
 *
 * @typeParam onClick: ({ ...arg }?: React.MouseEvent<HTMLImageElement> | IGenericRecord, ...args: IGenericRecord[]) => void - Optional prop with a function executed when icon is clicked
 * @typeParam id: string - prop for defining element's id
 * @typeParam className: string - Optional prop with a className for customize the icon
 * @typeParam classIcon: string - Optional prop for styles in tag img in icon
 * @typeParam name: IconsName => - Name of each icon
 * @typeParam alt: string - Optional prop with a name of each icon when not found them.
 * @typeParam hoverIcon: IconsNames - Optional prop with a name of the hover icon
 */
export interface IIconProps {
    onClick?: ({ ...arg }?: React.MouseEvent<HTMLImageElement> | IGenericRecord, ...args: IGenericRecord[]) => void;
    id?: string;
    className?: string;
    classIcon?: string;
    name: IconsNames;
    alt?: string;
    hoverIcon?: IconsNames;
}

/**
 * This type describe the types icon download
 */
export type TypeIconDownload = 'PDF' | 'XLS';

/**
 * This describe the type icon variables
 */
export enum TypeIconDownloadEnum {
    PDF = 'PDF',
    XLS = 'XLS',
    XML = 'XML',
}

/**
 * These interfaces are used to icon component
 *
 * @typeParam moduleId: string - module name in kebab-case (e.g., "electronic-document").
 * @typeParam className: string - Optional prop for customize the component
 * @typeParam download: IDownloadFile - Optional prop with a events for download files
 * @typeParam pdfUrl: string - Optional prop with a pdf url
 * @typeParam xlsUrl: string - Optional prop with an excel url
 * @typeParam typeIconDownload: TypeIconDownload - Optional type icon download;
 * @typeParam getExcel: () => Promise<void> - Optional prop with a function for download the excel
 * @typeParam downloadXml: () => void - Optional prop with a function to download the xml
 * @typeParam withoutText?: boolean - Optional prop to show a descargar text
 * @typeParam notFirstXls?: boolean - Optional prop to show first xls icon
 * @typeParam fileName?: string - Optional prop for pdf name
 */
export interface IDownloadIconsProps {
    moduleId: string;
    className?: string;
    download?: IDownloadFile;
    pdfUrl?: string;
    xlsUrl?: string;
    typeIconDownload?: TypeIconDownload;
    getExcel?: () => Promise<void>;
    downloadXml?: () => void;
    withoutText?: boolean;
    notFirstXls?: boolean;
    fileName?: string;
}

/**
 * These interfaces are used to icon component
 *
 * @typeParam excel: () => void - Event for download a excel file
 * @typeParam pdf: () => void - Event for download a pdf file
 */
export interface IDownloadFile {
    excel: () => void;
    pdf: () => void;
}
