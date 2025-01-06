const { NextResponse } = require('next/server');
const { cookies } = require('next/headers');
const { jwtVerify } = require('jose');

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;
const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request) {
    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");
    const refreshToken = cookieStore.get("refreshToken");
    const { pathname } = request.nextUrl; // Obtiene la ruta actual

    // Si no hay refreshToken, redirigir al login inmediatamente
    if (!refreshToken) {
        return redirectToLogin(request);
    }

    // Si no hay accessToken, intentamos usar el refreshToken para obtener un nuevo accessToken
    if (!accessToken) {
        return await refreshAccessToken(refreshToken, request);
    }

    try {
        // Verificar el accessToken usando jose
        await jwtVerify(accessToken.value, new TextEncoder().encode(JWT_SECRET));
         // Verificar y decodificar el accessToken usando jose
         const { payload } = await jwtVerify(accessToken.value, new TextEncoder().encode(JWT_SECRET));


                    // Verifica roles según la ruta
        if (pathname.startsWith('/dashboard/admin')) {
            // Rutas de administrador, verificar rol
            if (payload.role !== 'admin') {
                return redirectToUnauthorized(request);
            }
        } else if (pathname.startsWith('/dashboard')) {
            // Rutas de usuario normal o administrador
            if (!['usuario', 'admin'].includes(payload.role)) {
                return redirectToUnauthorized(request);
            }
            
        }

        
        // Si el token es válido, permitir el acceso
        return NextResponse.next();
    } catch (error) {
        // Si el token ha expirado, intentamos obtener uno nuevo usando el refreshToken
            return await refreshAccessToken(refreshToken, request);
    }
}

// Función auxiliar para intentar renovar el accessToken usando el refreshToken
async function refreshAccessToken(refreshToken, request) {
    try {
        // Solicitar un nuevo accessToken con el refreshToken
        const response = await fetch(`${URL_API_AUTH}/api/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken.value }),
        });

        if (!response.ok) {
            // Si falla la solicitud de refresh, eliminar los tokens y redirigir al login
            return redirectToLogin(request);
        }

        const data = await response.json();
        const newAccessToken = data.accessToken;

        // Establecer el nuevo accessToken en las cookies
        const newResponse = NextResponse.next();
        newResponse.cookies.set("accessToken", newAccessToken, {
            path: '/',
        });

        return newResponse;
    } catch (error) {
        console.error('Error al refrescar el accessToken:', error);
        return redirectToLogin(request);
    }
}

// Función auxiliar para redirigir al login
function redirectToLogin(request) {
    const newResponse = NextResponse.redirect(new URL('/auth/login', request.url));
    newResponse.cookies.delete("accessToken");
    newResponse.cookies.delete("refreshToken");
    return newResponse;
}


// Función auxiliar para redirigir a la página no autorizada
function redirectToUnauthorized(request) {
    return NextResponse.redirect(new URL('/dashboard/unauthorized', request.url));
}


export const config = {
    matcher: [
        '/dashboard/:path*', // Rutas protegidas
    ],
};
