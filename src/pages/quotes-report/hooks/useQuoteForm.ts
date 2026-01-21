import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '@redux/rootReducer';
import { Form } from '@models/ElectronicDocuments';
import { IProduct } from '@models/Inventory';
import { IFiscalResponsibility } from '@models/ElectronicNote';
import { ITaxes as ITax } from '@models/ElectronicInvoice';
import { createQuoteAction } from '@redux/quotes/actions';
import { getClientsThin } from '@redux/clients/actions';
import { getInformationCompany } from '@redux/company/actions';
import { getUtils } from '@redux/utils/actions';
import { getFilesCompanyAction } from '@redux/parameterization-customization-electronic-invoice/actions';
import { getUniqueProductStock } from '@redux/electronic-invoice/actions';
import { getSuppliers } from '@redux/suppliers/actions';
import { TypeFile } from '@constants/ElectronicInvoice';
import {
    FOREIGN_EXCHANGE,
    PAYMENT_METHODS,
    PAYMENT_TYPES,
    OPERATION_TYPES,
    PERSON_UTILS,
    LANGUAGES,
    DOCUMENT_TYPES,
} from '@constants/UtilsConstants';

import { 
    IFormData, 
    INITIAL_FORM_DATA
} from '@pages/quotes-report/components/quote-generate';

