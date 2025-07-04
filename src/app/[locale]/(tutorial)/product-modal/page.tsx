import Image from "next/image";

export default function ProductModal() {
  return (
    <div className="flex min-h-dvh w-screen items-center justify-center bg-slate-100">
      <div className="flex flex-col space-x-8 rounded-lg bg-gray-200 px-10 py-10 shadow-xl shadow-neutral-500 md:flex-row">
        {/* Image Container */}
        <div className="flex items-start justify-center">
          <Image
            src="/test/house-evening.jpg"
            height={200}
            width={200}
            alt="house-evening"
            className="mx-auto w-60 rounded-lg object-cover duration-200 hover:scale-105"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          <div className="mt-4 flex md:my-0">
            <div className="rounded-full bg-black px-3 py-1 text-sm font-light text-white">Free Shipping</div>
          </div>

          <div className="max-w-sm text-2xl font-bold">Razer Kraken Kitty Edt Gaming Headset Quartz</div>
          <div className="mb-4 flex flex-col space-y-3 text-center md:text-left">
            <p className="text-xs font-bold line-through">799</p>
            <p className="text-3xl font-bold">$599</p>
            <p className="font-sans text-xs text-gray-500">
              The offer is valid until April 3 or as long as stock lasts!
            </p>
          </div>

          <div className="group">
            <button className="w-full rounded-lg border-b-8 border-b-blue-700 bg-blue-700 text-white transition-all duration-150 group-hover:bg-blue-800 group-hover:shadow-lg">
              <div className="rounded-lg bg-blue-500 px-8 py-4 transition-all duration-150 group-hover:bg-blue-700">
                Add to cart
              </div>
            </button>
          </div>
          {/* Amount container */}
          <div className="group flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-400 transition-all duration-300 group-hover:animate-ping"></div>
            <div className="text-sm">50+ pcs. in stock.</div>
          </div>

          {/* Botton buttons container */}
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <button className="hover:bg-opacity-30 flex items-center justify-center space-x-3 rounded-lg border-2 border-gray-300 px-5 py-3 font-medium shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="inline-block h-3 w-4 rounded-full bg-green-600"></div>
              <span>Add to cart</span>
            </button>

            <button className="hover:bg-opacity-30 flex items-center justify-center space-x-3 rounded-lg border-2 border-gray-300 px-5 py-3 font-medium shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-lg">
              <div className="inline-block h-3 w-4 rounded-full bg-amber-600"></div>
              <span>Add to Wishlist</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
