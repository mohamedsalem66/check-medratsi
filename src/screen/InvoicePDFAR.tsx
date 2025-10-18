// components/InvoicePDFAR.tsx
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

// Define styles for Arabic (RTL) layout - using your exact styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 10,
        fontFamily: 'Tajawal',
        fontSize: 9,
        width: '148mm',
        height: '210mm',
        direction: 'rtl',
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
        marginLeft: 10,
    },
    schoolInfo: {
        flex: 1,
        alignItems: 'flex-end',
    },
    schoolName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 2,
        textAlign: 'right',
    },
    schoolDetails: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 1,
        textAlign: 'right',
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
        color: '#000',
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
        textAlign: 'right',
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
        textAlign: 'right',
    },
    infoValue: {
        fontSize: 9,
        fontWeight: 'bold',
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
        fontWeight: 'bold',
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
        textAlign: 'right',
    },
    summaryValueCompact: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'left',
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

interface InvoicePDFARProps {
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

const InvoicePDFAR: React.FC<InvoicePDFARProps> = ({
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
        return date.toLocaleDateString('ar-MA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatPaymentStatus = (status: string) => {
        switch (status) {
            case 'PAID': return 'مدفوع';
            case 'UNPAID': return 'غير مدفوع';
            case 'PARTIALLY_PAID': return 'مدفوع جزئياً';
            default: return status;
        }
    };

    const formatPaymentMethod = (method: string) => {
        switch (method) {
            case 'BANKILY': return 'بنكيلي';
            case 'CASH': return 'نقدي';
            case 'MASRIVI': return 'مصريفي';
            case 'SEDAD': return 'السداد';
            case 'CLICK': return 'كليك';
            case 'BIM_BANK': return 'بيم بنك';
            case 'MOOV_MONEY': return 'موف موني';
            default: return method;
        }
    };

    const getMonthName = (month: any) => {
        return month.arabicName;
    };

    const totalAmount = invoiceData.monthInvoiceRelations.reduce((sum: number, payment: any) => sum + payment.totalAmount, 0);
    const totalPaid = invoiceData.monthInvoiceRelations.reduce((sum: number, payment: any) => sum + payment.paidAmount, 0);
    const totalRemaining = invoiceData.monthInvoiceRelations.reduce((sum: number, payment: any) => sum + payment.remainingAmount, 0);
    const enrollmentPrice = invoiceData.enrollement.enrollementPrice || 0;

    return (
        <Document>
            <Page size="A5" style={styles.page} wrap>
                {/* Header - RTL layout */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <View style={styles.invoiceInfo}>
                            <Text style={styles.invoiceTitle}>فاتورة</Text>
                            <Text style={styles.invoiceNumber}>رقم: {invoiceData.ref}</Text>
                        </View>
                        <View style={styles.schoolInfo}>
                            <Text style={styles.schoolName}>{schoolArabicName}</Text>
                            {schoolAddress && <Text style={styles.schoolDetails}>{schoolAddress}</Text>}
                            <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
                                {schoolTel && <Text style={styles.schoolDetails}>الهاتف: {schoolTel}</Text>}
                                {schoolWhatsapp && <Text style={styles.schoolDetails}>واتساب: {schoolTel}</Text>}
                            </View>
                            <Text style={[styles.schoolDetails, { fontWeight: 'bold', color: '#000', marginTop: 2 }]}>
                                السنة الدراسية: {year}
                            </Text>
                        </View>
                        {logoUrl && <Image style={styles.logo} src={logoUrl} />}
                    </View>
                </View>

                {/* Combined Information Block */}
                <View style={styles.infoBlock}>
                    <Text style={[styles.sectionTitle, { marginBottom: 6 }]}>معلومات الطالب</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.infoValue}>{student.firstName} {student.lastName}</Text>
                        <Text style={styles.infoLabel}>: الاسم الكامل</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoValue}>{student.matricule}</Text>
                        <Text style={styles.infoLabel}>: رقم التسجيل</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoValue}>{schoolClass.arabicName || schoolClass.name}</Text>
                        <Text style={styles.infoLabel}>: الفصل</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoValue}>{formatPaymentMethod(invoiceData.paymentMethod)}</Text>
                        <Text style={styles.infoLabel}>: طريقة الدفع</Text>
                    </View>

                    {enrollmentPrice > 0 && (
                        <View style={[styles.infoRow, { marginTop: 4, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#e5e7eb' }]}>
                            <Text style={[styles.infoValue, { fontWeight: 'bold', color: '#1e40af' }]}>
                                {formatCurrency(enrollmentPrice)} أوقية
                            </Text>
                            <Text style={styles.infoLabel}>: رسوم التسجيل</Text>
                        </View>
                    )}

                    <Text style={[styles.sectionTitle, { marginTop: 10, marginBottom: 6 }]}>تفاصيل الدفع</Text>

                    <View style={styles.paymentTable}>
                        <View style={styles.paymentTableHeader}>
                            <Text style={[styles.paymentTableHeaderText, { width: '25%' }]}>الحالة</Text>
                            <Text style={[styles.paymentTableHeaderText, { width: '25%' }]}>المبلغ المدفوع</Text>
                            <Text style={[styles.paymentTableHeaderText, { width: '25%' }]}>المبلغ الإجمالي</Text>
                            <Text style={[styles.paymentTableHeaderText, { width: '25%' }]}>الشهر</Text>
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
                                    <Text style={[styles.paymentTableCell, { width: '25%' }, statusStyle]}>
                                        {formatPaymentStatus(payment.status)}
                                    </Text>
                                    <Text style={[styles.paymentTableCell, { width: '25%' }]}>
                                        {formatCurrency(payment.paidAmount)}
                                    </Text>
                                    <Text style={[styles.paymentTableCell, { width: '25%' }]}>
                                        {formatCurrency(payment.totalAmount)}
                                    </Text>
                                    <Text style={[styles.paymentTableCell, { width: '25%' }]}>
                                        {getMonthName(payment.enrollementPayment.month)}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                    <View style={styles.summaryRowCompact}>
                        <Text style={styles.summaryValueCompact}> {formatCurrency(totalAmount)} </Text>
                        <Text style={styles.summaryLabelCompact}>: إجمالي المبلغ</Text>
                    </View>
                    <View style={styles.summaryRowCompact}>
                        <Text style={[styles.summaryValueCompact, { color: '#10b981' }]}>  {formatCurrency(totalPaid)} </Text>
                        <Text style={styles.summaryLabelCompact}>: المبلغ المدفوع</Text>
                    </View>
                    <View style={styles.summaryRowCompact}>
                        <Text style={[styles.summaryValueCompact, { color: totalRemaining > 0 ? '#ef4444' : '#10b981' }]}>
                            {formatCurrency(totalRemaining)}
                        </Text>
                        <Text style={styles.summaryLabelCompact}>: المبلغ المتبقي</Text>
                    </View>
                </View>


                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.generatedDate}>
                        تم إنشاء هذه الفاتورة في: {formatDate(generatedAt.toISOString())}
                    </Text>
                    <Text style={{ fontSize: 8, color: '#000', lineHeight: 1.2 }}>
                        تم إنشاء هذه الفاتورة تلقائياً من نظام إدارة المدرسة - Medrasti
                    </Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDFAR;
