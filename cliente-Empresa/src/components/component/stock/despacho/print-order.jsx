"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import ReactToPrint from "react-to-print";
import OrdenAImprimir from "@/components/component/stock/despacho/orden-al-imprimir";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintOrden({ firma, despacho, productos, empresa, proveedor, runKey }) {
  const componentRef = useRef();
  const [saving, setSaving] = useState(false);
  const [serverUrl, setServerUrl] = useState("");

  // ✅ Clave estable por despacho + corrida, evita dobles subidas en dev y entre runs
  const saveKey = useMemo(() => {
    const id = despacho?.Id ?? despacho?.Numero ?? "sin_id";
    return `printorden:${id}:${runKey ?? 0}`;
  }, [despacho?.Id, despacho?.Numero, runKey]);

  const didSaveRef = useRef(false);

  // Espera a que todas las imágenes terminen (firma/logos)
  const waitForImages = (root) =>
    new Promise((resolve) => {
      const imgs = Array.from(root.querySelectorAll("img"));
      if (!imgs.length) return resolve();
      let loaded = 0;
      const done = () => (++loaded >= imgs.length ? resolve() : null);
      imgs.forEach((img) => {
        if (img.complete) return done();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    });

  // 📄 Genera PDF multi-página y estampa la firma en cada hoja
const generatePdfBlob = async () => {
  const { jsPDF } = await import("jspdf");
  const html2canvas = (await import("html2canvas")).default;

  const node = componentRef.current;

  // 👇 Ocultar temporariamente la firma que está en el DOM
  const sigEls = Array.from(node.querySelectorAll('[data-role="firma"]'));
  const restore = [];
  sigEls.forEach(el => {
    restore.push([el, el.style.visibility]);
    el.style.visibility = 'hidden';
  });

  // Captura “fiel” del DOM (sin la firma del DOM)
  const canvas = await html2canvas(node, {
    scale: 2,
    useCORS: true,
    scrollX: 0,
    scrollY: -window.scrollY,
    windowWidth: node.scrollWidth,
  });

  // 👇 Restaurar visibilidad de la firma en el DOM
  restore.forEach(([el, vis]) => (el.style.visibility = vis || ''));

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfW = pdf.internal.pageSize.getWidth();
  const pdfH = pdf.internal.pageSize.getHeight();

  const ratio = pdfW / canvas.width;
  const pageHeightPx = Math.floor(pdfH / ratio);

  const sliceCanvas = (sourceCanvas, y, h) => {
    const slice = document.createElement("canvas");
    slice.width = sourceCanvas.width;
    slice.height = h;
    const ctx = slice.getContext("2d");
    ctx.drawImage(sourceCanvas, 0, y, sourceCanvas.width, h, 0, 0, sourceCanvas.width, h);
    return slice;
  };

  // Preparar tamaño consistente de la firma (en mm)
  // Si en pantalla usás ~80px de alto, eso es aprox 21 mm en A4.
  let firmaHeightMm = 21;      // 👈 alto fijo “parecido” al del DOM
  let firmaWidthMm = 36;       // se recalcula con la proporción real
  if (firma) {
    try {
      const im = await new Promise((res) => {
        const x = new Image();
        x.onload = () => res(x);
        x.onerror = () => res(null);
        x.src = firma;
      });
      if (im && im.naturalWidth && im.naturalHeight) {
        const aspect = im.naturalWidth / im.naturalHeight;
        firmaWidthMm = firmaHeightMm * aspect;  // 👈 mantiene proporción
      }
    } catch {}
  }
  const marginMm = 10;

  let y = 0;
  let first = true;
  while (y < canvas.height) {
    const sliceHeight = Math.min(pageHeightPx, canvas.height - y);
    const pageCanvas = sliceCanvas(canvas, y, sliceHeight);
    const pageImgData = pageCanvas.toDataURL("image/png");

    if (!first) pdf.addPage();
    first = false;

    const renderH = sliceHeight * ratio;
    const yOffsetMm = renderH < pdfH ? (pdfH - renderH) / 2 : 0;

    pdf.addImage(pageImgData, "PNG", 0, yOffsetMm, pdfW, renderH);

    // Estampar la firma en cada página (una sola, con tamaño consistente)
    if (firma) {
      const firmaX = pdfW - firmaWidthMm - marginMm;
      const firmaY = pdfH - firmaHeightMm - marginMm;
      pdf.addImage(firma, "PNG", firmaX, firmaY, firmaWidthMm, firmaHeightMm);
    }

    y += sliceHeight;
  }

  return pdf.output("blob");
};


  const uploadToServer = async (blob) => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd = String(hoy.getDate()).padStart(2, "0");
    const hh = String(hoy.getHours()).padStart(2, "0");
    const mi = String(hoy.getMinutes()).padStart(2, "0");
    const ss = String(hoy.getSeconds()).padStart(2, "0");

    const numero = despacho?.Numero || despacho?.Id || "sin_numero";
    const providerName =
      proveedor?.Nombre?.toString()?.trim() ||
      proveedor?.RazonSocial?.toString()?.trim() ||
      "generico";

    const filename = `orden-despacho-${numero}-${yyyy}${mm}${dd}-${hh}${mi}${ss}.pdf`;

    const fd = new FormData();
    fd.append("provider", providerName);
    fd.append("file", new File([blob], filename, { type: "application/pdf" }));

    const res = await fetch("/api/utils/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || "Error de subida");
    return data.url; // /api/upload/{provider}/{filename}
  };

  // Auto-guardado apenas aparece (con anti-doble)
  useEffect(() => {
    if (!componentRef.current) return;
    if (!Array.isArray(productos) || productos.length === 0) return;
    if (didSaveRef.current) return;

    if (typeof window !== "undefined") {
      if (!window.__savedOrders) window.__savedOrders = new Set();
      if (window.__savedOrders.has(saveKey)) return;
      window.__savedOrders.add(saveKey);
    }

    didSaveRef.current = true;

    (async () => {
      try {
        setSaving(true);
        await waitForImages(componentRef.current);
        await new Promise((r) => setTimeout(r, 0)); // asegurar layout estable
        const blob = await generatePdfBlob();
        const url = await uploadToServer(blob);
        setServerUrl(url);
      } catch (e) {
        console.error("Auto-guardado PDF falló:", e);
      } finally {
        setSaving(false);
      }
    })();
  }, [productos, saveKey]);

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="mx-auto w-full max-w-screen-lg px-2 sm:px-4">
        <div className="flex gap-2 justify-center items-center mb-4 no-print">
          {/* Botón de impresión opcional */}
          <ReactToPrint
            trigger={() => (
              <Button className="bg-blue-500 text-white" disabled={saving}>
                <Printer className="mr-2 h-4 w-4" /> Imprimir Orden
              </Button>
            )}
            content={() => componentRef.current}
            pageStyle={`@page { size: A4 portrait; margin: 12mm; } @media print { html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}
          />
        </div>

        {saving && <p className="text-center text-sm mb-4">Guardando PDF…</p>}
        {serverUrl && (
          <p className="text-center text-sm mb-4">
            PDF guardado:{" "}
            <a className="underline" href={serverUrl} target="_blank" rel="noreferrer">
              {serverUrl}
            </a>
          </p>
        )}

        {/* Lo que capturamos y guardamos */}
        <OrdenAImprimir
          ref={componentRef}
          firma={firma}
          despacho={despacho}
          productos={productos}
          empresa={empresa}
          proveedor={proveedor}
        />
      </div>
    </div>
  );
}