export const useQuoteForm = (): {
  formData: IFormData;
  openModal: boolean;
  addClient: boolean;
  isLoading: boolean;
  validationErrors: string[];
  validationWarnings: string[];
  products: IProduct[];
  isSubmitting: boolean;
  submitError: string | null;
  updateFormData: (data: Partial<IFormData>) => void;
  handleSubmit: (type?: Form) => Promise<void>;
  resetForm: () => void;
  setProducts: (products: IProduct[]) => void;
  toggleModal: () => void;
  handleClientCreated: () => void;
  setAddClient: (value: boolean) => void;
} => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { information: companyInformation } = useSelector(
    ({ company }: RootState) => ({
      information: company.information,
    })
  );

  const [formData, setFormData] = useState<IFormData>(INITIAL_FORM_DATA);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [addClient, setAddClient] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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
    ]);
  };

  const updateFormData = useCallback((data: Partial<IFormData>): void => {
    setFormData(prevData => ({
      ...prevData,
      ...data,
    }));
  }, []);

  const toggleModal = useCallback((): void => {
    setOpenModal(prev => !prev);
  }, []);

  const validateClientLocation = useCallback((formDataWithProducts: IGenericRecord): string | null => {
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
    const invalidProducts = products.filter(p => !p.sku_internal || !p.reference || !p.unique_products_id);
    if (invalidProducts.length > 0) {
      return 'Algunos productos no tienen información completa (SKU, referencia). Por favor, seleccione productos válidos del catálogo.';
    }
    return null;
  }, [products]);

  const calculateTotals = useCallback(() => {
    const totalBase = products.reduce((acc, p) => acc + ((p.quantity || 0) * (p.unit_cost || 0)), 0);
    const totalIva = products.reduce((acc, p) => {
      const baseValue = (p.quantity || 0) * (p.unit_cost || 0);
      return acc + (baseValue * 0.19);
    }, 0);
    const totalDiscount = products.reduce((acc, p) => acc + (p.discount || 0), 0);

    return { totalBase, totalIva, totalDiscount };
  }, [products]);

  const buildQuotePayload = useCallback((formDataWithProducts: IGenericRecord, totals: { totalBase: number; totalIva: number; totalDiscount: number }) => {
    const currentDate = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);

    return {
      address: formDataWithProducts.clientInfo?.address || formDataWithProducts.address || null,
      aggregation_method: 'NO_ELECTRONICS',
      apply_deductible: false,
      base_retefuente: 0,
      base_reteica: 0,
      base_reteiva: 0,
      city_id: formDataWithProducts.clientInfo?.city_id || formDataWithProducts.city_id || null,
      city_name: formDataWithProducts.clientInfo?.city_name || formDataWithProducts.city_name || null,
      company_address: companyInformation?.address || null,
      company_postal_code: companyInformation?.postal_code || companyInformation?.zip_code || null,
      country_id: formDataWithProducts.clientInfo?.country_id || formDataWithProducts.country_id || null,
      country_name: formDataWithProducts.clientInfo?.country_name || formDataWithProducts.country_name || null,
      date: formDataWithProducts.date || currentDate.toISOString().split('T')[0],
      date_limit: formDataWithProducts.date_limit || futureDate.toISOString().split('T')[0],
      department_id: formDataWithProducts.clientInfo?.department_id || formDataWithProducts.department_id || null,
      department_name: formDataWithProducts.clientInfo?.department_name || formDataWithProducts.department_name || null,
      document_number: formDataWithProducts.clientInfo?.documentNumber || formDataWithProducts.document_number || null,
      document_number_purchasing_manager: formDataWithProducts.document_number_purchasing_manager || null,
      document_number_sales_manager: formDataWithProducts.document_number_sales_manager || null,
      document_type: formDataWithProducts.clientInfo?.documentTypeId || formDataWithProducts.document_type_id || null,
      document_type_purchasing_manager: formDataWithProducts.document_type_purchasing_manager || null,
      document_type_sales_manager: formDataWithProducts.document_type_sales_manager || null,
      electronic_billing: null,
      email: formDataWithProducts.clientInfo?.email || formDataWithProducts.email || null,
      employee_id: formDataWithProducts.employee_id || null,
      fiscal_responsibilities: (formDataWithProducts.clientInfo?.fiscal_responsibilities || formDataWithProducts.fiscal_responsibilities || []).map((fr: IFiscalResponsibility | string) => ({
        id: typeof fr === 'string' ? fr : (fr.id || fr)
      })),
      foreign_exchange_id: formDataWithProducts.paymentConfig?.foreignExchangeId || formDataWithProducts.foreign_exchange_id || null,
      foreign_exchange_name: formDataWithProducts.paymentConfig?.foreignExchangeName || formDataWithProducts.foreign_exchange_name || null,
      
      invoice_state: 'ACCEPTED',
      invoice_type: 'QUOTE',
      is_electronic_invoice: false,
      is_paid: false,
      
      loaded_inventory: false,
      
      name: formDataWithProducts.clientInfo?.name || formDataWithProducts.name || null,
      note: formDataWithProducts.note || formDataWithProducts.observations || null,
      number: formDataWithProducts.number || null,
      number_purchase_order: formDataWithProducts.number_purchase_order || null,
      
      operation_type_id: formDataWithProducts.operation_type_id || null,
      
      payment_method_id: formDataWithProducts.paymentConfig?.method || formDataWithProducts.payment_method_id || null,
      payment_type_id: formDataWithProducts.paymentConfig?.means || formDataWithProducts.payment_type_id || null,
      payment_type_name: formDataWithProducts.paymentConfig?.meansName || formDataWithProducts.payment_type_name || null,
      person_id: formDataWithProducts.client_id || null,
      phone: formDataWithProducts.clientInfo?.phone || formDataWithProducts.phone || null,
      postal_code: formDataWithProducts.clientInfo?.postal_code || formDataWithProducts.postal_code || null,
      
      products: products.map(p => ({
        batch_id: p.batch_id || null,
        ciiu_id: p.ciiu_id || null,
        date_expiration: (p.date_expiration && p.date_expiration !== 'N/A') ? p.date_expiration : null,
        delivery_cost: p.delivery_cost || 0,
        description: p.description || p.name || null,
        discount: p.discount || 0,
        is_inventoriable: p.is_inventoriable !== undefined ? p.is_inventoriable : true,
        is_product: p.is_product !== undefined ? p.is_product : true,
        iva: ((p.quantity || 0) * (p.unit_cost || 0)) * 0.19,
        mandate_id: p.mandate_id || null,
        quantity: p.quantity || 1,
        reference: p.reference || p.code || null,
        sku_internal: p.sku_internal || p.code || null,
        taxes: p.taxes?.map((t: ITax) => ({
          company_tax_id: t.company_tax_id || t.id || null
        })) || [],
        total_buy: (p.quantity || 0) * (p.unit_cost || 0),
        unique_product_name: p.unique_product_name || p.name || null,
        unique_products_id: p.unique_products_id || p.id || null,
        unit_cost: p.unit_cost || 0,
        unit_measurements_id: p.unit_measurements_id || p.unit_measurement_id || null,
        unit_value: p.unit_cost || 0,
        warehouse_id: p.warehouse_id || null,
        warehouse_name: p.warehouse_name || null
      })),
      purchasing_manager: formDataWithProducts.purchasing_manager || null,
      
      qualification_id: formDataWithProducts.qualification_id || null,
      
      retefuente: 0,
      reteica: 0,
      reteiva: 0,
      
      sale_channel: 'PHYSICAL_STORE',
      sales_manager: formDataWithProducts.sales_manager || null,
      send_address: formDataWithProducts.send_address || null,
      sending_charge: formDataWithProducts.sending_charge || 0,
      source_type: 'VENDORS',
      state_purchase_order: formDataWithProducts.state_purchase_order || null,
      
      taxes: [
        {
          base: totals.totalBase,
          name: "01",
          percentage: "19",
          value: totals.totalIva
        },
        {
          base: totals.totalBase,
          name: "02",
          percentage: "0",
          value: 0
        },
        {
          base: totals.totalBase,
          name: "03",
          percentage: "0",
          value: 0
        },
        {
          base: totals.totalBase,
          name: "04",
          percentage: "0",
          value: 0
        },
        {
          base: totals.totalBase,
          name: "05",
          percentage: "0",
          value: 0
        }
      ],
      time_issue: formDataWithProducts.time_issue || new Date().toTimeString().split(' ')[0],
      total: totals.totalBase,
      total_discount: totals.totalDiscount,
      total_ibua: 0,
      total_icui: 0,
      total_impoconsumption: 0,
      total_invoice: totals.totalBase,
      total_iva: totals.totalIva,
      total_sale: totals.totalBase,
      total_sale_value: totals.totalBase,
      type_taxpayer_id: formDataWithProducts.clientInfo?.taxpayerType || formDataWithProducts.type_taxpayer_id || null,
      type_taxpayer_name: formDataWithProducts.clientInfo?.taxpayerTypeName || formDataWithProducts.type_taxpayer_name || null,
      
      withholdings: [
        {
          base: totals.totalBase,
          name: "retefuente",
          percentage: "0",
          value: 0
        },
        {
          base: totals.totalBase,
          name: "reteIVA", 
          percentage: "0",
          value: 0
        },
        {
          base: totals.totalBase,
          name: "reteICA",
          percentage: "0",
          value: 0
        }
      ]
    };
  }, [products, companyInformation]);

  const handleValidationError = useCallback((errorMessage: string): void => {
    setValidationErrors([errorMessage]);
    setSubmitError(errorMessage);
    setIsSubmitting(false);
    setIsLoading(false);
  }, []);

  const handleSubmit = useCallback(async (type?: Form): Promise<void> => {
    if (type === Form.Client) {
      setAddClient(true);
      return;
    }

    setValidationErrors([]);
    setValidationWarnings([]);
    setSubmitError(null);
    setIsLoading(true);
    setIsSubmitting(true);

    try {
      const formDataWithProducts = {
        ...formData,
        products: products
      };

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
      const quotePayload = buildQuotePayload(formDataWithProducts, totals);
      
      const result = await dispatch(createQuoteAction(quotePayload));
      
      if (result && result.data) {
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
    setFormData(INITIAL_FORM_DATA);
    setValidationErrors([]);
    setValidationWarnings([]);
  }, []);

  return {
    formData,
    openModal,
    addClient,
    isLoading,
    validationErrors,
    validationWarnings,
    products,
    isSubmitting,
    submitError,

    updateFormData,
    handleSubmit,
    resetForm,
    setProducts,

    toggleModal,
    handleClientCreated,
    setAddClient,
  };
};
