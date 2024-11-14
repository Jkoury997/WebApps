"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BadgeCheck, Mail, User, CreditCard, Users, PersonStanding } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast"; // Importa el hook de toast


export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast(); // Usa el hook para mostrar el toast

  const searchParams = typeof window !== "undefined" ? useSearchParams() : null;
  const userId = searchParams ? searchParams.get("userId") : null;

  const fetchUserDetails = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/auth/info/user?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user details");

      const userData = await response.json();
      setUser(userData);
      setEditableUser(userData); // Sincronizar `editableUser` con `user`
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEditableUser({ ...editableUser, [id]: value });
  };

  const handleGenderChange = (value) => {
    setEditableUser({ ...editableUser, sex: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/auth/user/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editableUser),
      });

      const responseData = await response.json();

      if (response.ok) {
        setUser(editableUser);
        setIsEditing(false);
        toast({
          title: "Usuario actualizado",
          description: "Los datos del usuario han sido guardados exitosamente.",
          variant: "success",
        }); // Muestra el toast de éxito
      } else {
        console.error("Error al actualizar el usuario:", responseData.error);
        toast({
          title: "Error al actualizar",
          description: "Hubo un problema al guardar los datos del usuario.",
          variant: "destructive",
        }); // Muestra el toast de error
      }
      } catch (error) {
        console.error("Error en la solicitud de actualización:", error.message);
        toast({
          title: "Error de conexión",
          description: "No se pudo conectar con el servidor para actualizar el usuario.",
          variant: "destructive",
        }); // Muestra el toast de error de conexión
      }
      
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Perfil de Usuario</CardTitle>
      </CardHeader>

      {editableUser ? (
        <>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={editableUser.avatar || ""} alt={`${editableUser.firstName} ${editableUser.lastName}`} />
                <AvatarFallback>
                  {editableUser.firstName[0]}
                  {editableUser.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-2xl font-semibold">
                  {editableUser.firstName} {editableUser.lastName}
                </h2>
                <p className="text-muted-foreground">{editableUser.email}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    className="pl-10"
                    value={editableUser.firstName}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    className="pl-10"
                    value={editableUser.lastName}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    className="pl-10"
                    value={editableUser.email}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <div className="relative flex items-center">
                  <PersonStanding className="absolute left-3 w-4 h-4 text-muted-foreground" />
                  <Select
                    value={editableUser.sex}
                    onValueChange={handleGenderChange}
                    disabled={!isEditing}
                    className="pl-10"
                  >
                    <SelectTrigger id="sex" className="w-full pl-10">
                      <SelectValue placeholder="Selecciona el sexo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Masculino</SelectItem>
                      <SelectItem value="Female">Femenino</SelectItem>
                      <SelectItem value="Other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="dni">DNI</Label>
                <div className="relative flex items-center">
                  <CreditCard className="absolute left-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="dni"
                    className="pl-10"
                    value={editableUser.dni}
                    onChange={handleChange}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row justify-end gap-4">
            {isEditing ? (
              <Button className="w-full sm:w-auto" onClick={handleSave}>
                Guardar Cambios
              </Button>
            ) : (
              <Button className="w-full sm:w-auto" onClick={handleEditToggle}>
                <Users className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </CardFooter>
        </>
      ) : (
        <p>Cargando datos del usuario...</p>
      )}
    </Card>
  );
}
