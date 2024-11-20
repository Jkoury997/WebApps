"use client"; // Esto convierte el componente en un Client Component

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, MapPin, Globe, Phone, Share2, Contact } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import QRCode from "react-qr-code";
import { useRef } from "react";
import { toPng } from "html-to-image";
import "./background.css";

export default function Page() {
  const qrValue = "https://example.com";
  const qrRef = useRef();

  const handleDownloadQR = () => {
    if (qrRef.current) {
      toPng(qrRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "codigo-qr.png";
          link.click();
        })
        .catch((err) => {
          console.error("Error al generar la imagen QR:", err);
        });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Perfil de Jorge Koury",
          text: "Conoce el perfil de Jorge Koury, C.E.O. de nuestra empresa.",
          url: window.location.href,
        })
        .then(() => console.log("Perfil compartido con éxito"))
        .catch((error) => console.error("Error al compartir:", error));
    } else {
      console.log(
        "La funcionalidad de compartir no es compatible en este dispositivo."
      );
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-4 space-y-3">
      <div className="box absolute inset-0 -z-10">
        <div className="wave -one"></div>
        <div className="wave -two"></div>
        <div className="wave -three"></div>
      </div>

      <Card className="w-full max-w-md bg-transparent border-none rounded-3xl text-white text-center mt-8 shadow-none">
        <CardHeader className="flex flex-col items-center">
          <Dialog>
            <DialogTrigger>
              <Avatar className="h-28 w-28 mb-2">
                <AvatarImage src="/marcelakoury.jpg" alt="Profile Image" />
                <AvatarFallback>JK</AvatarFallback>
              </Avatar>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-center">Código QR</DialogTitle>
                <DialogDescription>
                  <div
                    ref={qrRef}
                    className="flex justify-center items-center mt-4"
                  >
                    <QRCode value={qrValue} size={200} />
                  </div>
                  <div className="flex justify-center mt-4">
                    <Button
                      className="bg-pink-400 text-white rounded-3xl"
                      onClick={handleDownloadQR}
                    >
                      Descargar QR
                    </Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <CardTitle>Jorge Koury</CardTitle>
          <Separator className="w-[70%] mt-2" />
          <CardDescription className="text-white">C.E.O.</CardDescription>
        </CardHeader>
      </Card>

      <Card className="w-full max-w-md bg-slate-50 p-6 border-none rounded-3xl text-center">
        <CardContent className="space-y-4">
          <ContactDetail
            icon={<Phone className="text-green-500" />}
            label="Teléfono"
            content="+1 (234) 567-8901"
          />
          <Separator />
          <ContactDetail
            icon={<Mail className="text-gray-500" />}
            label="Correo"
            content="jorge.koury@example.com"
          />
          <Separator />
          <ContactDetail
            icon={<MapPin className="text-red-500" />}
            label="Dirección"
            content="123 Business Street, City, Country"
          />
        </CardContent>
      </Card>

      <Card className="w-full max-w-md border-none shadow-none text-center bg-transparent">
        <div className="flex justify-center space-x-4 py-4">
          <ContactIcon
            href="https://wa.me/1234567890"
            icon={<Phone className="text-black" />}
            color="bg-white"
          />
          <ContactIcon
            href="https://www.example.com"
            icon={<Globe className="text-black" />}
            color="bg-white"
          />
          <ContactIcon
            href="geo:0,0?q=123+Business+Street,+City,+Country"
            icon={<MapPin className="text-black" />}
            color="bg-white"
          />
          <ContactIcon
            href="mailto:jorge.koury@example.com"
            icon={<Mail className="text-black" />}
            color="bg-white"
          />
        </div>
      </Card>

      <div className="fixed inset-x-0 bottom-4 flex justify-center space-x-4">
        <Button
          className="w-[35%] max-w-xs bg-white rounded-3xl text-pink-300"
          variant="primary"
          onClick={handleShare}
        >
          <Share2 className="mr-2" /> Compartir
        </Button>
        <Button
          className="w-[50%] max-w-xs bg-pink-400 rounded-3xl text-white"
          variant="primary"
          onClick={handleShare}
        >
          <Contact className="mr-2" /> Añadir a Contactos
        </Button>
      </div>
    </div>
  );
}

// Componente para cada ícono de contacto
function ContactIcon({ href, icon, color }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact Icon"
    >
      <Avatar
        className={`h-10 w-10 ${color} text-white hover:bg-opacity-90 flex items-center justify-center`}
      >
        {icon}
      </Avatar>
    </a>
  );
}

// Componente para cada detalle de contacto
function ContactDetail({ icon, label, content }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center mt-1">
        <Label className="text-pink-300 font-medium text-md">{label}</Label>
        <p className="text-gray-700">{content}</p>
      </div>
    </div>
  );
}
