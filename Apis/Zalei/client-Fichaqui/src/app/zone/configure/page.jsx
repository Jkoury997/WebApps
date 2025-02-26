"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { VideoIcon,ScanBarcodeIcon } from 'lucide-react';
import ScanModeSelector from '@/components/component/zone/selector-scanner';


export default function Page() {

  
    return (

    <ScanModeSelector></ScanModeSelector>
    );
  }