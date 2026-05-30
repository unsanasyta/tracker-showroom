// File: app/loginModel.ts
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const loginModel = {
    async signIn(email: string, password: string) {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
    }
};