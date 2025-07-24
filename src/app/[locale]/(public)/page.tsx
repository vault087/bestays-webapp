import Image from "next/image";
import { getTranslations } from "next-intl/server";
import BackgroundAnimated from "@/components/background/background-animated";
import { Link } from "@/modules/i18n";
import { Button } from "@/modules/shadcn/";

export default async function HomePage() {
  const t = await getTranslations("Home");

  return (
    <div className="min-h-screen bg-white">
      {/* Background Image Section */}
      <div className="relative min-h-[80vh] w-full overflow-hidden">
        <BackgroundAnimated />
        <div className="absolute right-0 z-20 flex"></div>
        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-black/40" />
        {/* Content */}
        <div className="relative z-20 container mx-auto flex h-full flex-col items-center justify-center px-4 py-12 pt-20 text-center">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">Welcome to Best Stays</h1>
            <p className="text-xl text-gray-200 md:text-2xl lg:text-3xl">Your Real Estate Destination in Thailand</p>
          </div>

          {/* Description */}
          <div className="mx-auto mt-6 max-w-2xl">
            <p className="text-lg text-gray-100 md:text-xl">
              Find your perfect property in Thailand&apos;s most beautiful locations. Whether you&apos;re looking to
              rent, buy, or invest, we have options for every need.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex w-full max-w-md flex-col justify-center gap-4 sm:flex-row">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 sm:w-auto">
              <Link href="/properties">View All Properties</Link>
            </Button>
            <Button className="w-full border-white/50 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
              <Link href="https://wa.me/66983480288" target="_blank">
                Contact via WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Three Sections */}
      <div className="my-8 flex flex-col items-center justify-center space-y-8">
        {/* For Rent Section */}
        <section className="flex flex-col">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">For Rent</h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Featured MutableProperty Card */}
            <div className="col-span-1 overflow-hidden rounded-xl bg-white shadow-md lg:col-span-2">
              <div className="relative h-64 w-full">
                <Image
                  src="/images/rental-property.jpg"
                  alt="Luxury villa for rent in Koh Phangan"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Luxury Beach Villa</h3>
                <p className="mb-2 text-gray-700">Koh Phangan</p>
                <p className="mb-4 text-lg font-bold text-blue-600">฿35,000 / month</p>
                <Button className="w-full">
                  <Link href="/properties/for-rent/koh-phangan/luxury-beach-villa">View Details</Link>
                </Button>
              </div>
            </div>

            {/* Location Links */}
            <div className="col-span-1 rounded-xl bg-gray-50 p-6">
              <h3 className="mb-4 text-xl font-semibold">Popular Rental Locations</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/properties/for-rent/koh-phangan"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <span className="mr-2">→</span> Koh Phangan
                  </Link>
                </li>
                <li>
                  <Link href="/properties/for-rent/hua-hin" className="flex items-center text-blue-600 hover:underline">
                    <span className="mr-2">→</span> Hua Hin
                  </Link>
                </li>
                <li>
                  <Link href="/properties/for-rent/phuket" className="flex items-center text-blue-600 hover:underline">
                    <span className="mr-2">→</span> Phuket
                  </Link>
                </li>
                <li>
                  <Link
                    href="/properties/for-rent/chiang-mai"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <span className="mr-2">→</span> Chiang Mai
                  </Link>
                </li>
                <li>
                  <Link
                    href="/properties/for-rent"
                    className="mt-6 flex items-center font-semibold text-blue-700 hover:underline"
                  >
                    <span className="mr-2">✓</span> View All Rental Properties
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* For Sale Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">For Sale</h2>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Featured MutableProperty Card */}
            <div className="col-span-1 overflow-hidden rounded-xl bg-white shadow-md lg:col-span-2">
              <div className="relative h-64 w-full">
                <Image
                  src="/images/sale-property.jpg"
                  alt="Modern villa for sale in Hua Hin"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold">Modern Pool Villa</h3>
                <p className="mb-2 text-gray-700">Hua Hin</p>
                <p className="mb-4 text-lg font-bold text-blue-600">฿12,500,000</p>
                <Button className="w-full">
                  <Link href="/properties/for-sale/hua-hin/modern-pool-villa">View Details</Link>
                </Button>
              </div>
            </div>

            {/* Location Links */}
            <div className="col-span-1 rounded-xl bg-gray-50 p-6">
              <h3 className="mb-4 text-xl font-semibold">Popular Sale Locations</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/properties/for-sale/hua-hin" className="flex items-center text-blue-600 hover:underline">
                    <span className="mr-2">→</span> Hua Hin
                  </Link>
                </li>
                <li>
                  <Link
                    href="/properties/for-sale/koh-phangan"
                    className="flex items-center text-blue-600 hover:underline"
                  >
                    <span className="mr-2">→</span> Koh Phangan
                  </Link>
                </li>
                <li>
                  <Link href="/properties/for-sale/bangkok" className="flex items-center text-blue-600 hover:underline">
                    <span className="mr-2">→</span> Bangkok
                  </Link>
                </li>
                <li>
                  <Link href="/properties/for-sale/pattaya" className="flex items-center text-blue-600 hover:underline">
                    <span className="mr-2">→</span> Pattaya
                  </Link>
                </li>
                <li>
                  <Link
                    href="/properties/for-sale"
                    className="mt-6 flex items-center font-semibold text-blue-700 hover:underline"
                  >
                    <span className="mr-2">✓</span> View All Properties For Sale
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <div className="mt-8 space-y-3 border-t border-gray-200 pt-8 text-center text-gray-600">
          <p>📍 Sanchao, Ko Phangan, Surat Thani, Thailand 84280</p>
          <p>📧 beststaysinfo@gmail.com</p>
          <p>📱 +66 98-034-8288</p>
        </div>

        <div className="flex items-center justify-center">
          <Link href="/dashboard">
            <span className="text-accent-foreground p-2 text-sm font-light">{t("Dashboard")}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
