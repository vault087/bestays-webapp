import BackgroundAnimated from "@/components/background/background-animated";
import { Link } from "@/modules/i18n";
import { Button } from "@/modules/shadcn/";

export default async function HomePage() {
  // const t = await getTranslations("Home");

  return (
    <div className="min-h-screen bg-white">
      {/* Background Image Section */}
      <div className="relative min-h-dvh w-full overflow-hidden">
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
            <Button className="w-full border-white/50 bg-white/10 text-white hover:bg-white/20 sm:w-auto">
              <Link href="https://wa.me/66983480288" target="_blank">
                Contact via WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div>
        {/* Contact Info */}
        <div className="space-y-3 pt-8 pb-4 text-center text-gray-600">
          <p>📍 Sanchao, Ko Phangan, Surat Thani, Thailand 84280</p>
          <p>📧 beststaysinfo@gmail.com</p>
          <p>📱 +66 98-034-8288</p>
          {/* <Link href="/login">
            <span className="text-sm font-light">login</span>
          </Link> */}
        </div>
      </div>
    </div>
  );
}
