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
    const [downloadStatus, setDownloadStatus] = useState<string>('');
    const [isDownloadComplete, setIsDownloadComplete] = useState<boolean>(false);
    const hasDownloaded = useRef(false);

    // Translations
    const messages = {
        fr: {
            noInvoiceId: 'Aucun identifiant de facture fourni',
            fetchingData: 'Récupération des données de la facture...',
            loadError: 'Échec du chargement de la facture. Veuillez vérifier l\'identifiant de la facture.',
            generatingPDF: 'Génération du PDF...',
            downloading: 'Téléchargement en cours...',
            downloadComplete: 'Téléchargement terminé ! Vous pouvez fermer cette page.',
            pdfGenerationError: 'Échec de la génération du PDF. Veuillez réessayer.',
            noInvoiceData: 'Aucune donnée de facture trouvée',
            downloadNotStarted: 'Si le téléchargement n\'a pas démarré automatiquement, veuillez actualiser la page.',
        },
        ar: {
            noInvoiceId: 'لم يتم توفير معرف الفاتورة',
            fetchingData: 'جاري استرجاع بيانات الفاتورة...',
            loadError: 'فشل تحميل الفاتورة. يرجى التحقق من معرف الفاتورة.',
            generatingPDF: 'جاري إنشاء ملف PDF...',
            downloading: 'جاري التحميل...',
            downloadComplete: 'اكتمل التحميل! يمكنك إغلاق هذه الصفحة.',
            pdfGenerationError: 'فشل إنشاء ملف PDF. يرجى المحاولة مرة أخرى.',
            noInvoiceData: 'لم يتم العثور على بيانات الفاتورة',
            downloadNotStarted: 'إذا لم يبدأ التحميل تلقائياً، يرجى تحديث الصفحة.',
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
                setDownloadStatus(t.fetchingData);
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
        const downloadPDF = async () => {
            if (!invoiceData || hasDownloaded.current) return;

            hasDownloaded.current = true;

            try {
                setDownloadStatus(t.generatingPDF);

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

                setDownloadStatus(t.downloading);

                // Create download link and trigger download
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `facture_${invoiceId}_${language}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                setDownloadStatus(t.downloadComplete);
                setIsDownloadComplete(true);
                setIsLoading(false);
            } catch (error) {
                console.error('Error generating PDF:', error);
                setErrorMessage(t.pdfGenerationError);
                setIsLoading(false);
            }
        };

        if (invoiceData && isLoading) {
            downloadPDF();
        }
    }, [invoiceData, isLoading, invoiceId, language, t.generatingPDF, t.downloading, t.downloadComplete, t.pdfGenerationError]);

    if (isLoading && !isDownloadComplete) {
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
                <Alert severity="info">{downloadStatus}</Alert>
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
            <Alert severity="success">{downloadStatus}</Alert>
            <Alert severity="info">{t.downloadNotStarted}</Alert>
        </Box>
    );
};

export default InvoiceDetails;
