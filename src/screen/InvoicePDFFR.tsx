// components/InvoicePDFFR.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts
Font.register({
    family: 'Tajawal',
    fonts: [
        {
            src: '/fonts/Tajawal/Tajawal-Regular.ttf',
            fontWeight: 'normal',
        },
        {
            src: '/fonts/Tajawal/Tajawal-Bold.ttf',
            fontWeight: 'bold',
        },
        {
            src: '/fonts/Tajawal/Tajawal-Medium.ttf',
            fontWeight: 'medium',
        },
    ],
});

// Define styles for French (LTR) layout
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 10,
        fontFamily: 'Tajawal',
        fontSize: 9,
        width: '148mm', // A5 width
        height: '210mm', // A5 height
        direction: 'ltr',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: '#3b82f6',
        borderBottomStyle: 'solid',
    },
    headerLeft: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    logo: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    schoolInfo: {
        flex: 1,
        alignItems: 'flex-start',
    },
    schoolName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 2,
        textAlign: 'left',
    },
    schoolDetails: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 1,
        textAlign: 'left',
    },
    invoiceInfo: {
        alignItems: 'flex-end',
        minWidth: '35%',
    },
    invoiceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 6,
        textAlign: 'right',
    },
    invoiceNumber: {
        fontSize: 10,
        color: '#000',
        marginBottom: 2,
        lineHeight: 1.3,
        textAlign: 'right',
    },
    invoiceDate: {
        fontSize: 9,
        color: '#4b5563',
        lineHeight: 1.3,
        textAlign: 'right',
    },
    infoBlock: {
        backgroundColor: '#f9fafb',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1e40af',
        marginBottom: 8,
        textAlign: 'left',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    infoLabel: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000',
        width: '40%',
        textAlign: 'left',
    },
    infoValue: {
        fontSize: 9,
        color: '#000',
        width: '60%',
        textAlign: 'right',
    },
    paymentTable: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 4,
    },
    paymentTableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f3f4f6',
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    paymentTableHeaderText: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
    },
    paymentTableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingVertical: 2,
        paddingHorizontal: 4,
        lineHeight: 1.2,
    },
    paymentTableRowEven: {
        backgroundColor: '#f8fafc',
    },
    paymentTableCell: {
        fontSize: 8,
        color: '#000',
        textAlign: 'center',
        paddingHorizontal: 2,
        lineHeight: 1.2,
    },
    summaryRowCompact: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    summaryLabelCompact: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left',
    },
    summaryValueCompact: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'right',
    },
    qrSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: 3,
        paddingTop: 5,
    },
    qrContainer: {
        alignItems: 'center',
        width: '35%',
    },
    qrCode: {
        width: 65,
        height: 65,
        marginBottom: 4,
        borderColor: '#e5e7eb',
        backgroundColor: '#ffffff',
    },
    qrText: {
        fontSize: 7,
        color: '#6b7280',
        textAlign: 'center',
        lineHeight: 1.2,
        marginTop: 2,
    },
    signatureBlock: {
        alignItems: 'center',
        width: '45%',
    },
    signatureLine: {
        width: '100%',
        height: 1,
        backgroundColor: '#000',
        marginBottom: 3,
    },
    signatureText: {
        fontSize: 10,
        color: '#000',
        lineHeight: 1.2,
        textAlign: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        right: 15,
        textAlign: 'center',
        fontSize: 8,
        color: '#000',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 8,
        lineHeight: 1.2,
    },
    generatedDate: {
        fontSize: 8,
        color: '#000',
        marginBottom: 3,
        lineHeight: 1.2,
    },
});

interface InvoicePDFFRProps {
    invoiceData: any;
    student: any;
    schoolClass: any;
    year: string;
    schoolName: string;
    schoolArabicName: string;
    schoolAddress?: string;
    schoolTel?: string;
    schoolWhatsapp?: string;
    logoUrl?: string;
    generatedAt: Date;
}

