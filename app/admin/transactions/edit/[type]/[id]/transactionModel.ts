// File: app/admin/transactions/edit/[type]/[id]/transactionModel.ts
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

export const transactionModel = {
    async getPurchaseById(id: string) {
        const { data, error } = await supabase.from('purchases').select('*').eq('id', id).single();
        if (error) throw error; return data;
    },
    async getSaleById(id: string) {
        const { data, error } = await supabase.from('sales').select('*').eq('id', id).single();
        if (error) throw error; return data;
    },
    async getAvailableCars() {
        const { data, error } = await supabase.from('purchases').select('id, car_brand, car_year, license_plate, total_acquisition_cost');
        if (error) throw error; return data || [];
    },
    async uploadFile(file: File) {
        const fileExt = file.name.split('.').pop();
        const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `pembelian/${uniqueName}`;
        const { error: uploadError } = await supabase.storage.from('documents').upload(filePath, file);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('documents').getPublicUrl(filePath);
        return data.publicUrl;
    },
    async deleteFile(url: string) {
        const fileName = url.split('/').pop();
        if (!fileName) return;
        await supabase.storage.from('documents').remove([`pembelian/${fileName}`]);
    },
    async updatePurchase(id: string, payload: any) {
        const { error } = await supabase.from('purchases').update(payload).eq('id', id);
        if (error) throw error;
    },
    async updateSale(id: string, payload: any) {
        const { error } = await supabase.from('sales').update(payload).eq('id', id);
        if (error) throw error;
    }
};