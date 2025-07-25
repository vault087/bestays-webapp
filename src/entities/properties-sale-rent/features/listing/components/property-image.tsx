import { ImageIcon } from "lucide-react";

interface PropertyImageProps {
  coverImage: { url?: string } | null;
}

export function PropertyImage({ coverImage }: PropertyImageProps) {
  if (coverImage?.url) {
    return <img src={coverImage.url} alt="Property" className="h-12 w-12 rounded-md object-cover" />;
  }
  return (
    <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-md">
      <ImageIcon className="text-muted-foreground h-6 w-6" />
    </div>
  );
}
