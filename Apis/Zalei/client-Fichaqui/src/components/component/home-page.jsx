import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, QrCode, Smartphone, Users } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

const colors = {
  primary: "#98D8AA",      // Verde pastel principal
  secondary: "#B5EAD7",    // Verde pastel claro
  accent: "#57A773",       // Verde pastel intenso
  background: "#F0FFF4",   // Verde muy claro para fondo
  text: "#2F4858",         // Azul oscuro para texto
  muted: "#C7E8CA"         // Verde pastel suave
};


export default function HomePage() {

  return (
    <div className="flex flex-col min-h-screen bg-[${colors.background}] text-[${colors.text}]">
      <header className="sticky top-0 z-50 w-full border-b bg-[${colors.background}]/95 backdrop-blur supports-[backdrop-filter]:bg-[${colors.background}]/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <a className="mr-6 flex items-center space-x-2" href="/">
              <QrCode className="h-6 w-6 text-[${colors.primary}]" />
              <span className="hidden font-bold sm:inline-block">Fichaqui Zalei</span>
            </a>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <a className="transition-colors hover:text-[${colors.primary}]" href="#features">
                Características
              </a>
              <a className="transition-colors hover:text-[${colors.primary}]" href="#benefits">
                Beneficios
              </a>
              {/* <a className="transition-colors hover:text-[${colors.primary}]" href="#testimonials">
                Testimonios
              </a> */}
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Link href="/zone/reader" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Zona
            </Link>
            <Link href="/auth/login" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 ml-auto">
              Iniciar sesión
            </Link>
            <Link href="/auth/register" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
              Registrarse
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-[${colors.background}]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-[${colors.primary}]">
                  Simplifica tu sistema de fichaje con QR
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Gestiona la asistencia de tus empleados de manera eficiente y segura con nuestro innovador sistema de fichaje por QR.
                </p>
              </div>
              <div className="space-x-4">
                <Button size="lg" className={`bg-[${colors.primary}] text-[${colors.background}] hover:bg-[${colors.accent}]`}>Prueba gratis</Button>
                <Button variant="outline" size="lg" className={`border-[${colors.primary}] text-[${colors.primary}] hover:bg-[${colors.primary}]/10`}>
                  Saber más
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-[${colors.secondary}]/10">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-[${colors.secondary}]">Características principales</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className={`bg-[${colors.background}] border-[${colors.secondary}]/20`}>
                <CardHeader>
                  <QrCode className="w-8 h-8 mb-2 text-[${colors.secondary}]" />
                  <CardTitle className="text-[${colors.secondary}]">Fichaje por QR</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Escanea un código QR para registrar entradas y salidas de forma rápida y segura.</p>
                </CardContent>
              </Card>
              <Card className={`bg-[${colors.background}] border-[${colors.secondary}]/20`}>
                <CardHeader>
                  <Clock className="w-8 h-8 mb-2 text-[${colors.secondary}]" />
                  <CardTitle className="text-[${colors.secondary}]">Tiempo real</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Monitorea la asistencia y las horas trabajadas en tiempo real desde cualquier dispositivo.</p>
                </CardContent>
              </Card>
              <Card className={`bg-[${colors.background}] border-[${colors.secondary}]/20`}>
                <CardHeader>
                  <Smartphone className="w-8 h-8 mb-2 text-[${colors.secondary}]" />
                  <CardTitle className="text-[${colors.secondary}]">App móvil</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Accede a todas las funciones desde nuestra aplicación móvil intuitiva y fácil de usar.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="benefits" className="w-full py-12 md:py-24 lg:py-32 bg-[${colors.background}]">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-[${colors.accent}]">Beneficios para tu empresa</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-8 h-8 text-[${colors.accent}]" />
                <div>
                  <h3 className="font-bold text-[${colors.accent}]">Ahorro de tiempo</h3>
                  <p>Reduce el tiempo dedicado a la gestión de asistencia y nóminas.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-8 h-8 text-[${colors.accent}]" />
                <div>
                  <h3 className="font-bold text-[${colors.accent}]">Mayor precisión</h3>
                  <p>Elimina errores humanos en el registro de horas trabajadas.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-8 h-8 text-[${colors.accent}]" />
                <div>
                  <h3 className="font-bold text-[${colors.accent}]">Cumplimiento normativo</h3>
                  <p>Asegura el cumplimiento de las regulaciones laborales vigentes.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-[${colors.primary}]/10">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-[${colors.primary}]">Lo que dicen nuestros clientes</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className={`bg-[${colors.background}] border-[${colors.primary}]/20`}>
                <CardContent className="mt-4">
                  <p className="mb-4">"Este sistema ha revolucionado la forma en que gestionamos la asistencia en nuestra empresa. Es fácil de usar y nos ahorra mucho tiempo."</p>
                  <p className="font-semibold text-[${colors.primary}]">María G. - Gerente de RRHH</p>
                </CardContent>
              </Card>
              <Card className={`bg-[${colors.background}] border-[${colors.primary}]/20`}>
                <CardContent className="mt-4">
                  <p className="mb-4">"La implementación fue sencilla y el soporte técnico es excelente. Nuestros empleados se adaptaron rápidamente al nuevo sistema."</p>
                  <p className="font-semibold text-[${colors.primary}]">Carlos R. - Director de Operaciones</p>
                </CardContent>
              </Card>
              <Card className={`bg-[${colors.background}] border-[${colors.primary}]/20`}>
                <CardContent className="mt-4">
                  <p className="mb-4">"Gracias a este sistema, hemos mejorado significativamente la precisión de nuestros registros de horas trabajadas. Lo recomiendo totalmente."</p>
                  <p className="font-semibold text-[${colors.primary}]">Ana L. - Propietaria de Pyme</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section> */}
      </main>
      <footer className="w-full border-t py-6 bg-[${colors.background}]">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-[${colors.muted}] md:text-left">
            © 2023 QR Fichaje. Todos los derechos reservados.
          </p>
          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm underline hover:text-[${colors.primary}]">
              Política de privacidad
            </a>
            <a href="#" className="text-sm underline hover:text-[${colors.primary}]">
              Términos de servicio
            </a>
            <a href="#" className="text-sm underline hover:text-[${colors.primary}]">
              Contacto
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}