// File: app/admin/transactions/edit/[type]/[id]/transactionModel.ts
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

// Fungsi-fungsi khusus berinteraksi dengan tabel 'purchases' dan 'sales'
export const transactionModel = {
    // READ
    async getPurchaseById(id: string) {
        const { data, error } = await supabase.from('purchases').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async getSaleById(id: string) {
        const { data, error } = await supabase.from('sales').select('*').eq('id', id).single();
        if (error) throw error;
        return data;
    },

    async getAvailableCars() {
        const { data, error } = await supabase.from('purchases').select('id, car_brand, car_year, license_plate, total_acquisition_cost');
        if (error) throw error;
        return data || [];
    },

    // UPDATE
    async updatePurchase(id: string, payload: any) {
        const { error } = await supabase.from('purchases').update(payload).eq('id', id);
        if (error) throw error;
    },

    async updateSale(id: string, payload: any) {
        const { error } = await supabase.from('sales').update(payload).eq('id', id);
        if (error) throw error;
    }
};