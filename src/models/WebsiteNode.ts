import { IDraggableElement } from '@pages/website-editor/editor/components/drag-and-drop';
import { IGenericRecord } from './GenericRecord';

/**
 * Options for every type of element
 */
export enum ElementOption {
    One = 'one',
    Two = 'two',
    Three = 'three',
    Four = 'four',
    Five = 'five',
    Six = 'six',
    Seven = 'seven',
    Eight = 'eight',
    Nine = 'nine',
    Ten = 'ten',
    Eleven = 'eleven',
    Twelve = 'twelve',
    Thirteen = 'thirteen',
    Fourteen = 'fourteen',
    Fifteen = 'fifteen',
}

/**
 * Type of element
 */
export enum ElementType {
    Banner = 'BANNER',
    Blog = 'BLOG',
    Button = 'BUTTON',
    Catalog = 'CATALOG',
    Carousel = 'CAROUSEL',
    Collage = 'COLLAGE',
    Footer = 'FOOTER',
    Form = 'FORM',
    Shape = 'SHAPE',
    Header = 'HEADER',
    Icon = 'ICON',
    Image = 'IMAGE',
    Text = 'TEXT',
    Video = 'VIDEO',
}

/**
 * Tab types
 */
export enum TabType {
    BasicElements = 'BASIC_ELEMENTS',
    CompositeElements = 'COMPOSITE_ELEMENTS',
    PresetTemplates = 'PRESET TEMPLATES',
}

/**
 * Template type
 */
export enum TemplateType {
    Homepage = 'HOMEPAGE',
    CompanyInformation = 'COMPANY_INFORMATION',
    OnlineStore = 'ONLINE_STORE',
}

/**
 * This is used to save the style according to the active screen
 */
export enum StyleKey {
    DesktopStyle = 'desktopStyle',
    MobileStyle = 'mobileStyle',
}

/**
 * Screen name
 */
export enum Screen {
    Desktop = 'DESKTOP',
    Mobile = 'MOBILE',
}

/**
 * This interface describes the contact modal data
 *
 * @typeParam title: string -  Require modal title
 * @typeParam description: string - Require description modal
 * @typeParam fields: IFieldsContactUs[] - Require fields modal
 */
export interface IContactUs {
    title: string;
    description: string;
    fields: IFieldContactUs[];
}

/**
 * This interface describes the data blog website
 *
 * @typeParam editNameArticle: ITitlePage - Require props name article edit
 * @typeParam editSynthesisArticle: ITitlePage - Require props synthesis article edit
 * @typeParam actionButton: IActionButton - Require props action button
 * @typeParam articles: IArticle[] - Require data list article
 */
export interface IBlogArticle {
    editNameArticle: ITitlePage;
    editSynthesisArticle: ITitlePage;
    actionButton: IActionButton;
    articles: IArticle[];
}

/**
 * This interface describes the article
 *
 * @typeParam idArticle: string - Require id article
 * @typeParam nameArticle: string - Require name article
 * @typeParam synthesisArticle: string - Require synthesis article
 * @typeParam imageArticle: string - Require image article
 * @typeParam contentArticle: ITitlePage - Require content article
 * @typeParam bibliographicReference: string - Require bibliographic reference
 */
export interface IArticle {
    idArticle: string;
    nameArticle: string;
    synthesisArticle: string;
    imageArticle: string;
    contentArticle: string;
    bibliographicReference?: string;
}

/**
 * This interface describes the data fields
 *
 * @typeParam label: string - Require value input
 * @typeParam type: string - Require type input
 * @typeParam id: string - Require id input
 * @typeParam name: ContactUsType - Require name input
 * @typeParam is_required: boolean - Require is require value input
 * @typeParam field_type_id: string - Require id field input select
 * @typeParam max_length: number - Require  maximum size of the type of field
 * @typeParam min_length: number - Require minimum size of the type of field
 */
export interface IFieldContactUs {
    label: string;
    type: string;
    id: string;
    name: ContactUsType;
    is_required: boolean;
    field_type_id: string;
    max_length: number;
    min_length: number;
}

/**
 * This interface describes the data list proof of purchase
 *
 * @typeParam number: string - Require proof of purchase number
 * @typeParam date: number - Require transaction date
 * @typeParam client_name: string - Require client name
 * @typeParam client_email: string - Require client email
 * @typeParam invoice_pdf_url: string - Require url pdf
 */
export interface IProofPurchase {
    number: string;
    date: number;
    client_name: string;
    client_email: string;
    invoice_pdf_url: string;
}

/**
 * This interface describes the data iption website
 *
 * @typeParam type: string - Require type option website
 * @typeParam value: string - Require value option image
 */
export interface IOptionWebsite {
    type: string;
    value: string;
}

