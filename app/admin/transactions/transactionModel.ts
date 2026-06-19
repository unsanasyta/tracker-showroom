// File: app/admin/transactions/transactionModel.ts
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const transactionModel = {
    // READ
    async getPurchasesForStats() {
        const { data, error } = await supabase.from('purchases').select('total_acquisition_cost');
        if (error) throw error;
        return data || [];
    },

    async getSalesForStats() {
        const { data, error } = await supabase.from('sales').select('sell_price, net_profit');
        if (error) throw error;
        return data || [];
    },

    async getPurchasesList() {
        const { data, error } = await supabase.from('purchases').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getSalesList() {
        // PERBAIKAN DI SINI: Tarik juga license_plate dan car_color dari tabel purchases
        const { data, error } = await supabase.from('sales').select('*, purchases(car_brand, car_year, license_plate, car_color)').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getSaleById(id: string) {
        const { data, error } = await supabase.from('sales').select('purchase_id').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    // UPDATE
    async updatePurchaseStatus(id: string, isSold: boolean) {
        const { error } = await supabase.from('purchases').update({ is_sold: isSold }).eq('id', id);
        if (error) throw error;
    },

    // DELETE
    async deleteRecord(table: 'purchases' | 'sales', id: string) {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw error;
    }
};