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

    // Fungsi upload file (Gambar & Dokumen)
    async uploadFile(file: File) {
        const fileExt = file.name.split('.').pop();
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `pembelian/${uniqueName}`;

        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        return data.publicUrl;
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