import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const transactionModel = {
    async getPurchaseById(id: string) {
        const { data, error } = await supabase.from('purchases').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async getSaleById(id: string) {
        // PERBAIKAN: Sertakan document_urls saat menarik data mobil dari relasi pembelian
        const { data, error } = await supabase.from('sales').select(`
                *, purchases (car_brand, car_year, license_plate, total_acquisition_cost, document_urls)
            `).eq('id', id).single();
        if (error) throw error;
        return data;
    }
};