"use client";

import { ArrowLeftIcon, CircleAlertIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo, useMemo, useState, useCallback, useId, useTransition } from "react";
import AvatarMenu from "@/components/dashboard-nav-bar/avatar-menu";
import { ThemeSwitcher } from "@/components/theme/components/theme-switcher";
import { DebugCard } from "@/components/ui/debug-json-card";
import { createDictionaryFormStore } from "@/entities/dictionaries/features/form/store";
import { DictionaryFormStoreProvider } from "@/entities/dictionaries/features/form/store/dictionary-form.store.provider";
import { DBDictionary, DBDictionaryEntry } from "@/entities/dictionaries/types/dictionary.types";
import {
  PropertyFormStoreProvider,
  MutableProperty,
  PropertyPersonalNotesInput,
  PropertyAreaInput,
  PropertyDivisibleSaleInput,
  PropertyOwnershipTypeInput,
  PropertyPropertyTypeInput,
  PropertyHighlightsInput,
  PropertyLocationStrengthsInput,
  PropertyLandFeaturesInput,
  PropertyNearbyAttractionsInput,
  PropertyLandAndConstructionInput,
  PropertySizeInput,
  PropertyRoomsInputGroup,
  usePropertyFormStore,
  createPropertyFormStore,
  PropertyAboutInput,
  PropertySalePriceInput,
  PropertyRentPriceInput,
  PropertyFormStoreHydrated,
  usePropertyTextInput,
  PROPERTY_PERSONAL_NOTES_MAX,
  usePropertyFormStoreContext,
  // PropertyPriceInputGroup,
} from "@/entities/properties-sale-rent/";
import { PropertyImagesInput } from "@/entities/properties-sale-rent/features/form/components/images-input";
import { usePropertyBoolInput } from "@/entities/properties-sale-rent/features/form/hooks/use-bool-field";
import { updateProperty } from "@/entities/properties-sale-rent/libs/actions/property";
import LocaleSwitcher from "@/modules/i18n/components/locale-switcher";
import { useRouter } from "@/modules/i18n/core/client/navigation";
import { cn, Button, Input } from "@/modules/shadcn";
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/modules/shadcn/components/ui/dialog";
import { Label } from "@/modules/shadcn/components/ui/label";
import { Switch } from "@/modules/shadcn/components/ui/switch";

export default function PropertiesPageClient({
  property,
  dictionaries,
  entries,
}: {
  property: MutableProperty;
  dictionaries: DBDictionary[];
  entries: DBDictionaryEntry[];
}) {
  const router = useRouter();

  const dictionaryStore = useMemo(() => createDictionaryFormStore(dictionaries, entries), [dictionaries, entries]);
  const propertyStore = useMemo(() => createPropertyFormStore("properties-sell-rent", property), [property]);

  return (
    <div className="flex h-full w-full">
      <DictionaryFormStoreProvider store={dictionaryStore}>
        <PropertyFormStoreProvider store={propertyStore}>
          <PropertyFormStoreHydrated fallback={<div>Loading...</div>}>
            <div className="flex w-full flex-col gap-4 pt-4">
              <div className="flex w-full flex-row items-center justify-between px-6">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/properties")}>
                    <ArrowLeftIcon className="!h-6 !w-6" />
                  </Button>
                  {/* <h1 className="text-xl font-bold">Listing editor</h1> */}
                  <div className="shrink-0">
                    <TitleInput />
                  </div>
                </div>

                <div className="flex items-center gap-2"></div>

                <div className="min-w-sm pt-4">{/* <Comp439 /> */}</div>

                <div className="flex items-center justify-end space-x-3">
                  <div className="flex pr-4">
                    <PublishedToggle />
                  </div>
                  <div className="flex flex-row space-x-6">
                    <SaveButton />
                  </div>
                  <LocaleSwitcher />
                  <ThemeSwitcher />
                  <AvatarMenu />
                </div>
              </div>

              <div className="flex flex-col overflow-auto">
                <PropertyListCanvas />
                <div className="flex flex-row items-center justify-center space-x-6 py-4">
                  <DeleteButton />
                </div>
              </div>
            </div>
          </PropertyFormStoreHydrated>
        </PropertyFormStoreProvider>
      </DictionaryFormStoreProvider>
    </div>
  );
}

const PropertyListCanvas = memo(function PropertyListCanvas({ className }: { className?: string }) {
  return (
    <div className={cn("bg-background w-full px-5 pt-2", className)}>
      {/* Editing Area */}
      {/* <div className="w-full"> */}
      {/* Fields Container */}
      <div className="rounded-card flex flex-1 flex-col items-start justify-center gap-4 rounded-md p-0 sm:flex-row">
        {/* Left Column */}
        <div className="contents w-1/2 flex-col space-y-4 pb-8 sm:flex">
          {/* <PropertyTitleInput /> */}
          <PropertyAreaInput />
          <PropertyPropertyTypeInput />
          {/* <div className="flex w-1/2 flex-col items-start gap-4">
              <PropertyPriceInputGroup direction="vertical" />
            </div> */}
          <>
            <PropertyHighlightsInput />
            <PropertyLocationStrengthsInput />
            <PropertyNearbyAttractionsInput />
          </>
          {/* <div className="flex w-full flex-col space-y-4">
              <PropertyAboutInput />
            </div> */}
          <PropertyRoomsInputGroup />
          <>
            <PropertySizeInput />
            <PropertyOwnershipTypeInput />
            <PropertyDivisibleSaleInput />
            <PropertyLandAndConstructionInput />
            <PropertyLandFeaturesInput />
          </>
        </div>

        {/* Right Column */}
        <div className="contents w-1/2 flex-col space-y-4 sm:flex">
          <PropertyImagesInput />
          <div className="grid w-full grid-cols-2 gap-4">
            <PropertyRentPriceInput />
            <PropertySalePriceInput />
          </div>
          <PropertyAboutInput />
          <PropertyPersonalNotesInput />
        </div>
        {/* <ReactiveDebugCard /> */}
      </div>
      {/* </div> */}
    </div>
  );
});

