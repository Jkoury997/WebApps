"use client"
import ListWarehouse from "@/components/component/list-warehouse";

export default function Page(){
    const almacenesData = [
        { codigo: "ALM001", nombre: "Almacén Central" },
        { codigo: "ALM002", nombre: "Almacén Norte" },
        { codigo: "ALM003", nombre: "Almacén Sur" },
        { codigo: "ALM004", nombre: "Almacén Este" },
        { codigo: "ALM005", nombre: "Almacén Oeste" },
      ]
    return(
        <ListWarehouse almacenes={almacenesData}></ListWarehouse>
    )
}