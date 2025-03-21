"use client"

import ZoneCreationForm from "@/components/component/mantenimiento/zona-create"
import { useSearchParams } from "next/navigation";

export default function Page() {

    const searchParams = useSearchParams();
    const zona = searchParams.get("zona");

    return(
        <ZoneCreationForm></ZoneCreationForm>
    )
}