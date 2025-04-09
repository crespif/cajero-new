"use client"

import { useRouter } from "next/navigation";
import Dialog from "./dialog";
import { useState } from "react";

export default function ErrorSavePago() {

  const [open, setOpen] = useState(true);

  const router = useRouter();
  
  const handleVolver = () => {
    router.back();
  };

  return (
    <>
      <Dialog open={open} setOpen={() => {setOpen(false); handleVolver()}} />
    </>
  )
}

