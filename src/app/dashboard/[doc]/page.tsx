
import { fetchClient } from "@/app/lib/data"
import { SelectSkeleton } from "@/app/ui/skeletons";
import { Suspense } from 'react';
import SelectSumin from "../select";
import Link from "next/link";

export default async function Dashboard({ params } : { params: {doc: number} }) {
  
  const doc = params.doc;
  
  try {
    const client = await fetchClient(doc);
    if (client.length === 0) {
      throw new Error('Cliente no encontrado');
    }
    return (
      <>
        <div className="grow overflow-auto">
          <Suspense fallback={<SelectSkeleton />}>
            <SelectSumin clientes={client}  />
          </Suspense>
        </div>
        <Link href="/" className="flex items-center w-2/4 justify-center gap-2 self-start rounded-lg bg-blue-500 my-2 py-1 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base m-auto">
          <span>Volver</span>
        </Link>
      </>
    )
  }
  catch (error) {
    return (
      <div>
        <h1>Cliente no encontrado</h1>
        <Link href="/" className="flex items-center w-2/4 justify-center gap-2 self-start rounded-lg bg-blue-500 my-2 py-1 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base m-auto">
          <span>Volver</span>
        </Link>
      </div>
    )
  }
  
  
}