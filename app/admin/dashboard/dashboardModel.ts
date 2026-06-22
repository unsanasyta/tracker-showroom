// File: app/admin/dashboard/dashboardModel.ts
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const dashboardModel = {
    async getAllPurchases() {
        const { data, error } = await supabase
            .from('purchases')
            .select('*') // Menarik semua data termasuk field tanggal manual
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getAllSales() {
        const { data, error } = await supabase
            .from('sales')
            .select('*, purchases(car_brand)') // Menarik semua data dan relasi mobil
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    }
};