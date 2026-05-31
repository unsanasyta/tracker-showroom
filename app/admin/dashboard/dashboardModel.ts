// File: app/admin/dashboard/dashboardModel.ts
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const dashboardModel = {
    async getAllPurchases() {
        const { data, error } = await supabase
            .from('purchases')
            // TAMBAHAN: Kita menarik data is_sold untuk menghitung stok
            .select('id, created_at, car_brand, car_year, total_acquisition_cost, source_name, is_sold')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    },

    async getAllSales() {
        const { data, error } = await supabase
            .from('sales')
            .select('id, created_at, sell_price, net_profit, buyer_name, purchases(car_brand)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    }
};