export function ReactiveDebugCard() {
  // ✅ FIXED: Single subscription instead of multiple to prevent infinite loops
  const property = usePropertyFormStore((state) => state.property);
  const debug = useMemo(() => {
    return {
      property,
    };
  }, [property]);
  return <DebugCard label="Error State Debug" json={debug} />;
}

export const TitleInput = memo(function TitleInput() {
  const { inputId, value, onChange } = usePropertyTextInput("personal_title", PROPERTY_PERSONAL_NOTES_MAX);
  const t = useTranslations("Properties.fields.title");
  return (
    <div className="flex flex-col gap-2">
      <Input
        className={cn(
          "placeholder:muted-foreground text-foreground h-20 border-0 font-medium shadow-none md:text-3xl",
          value.length > 0 && "",
        )}
        id={inputId}
        value={value}
        placeholder={t("no_title")}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
});

export const PublishedToggle = memo(function PublishedInput() {
  const { inputId, value, onChange } = usePropertyBoolInput("is_published");

  const t = useTranslations("Properties.fields.published");

  return (
    <div className="flex flex-row items-center gap-2">
      <Label
        htmlFor={inputId}
        className={cn("text-sm font-medium", value && "text-primary", !value && "text-muted-foreground")}
      >
        {t("is_published")}
      </Label>
      <Switch
        checked={value}
        onCheckedChange={onChange}
        id={inputId}
        className="data-[state=unchecked]:border-input data-[state=unchecked]:[&_span]:bg-input data-[state=unchecked]:bg-transparent [&_span]:transition-all data-[state=unchecked]:[&_span]:size-4 data-[state=unchecked]:[&_span]:translate-x-0.5 data-[state=unchecked]:[&_span]:shadow-none data-[state=unchecked]:[&_span]:rtl:-translate-x-0.5"
      />
    </div>
  );
});

export const SaveButton = memo(function SaveButton() {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("Common");

  const propertyStore = usePropertyFormStoreContext();

  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(() => {
    startTransition(async () => {
      const property = propertyStore.getState().property;
      console.log("property", property);
      if (!property) return;

      const response = await updateProperty(property.id, property);
      setError(response.error);
    });
  }, [propertyStore, startTransition]);

  return (
    <div className="relative">
      <Button size="sm" onClick={handleSave} disabled={isPending}>
        {isPending ? t("saving") : t("save")}
      </Button>

      {error && (
        <div onClick={() => setError(null)} className="absolute top-2 left-0 w-full text-sm text-red-500">
          {error}
        </div>
      )}
    </div>
  );
});

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteConfirmationDialog({ isOpen, onClose, onConfirm }: DeleteConfirmationDialogProps) {
  const id = useId();
  const [inputValue, setInputValue] = useState("");
  const t = useTranslations("Properties.delete_confirmation");

  const isConfirmEnabled = inputValue.toLowerCase() === "delete";

  const handleConfirm = useCallback(() => {
    if (isConfirmEnabled) {
      onConfirm();
      setInputValue("");
      onClose();
    }
  }, [isConfirmEnabled, onConfirm, onClose]);

  const handleClose = useCallback(() => {
    setInputValue("");
    onClose();
  }, [onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">{t("title")}</DialogTitle>
            <DialogDescription className="sm:text-center">{t("description")}</DialogDescription>
          </DialogHeader>
        </div>

        <form className="space-y-5">
          <div className="*:not-first:mt-2">
            <Label htmlFor={id}>{t("description")}</Label>
            <Input
              id={id}
              type="text"
              placeholder={t("input_placeholder")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" className="flex-1">
                {t("cancel")}
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              className="flex-1"
              disabled={!isConfirmEnabled}
              onClick={handleConfirm}
            >
              {t("delete")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export const DeleteButton = memo(function DeleteButton() {
  const store = usePropertyFormStoreContext();
  const { updateProperty } = store.getState(); // instant
  const isDeleted = usePropertyFormStore((state) => state.property.deleted_at !== null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = useCallback(() => {
    updateProperty((draft) => {
      draft.deleted_at = new Date().toISOString();
    });
  }, [updateProperty]);

  const handleShowDeleteDialog = useCallback(() => {
    setShowDeleteDialog(true);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setShowDeleteDialog(false);
  }, []);

  return (
    <>
      <div>
        {isDeleted && (
          <Button
            variant="secondary"
            size="sm"
            className=""
            onClick={() => {
              updateProperty((draft) => {
                draft.deleted_at = null;
              });
            }}
          >
            Restore
          </Button>
        )}

        {!isDeleted && (
          <Button variant="destructive" size="sm" className="" onClick={handleShowDeleteDialog}>
            Delete
          </Button>
        )}
      </div>

      <DeleteConfirmationDialog isOpen={showDeleteDialog} onClose={handleCloseDeleteDialog} onConfirm={handleDelete} />
    </>
  );
});
