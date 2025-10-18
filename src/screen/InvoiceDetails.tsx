// screen/InvoiceDetails.tsx
import * as React from 'react';
import { getInvoiceById } from '../api/api';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import InvoicePDFFR from './InvoicePDFFR';
import InvoicePDFAR from './InvoicePDFAR';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

interface InvoiceDetailsProps {
    language: 'fr' | 'ar';
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ language }) => {
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!invoiceId) {
                setErrorMessage('No invoice ID provided');
                setIsLoading(false);
                return;
            }

            setErrorMessage('');

            try {
                setIsLoading(true);
                const response = await getInvoiceById(invoiceId);
                setInvoiceData(response);
            } catch (error: any) {
                setErrorMessage(error?.response?.data?.message || 'Failed to load invoice. Please check the invoice ID.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchInvoice();
    }, [invoiceId]);

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (errorMessage) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Alert severity="error">{errorMessage}</Alert>
            </Box>
        );
    }

    if (!invoiceData) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Alert severity="warning">No invoice data found</Alert>
            </Box>
        );
    }

    // Extract school information from the API response
    const schoolInfo = {
        name: invoiceData.school?.name || "École",
        arabicName: invoiceData.school?.arabicName || "مدرسة",
        address: invoiceData.school?.address?.name || "Nouakchott, Mauritanie",
        tel: invoiceData.school?.firstTel || "",
        whatsapp: invoiceData.school?.whatsapp || "",
        logoUrl: invoiceData.school?.logo?.link || ""
    };


    const InvoicePDFComponent = language === 'ar' ? InvoicePDFAR : InvoicePDFFR;

    return (
        <Box sx={{ width: '100%', height: '100vh', position: 'relative', pedding : '10px' }}>
            <PDFViewer width="100%" height="100%">
                <InvoicePDFComponent
                    invoiceData={invoiceData}
                    student={invoiceData.enrollement.student}
                    schoolClass={invoiceData.enrollement.schoolClass}
                    year={invoiceData.enrollement.year}
                    schoolName={schoolInfo.name}
                    schoolArabicName={schoolInfo.arabicName}
                    schoolAddress={schoolInfo.address}
                    schoolTel={schoolInfo.tel}
                    schoolWhatsapp={schoolInfo.whatsapp}
                    logoUrl={schoolInfo.logoUrl}
                    generatedAt={new Date(invoiceData?.createdAt)}
                />
            </PDFViewer>
        </Box>
    );
};

export default InvoiceDetails;
