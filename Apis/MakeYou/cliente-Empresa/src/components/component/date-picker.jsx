"use client";
import { useState, useEffect } from "react";
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePicker({
    selectedDate,
    onDateChange,
    title,
    className = "",
}) {
    const [date, setDate] = useState();

    // Actualiza la fecha si el valor externo cambia
    useEffect(() => {
        if (selectedDate !== date) {
            setDate(selectedDate);
        }
    }, [selectedDate]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full md:w-auto justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy") : <span>{title}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                        setDate(newDate);
                        onDateChange(newDate); // Llama al manejador de cambio de fecha
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
