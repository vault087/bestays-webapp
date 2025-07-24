import { X, ImagesIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { QuickTooltip } from "@/components";
import { DBImage } from "@/entities/media/types/image.type";
import { Button } from "@/modules/shadcn/components/ui/button";

export const PropertyImage = memo(function PropertyImage({
  image,
  onRemove,
  isCover,
  setCover,
}: {
  image: DBImage;
  onRemove: () => void;
  isCover: boolean;
  setCover?: () => void;
}) {
  const t = useTranslations("Common");

  return (
    <div className="group/image flex-shrink-0">
      <div className="relative h-20 w-20 overflow-hidden rounded-md">
        <div className="flex h-full w-full transition-transform duration-200 group-hover/image:scale-105">
          <Image src={image.url} alt="Cover photo" fill className="object-cover" unoptimized />
        </div>
        {isCover && (
          <div className="bg-primary/80 text-primary-foreground absolute top-1.5 left-1.5 rounded px-1 text-xs select-none">
            {t("image.cover")}
          </div>
        )}
        {!isCover && (
          <div>
            <QuickTooltip content={t("image.setCover")}>
              <Button
                type="button"
                variant="default"
                size="xs"
                className="bg-foreground text-background group-hover/image:bg-foreground absolute top-1.5 left-1.5 h-4 w-4 rounded-full p-0 opacity-20 duration-100 group-hover/image:opacity-100"
                onClick={() => setCover?.()}
              >
                <ImagesIcon className="!h-3 !w-3" />
              </Button>
            </QuickTooltip>
          </div>
        )}
        <Button
          type="button"
          variant="destructive"
          size="xs"
          className="bg-foreground text-background absolute top-1.5 right-1.5 h-4 w-4 rounded-full p-0 opacity-20 duration-100 group-hover/image:opacity-100"
          onClick={() => onRemove()}
        >
          <X className="!h-3 !w-3" />
        </Button>
      </div>
    </div>
  );
});

export const PropertyBigImage = memo(function PropertyBigImage({
  image,
  onRemove,
  isCover,
}: {
  image: DBImage;
  onRemove: () => void;
  isCover: boolean;
}) {
  const t = useTranslations("Common");

  return (
    <div className="group/image relative aspect-[4/3] overflow-hidden rounded-lg">
      <div className="flex h-full w-full overflow-clip rounded-md">
        <div className="h-full w-full transition-transform duration-200 group-hover/image:scale-105">
          <Image src={image.url} alt="Cover photo" fill className="object-cover" unoptimized />
        </div>
      </div>
      {isCover && (
        <div className="bg-primary text-primary-foreground absolute top-2.5 left-2.5 rounded px-2 py-1 text-xs transition-transform duration-200 select-none group-hover/image:scale-110">
          {t("image.cover")}
        </div>
      )}
      <Button
        type="button"
        variant="destructive"
        size="xs"
        className="bg-foreground text-background absolute top-2 right-2 h-5 w-5 rounded-full p-0 opacity-20 group-hover/image:scale-115 group-hover/image:opacity-100"
        onClick={() => onRemove()}
      >
        <X className="!h-4 !w-4" />
      </Button>
    </div>
  );
});
