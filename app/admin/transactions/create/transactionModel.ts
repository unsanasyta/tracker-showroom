import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const transactionModel = {
    async getAvailableCars() {
        const { data, error } = await supabase
            .from('purchases')
            .select('id, car_brand, car_year, license_plate, total_acquisition_cost')
            .eq('is_sold', false);

        if (error) throw error;
        return data || [];
    },

    async createPurchase(payload: any) {
        const { error } = await supabase.from('purchases').insert([payload]);
        if (error) throw error;
    },

    async createSale(payload: any) {
        const { error } = await supabase.from('sales').insert([payload]);
        if (error) throw error;
    },

    async updateCarStatusToSold(purchaseId: string) {
        const { error } = await supabase
            .from('purchases')
            .update({ is_sold: true })
            .eq('id', purchaseId);

        if (error) throw error;
    }
};