/**
 * This interface describes the social network properties
 *
 * @typeParam id: string - Optional id social network
 * @typeParam network_type: string - Type of social network
 * @typeParam network_account: string - Social network account
 * @typeParam is_button: string - Optional Social check button
 * @typeParam company_id: string - Optional company id
 * @typeParam errorMessage: string - Optional Error message
 * @typeParam created_at: string - Optional created social network
 */
export interface ISocialNetwork {
    id?: string;
    network_type: string;
    network_account: string;
    is_button?: boolean;
    company_id?: string;
    errorMessage?: string;
    created_at?: string;
}

/**
 * This interface describes the edited data
 *
 * @typeParam component: string - Require component name
 * @typeParam titlePages: ITitlePage - Require data title pages
 * @typeParam backgroundColor: string - Require backgroundColor component
 * @typeParam description: string - Optional description component
 * @typeParam formContactUs: IContactUsForm - Optional form contact us
 * @typeParam isButtonForm: boolean - Optional if the button form option is active
 * @typeParam socialNetwork: ISocialNetworkEdit[] - Optional if add social network
 * @typeParam buttonForm: IFieldsButtonForm - Optional if the button form
 * @typeParam logoComponent: string - Optional if the logo component
 * @typeParam blogArticle: IBlogArticle - Optional data for blog article
 */
export interface IEditedData {
    component: string;
    titlePages: ITitlePage;
    backgroundColor: string;
    description?: string;
    formContactUs?: IContactUsForm;
    isButtonForm?: boolean;
    socialNetwork?: ISocialNetworkEdit[];
    buttonForm?: IFieldsButtonForm;
    logoComponent?: string;
    blogArticle?: IBlogArticle;
}

/**
 * This interface describes the data title pages
 *
 * @typeParam typography: string - Require typography title pages
 * @typeParam weight: string - Require weight title pages
 * @typeParam size: string - Require size title pages
 * @typeParam color: string - Require color title pages
 */
export interface ITitlePage {
    typography: string;
    weight: string;
    size: string;
    color: string;
}

/**
 * This interface describes the data contact us form
 *
 * @typeParam fields: IFieldsForm[] - Require contact us form fields
 * @typeParam buttonColor: string - Require button color contact us form
 * @typeParam buttonText: string - Require button text contact us form
 */
export interface IContactUsForm {
    fields: IFieldsForm[];
    buttonColor: string;
    buttonText: string;
}

/**
 * This interface describes the data fields form contact us
 *
 * @typeParam idField: string - Require field id form
 * @typeParam titleField: string - Require field title form
 * @typeParam typeField: string - Require type field form
 * @typeParam titleFieldEdited: ITitlePage - Require data title pages
 * @typeParam valueField: string - Require value field form
 */
export interface IFieldsForm {
    idField: string;
    titleField: string;
    typeField: string;
    titleFieldEdited?: ITitlePage;
    valueField?: string;
}

/**
 * This interface describes the data to new website request
 *
 * @typeParam id: string - Require id website
 * @typeParam is_draft: boolean - Require if the website is draft
 * @typeParam is_template: boolean - Require if if it is a template
 * @typeParam pages: IPageWebsite[] - Require elements pages website
 * @typeParam common_elements: IElementPagesWebsite - Require common elements website
 * @typeParam url_log: string - Require url logo website
 * @typeParam domain: string - Require domain website
 * @typeParam title: string - Require title website
 * @typeParam description: string - Require description website
 * @typeParam keywords: string - Require keywords website
 * @typeParam published_at: string - Require website publication date
 */
export interface INewWebsite {
    id: string;
    is_draft: boolean;
    is_template: boolean;
    pages: IPageWebsite[];
    common_elements: IElementPagesWebsite[];
    url_logo: string;
    domain: string;
    title: string;
    description: string;
    keywords: string;
    published_at: Date;
}

/**
 * This interface describes the data to new website request
 *
 * @typeParam id: string - Require id website
 * @typeParam is_draft: boolean - Require if the website is draft
 * @typeParam is_template: boolean - Require if if it is a template
 * @typeParam pages: IPageWebsite[] - Require elements pages website
 * @typeParam created_at: string - Require date of creation
 * @typeParam common_elements: IElementPagesWebsite - Require common elements website
 * @typeParam url_log: string - Require url logo website
 * @typeParam domain: string - Require domain website
 * @typeParam title: string - Require title website
 * @typeParam description: string - Require description website
 * @typeParam keywords: string - Require keywords website
 * @typeParam published_at: string - Require website publication date
 * @typeParam preview_website_url: string - Optional previous website url
 */
export interface IWebsite {
    id: string;
    is_draft: boolean;
    is_template: boolean;
    pages: IPageWebsite[];
    created_at: string;
    common_elements: IElementPagesWebsite[];
    url_logo: string;
    domain: string;
    title: string;
    description: string;
    keywords: string;
    published_at: Date;
    preview_website_url?: string;
}

