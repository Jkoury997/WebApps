import { NextResponse } from "next/server";

const NEXT_PUBLIC_URL_API_MANTENIMIENTO = process.env.NEXT_PUBLIC_URL_API_MANTENIMIENTO;

export async function POST(req) {
    console.log("📌 Entro al handler de creación de tareas");

    try {
        // Verificar si la URL de la API está configurada correctamente
        if (!NEXT_PUBLIC_URL_API_MANTENIMIENTO) {
            throw new Error("API URL is not defined");
        }

        // Obtener parámetros de la URL
        const { searchParams } = new URL(req.url);
        const zona = searchParams.get("zona");

        // 📌 **Detectar el tipo de contenido**
        const contentType = req.headers.get("content-type") || "";
        const isMultipart = contentType.includes("multipart/form-data");

        let requestData;
        if (isMultipart) {
            console.log("📌 Se detectó `multipart/form-data`");

            const formData = await req.formData();
            requestData = {
                nombre: formData.get("nombre"),
                descripcion: formData.get("descripcion"),
                categoria: formData.get("categoria"),
                ubicacionExpecifica: formData.get("ubicacionExpecifica"),
                zona: zona,
            };
        } else {
            console.log("📌 Se detectó `application/json`");

            try {
                requestData = await req.json();
            } catch (err) {
                throw new Error("Error al leer el cuerpo de la solicitud. Asegúrate de que el JSON es válido.");
            }
        }

        console.log("📌 Datos recibidos:", requestData);

        // 📌 **Validar los datos requeridos**
        if (!requestData.nombre || !requestData.descripcion || !requestData.categoria || !requestData.ubicacionExpecifica) {
            return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
        }

        // 📌 **Enviar la solicitud al backend**
        const response = await fetch(`${NEXT_PUBLIC_URL_API_MANTENIMIENTO}/api/tareas`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
            cache: "no-store",
        });

        // 📌 **Validar respuesta del backend**
        let responseData;
        try {
            responseData = await response.json();
        } catch (error) {
            throw new Error("La respuesta del backend no es un JSON válido.");
        }

        if (!response.ok) {
            return NextResponse.json(
                { error: responseData.error || "Error en la respuesta de la API" },
                { status: response.status }
            );
        }

        console.log("✅ Tarea creada con éxito:", responseData);
        return NextResponse.json(responseData, { status: 201 });

    } catch (error) {
        console.error("❌ Error en la API de Next.js:", error.message);
        return NextResponse.json({ error: error.message || "Error interno del servidor" }, { status: 500 });
    }
}
