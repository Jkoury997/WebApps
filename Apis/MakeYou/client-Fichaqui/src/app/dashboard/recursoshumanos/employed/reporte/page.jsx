"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Timer,
  ArrowRightLeft,
  AlertTriangle,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

const attendanceData = [
  {
    date: new Date(2023, 4, 1),
    checkIn: "09:00",
    checkOut: "18:00",
    status: "Presente",
    hoursWorked: 9,
    checkInLocation: "Oficina Principal",
    checkOutLocation: "Oficina Principal",
    zoneMovements: [
      { from: "Zona A", to: "Zona B" },
      { from: "Zona B", to: "Zona C" },
      { from: "Zona C", to: "Zona A" },
    ],
    isIrregular: false,
  },
  {
    date: new Date(2023, 4, 2),
    checkIn: "09:30",
    checkOut: "18:15",
    status: "Tarde",
    hoursWorked: 8.75,
    checkInLocation: "Sucursal Norte",
    checkOutLocation: "Sucursal Norte",
    zoneMovements: [
      { from: "Zona X", to: "Zona Y" },
      { from: "Zona Y", to: "Zona Z" },
    ],
    isIrregular: true,
  },
  {
    date: new Date(2023, 4, 3),
    checkIn: "",
    checkOut: "",
    status: "Ausente",
    hoursWorked: 0,
    checkInLocation: "",
    checkOutLocation: "",
    zoneMovements: [],
    isIrregular: false,
  },
  {
    date: new Date(2023, 4, 4),
    checkIn: "08:55",
    checkOut: "17:50",
    status: "Presente",
    hoursWorked: 8.92,
    checkInLocation: "Oficina Principal",
    checkOutLocation: "Oficina Principal",
    zoneMovements: [
      { from: "Zona A", to: "Zona C" },
      { from: "Zona C", to: "Zona B" },
      { from: "Zona B", to: "Zona A" },
    ],
    isIrregular: false,
  },
  {
    date: new Date(2023, 4, 5),
    checkIn: "09:05",
    checkOut: "18:00",
    status: "Presente",
    hoursWorked: 8.92,
    checkInLocation: "Trabajo Remoto",
    checkOutLocation: "Trabajo Remoto",
    zoneMovements: [],
    isIrregular: false,
  },
];

