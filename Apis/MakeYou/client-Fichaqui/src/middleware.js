const { NextResponse } = require('next/server');
const { cookies } = require('next/headers');
const { jwtVerify } = require('jose');

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;
const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request) {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");
    const refreshToken = cookieStore.get("refreshToken");

    if (!accessToken) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    try {
        // Verifica el accessToken usando jose
        const { payload } = await jwtVerify(accessToken.value, new TextEncoder().encode(JWT_SECRET));
        
        // Obtener el rol del usuario
        const userRole = payload.role;

        // Definir roles permitidos para cada ruta
        const allowedRoles = {
            '/dashboard/admin': ['admin'],
            '/dashboard/recursoshumanos': ['admin', 'recursos_humanos'],
            '/dashboard': ['admin', 'employed', 'recursos_humanos'],
            // Agregar más rutas y roles permitidos según sea necesario
        };

        const pathname = request.nextUrl.pathname;

        // Comprobar si el rol del usuario está permitido en la ruta actual
        let isAuthorized = false;
        for (const [path, roles] of Object.entries(allowedRoles)) {
            if (pathname === path || pathname.startsWith(`${path}/`)) {
                if (roles.includes(userRole)) {
                    isAuthorized = true;
                } else {
                    isAuthorized = false;
                    break;
                }
            }
        }

        if (isAuthorized) {
            const response = NextResponse.next();
            response.cookies.set("userRole", userRole, {
                path: '/',
            });

            return response;
        } else {
            const response = NextResponse.redirect(new URL('/dashboard', request.url));
            response.cookies.set("error", "Access Denied", {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
            });
            return response;
        }
    } catch (error) {
        if (error.code === 'ERR_JWT_EXPIRED') {
            if (!refreshToken) {
                return NextResponse.redirect(new URL('/auth/login', request.url));
            }

            const response = await fetch(`${URL_API_AUTH}/api/token/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token: refreshToken.value }),
            });

            if (!response.ok) {
                return NextResponse.redirect(new URL('/auth/login', request.url));
            }

            const data = await response.json();
            const newAccessToken = data.accessToken;

            const newResponse = NextResponse.next();
            newResponse.cookies.set("accessToken", newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
            });

            return newResponse;
        } else {
            console.error('Token verification error:', error);
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }
}

export const config = {
    matcher: [
        '/dashboard/admin/:path*',
        '/dashboard/recursoshumanos/:path*',
        '/dashboard/:path*'
    ], // Rutas protegidas
};
