import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserCheck, Clock, BarChart, Shield, Users, LogIn, UserPlus, Menu, AlarmClockIcon, WarehouseIcon } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function Homepage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <header className="px-4 lg:px-6 h-auto lg:h-16 flex flex-wrap items-center justify-between border-b border-blue-100 dark:border-gray-700">
        <Link className="flex items-center justify-center py-4 lg:py-0" href="#">
          <AlarmClockIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="ml-2 text-lg font-bold text-blue-800 dark:text-blue-200">Fichaqui - Make You S.R.L.</span>
        </Link>
        <div className="flex items-center lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
            <Menu className="h-6 w-6 text-blue-800 dark:text-blue-200" />
          </button>
        </div>
        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row w-full lg:w-auto items-start lg:items-center gap-4 py-4 lg:py-0`}>

          <div className="flex flex-row gap-2 w-full lg:w-auto">
          <Link  href="/auth/login">
            <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
              <LogIn className="mr-2 h-4 w-4" />
              Ingresar
            </Button>
            </Link>
            <Link  href="/auth/register">
            <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
              <UserPlus className="mr-2 h-4 w-4" />
              Crear Cuenta
            </Button>
            </Link>
            <Link  href="/zone/configure">
            <Button size="sm" className="flex-1 lg:flex-none">
              <WarehouseIcon className="mr-2 h-4 w-4" />
              Zona
            </Button>
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700">
          <div className="container px-4 md:px-6 flex flex-col md:flex-row items-center">
            <div className="flex flex-col items-center md:items-start space-y-4 text-center md:text-left text-white md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                Gestión de Asistencia Inteligente
              </h1>
              <p className="max-w-[600px] text-zinc-200 text-sm sm:text-base md:text-lg">
                Optimiza el control de asistencia de tu personal con nuestra solución innovadora y eficiente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">

                <Link  href="/auth/login"><Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">Ingresar</Button></Link>
                <Link  href="/auth/register"><Button size="md" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto">Crear Cuenta</Button></Link>
                <Link  href="/zone/configure"><Button size="md" className="bg-white text-blue-600 hover:bg-blue-50 w-full sm:w-auto ">Zona</Button></Link>

              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Gestión de Asistencia"
                className="rounded-lg shadow-2xl max-w-full h-auto hidden"
                width={400}
                height={400}
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-center mb-8 md:mb-12 text-blue-800 dark:text-blue-200">
              Características Principales
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <Clock className="h-12 w-12 mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200">Control en Tiempo Real</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Monitorea la asistencia de tu equipo al instante.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <BarChart className="h-12 w-12 mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200">Reportes Detallados</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Genera informes completos para una mejor toma de decisiones.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <Shield className="h-12 w-12 mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200">Seguridad Avanzada</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Protege los datos de tu empresa con nuestra tecnología segura.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
                <UserCheck className="h-12 w-12 mb-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-200">Fácil de Usar</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Interfaz intuitiva para todos los niveles de usuarios.</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-50 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tighter text-center mb-8 md:mb-12 text-blue-800 dark:text-blue-200">
              Marcas con las que Trabajamos
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center">
              <div className="bg-white p-4 rounded-lg shadow-md dark:bg-gray-700 flex items-center justify-center w-full h-24">
                <img
                  src="marcela-koury-logo.jpg/?height=80&width=120"
                  alt="Logo Marca 1"
                  className="max-h-16 w-auto"
                  width={120}
                  height={80}
                />
              </div>
              
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-100 dark:bg-gray-800">
        <p className="text-xs text-gray-600 dark:text-gray-400">© 2024 Fichaqui. Todos los derechos reservados.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6 ">
          <Link className="text-xs hover:underline underline-offset-4 text-gray-600 dark:text-gray-400 hidden" href="#">
            Términos de Servicio
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-gray-600 dark:text-gray-400 hidden" href="#">
            Privacidad
          </Link>
        </nav>
      </footer>
    </div>
  )
}