export default function PersonalAttendanceReport() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [fechaInicio, setFechaInicio] = useState(
    format(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1),
      "yyyy-MM-dd"
    )
  );
  const [fechaFin, setFechaFin] = useState(
    format(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0),
      "yyyy-MM-dd"
    )
  );
  const [employee, setEmployee] = useState(null);
  const [asistenciaDiaria, setAsistenciaDiaria] = useState(null);
  const [estadisticasTrabajo,setEstadisticasTrabajo]= useState(null);
  const [lugaresfrecuentes,setLugaresfrecuentes]= useState(null);
  const [movimientosZonas,setMovimientosZonas]= useState(null);


  lugaresfrecuentes

  const searchParams = useSearchParams();
  const userId = searchParams.get("userId"); // Obtiene el userId desde la URL

  const fetchUserDetails = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/auth/info/user?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user details");

      const employeeData = await response.json();
      console.log(employeeData);
      setEmployee(employeeData);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const fetchAsistenciaDiaria = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/qrfichaqui/metrics/asistenciadiaria?userId=${userId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
      if (!response.ok) throw new Error("Failed to fetch attendance details");

      const attendanceData = await response.json();
      console.log(attendanceData.asistencia);
      setAsistenciaDiaria(attendanceData.asistencia);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const handleMonthChange = (value) => {
    const newDate = new Date(value);
    setSelectedMonth(newDate);

    const inicio = format(
      new Date(newDate.getFullYear(), newDate.getMonth(), 1),
      "yyyy-MM-dd"
    );
    const fin = format(
      new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0),
      "yyyy-MM-dd"
    );
    console.log(inicio, fin);

    setFechaInicio(inicio);
    setFechaFin(fin);
  };

  const fetchEstadisticasTrabajo = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/qrfichaqui/metrics/estadisticastrabajos?userId=${userId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
      if (!response.ok) throw new Error("Failed to fetch attendance details");

      const estadisticasTrabajo = await response.json();
      console.log(estadisticasTrabajo);
      setEstadisticasTrabajo(estadisticasTrabajo);
    } catch {
      console.error("Error:", error.message);
    }
  };

  const fetchLugaresFrecuentes = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/qrfichaqui/metrics/lugaresfrecuentes?userId=${userId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
      if (!response.ok) throw new Error("Failed to fetch lugares frecuentes");

      const lugaresfrecuentes = await response.json();
      console.log(lugaresfrecuentes);
      setLugaresfrecuentes(lugaresfrecuentes);
    } catch {
      console.error("Error:", error.message);
    }
  };

  const fetchMovimientosZonas = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `/api/qrfichaqui/metrics/movimientoszonas?userId=${userId}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
      if (!response.ok) throw new Error("Failed to fetch movimientos zonas");

      const movimientosZonas = await response.json();
      console.log("Movimet6os: " ,movimientosZonas);
      setMovimientosZonas(movimientosZonas);
    } catch {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchAsistenciaDiaria();
    fetchEstadisticasTrabajo();
    fetchLugaresFrecuentes();
    fetchMovimientosZonas()
  }, [fechaInicio, fechaFin]);

  const filteredAttendance = attendanceData.filter(
    (record) =>
      record.date.getMonth() === selectedMonth.getMonth() &&
      record.date.getFullYear() === selectedMonth.getFullYear()
  );

  const totalDays = filteredAttendance.length;
  const presentDays = filteredAttendance.filter(
    (record) => record.status === "Presente"
  ).length;
  const lateDays = filteredAttendance.filter(
    (record) => record.status === "Tarde"
  ).length;
  const absentDays = filteredAttendance.filter(
    (record) => record.status === "Ausente"
  ).length;
  const totalHoursWorked = filteredAttendance.reduce(
    (sum, record) => sum + record.hoursWorked,
    0
  );
  const averageWorkTime = totalHoursWorked / (presentDays + lateDays);
  const irregularShifts = filteredAttendance.filter(
    (record) => record.isIrregular
  ).length;

  const getStatusColor = (status) => {
    switch (status) {
      case "Normal":
        return "bg-green-500";
      case "Tarde":
        return "bg-yellow-500";
      case "Automática":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getFrequentLocations = (type) => {
    const locationCounts = filteredAttendance.reduce((acc, record) => {
      const location =
        type === "checkIn" ? record.checkInLocation : record.checkOutLocation;
      if (location) {
        acc[location] = (acc[location] || 0) + 1;
      }
      return acc;
    }, {});

    return Object.entries(locationCounts)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

  const getZoneMovements = () => {
    const movementCounts = filteredAttendance
      .flatMap((record) => record.zoneMovements)
      .reduce((acc, movement) => {
        const key = `${movement.from}-${movement.to}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

    return Object.entries(movementCounts)
      .map(([key, count]) => {
        const [from, to] = key.split("-");
        return { from, to, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const frequentCheckInLocations = getFrequentLocations("checkIn");
  const frequentCheckOutLocations = getFrequentLocations("checkOut");
  const frequentZoneMovements = getZoneMovements();

  return (
    <div className="container mx-auto px-2 py-8 max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">
        Reporte de Asistencia Personal
      </h1>
      {employee ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {employee.firstName} {employee.lastName}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Email: {employee.email}
            </p>
            <p className="text-sm text-muted-foreground">Dni: {employee.dni}</p>
            <p className="text-sm text-muted-foreground">Id: {employee._id}</p>
          </CardContent>
        </Card>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="col-span-1 md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mes</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Select
              value={format(selectedMonth, "yyyy-MM")}
              onValueChange={(value) => handleMonthChange(value)}
            >
              <SelectTrigger>
                <SelectValue>{format(selectedMonth, "MMMM yyyy")}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => new Date(2024, i, 1)).map(
                  (date) => (
                    <SelectItem
                      key={date.toISOString()}
                      value={format(date, "yyyy-MM")}
                    >
                      {format(date, "MMMM yyyy")}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        {estadisticasTrabajo ? (
            <>
            
                    <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Días Trabajados
                      </CardTitle>

                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {estadisticasTrabajo.diasTrabajados}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Horas Trabajadas
                      </CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {estadisticasTrabajo.horasTotales
                        } h
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Tiempo Promedio
                      </CardTitle>
                      <Timer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {estadisticasTrabajo.horasPromedio} h
                      </div>
                    </CardContent>
                  </Card>
                  </>
        ) : (
            <p>Cargando estadisticas de trabajo...</p>
        ) }

      </div>

      {/* Additional Components for Locations and Table can be included here */}
      {lugaresfrecuentes ? (
      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Lugares de Entrada Frecuentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {lugaresfrecuentes.lugaresEntrada.map((location) => (
                <li
                  key={location.id}
                  className="flex items-center justify-between mb-2"
                >
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {location.nombre}
                  </span>
                  <Badge variant="outline">{location.frecuencia}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Lugares de Salida Frecuentes
            </CardTitle>
          </CardHeader>
          <CardContent>
          <ul>
              {lugaresfrecuentes.lugaresSalida.map((location) => (
                <li
                  key={location.id}
                  className="flex items-center justify-between mb-2"
                >
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    {location.nombre}
                  </span>
                  <Badge variant="outline">{location.frecuencia}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
      ) : (
        <p>Cargando lugares frecuentes...</p>
      ) }


      {movimientosZonas ? (
        <div className="grid gap-4 md:grid-cols-2 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Movimientos entre Zonas Frecuentes</CardTitle>
          </CardHeader>
          <CardContent>
          <ul>
  {movimientosZonas.map((movement, index) => (
    <li key={index} className="flex items-center justify-between mb-2">
      <span className="flex items-center">
        <ArrowRightLeft className="h-4 w-4 mr-2 text-muted-foreground" />
        {movement.zonaEntrada.nombre} → {movement.zonaSalida.nombre}
      </span>
      <Badge variant="outline">{movement.frecuencia}</Badge>
    </li>
  ))}
</ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Turnos Irregulares - 9 a 20 hs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
                Total de turnos irregulares
              </span>
              <Badge variant="outline" className="bg-yellow-100">{irregularShifts}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Los turnos irregulares pueden indicar cambios en el horario habitual o situaciones excepcionales.
            </p>
          </CardContent>
        </Card>
      </div>

      ) : (
        <p>Cargando movmientos zonas ...</p>
      )}
    

      {asistenciaDiaria ? (
        <Card>
          <CardHeader>
            <CardTitle>Detalle de Asistencia</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="hidden sm:table-cell">Entrada</TableHead>
                  <TableHead className="hidden sm:table-cell">Salida</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Horas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(asistenciaDiaria).map(
                  ([date, record], index) => (
                    <TableRow key={index}>
                      <TableCell>{date}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(record.primeraEntrada).toLocaleTimeString() ||
                          "-"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(record.ultimaSalida).toLocaleTimeString() ||
                          "-"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(
                            record.salidaAutomatica ? "Automática" : "Normal"
                          )}
                        >
                          {record.salidaAutomatica ? "Automática" : "Normal"}
                        </Badge>
                      </TableCell>
                      <TableCell >
                        {parseFloat(record.horasTrabajadas).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <p>Cargando datos de asistencia...</p>
      )}
    </div>
  );
}
