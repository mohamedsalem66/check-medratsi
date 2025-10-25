// screen/InvoiceDetails.tsx
import * as React from 'react';
import { getInvoiceById } from '../api/api';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import InvoicePDFFR from './InvoicePDFFR';
import InvoicePDFAR from './InvoicePDFAR';
import Box from '@mui/material/Box';

interface InvoiceDetailsProps {
    language: 'fr' | 'ar';
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ language }) => {
    const { invoiceId } = useParams<{ invoiceId: string }>();
    const [invoiceData, setInvoiceData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [loadingStatus, setLoadingStatus] = useState<string>('');
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const hasGenerated = useRef(false);

    // Translations
    const messages = {
        fr: {
            noInvoiceId: 'Aucun identifiant de facture fourni',
            fetchingData: 'Récupération des données de la facture...',
            loadError: 'Échec du chargement de la facture. Veuillez vérifier l\'identifiant de la facture.',
            generatingPDF: 'Génération du PDF...',
            pdfGenerationError: 'Échec de la génération du PDF. Veuillez réessayer.',
            noInvoiceData: 'Aucune donnée de facture trouvée',
        },
        ar: {
            noInvoiceId: 'لم يتم توفير معرف الفاتورة',
            fetchingData: 'جاري استرجاع بيانات الفاتورة...',
            loadError: 'فشل تحميل الفاتورة. يرجى التحقق من معرف الفاتورة.',
            generatingPDF: 'جاري إنشاء ملف PDF...',
            pdfGenerationError: 'فشل إنشاء ملف PDF. يرجى المحاولة مرة أخرى.',
            noInvoiceData: 'لم يتم العثور على بيانات الفاتورة',
        }
    };

    const t = messages[language];

    useEffect(() => {
        const fetchInvoice = async () => {
            if (!invoiceId) {
                setErrorMessage(t.noInvoiceId);
                setIsLoading(false);
                return;
            }

            setErrorMessage('');

            try {
                setIsLoading(true);
                setLoadingStatus(t.fetchingData);
                const response = await getInvoiceById(invoiceId);
                setInvoiceData(response);
            } catch (error: any) {
                setErrorMessage(error?.response?.data?.message || t.loadError);
                setIsLoading(false);
            }
        };

        fetchInvoice();
    }, [invoiceId, t.noInvoiceId, t.fetchingData, t.loadError]);

    useEffect(() => {
        const generatePDF = async () => {
            if (!invoiceData || hasGenerated.current) return;

            hasGenerated.current = true;

            try {
                setLoadingStatus(t.generatingPDF);

                // Extract school information
                const schoolInfo = {
                    name: invoiceData.school?.name || "École",
                    arabicName: invoiceData.school?.arabicName || "مدرسة",
                    address: invoiceData.school?.address?.name || "Nouakchott, Mauritanie",
                    tel: invoiceData.school?.firstTel || "",
                    whatsapp: invoiceData.school?.whatsapp || "",
                    logoUrl: invoiceData.school?.logo?.link || ""
                };

                const InvoicePDFComponent = language === 'ar' ? InvoicePDFAR : InvoicePDFFR;

                // Generate PDF blob
                const blob = await pdf(
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
                ).toBlob();

                // Create blob URL to display PDF in browser
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
                setIsLoading(false);
            } catch (error) {
                console.error('Error generating PDF:', error);
                setErrorMessage(t.pdfGenerationError);
                setIsLoading(false);
            }
        };

        if (invoiceData && isLoading) {
            generatePDF();
        }
    }, [invoiceData, isLoading, invoiceId, language, t.generatingPDF, t.pdfGenerationError]);

    // Cleanup blob URL on unmount
    useEffect(() => {
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [pdfUrl]);

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                flexDirection="column"
                gap={2}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
                <CircularProgress />
                <Alert severity="info">{loadingStatus}</Alert>
            </Box>
        );
    }

    if (errorMessage) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
                <Alert severity="error">{errorMessage}</Alert>
            </Box>
        );
    }

    if (!invoiceData) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
                dir={language === 'ar' ? 'rtl' : 'ltr'}
            >
                <Alert severity="warning">{t.noInvoiceData}</Alert>
            </Box>
        );
    }

    // Display PDF in iframe for sharing
    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                margin: 0,
                padding: 0,
                overflow: 'hidden'
            }}
        >
            {pdfUrl && (
                <iframe
                    src={pdfUrl}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        margin: 0,
                        padding: 0,
                    }}
                    title="Invoice PDF"
                />
            )}
        </Box>
    );
};

export default InvoiceDetails;
