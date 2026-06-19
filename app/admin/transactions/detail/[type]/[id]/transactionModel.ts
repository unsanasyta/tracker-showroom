// File: app/admin/transactions/detail/[type]/[id]/transactionModel.ts
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const transactionModel = {
    async getPurchaseById(id: string) {
        const { data, error } = await supabase
            .from('purchases')
            .select('*')
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    },

    async getSaleById(id: string) {
        // Menggunakan fitur relasi Supabase untuk menarik identitas mobil yang terjual
        const { data, error } = await supabase
            .from('sales')
            .select(`
                *,
                purchases (
                    car_brand,
                    car_year,
                    license_plate,
                    total_acquisition_cost
                )
            `)
            .eq('id', id)
            .single();
        if (error) throw error;
        return data;
    }
};