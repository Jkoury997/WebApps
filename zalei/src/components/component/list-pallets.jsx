import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";

export function ListPallets({ pallets }) {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPallets = pallets.filter((pallet) => {
    return (
      pallet.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pallet.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pallet.date.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Card className="border-none">
      <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <CardTitle>Pallets</CardTitle>
          <CardDescription>Manage your pallets and move them between different warehouses.</CardDescription>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full lg:w-auto mt-4 lg:mt-0 lg:ml-auto">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4 lg:mb-0 lg:mr-4 w-full lg:w-auto"
          />
          <Link href={`${pathname}/create`} passHref>
            <Button className="w-full lg:w-auto">Create New Pallet</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Almacen</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPallets.map((pallet) => (
              <TableRow key={pallet.id}>
                <TableCell>{pallet.id}</TableCell>
                <TableCell>{pallet.location}</TableCell>
                <TableCell>{pallet.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <Ellipsis className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Mover</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link href={`${pathname}/create`} passHref>
          <Button className="w-full lg:w-auto">Create New Pallet</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}