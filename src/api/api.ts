// api/api.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getInvoiceById = async (invoiceId: string) => {
    try {
        const response = await axios.get(`${API_URL}/invoice/complete/${invoiceId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting invoice:', error);
        throw error;
    }
};
