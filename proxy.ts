import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// PERUBAHAN DI SINI: Nama fungsi diubah dari 'middleware' menjadi 'proxy'
export async function proxy(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    // Membuat client Supabase khusus untuk proxy
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Mengecek sesi user saat ini
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const isTryingToAccessAdmin = request.nextUrl.pathname.startsWith('/admin');
    const isAtLoginPage = request.nextUrl.pathname === '/';

    // LOGIKA 1: Jika belum login tapi mau masuk /admin, TENDANG KELUAR ke halaman Login (/)
    if (!user && isTryingToAccessAdmin) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
    }

    // LOGIKA 2: Jika sudah login tapi buka halaman Login (/), LEMPAR LANGSUNG ke Dashboard
    if (user && isAtLoginPage) {
        const url = request.nextUrl.clone()
        url.pathname = '/admin/dashboard'
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}

// Menentukan rute mana saja yang harus dicek oleh proxy ini
export const config = {
    matcher: [
        /*
         * Mengecek semua request rute KECUALI untuk:
         * - _next/static (file statis next)
         * - _next/image (optimasi gambar)
         * - favicon.ico (ikon browser)
         * - file gambar (svg, png, dll)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}