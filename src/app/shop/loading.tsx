export default function ShopLoading() {
  return (
    <div className="bg-[#f8f4f1] min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <div className="h-4 w-40 rounded-full bg-[#efe6e0] animate-pulse" />

        <div className="mt-6 space-y-3">
          <div className="h-9 w-64 rounded-md bg-[#efe6e0] animate-pulse" />
          <div className="h-4 w-[28rem] max-w-full rounded-full bg-[#efe6e0]/80 animate-pulse" />
          <div className="h-3 w-20 rounded-full bg-[#efe6e0]/80 animate-pulse" />
        </div>

        <div className="mt-8 flex gap-3 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 shrink-0 rounded-full bg-[#efe6e0] animate-pulse"
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="h-9 w-28 rounded-md bg-[#efe6e0] animate-pulse" />
          <div className="h-9 w-36 rounded-md bg-[#efe6e0] animate-pulse" />
        </div>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] w-full rounded-lg bg-[#efe6e0] animate-pulse" />
              <div className="h-3 w-3/4 rounded-full bg-[#efe6e0] animate-pulse" />
              <div className="h-3 w-1/2 rounded-full bg-[#efe6e0]/80 animate-pulse" />
              <div className="h-3 w-1/3 rounded-full bg-[#efe6e0] animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