/**
 * This interface describes the data to make request
 *
 * @typeParam id: string - Require id page
 * @typeParam tab_name: string - Require name page
 * @typeParam order: number - Require page order
 * @typeParam is_enable: boolean - Require if the page is enabled
 * @typeParam website_id: string - Require website id
 * @typeParam elements: IElementPagesWebsite[] - Require elements pages website
 * @typeParam style: IGenericRecord - Require general element styles
 * @typeParam allElements: IDraggableElement[] - Are all elements including simple and common
 */
export interface IPageWebsite {
    id: string;
    tab_name: string;
    order: number;
    is_enable: boolean;
    website_id: string;
    elements?: IElementPagesWebsite[];
    style: IGenericRecord;
    allElements: IDraggableElement[];
}

/**
 * This interface describes the data element page
 *
 * @typeParam id: string - Require id element
 * @typeParam name: string - Require the name element
 * @typeParam type: string - Require the type of the element
 * @typeParam class_name: boolean - Require element classes
 * @typeParam value: IGenericRecord[] - Require value element
 * @typeParam style_desktop: IGenericRecord - Require general element styles desktop
 * @typeParam style_mobile: IGenericRecord - Require general element styles mobile
 * @typeParam website_id: string - Require website id
 * @typeParam page_id: string - Require page id
 */
export interface IElementPagesWebsite {
    id: string;
    name: string;
    type: string;
    class_name: boolean;
    value: IGenericRecord[];
    style_desktop: IGenericRecord;
    style_mobile: IGenericRecord;
    website_id: string;
    page_id: string;
}

/**
 * This interface describes the element styles
 *
 * @typeParam background_color: string - Require the background color of the element
 * @typeParam typography_color: string - Require the typography color of the element
 * @typeParam typography: string - Require typography of the element
 * @typeParam typography_size: string - Require the size of the font
 * @typeParam typography_weight: string - Require the weight of the font
 * @typeParam top: string - Require top position of the element
 * @typeParam left: string - Require left position of the element
 * @typeParam bottom: string - Require bottom position of the element
 * @typeParam right: string - Require right position of the element
 */
export interface IElementStyles {
    background_color: string;
    typography_color: string;
    typography: string;
    typography_size: string;
    typography_weight: string;
    top: string;
    left: string;
    bottom: string;
    right: string;
}

/**
 * This interface describes the props social network
 *
 * @typeParam id: string - Require id social network
 * @typeParam name: string - Require name social network
 * @typeParam link: string - Require link social network
 * @typeParam first: boolean - Require indicates if it is the first item
 */
export interface ISocialNetworkEdit {
    id: string;
    name: string;
    link: string;
    first: boolean;
}

/**
 * This interface describes the props field button form
 *
 * @typeParam titleField: ITitlePage - Require props title field
 * @typeParam actionButton: IActionButton - Require props action button
 * @typeParam fields: IFieldsForm - Require form fields
 */
export interface IFieldsButtonForm {
    titleField: ITitlePage;
    actionButton: IActionButton;
    fields: IFieldsForm[];
}

/**
 * This interface describes the props action button
 *
 * @typeParam colorButton: string - Require color action button
 * @typeParam textButton: string - Require text action button
 */
export interface IActionButton {
    colorButton: string;
    textButton: string;
}

/**
 * Contact type
 */
export enum ContactUsType {
    text = 'Texto corto',
    paragraph = 'Párrafo',
    number = 'Número',
    email = 'Correo electrónico',
    select = 'Seleccionar',
}

/**
 * This interface describes the properties of video tutorial
 *
 * @typeParam id: string - Video tutorial id
 * @typeParam title: string - Title video tutorial
 * @typeParam url: string - Url video tutorial
 */
export interface IVideoTutorial {
    id: string;
    name: string;
    url: string;
}

/**
 * This enum contains the common properties
 */
export enum CommonProperty {
    Title = 'title',
    Description = 'description',
    KeyWords = 'keywords',
    HostedZone = 'hosted_zone',
    Domain = 'domain',
}

/**
 * This interface describes the properties of video tutorial
 *
 * @typeParam id: string - Video tutorial id
 * @typeParam title: string - Title video tutorial
 * @typeParam url: string - Url video tutorial
 */
export interface IVideoTutorial {
    id: string;
    name: string;
    url: string;
}

/**
 * This interface describes the properties of hosted zone
 *
 * @typeParam dns: string[] - Dns array
 * @typeParam domain: string - Domain user
 * @typeParam id: string - Id register
 */
export interface IHostedZone {
    dns: string[];
    domain: string;
    id: string;
}

/**
 * This interface describes the properties of video tutorial
 *
 * @typeParam domain: string - Domain user
 * @typeParam hostedZone: IHostedZone - data hosted zone
 * @typeParam isDomain: boolean - State to know if it's domain or subdomain
 */
export interface IDomainProps {
    domain: string;
    hostedZone: IHostedZone;
    isDomain: boolean;
}
