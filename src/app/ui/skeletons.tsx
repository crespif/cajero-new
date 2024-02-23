// Loading animation
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export function SelectSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
    >
      <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
        <div className="h-7 w-20 rounded-md bg-gray-200" />
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="mt-5">
      <h2 className="text-center">Cargando...</h2>
      <div
        className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
      >
        {
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center my-2 justify-center truncate rounded-xl bg-white px-2 py-2">
              <div className="h-5 w-60 rounded-md bg-gray-200" />
            </div>
          ))  
        }
      
      </div>
    </div>
  );
}