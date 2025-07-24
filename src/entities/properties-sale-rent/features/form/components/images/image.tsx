import { X, ImagesIcon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { QuickTooltip } from "@/components";
import { DBImage } from "@/entities/media/types/image.type";
import { cn } from "@/modules/shadcn";
import { Button } from "@/modules/shadcn/components/ui/button";

export const PropertyImage = memo(function PropertyImage({
  image,
  onRemove,
  isCover,
  setCover,
  size = "sm",
}: {
  image: DBImage;
  onRemove: () => void;
  isCover: boolean;
  size?: "sm" | "lg";
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
                <ImagesIcon className={cn("", size === "lg" && "!h-4 !w-4", size == "sm" && "!h-3 !w-3")} />
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
