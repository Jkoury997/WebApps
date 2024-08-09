import React from 'react';
import { UserIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

export default function CardEmployed({ employee, employeeDetails }) {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6 md:max-w-lg md:flex md:items-center md:p-8 dark:bg-gray-800">
      <div className="flex flex-col items-center">
        <div className="mb-4">
          <div className="bg-gray-100 rounded-full p-6 dark:bg-gray-700">
            <UserIcon className="h-20 w-20 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold mb-2 dark:text-gray-200">{`${employee.firstName.toUpperCase()} ${employee.lastName.toUpperCase()}`}</h1>
          <div className="text-gray-500 dark:text-gray-400">{employee.email}</div>
          <div className="text-gray-500 dark:text-gray-400">{employee.dni}</div>
          
          <div className="flex items-center justify-center space-x-2 text-green-500 dark:text-green-400">
            <CheckCircleIcon className="h-5 w-5" />
            <span>Hora de entrada <p className='hidden'>{new Date(employeeDetails.entryTime).toLocaleTimeString()}</p></span>
          </div>

          {employeeDetails.exitTime && (
            <div className="flex items-center justify-center space-x-2  text-green-500 dark:text-green-400">
              <XCircleIcon className="h-5 w-5" />
              <span>Hora de salida <p className='hidden'>{new Date(employeeDetails.exitTime).toLocaleTimeString()}</p></span>
            </div>
          )}

          <div className="text-gray-500 dark:text-gray-400">
            Necesitas escanear tu código QR de tu app para marcar la hora de entrada y salida.
          </div>
        </div>
      </div>
    </div>
  );
}