const InvoicePDFFR: React.FC<InvoicePDFFRProps> = ({
                                                       invoiceData,
                                                       student,
                                                       schoolClass,
                                                       year,
                                                       schoolName,
                                                       schoolArabicName,
                                                       schoolAddress,
                                                       schoolTel,
                                                       schoolWhatsapp,
                                                       logoUrl,
                                                       generatedAt,
                                                   }) => {
    const formatCurrency = (amount: number) => {
        return `${Math.round(amount)}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatPaymentStatus = (status: string) => {
        switch (status) {
            case 'PAID': return 'Payé';
            case 'UNPAID': return 'Non payé';
            case 'PARTIALLY_PAID': return 'Partiellement payé';
            default: return status;
        }
    };

    const formatPaymentMethod = (method: string) => {
        switch (method) {
            case 'BANKILY': return 'Bankily';
            case 'CASH': return 'Espèces';
            case 'MASRIVI': return 'Masrivi';
            case 'SEDAD': return 'Sedad';
            case 'CLICK': return 'Click';
            case 'BIM_BANK': return 'BIM Bank';
            case 'MOOV_MONEY': return 'Moov Money';
            default: return method;
        }
    };

    const getMonthName = (month: any) => {
        return month.frenchName;
    };


    const totalAmount = invoiceData.monthInvoiceRelations.reduce((sum: number, payment: any) => sum + payment.totalAmount, 0);
    const totalPaid = invoiceData.monthInvoiceRelations.reduce((sum: number, payment: any) => sum + payment.paidAmount, 0);
    const totalRemaining = invoiceData.monthInvoiceRelations.reduce((sum: number, payment: any) => sum + payment.remainingAmount, 0);
    const enrollmentPrice = invoiceData.enrollement.enrollementPrice || 0;

    return (
        <Document>
            <Page size="A5" style={styles.page} wrap>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        {logoUrl && <Image style={styles.logo} src={logoUrl} />}
                        <View style={styles.schoolInfo}>
                            <Text style={styles.schoolName}>{schoolName}</Text>
                            {schoolAddress && <Text style={styles.schoolDetails}>{schoolAddress}</Text>}
                            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                                {schoolTel && <Text style={styles.schoolDetails}>Tél: {schoolTel}</Text>}
                                {schoolWhatsapp && <Text style={styles.schoolDetails}>WhatsApp: {schoolWhatsapp}</Text>}
                            </View>
                            <Text style={[styles.schoolDetails, { fontWeight: 'bold', color: '#000', marginTop: 2 }]}>
                                Année scolaire: {year}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.invoiceInfo}>
                        <Text style={styles.invoiceTitle}>FACTURE</Text>
                        <Text style={styles.invoiceNumber}>N°: {invoiceData.ref}</Text>
                        <Text style={styles.invoiceDate}>
                            {formatDate(invoiceData.createdAt)}
                        </Text>
                    </View>
                </View>

                {/* Combined Information Block */}
                <View style={styles.infoBlock}>
                    <Text style={[styles.sectionTitle, { marginBottom: 6 }]}>Informations de l'étudiant</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Nom complet:</Text>
                        <Text style={styles.infoValue}>{student.firstName} {student.lastName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Matricule:</Text>
                        <Text style={styles.infoValue}>{student.matricule}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Classe:</Text>
                        <Text style={styles.infoValue}>{schoolClass.name}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Mode de paiement:</Text>
                        <Text style={styles.infoValue}>{formatPaymentMethod(invoiceData.paymentMethod)}</Text>
                    </View>

                    {enrollmentPrice > 0 && (
                        <View style={[styles.infoRow, { marginTop: 4, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#e5e7eb' }]}>
                            <Text style={styles.infoLabel}>Frais d'inscription:</Text>
                            <Text style={[styles.infoValue, { fontWeight: 'bold', color: '#1e40af' }]}>
                                {formatCurrency(enrollmentPrice)} MRU
                            </Text>
                        </View>
                    )}

                    <Text style={[styles.sectionTitle, { marginTop: 10, marginBottom: 6 }]}>Détails des paiements</Text>

                    <View style={styles.paymentTable}>
                        <View style={styles.paymentTableHeader}>
                            <Text style={[styles.paymentTableHeaderText, { width: '25%' }]}>Mois</Text>
                            <Text style={[styles.paymentTableHeaderText, { width: '25%' }]}>Montant total</Text>
                            <Text style={[styles.paymentTableHeaderText, { width: '25%' }]}>Montant payé</Text>
                            <Text style={[styles.paymentTableHeaderText, { width: '25%' }]}>Statut</Text>
                        </View>

                        {invoiceData.monthInvoiceRelations.map((payment: any, index: number) => {
                            const statusStyle = payment.status === 'PAID' ? { color: '#10b981' } :
                                payment.status === 'UNPAID' ? { color: '#ef4444' } :
                                    { color: '#f59e0b' };

                            return (
                                <View
                                    key={payment.id}
                                    style={[
                                        styles.paymentTableRow,
                                        index % 2 === 0 ? styles.paymentTableRowEven : {}
                                    ]}
                                >
                                    <Text style={[styles.paymentTableCell, { width: '25%' }]}>
                                        {getMonthName(payment.enrollementPayment.month)}
                                    </Text>
                                    <Text style={[styles.paymentTableCell, { width: '25%' }]}>
                                        {formatCurrency(payment.totalAmount)} MRU
                                    </Text>
                                    <Text style={[styles.paymentTableCell, { width: '25%' }]}>
                                        {formatCurrency(payment.paidAmount)} MRU
                                    </Text>
                                    <Text style={[styles.paymentTableCell, { width: '25%' }, statusStyle]}>
                                        {formatPaymentStatus(payment.status)}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                    <View style={styles.summaryRowCompact}>
                        <Text style={styles.summaryLabelCompact}>Montant total:</Text>
                        <Text style={styles.summaryValueCompact}>{formatCurrency(totalAmount)} MRU</Text>
                    </View>
                    <View style={styles.summaryRowCompact}>
                        <Text style={styles.summaryLabelCompact}>Montant payé:</Text>
                        <Text style={[styles.summaryValueCompact, { color: '#10b981' }]}>
                            {formatCurrency(totalPaid)} MRU
                        </Text>
                    </View>
                    <View style={styles.summaryRowCompact}>
                        <Text style={styles.summaryLabelCompact}>Montant restant:</Text>
                        <Text style={[styles.summaryValueCompact, { color: totalRemaining > 0 ? '#ef4444' : '#10b981' }]}>
                            {formatCurrency(totalRemaining)} MRU
                        </Text>
                    </View>
                </View>


                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.generatedDate}>
                        Cette facture a été générée le: {formatDate(generatedAt.toISOString())}
                    </Text>
                    <Text style={{ fontSize: 8, color: '#000', lineHeight: 1.2 }}>
                        Cette facture a été générée automatiquement par le système de gestion scolaire - Medrasti
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDFFR;
