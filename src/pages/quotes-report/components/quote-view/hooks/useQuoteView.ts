import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@redux/rootReducer';
import { apiGetQuote, apiGetQuoteBlob } from '@api/quotes';
import { urls } from '@api/urls';
import { getInformationCompany } from '@redux/company/actions';
import { Routes } from '@constants/Paths';
import { getRoute } from '@utils/Paths';
import type { IQuoteDataView } from '..';

/**
 * @typeParam showModal: boolean - Modal visibility state
 * @typeParam quoteData: IQuoteDataView | null - Quote data object
 * @typeParam isLoading: boolean - Loading state indicator
 * @typeParam error: string | null - Error message if any
 * @typeParam handleExportPDF: () => void - PDF export handler
 * @typeParam handleExportExcel: () => void - Excel export handler
 * @typeParam handlePrint: () => void - Print handler
 * @typeParam handleSendEmail: () => void - Email sending handler
 * @typeParam handleGenerateInvoice: () => void - Invoice generation handler
 * @typeParam handleGoBack: () => void - Navigation back handler
 * @typeParam handleGoNext: () => void - Navigation forward handler
 * @typeParam openModal: () => void - Modal open handler
 * @typeParam closeModal: () => void - Modal close handler
 */
export const useQuoteView = (): {
  showModal: boolean;
  quoteData: IQuoteDataView | null;
  isLoading: boolean;
  error: string | null;
  handleExportPDF: () => void;
  handleExportExcel: () => void;
  handlePrint: () => void;
  handleSendEmail: () => void;
  handleGenerateInvoice: () => void;
  handleGoBack: () => void;
  handleGoNext: () => void;
  openModal: () => void;
  closeModal: () => void;
} => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [quoteData, setQuoteData] = useState<IQuoteDataView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { companyInformation } = useSelector(
    ({ company }: RootState) => ({
      companyInformation: company.information,
    })
  );
  
  const getQuoteIdFromUrl = (): string | null => {
    const storedQuoteId = sessionStorage.getItem('currentQuoteId');
    if (storedQuoteId) {
      return storedQuoteId;
    }
    
    const searchParams = new URLSearchParams(location.search);
    const quoteParam = searchParams.get('quote') || searchParams.get('id');
    return quoteParam;
  };

  useEffect(() => {
    if (!companyInformation) {
      dispatch(getInformationCompany());
    }
  }, [dispatch, companyInformation]);

  useEffect(() => {
    const loadQuoteData = async (): Promise<void> => {
      const quoteId = getQuoteIdFromUrl();
      
      if (!quoteId) {
        setError('Quote ID not found in URL');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const endpoint = urls.invoice.quotes.getById(quoteId);
        
        const response = await apiGetQuote({
          resource: endpoint
        });
        
        if (response && response.data) {
          const quote = response.data;
          
          const transformedData: IQuoteDataView = {
            id: quote.id,
            number: quote.number || '',
            date: quote.date ? new Date(quote.date * 1000).toISOString() : new Date().toISOString(),
            validUntil: quote.date_limit ? new Date(quote.date_limit * 1000).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            company: {
              name: companyInformation?.name || 'Mi Empresa S.A.S',
              nit: companyInformation?.document_number || '900.123.456-7',
              address: companyInformation?.address || 'Dirección de la empresa',
              phone: companyInformation?.phone || '(601) 123-4567',
              city: `${companyInformation?.city_name || 'Bogotá'} - ${companyInformation?.country_name || 'Colombia'}`,
              email: companyInformation?.email || 'contacto@empresa.com',
            },
            customer: {
              name: quote.name || quote.person_name || 'Cliente sin nombre',
              nit: quote.document_number || quote.nit || '',
              address: quote.address || '',
              phone: quote.phone || '',
              email: quote.email || '',
              person_id: quote.person_id || null,
            },
            seller: {
              name: quote.employee?.name || quote.sales_manager || 'Vendedor',
              email: quote.employee?.email || 'vendedor@empresa.com',
              phone: quote.employee?.phone || '',
            },
            products: (quote.invoice_details || []).map((product: {
              id?: string;
              unique_products_id?: string;
              description?: string;
              quantity?: number;
              unit_value?: number;
              total?: number;
              discount?: number;
              unit_measurements_id?: string;
              taxes?: Array<{ name: string; percentage: number }>;
            }) => {
              const taxAmount = (product.taxes || []).reduce((sum, tax) => sum + (tax.percentage || 0), 0);
              return {
                id: product.id || '',
                description: product.description || '',
                quantity: product.quantity || 0,
                unitPrice: product.unit_value || 0,
                total: product.total || 0,
                discount: product.discount || 0,
                tax: taxAmount,
              };
            }),
            totalItems: quote.invoice_details?.length || 0,
            subtotal: quote.sub_total || 0,
            totalDiscount: quote.discount || 0,
            totalTax: quote.taxes || 0,
            total: quote.total || 0,
            paymentMethod: quote.payment_type || 'Contado',
            notes: quote.notes || '',
            terms: quote.terms_conditions || '',
            createdAt: quote.created_at || new Date().toISOString(),
            updatedAt: quote.updated_at || new Date().toISOString(),
            status: quote.status || 'draft',
            is_send_email: quote.is_send_email || false,
            pdfUrl: quote.pdf_url || '',
          };
          
          setQuoteData(transformedData);
          
          sessionStorage.setItem('currentQuoteNumber', quote.number || '');
        }
      } catch (err) {
        setError('Failed to load quote data');
      } finally {
        setIsLoading(false);
      }
    };

    loadQuoteData();
  }, [location.search, companyInformation, dispatch]);

  const handleExportPDF = async (): Promise<void> => {
    const quoteId = getQuoteIdFromUrl();
    if (!quoteId) return;

    try {
      const response = await apiGetQuoteBlob({
        resource: urls.invoice.quotes.download.pdf(quoteId)
      });
      
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cotizacion-${quoteData?.number || quoteId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting PDF:', error);
    }
  };

  const handleExportExcel = async (): Promise<void> => {
    const quoteId = getQuoteIdFromUrl();
    if (!quoteId) return;

    try {
      const response = await apiGetQuoteBlob({
        resource: urls.invoice.quotes.download.excel(quoteId)
      });
      
      const blob = new Blob([response], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cotizacion-${quoteData?.number || quoteId}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting Excel:', error);
    }
  };

  const handlePrint = (): void => {
    window.print();
  };

  const handleSendEmail = (): void => {
    const quoteId = getQuoteIdFromUrl();
    if (quoteId) {
      history.push(`${getRoute(Routes.QUOTES_REPORT)}?view=quote-send-mail&quote=${quoteId}`);
    }
  };

  const handleGenerateInvoice = (): void => {
    const quoteId = getQuoteIdFromUrl();
    if (quoteId) {
      sessionStorage.setItem('quoteToInvoice', quoteId);
      history.push(getRoute(Routes.ELECTRONIC_INVOICE));
    }
  };

  const handleGoBack = (): void => {
    history.push(getRoute(Routes.QUOTES_REPORT));
  };

  const handleGoNext = (): void => {
    handleSendEmail();
  };

  const openModal = (): void => setShowModal(true);
  const closeModal = (): void => setShowModal(false);

  return {
    showModal,
    quoteData,
    isLoading,
    error,
    handleExportPDF,
    handleExportExcel,
    handlePrint,
    handleSendEmail,
    handleGenerateInvoice,
    handleGoBack,
    handleGoNext,
    openModal,
    closeModal,
  };
};
