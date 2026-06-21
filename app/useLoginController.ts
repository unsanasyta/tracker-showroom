// File: app/useLoginController.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginModel } from "./loginModel";

export function useLoginController() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await loginModel.signIn(email, password);
            // Jika berhasil, arahkan ke dashboard
            router.push("/admin/dashboard");
        } catch (err: any) {
            // Mencegat pesan error bawaan dari Supabase
            if (err.message === "Invalid login credentials") {
                setError("Password / akun anda salah. Silakan coba kembali.");
            } else {
                // Tampilkan pesan error lain jika masalahnya berbeda (misal: internet mati)
                setError(err.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email, setEmail,
        password, setPassword,
        error, isLoading,
        handleLogin
    };
}