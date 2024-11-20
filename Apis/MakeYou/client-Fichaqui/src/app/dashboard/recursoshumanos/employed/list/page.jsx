"use client"

import { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Edit } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from 'next/link'
import { useToast } from "@/hooks/use-toast" // Importa el hook de toast

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [workGroups, setWorkGroups] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // Controla el diálogo de creación
  const { toast } = useToast() // Usa el hook de toast

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/auth/info/userbyempresa");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Error al obtener los usuarios:", response.statusText);
      }
    } catch (error) {
      console.error("Error al hacer la petición:", error);
    }
  };

  const fetchWorkGroups = async () => {
    try {
      const response = await fetch("/api/qrfichaqui/workgroup/list");
      if (response.ok) {
        const data = await response.json();
        setWorkGroups(data);
        console.log(data)
      } else {
        console.error("Error al obtener los workGroup:", response.statusText);
      }
    } catch (error) {
      console.error("Error al hacer la petición:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWorkGroups()
  }, []);

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.dni.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchUserExtra = async (userId) => {
    
    try {
      const response = await fetch(`/api/qrfichaqui/userextra/info?userId=${userId}`);

      const responseData = await response.json();

      if (response.ok) {
        return responseData
      } else {
        console.error("Error al actualizar el usuario:", responseData.error);
      }
    } catch (error) {
      console.error("Error en la solicitud de actualización:", error.message);
    }
  }

  const handleEdit = async (userId) => {
    const user = users.find((u) => u._id === userId); // Encuentra al usuario
    setEditingUser({ ...user, workGroupId: '' }); // Establece temporalmente el usuario con un workGroupId vacío
  
    try {
      const userExtra = await fetchUserExtra(userId);
      if (!userExtra) {
        toast({
          title: "Error",
          description: "No se pudo obtener información extra del usuario. Asigna un horario.",
          variant: "destructive",
        });
        setIsCreateDialogOpen(true); // Abre el diálogo de creación
        return;
      }
  
      setEditingUser({ ...user, workGroupId: userExtra.workGroupId });
      setIsEditDialogOpen(true); // Abre el diálogo de edición
    } catch (error) {
      console.error("Error en handleEdit:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al intentar editar el usuario.",
        variant: "destructive",
      });
    }
  };
  
  

  const handleSaveEdit = async () => {

    console.log(editingUser)
    if (!editingUser || !editingUser.workGroupId) {
      toast({
        title: "Error",
        description: "Faltan datos requeridos para actualizar el usuario.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      const response = await fetch(`/api/auth/user/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });
  
      const responseData = await response.json();

      const responseUserExtra = await fetch(`/api/qrfichaqui/userextra/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
      });
  
      if (response.ok &&responseUserExtra.ok ) {
        await fetchUsers();
        await fetchUserExtra(editingUser._id)
        toast({
          title: "Usuario actualizado",
          description: "Los datos del usuario se han modificado correctamente.",
          variant: "success",
        });
      } else {
        console.error("Error al actualizar el usuario:", responseData.error);
        toast({
          title: "Error",
          description: responseData.error || "Hubo un problema al actualizar el usuario.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error en la solicitud de actualización:", error.message);
      toast({
        title: "Error",
        description: "No se pudo actualizar el usuario.",
        variant: "destructive",
      });
    } finally {
      setIsEditDialogOpen(false);
    }
  };

  const handleCreateEdit = async () => {

    if (!editingUser || !editingUser.workGroupId) {
      toast({
        title: "Error",
        description: "Faltan datos requeridos para actualizar el usuario.",
        variant: "destructive",
      });
      return;
    }
  
    console.log(editingUser)
    try {
      const payload = {
        userId: editingUser._id, // Incluye el userId
        workGroupId: editingUser.workGroupId,
      };
  
      const responseUserExtra = await fetch(`/api/qrfichaqui/userextra/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (responseUserExtra.ok) {
        await fetchUsers(); // Recargar lista de usuarios
        toast({
          title: "Usuario actualizado",
          description: "El horario de trabajo se asignó correctamente.",
          variant: "success",
        });
      } else {
        const errorData = await responseUserExtra.json();
        console.error("Error al actualizar el usuario:", errorData.error);
        toast({
          title: "Error",
          description: errorData.error || "Hubo un problema al asignar el horario.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error en la solicitud de actualización:", error.message);
      toast({
        title: "Error",
        description: "No se pudo asignar el horario. Inténtalo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(true);
    }
  };
  


  

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Gestión de Usuarios</h1>
      <div className="relative mb-6 max-w-md mx-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="search"
          placeholder="Buscar usuarios..."
          className="pl-10 pr-4 py-2 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredUsers.map(user => (
          <Card key={user._id} className="flex flex-col justify-between transition-shadow hover:shadow-lg">
            <div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={user.avatarUrl} alt={`Avatar de ${user.firstName}`} />
                    <AvatarFallback>{user.firstName[0] + user.lastName[0]}</AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary" className="mt-1">
                    {user.dni}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-1 text-lg">{user.firstName + " " + user.lastName}</CardTitle>
                <p className="text-sm text-muted-foreground break-words">{user.email}</p>
              </CardContent>
            </div>
            <CardFooter className="bg-muted/50 p-5 flex flex-col">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleEdit(user._id)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Modificar datos
              </Button>
              <Link href={`/dashboard/recursoshumanos/employed/reporte?userId=${user._id}`} className="w-full">
                <Button variant="ghost" className="w-full">
                  Ver Reporte
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
      {filteredUsers.length === 0 && (
        <p className="text-center mt-8 text-muted-foreground">No se encontraron usuarios.</p>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input
                  id="name"
                  value={editingUser.firstName}
                  onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">Apellido</Label>
                <Input
                  id="lastName"
                  value={editingUser.lastName}
                  onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input
                  id="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dni" className="text-right">DNI</Label>
                <Input
                  id="dni"
                  value={editingUser.dni}
                  onChange={(e) => setEditingUser({...editingUser, dni: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Sexo</Label>
                <RadioGroup
                  value={editingUser.sex}
                  onValueChange={(value) => setEditingUser({...editingUser, sex: value})}
                  className="col-span-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Male" id="Male" />
                    <Label htmlFor="Male">Masculino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Female" id="Female" />
                    <Label htmlFor="Female">Femenino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Other" id="Other" />
                    <Label htmlFor="Other">No Binario</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
  <Label className="text-right">Horas de trabajo</Label>
  <select
    value={editingUser.workGroupId._id}
    onChange={(e) => setEditingUser({ ...editingUser, workGroupId: e.target.value })}
    className="col-span-3 p-2 border rounded-md"
  >
   {workGroups.map((workGroup) => (
    <option key={workGroup._id} value={workGroup._id}>
      {workGroup.name}
    </option>
  ))}
  </select>
</div>

            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleSaveEdit}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
          
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Asignar Horario de Trabajo</DialogTitle>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        {workGroups ? (
          <>
            <Label className="text-right">Grupo</Label>
            <select
              value={editingUser?.workGroupId || ''} // Establecer el valor seleccionado
              onChange={(e) =>
                setEditingUser({ ...editingUser, workGroupId: e.target.value }) // Actualizar el workGroupId
              }
              className="col-span-3 p-2 border rounded-md"
            >
              <option value="" disabled>
                Selecciona un grupo
              </option>
              {workGroups.map((workGroup) => (
                <option key={workGroup._id} value={workGroup._id}>
                  {workGroup.name}
                </option>
              ))}
            </select>
          </>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
    </div>
    <DialogFooter>
      <Button
        type="submit"
        onClick={handleCreateEdit}
        disabled={!editingUser?.workGroupId} // Deshabilitar si no hay un grupo seleccionado
      >
        Guardar cambios
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>



    </div>
  )
}
