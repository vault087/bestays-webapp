import Image from "next/image";

export default function Page() {
  return (
    <div className="flex min-h-dvh justify-center bg-cyan-100">
      {/* Card container */}
      <div className="m-3 space-y-10 rounded-3xl bg-white p-6 shadow-2xl md:p-40">
        <div className="md:mb-24">
          <NavBar />
        </div>
        <div className="flex flex-col justify-between space-y-5 md:flex-row md:space-y-0">
          <SearchBar />
          <UploadButton />
        </div>
        <div>
          <ImageGallery />
        </div>
      </div>
    </div>
  );
}

function ImageGallery() {
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

  function Item({ image }: { image: string }) {
    return (
      <div className="group relative flex items-center justify-center">
        <Image src={image} alt="Image" width={300} height={300} className="h-full w-full object-cover" />
        <div className="absolute right-0 bottom-0 left-0 bg-black/40 p-2 px-4 text-white opacity-0 group-hover:opacity-100">
          <div className="flex w-full justify-between">
            <div className="font-normal">
              <p className="text-sm">Some description</p>
              <p className="text-sm">245 likes - 35 shares</p>
            </div>
            <div className="flex items-center">
              <div>Bookmark</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {images.map((image) => (
        <Item key={image.id} image={image.src} />
      ))}
    </div>
  );
}

function NavBar() {
  function Item({ name }: { name: string }) {
    return (
      <div className="group">
        <a className="text-sm font-semibold" href="#">
          {name}
        </a>
        <div className="mx-1 mt-2 border-b-2 border-black opacity-0 duration-500 group-hover:opacity-100"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-3 md:flex-row md:justify-end md:space-y-0 md:space-x-8">
      <Item name="Vector" />
      <Item name="Illustrations" />
      <Item name="Images" />
      <Item name="Icons" />
    </div>
  );
}

function SearchBar() {
  return (
    <div className="flex justify-between border-b border-b-slate-300">
      <input
        className="placeholder:text-md ml-6 border-none placeholder:font-thin focus:outline-none md:w-80"
        type="text"
        placeholder="Search"
      />
      <button className="text-sm text-slate-600">OK</button>
    </div>
  );
}

function UploadButton() {
  return (
    <button className="rounded-md border border-black bg-black px-14 py-3 text-lg text-white shadow-2xl transition-all duration-150 hover:bg-white hover:text-black">
      Upload
    </button>
  );
}
