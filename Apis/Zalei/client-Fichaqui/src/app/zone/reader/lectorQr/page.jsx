"use client";
import { useState, useEffect, useRef } from "react";
import CardEmployed from "@/components/component/card-employed";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/component/alert";
import { ExpandIcon } from "lucide-react";
import AttendanceFichadaInput from "@/components/component/zone/attendance/AttendanceFichadaInput";




export default function Page() {

  return (
    <AttendanceFichadaInput></AttendanceFichadaInput>
  )
}
