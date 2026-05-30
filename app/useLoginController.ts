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
            setError(err.message);
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