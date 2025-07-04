import Image from "next/image";

export default function Page() {
  return (
    <div className="h-dvh bg-cyan-100 px-8 py-2">
      {/* Card container */}
      <div className="flex min-h-dvh flex-col rounded-2xl bg-white shadow-2xl md:px-30">
        <div className="my-4 md:my-30">
          <NavBar />
        </div>
        <div>
          <div className="mb-2 md:mb-10">
            <ActionBar />
          </div>
          <div className="mb-2 md:mb-10">
            <ImageGallery />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavBar() {
  function Item({ name }: { name: string }) {
    return (
      <div className="text-sm font-semibold transition-all duration-150 hover:cursor-pointer hover:underline hover:underline-offset-2">
        {name}
      </div>
    );
  }

  return (
    <nav className="">
      <ul className="flex flex-col items-center justify-end gap-4 md:flex-row">
        <li>
          <Item name="Vector" />
        </li>
        <li>
          <Item name="Illustrations" />
        </li>
        <li>
          <Item name="Images" />
        </li>
        <li>
          <Item name="Icons" />
        </li>
      </ul>
    </nav>
  );
}

function ActionBar() {
  function SearchBar() {
    return (
      <div className="flex flex-1 items-center gap-2">
        <div className="flex border-b-2 border-gray-300">
          <input className="min-w-sm py-2 pl-4 focus:outline-0" type="text" placeholder="Search" />
          <div className="h-5 w-5 rounded-full bg-zinc-500 blur-sm"></div>
        </div>
      </div>
    );
  }

  function UploadButton() {
    return (
      <button className="rounded-md bg-black px-15 py-4 text-white transition-all duration-150 hover:scale-105">
        Upload
      </button>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
      <SearchBar />
      <div className="justify-end bg-amber-300">
        <UploadButton />
      </div>
    </div>
  );
}

function ImageGallery() {
  function Item({ image }: { image: string }) {
    return (
      <div className="group relative flex items-center justify-center">
        <Image
          src={image}
          alt="Image"
          width={300}
          height={300}
          className="h-full w-full object-cover transition-all duration-150 group-hover:scale-105 hover:rounded-sm"
        />
        <div className="absolute right-0 bottom-0 left-0 bg-black/50 text-center text-white opacity-50 transition-all duration-150 group-hover:scale-105 group-hover:pb-20 group-hover:opacity-100"></div>
      </div>
    );
  }

  const images = [
    { id: 0, src: "/test/beach-villa.png" },
    { id: 1, src: "/test/house-evening.jpg" },
    { id: 2, src: "/test/beach-villa.png" },
    { id: 3, src: "/test/house-evening.jpg" },
    { id: 4, src: "/test/beach-villa.png" },
    { id: 5, src: "/test/house-evening.jpg" },
    { id: 6, src: "/test/beach-villa.png" },
    { id: 7, src: "/test/house-evening.jpg" },
    { id: 8, src: "/test/beach-villa.png" },
    { id: 9, src: "/test/house-evening.jpg" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {images.map((image) => (
        <Item key={image.id} image={image.src} />
      ))}
    </div>
  );
}
