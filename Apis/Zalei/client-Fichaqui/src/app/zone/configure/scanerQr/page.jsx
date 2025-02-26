"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import QRScanner from "@/components/component/QRScanner";
import FingerprintJS from "@fingerprintjs/fingerprintjs"; // Importar FingerprintJS
import { ExpandIcon } from 'lucide-react';
import CameraZoneConfig from "@/components/component/zone/configuration/CameraZoneConfig";




export default function Page() {


  return (
    <CameraZoneConfig></CameraZoneConfig>
  );
}
