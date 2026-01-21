import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import {
    DOCUMENT_TYPES,
    FOREIGN_EXCHANGE,
    LANGUAGES,
    OPERATION_TYPES,
    PAYMENT_METHODS,
    PAYMENT_TYPES,
    PERSON_UTILS,
} from '@constants/UtilsConstants';
import { TypeFile } from '@constants/ElectronicInvoice';
import { ZERO } from '@constants/Numbers';

import { Form } from '@models/ElectronicDocuments';
import { IFiscalResponsibility } from '@models/ElectronicNote';
import { IInvoiceCalculates, ITaxes as ITax } from '@models/ElectronicInvoice';
import { IInvoiceDetails } from '@models/ElectronicInvoice';
import { ICompany } from '@models/Company';
import { IGenericRecord } from '@models/GenericRecord';

import { setClientSelected } from '@redux/client-portal/actions';
import { getClientsThin } from '@redux/clients/actions';
import { getInformationCompany } from '@redux/company/actions';
import { getUniqueProductStock, getInvoiceCalculations as getTotals } from '@redux/electronic-invoice/actions';
import { getFilesCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import { createQuoteAction, getQuoteConsecutive } from '@redux/quotes/actions';
import { IQuoteCreateResponse } from '@redux/quotes/types';
import { RootState } from '@redux/rootReducer';
import { getSuppliers } from '@redux/suppliers/actions';
import { getUtils } from '@redux/utils/actions';

import { calculateQuoteProductTaxes } from '@utils/quoteCalculations';
import { validateEmptyFields } from '@utils/Fields';

import { INITIAL_FORM_DATA, IFormData, formatTaxes, QUOTE_REQUIRED_FORM_FIELDS } from '../components/quote-generate';
import { IQuoteFormData } from '@models/QuoteGeneration';
import { ITableTaxesAndRetention } from '@models/ElectronicInvoice';
import { IQuoteTotals } from '@models/QuoteGeneration';

import { IQuoteFormDataWithProducts } from './IQuoteFormDataWithProducts';

import { safeValue, getClientField, normalizeToNull, getPaymentField, resolvePaymentTypeName } from '../utils/QuoteFormUtils';

export const useQuoteForm = (): {
  formData: IQuoteFormData;
  openModal: boolean;
  addClient: boolean;
  isLoading: boolean;
  validate: boolean;
  validationErrors: string[];
  validationWarnings: string[];
  products: IInvoiceDetails[];
  withholdings: ITableTaxesAndRetention[];
  isSubmitting: boolean;
  submitError: string | null;
  showNegativeValueModal: boolean;
  createdQuoteNumber: string | null;
  updateFormData: (data: Partial<IQuoteFormData> | ((prev: IQuoteFormData) => IQuoteFormData)) => void;
  handleSubmit: (type?: Form) => Promise<void>;
  resetForm: () => void;
  setProducts: (products: IInvoiceDetails[]) => void;
  setWithholdings: (withholdings: ITableTaxesAndRetention[]) => void;
  toggleModal: () => void;
  toggleNegativeValueModal: () => void;
  handleClientCreated: () => void;
  setAddClient: (value: boolean) => void;
} => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { information: companyInformation, utils, consecutive } = useSelector(
    ({ company, utils, quotes }: RootState): { information: ICompany | null; utils: { utils: IGenericRecord }; consecutive: IGenericRecord } => ({
      information: company.information,
      utils,
      consecutive: quotes.consecutive,
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [internalFormData, setInternalFormData] = useState<IFormData>(INITIAL_FORM_DATA);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [addClient, setAddClient] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validate, setValidate] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [products, setProducts] = useState<IInvoiceDetails[]>([]);
  const [withholdings, setWithholdings] = useState<ITableTaxesAndRetention[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showNegativeValueModal, setShowNegativeValueModal] = useState<boolean>(false);
  const [createdQuoteNumber, setCreatedQuoteNumber] = useState<string | null>(null);

  const convertToQuoteFormData = useCallback((data: IFormData): IQuoteFormData => {
    return {
      ...data,
      client_id: data.clientInfo?.id || '',
      authorize_personal_data: data.documentConfig?.authorizePersonalData ? 'true' : 'false',
      selected_option_id: '',
      not_information_customer: data.not_information_customer || false,
    } as IQuoteFormData;
  }, []);

  const formData = useMemo(() => convertToQuoteFormData(internalFormData), [internalFormData, convertToQuoteFormData]);

  useEffect((): void => {
    getData();
  }, [dispatch]);

  const getData = async (): Promise<void> => {
    await Promise.all([
      dispatch(getClientsThin()),
      dispatch(getInformationCompany()),
      dispatch(getUtils([PAYMENT_TYPES, PAYMENT_METHODS, FOREIGN_EXCHANGE, OPERATION_TYPES, LANGUAGES, DOCUMENT_TYPES, ...PERSON_UTILS])),
      dispatch(getFilesCompanyAction(TypeFile.LOGO_INVOICE)),
      dispatch(getUniqueProductStock()),
      dispatch(getSuppliers(true)),
      dispatch(getQuoteConsecutive()),
    ]);
  };

  useEffect(() => {
    if (consecutive) {
      const consecutiveValue = typeof consecutive === 'number'
        ? consecutive
        : (consecutive.data || consecutive.consecutive || consecutive);

      if (consecutiveValue) {
        setInternalFormData(prev => ({
          ...prev,
          number: String(consecutiveValue),
        }));
      }
    }
  }, [consecutive]);

  const updateFormData = useCallback((data: Partial<IQuoteFormData> | ((prev: IQuoteFormData) => IQuoteFormData)): void => {
    if (typeof data === 'function') {
      setInternalFormData(prevInternalData => {
        const prevQuoteData = convertToQuoteFormData(prevInternalData);
        const newQuoteData = data(prevQuoteData);

        const authorizeValue = newQuoteData.not_information_customer !== undefined
          ? newQuoteData.not_information_customer
          : newQuoteData.authorize_personal_data === 'true';

        const newInternalData: IFormData = {
          ...prevInternalData,
          ...newQuoteData,
          clientInfo: {
            ...prevInternalData.clientInfo,
            ...(newQuoteData.clientInfo || {}),
            id: newQuoteData.client_id || prevInternalData.clientInfo?.id,
          },
          documentConfig: {
            ...prevInternalData.documentConfig,
            authorizePersonalData: authorizeValue,
          },
          not_information_customer: authorizeValue,
        };

        return newInternalData;
      });
    } else {
      setInternalFormData(prevInternalData => {
        const authorizeValue = data.not_information_customer !== undefined
          ? data.not_information_customer
          : data.authorize_personal_data !== undefined
            ? data.authorize_personal_data === 'true'
            : prevInternalData.not_information_customer;

        const newInternalData: IFormData = {
          ...prevInternalData,
          ...data,
          clientInfo: {
            ...prevInternalData.clientInfo,
            ...(data.clientInfo || {}),
            id: data.client_id !== undefined ? data.client_id : prevInternalData.clientInfo?.id,
          },
          documentConfig: {
            ...prevInternalData.documentConfig,
            authorizePersonalData: authorizeValue,
          },
          not_information_customer: authorizeValue,
        };

        return newInternalData;
      });
    }
  }, [convertToQuoteFormData]);

  const toggleModal = useCallback((): void => {
    setOpenModal(prev => !prev);
  }, []);

  const toggleNegativeValueModal = useCallback((): void => {
    setShowNegativeValueModal(prev => !prev);
  }, []);

  const validateClientLocation = useCallback((formDataWithProducts: IQuoteFormDataWithProducts): string | null => {
    if (formDataWithProducts.client_id && formDataWithProducts.not_information_customer) {
      if (!formDataWithProducts.clientInfo?.country_id || !formDataWithProducts.clientInfo?.city_id || !formDataWithProducts.clientInfo?.department_id) {
        return 'El cliente seleccionado no tiene información de ubicación completa (país, departamento, ciudad). Por favor, actualice la información del cliente antes de continuar.';
      }
    }
    return null;
  }, []);

  const validateCompanyInformation = useCallback((): string | null => {
    if (!companyInformation?.postal_code || !companyInformation?.address) {
      return 'La información de la empresa no está completa (código postal, dirección). Por favor, configure la información de la empresa en el sistema.';
    }
    return null;
  }, [companyInformation]);

  const validateProducts = useCallback((): string | null => {
    if (!products.length) {
      return 'Debe agregar al menos un producto o servicio a la cotización.';
    }

    const invalidProducts = products.filter(p => !p.sku_internal || !p.reference || !p.unique_products_id);
    if (invalidProducts.length > ZERO) {
      return 'Algunos productos no tienen información completa (SKU, referencia). Por favor, seleccione productos válidos del catálogo.';
    }

    return null;
  }, [products]);

  const validateNegativeValues = useCallback((totals: { totalBase: number; totalIva: number; totalDiscount: number }, sendingCharge: number): boolean => {
    const totalWithShipping = totals.totalBase + totals.totalIva - totals.totalDiscount + sendingCharge;

    if (sendingCharge < ZERO || totals.totalBase < ZERO || totalWithShipping < ZERO) {
      return true;
    }
    return false;
  }, []);

  const calculateTotals = useCallback(() => {
    const totalBase = products.reduce((acc, p) => acc + ((p.quantity || ZERO) * (p.unit_cost || ZERO)), ZERO);
    const totalIva = products.reduce((acc, p) => {
      const baseValue = (p.quantity || ZERO) * (p.unit_cost || ZERO);
      return acc + (baseValue * 0.19);
    }, ZERO);
    const totalDiscount = products.reduce((acc, p) => acc + (p.discount || ZERO), ZERO);

    return { totalBase, totalIva, totalDiscount };
  }, [products]);

  const buildQuotePayload = useCallback((
    formDataWithProducts: IQuoteFormDataWithProducts,
    totals: IQuoteTotals,
    currentWithholdings: ITableTaxesAndRetention[],
    calculatedValues?: IInvoiceCalculates
  ): IGenericRecord => {
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    const payload = {
      address: getClientField(formDataWithProducts.clientInfo, formDataWithProducts.address, 'address'),
      aggregation_method: 'NO_ELECTRONICS',
      apply_deductible: false,
      base_retefuente: ZERO,
      base_reteica: ZERO,
      base_reteiva: ZERO,
      city_id: getClientField(formDataWithProducts.clientInfo, formDataWithProducts.city_id, 'city_id'),
      city_name: getClientField(formDataWithProducts.clientInfo, formDataWithProducts.city_name, 'city_name'),
      company_address: safeValue(companyInformation?.address),
      company_postal_code: safeValue(companyInformation?.postal_code),
      country_id: getClientField(formDataWithProducts.clientInfo, formDataWithProducts.country_id, 'country_id'),
      country_name: getClientField(formDataWithProducts.clientInfo, formDataWithProducts.country_name, 'country_name'),
      date: formDataWithProducts.date || currentDate.toISOString().split('T')[0],
      date_limit: formDataWithProducts.date_limit || futureDate.toISOString().split('T')[0],
      days_collection: formDataWithProducts.collection_days,
      days_collection_type: formDataWithProducts.days_collection_type || 'Días calendario',
      department_id: getClientField(formDataWithProducts.clientInfo, formDataWithProducts.department_id, 'department_id'),
      department_name: getClientField(formDataWithProducts.clientInfo, formDataWithProducts.department_name, 'department_name'),
      document_number: getClientField(formDataWithProducts.clientInfo, formDataWithProducts.document_number, 'documentNumber'),
      document_number_purchasing_manager: formDataWithProducts.document_number_purchasing_manager,
      document_number_sales_manager: formDataWithProducts.document_number_sales_manager,
      document_type: formDataWithProducts.clientInfo?.documentType || formDataWithProducts.document_type_id,
      document_type_purchasing_manager: formDataWithProducts.document_type_purchasing_manager,
      document_type_sales_manager: formDataWithProducts.document_type_sales_manager,
      electronic_billing: null,
      email: getClientField(formDataWithProducts.clientInfo, formDataWithProducts.email, 'email'),
      employee_id: formDataWithProducts.employee_id,
      fiscal_responsibilities: (formDataWithProducts.clientInfo?.fiscal_responsibilities || formDataWithProducts.fiscal_responsibilities || [])
        .filter((fr: IFiscalResponsibility | string) => fr && (typeof fr === 'string' || fr.id))
        .map((fr: IFiscalResponsibility | string) => ({
          id: typeof fr === 'string' ? fr : fr.id
        })),
      foreign_exchange_id: formDataWithProducts.paymentConfig?.foreignExchangeId || formDataWithProducts.foreign_exchange_id,
      foreign_exchange_name: formDataWithProducts.paymentConfig?.foreignExchangeName || formDataWithProducts.foreign_exchange_name,
      foreign_exchange_rate: formDataWithProducts.foreign_exchange_rate || 1,
      internal_notes: formDataWithProducts.internal_notes,
      invoice_state: 'ACCEPTED',
      invoice_type: 'QUOTE',
      is_electronic_invoice: false,
      is_paid: false,
      lang: formDataWithProducts.lang || 'es',
      loaded_inventory: false,
      name: formDataWithProducts.name || null,
      note: formDataWithProducts.note || formDataWithProducts.observations,
      number: formDataWithProducts.number,
      number_purchase_order: formDataWithProducts.purchase_order_number,
      operation_type_id: formDataWithProducts.operation_type_id,
      payment_method_id: getPaymentField(formDataWithProducts.payment_method_id || undefined, formDataWithProducts.paymentConfig?.method),
      payment_type_id: getPaymentField(formDataWithProducts.payment_type_id || undefined, formDataWithProducts.paymentConfig?.means),
      payment_type_name: resolvePaymentTypeName(
        (formDataWithProducts.payment_type_id ?? formDataWithProducts.paymentConfig?.means) || undefined,
        utils?.utils?.payment_types,
        formDataWithProducts.payment_type_name || undefined,
        formDataWithProducts.paymentConfig?.meansName
      ),
      person_id: formDataWithProducts.client_id,
      phone: getClientField(formDataWithProducts.clientInfo, formDataWithProducts.phone, 'phone'),
      postal_code: getClientField(formDataWithProducts.clientInfo, formDataWithProducts.postal_code, 'postal_code'),
      products: products.map(p => ({
        batch_id: p.batch_id,
        ciiu_id: p.ciiu_id,
        date_expiration: (p.date_expiration && p.date_expiration !== 'N/A') ? p.date_expiration : undefined,
        delivery_cost: p.delivery_cost || ZERO,
        description: p.description || p.unique_product_name || '',
        discount: p.discount || ZERO,
        is_inventoriable: p.is_inventoriable !== undefined ? p.is_inventoriable : true,
        is_product: p.is_product !== undefined ? p.is_product : true,
        iva: ((p.quantity || ZERO) * (p.unit_cost || ZERO)) * 0.19,
        mandate_id: p.mandate_id,
        quantity: Number(p.quantity) || 1,
        reference: p.reference || p.sku_internal || '',
        sku_internal: p.sku_internal || p.reference || '',
        taxes: p.taxes?.map((t: ITax) => ({
          company_tax_id: t.company_tax_id
        })) || [],
        total_buy: (p.quantity || ZERO) * (p.unit_cost || ZERO),
        unique_product_name: p.unique_product_name || p.description || '',
        unique_products_id: p.unique_products_id || '',
        unit_cost: p.unit_cost || ZERO,
        unit_measurements_id: p.unit_measurements_id || '',
        unit_value: p.unit_cost || ZERO,
        warehouse_id: p.warehouse_id,
        warehouse_name: p.warehouse_name
      })),
      purchasing_manager: formDataWithProducts.purchasing_manager,
      qualification_id: formDataWithProducts.qualification_id,
      retefuente: ZERO,
      reteica: ZERO,
      reteiva: ZERO,
      sale_channel: 'PHYSICAL_STORE',
      sales_manager: formDataWithProducts.sales_manager,
      send_address: formDataWithProducts.send_address,
      sending_charge: formDataWithProducts.sending_charge || ZERO,
      source_type: 'VENDORS',
      state_purchase_order: formDataWithProducts.state_purchase_order,
      taxes: calculatedValues ? formatTaxes(calculatedValues) : [],
      time_issue: formDataWithProducts.time_issue || new Date().toTimeString().split(' ')[0],
      total: totals.totalBase,
      total_discount: totals.totalDiscount,
      total_ibua: ZERO,
      total_icui: ZERO,
      total_impoconsumption: ZERO,
      total_invoice: totals.totalBase,
      total_iva: totals.totalIva,
      total_sale: totals.totalBase,
      total_sale_value: totals.totalBase,
      type_taxpayer_id: formDataWithProducts.clientInfo?.taxpayerType || formDataWithProducts.type_taxpayer_id,
      type_taxpayer_name: formDataWithProducts.clientInfo?.taxpayerTypeName || formDataWithProducts.type_taxpayer_name,
      withholdings: currentWithholdings.length > 0 && currentWithholdings.some(w => w.value && w.value > 0)
        ? currentWithholdings.map(w => ({
            base: w.base || totals.totalBase,
            name: w.name || '',
            percentage: String(w.percentage || 0),
            value: w.value || ZERO
          }))
        : [
            {
              base: totals.totalBase,
              name: "06 Retefuente",
              percentage: "0",
              value: ZERO
            },
            {
              base: totals.totalBase,
              name: "08 ReteIVA",
              percentage: "0",
              value: ZERO
            },
            {
              base: totals.totalBase,
              name: "07 ReteICA",
              percentage: "0",
              value: ZERO
            }
          ]
    };

    // Normalize undefined values to null throughout the entire payload
    return normalizeToNull(payload);
  }, [products, companyInformation, utils, withholdings]);

  const handleValidationError = useCallback((errorMessage: string): void => {
    setValidate(true);
    setValidationErrors([errorMessage]);
    setSubmitError(errorMessage);
    setIsSubmitting(false);
    setIsLoading(false);
  }, []);

  const handleSubmit = useCallback(async (type?: Form): Promise<void> => {
    if (type === Form.Client) {
      dispatch(setClientSelected({}));
      setAddClient(true);
      return;
    }

    setValidationErrors([]);
    setValidationWarnings([]);
    setSubmitError(null);
    setIsLoading(true);
    setIsSubmitting(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { clientInfo, paymentConfig: _paymentConfig, documentConfig, ...restFormData } = formData;

      const formDataWithProducts: IQuoteFormDataWithProducts = {
        ...restFormData,
        clientInfo: clientInfo,
        products: products,
        not_information_customer: documentConfig?.authorizePersonalData || false,
        authorize_personal_data: documentConfig?.authorizePersonalData ? 'true' : 'false',
        selected_option_id: '',
      };

      // Validate required form fields (from generate-sales-invoice pattern)
      const requiredFields = QUOTE_REQUIRED_FORM_FIELDS(formDataWithProducts);
      const hasEmptyRequiredFields = validateEmptyFields(requiredFields, formDataWithProducts);

      if (hasEmptyRequiredFields) {
        handleValidationError('Por favor complete todos los campos requeridos del formulario.');
        return;
      }

      const clientLocationError = validateClientLocation(formDataWithProducts);
      if (clientLocationError) {
        handleValidationError(clientLocationError);
        return;
      }

      const companyInfoError = validateCompanyInformation();
      if (companyInfoError) {
        handleValidationError(companyInfoError);
        return;
      }

      const productsError = validateProducts();
      if (productsError) {
        handleValidationError(productsError);
        return;
      }

      const totals = calculateTotals();
      const sendingCharge = formDataWithProducts.sending_charge || ZERO;

      if (validateNegativeValues(totals, sendingCharge)) {
        setShowNegativeValueModal(true);
        setIsSubmitting(false);
        setIsLoading(false);
        return;
      }

      // Process products with taxes before calling getTotals (same pattern as QuoteBillingInformation)
      // Convert IInvoiceDetails[] to IQuoteProduct[] compatible format (batch_number: null -> undefined)
      const productsForCalculation = products.map(p => ({
        ...p,
        batch_number: p.batch_number ?? undefined,
      }));
      const processedProducts = calculateQuoteProductTaxes(productsForCalculation);

      // Call getTotals to ensure backend calculates taxes before building payload
      const calculatedValues = await dispatch(
        getTotals({
          products: processedProducts.map(item => ({
            ...item,
            taxes: item?.product_taxes ?? [],
          })),
          withholdings: withholdings,
          sending_charge: formData.sending_charge || ZERO,
        })
      );

      // Use the returned calculatedValues directly (no race condition with Redux selector)
      // getTotals returns IGenericRecord | null, cast to IInvoiceCalculates if valid
      const quotePayload = buildQuotePayload(
        formDataWithProducts, 
        totals, 
        withholdings, 
        calculatedValues as unknown as IInvoiceCalculates | undefined
      );

      const result = await dispatch(createQuoteAction(quotePayload)) as unknown as IQuoteCreateResponse;

      if (result && result.data) {
        const quoteId = result.data.id;
        setCreatedQuoteNumber(String(quoteId));
        setOpenModal(true);
        setIsSubmitting(false);
        setIsLoading(false);
      } else {
        throw new Error('Error creating quote');
      }
    } catch (error: unknown) {
      let errorMessage = 'Unexpected error saving quote';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const errorWithResponse = error as { response: { status: number; data: unknown } };
        if (errorWithResponse.response?.status === 422) {
          errorMessage = 'Error de validación. Por favor, verifique todos los campos requeridos.';
        } else if (errorWithResponse.response?.status === 401) {
          errorMessage = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
        } else if (errorWithResponse.response?.status === 500) {
          errorMessage = 'Error en el servidor. Por favor, intente más tarde.';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      setValidationErrors([errorMessage]);
      setSubmitError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  }, [
    formData,
    products,
    withholdings,
    history,
    validateClientLocation,
    validateCompanyInformation,
    validateProducts,
    calculateTotals,
    buildQuotePayload,
    handleValidationError,
    dispatch
  ]);

  const handleClientCreated = useCallback((): void => {
    setAddClient(false);
    dispatch(getClientsThin());
  }, [dispatch]);

  const resetForm = useCallback((): void => {
    setInternalFormData(INITIAL_FORM_DATA);
    setValidate(false);
    setValidationErrors([]);
    setValidationWarnings([]);
  }, []);

  return {
    formData,
    openModal,
    addClient,
    isLoading,
    validate,
    validationErrors,
    validationWarnings,
    products,
    withholdings,
    isSubmitting,
    submitError,
    showNegativeValueModal,
    createdQuoteNumber,

    updateFormData,
    handleSubmit,
    resetForm,
    setProducts,
    setWithholdings,

    toggleModal,
    toggleNegativeValueModal,
    handleClientCreated,
    setAddClient,
  };
};
