import Link from "next/link"
import {CalendarIcon,CheckIcon,ClockIcon,MailsIcon} from "lucide-react"

export function HomePage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <header className="bg-gray-900 text-white py-4 md:py-6 px-4 md:px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <ClockIcon className="h-6 w-6 mr-2" />
            <h1 className="text-2xl font-bold">Fichaqui - Zalei</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              className="inline-flex items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              href="/auth/login">
              Ingresar
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-md border border-gray-200 border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-800"
              href="/auth/register">
              Crear Cuenta
            </Link>
            <Link
              className="inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-800"
              href="/zone/configure">
              Zona
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gray-100 py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  Gestiona la asistencia de tu equipo con facilidad
                </h2>
                <p className="mt-4 text-lg text-gray-500">
                  Nuestra aplicación de seguimiento de asistencia hace que sea sencillo llevar un registro de las horas de trabajo de tu equipo, el tiempo libre y más.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  href="/auth/login">
                  Ingresar
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-md border border-gray-200 border-transparent bg-white px-4 py-2 text-sm font-medium text-indigo-600 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:border-gray-800"
                  href="/auth/register">
                  Crear Cuenta
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-md border border-gray-200 border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:border-gray-800"
                  href="/zone/configure">
                  Zona
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Características Clave</h2>
                <p className="mt-4 text-lg text-gray-500">
                  Nuestra aplicación de seguimiento de asistencia ofrece una gama de características para ayudarte a gestionar la asistencia de tu equipo de manera efectiva.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-lg p-6">
                  <ClockIcon className="h-8 w-8 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Seguimiento de Tiempo</h3>
                  <p className="text-gray-500">Lleva un registro fácil de las horas de trabajo y la asistencia de tu equipo.</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-6">
                  <CalendarIcon className="h-8 w-8 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Gestión de Permisos</h3>
                  <p className="text-gray-500">Gestiona el tiempo libre y las solicitudes de vacaciones de tu equipo.</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-6">
                  <CheckIcon className="h-8 w-8 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Informes</h3>
                  <p className="text-gray-500">Genera informes detallados sobre la asistencia de tu equipo.</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-6">
                  <MailsIcon className="h-8 w-8 text-indigo-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Notificaciones</h3>
                  <p className="text-gray-500">Recibe alertas para eventos importantes relacionados con la asistencia.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-gray-900 text-white py-6 px-4 md:px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm mb-4 md:mb-0">© 2024 Attendance Tracker. Todos los derechos reservados.</p>
          <div className="flex items-center space-x-4">
            <Link className="text-sm hover:underline" href="#">
              Política de Privacidad
            </Link>
            <Link className="text-sm hover:underline" href="#">
              Términos de Servicio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
