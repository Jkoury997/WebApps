import { Button } from "@/components/ui/button"
import { ArrowRight, UserPlus, QrCode, MapPin, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <a className="flex items-center justify-center" href="#">
          <Clock className="h-6 w-6 text-green-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900">Fichaqui</span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" className="text-gray-700 hover:text-green-600">
            Características
          </Button>
          <Button variant="ghost" className="text-gray-700 hover:text-green-600">
            Precios
          </Button>
          <Button variant="ghost" className="text-gray-700 hover:text-green-600">
            Contacto
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Control de Presentismo Simplificado
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    Ficha fácil y rápido con Fichaqui. Nuestra solución de QR hace el control de asistencia más eficiente que nunca.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/login">
                    <Button  className="bg-green-600 hover:bg-green-700">
                    Iniciar Sesión
                    <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/auth/register">
<Button variant="outline">
  Crear Cuenta
  <UserPlus className="ml-2 h-4 w-4" />
</Button>
</Link>
<Link href="/zone/reader">
<Button variant="secondary">
  Zona
  <MapPin className="ml-2 h-4 w-4" />
</Button>
</Link>


                </div>
              </div>
              <img
                alt="Control de presentismo con Fichaqui"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="550"
                width="750"
                src="https://uxwxqvbqvhbqbdqhvwjz.public.blob.vercel-storage.com/qr-code-scan-5Yx7qVUYSUDUCWXmLPQVVVZBXZLDLo.jpg"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              ¿Por qué elegir Fichaqui?
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-green-600 p-3 rounded-full">
                  <QrCode className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Fichaje Rápido</h3>
                <p className="text-gray-500">Escanea y ficha en segundos. Optimiza el proceso de registro.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-green-600 p-3 rounded-full">
                  <ArrowRight className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Fácil de Usar</h3>
                <p className="text-gray-500">Interfaz intuitiva para empleados y administradores.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="bg-green-600 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Múltiples Zonas</h3>
                <p className="text-gray-500">Gestiona la asistencia en diferentes ubicaciones con facilidad.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 Fichaqui. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Términos de Servicio
          </a>
          <a className="text-xs hover:underline underline-offset-4" href="#">
            Privacidad
          </a>
        </nav>
      </footer>
    </div>
  )
}