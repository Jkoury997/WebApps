const { NextResponse } = require('next/server');
const { cookies } = require('next/headers');
const { jwtVerify } = require('jose');

const URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;
const JWT_SECRET = process.env.JWT_SECRET;

export async function middleware(request) {
    console.log("Middleware ejecutado");

    const cookieStore = cookies();
    const accessToken = cookieStore.get("accessToken");
    const refreshToken = cookieStore.get("refreshToken");

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
        const { payload } = await jwtVerify(accessToken.value, new TextEncoder().encode(JWT_SECRET));

        // Verificar si el usuario tiene el rol adecuado
        if (payload.role !== 'admin') {
            console.log("Acceso denegado: el usuario no es admin.");
            return NextResponse.redirect(new URL('/unauthorized', request.url)); // Redirigir a página de no autorizado
        }

        // Si el token es válido y el rol es admin, permitir el acceso
        return NextResponse.next();
    } catch (error) {
        console.error("Error al verificar el token:", error);

        // Si el token ha expirado, intentamos obtener uno nuevo usando el refreshToken
        return await refreshAccessToken(refreshToken, request);
    }
}

export const config = {
    matcher: [
        '/dashboard/admin/:path*', // Rutas protegidas
    ],
};

// Función para redirigir al login
function redirectToLogin(request) {
    console.log("Redirigiendo al login...");
    return NextResponse.redirect(new URL('/login', request.url));
}

// Función para intentar obtener un nuevo accessToken usando el refreshToken
async function refreshAccessToken(refreshToken, request) {
    try {
        const response = await fetch(`${URL_API_AUTH}/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken.value }),
        });

        if (response.ok) {
            const { accessToken: newAccessToken } = await response.json();

            // Guardar el nuevo accessToken en las cookies
            const responseHeaders = new Headers(request.headers);
            responseHeaders.set(
                'Set-Cookie',
                `accessToken=${newAccessToken}; Path=/; HttpOnly; Secure; SameSite=Strict`
            );

            console.log("Access token renovado. Permitiendo acceso...");
            return NextResponse.next({ headers: responseHeaders });
        } else {
            console.log("Error al renovar el token. Redirigiendo al login...");
            return redirectToLogin(request);
        }
    } catch (error) {
        console.error("Error al intentar renovar el token:", error);
        return redirectToLogin(request);
    }
}
