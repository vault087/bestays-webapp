"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { Button } from "@/modules/shadcn/components/ui/button";
import { DialogFooter } from "@/modules/shadcn/components/ui/dialog";

interface EditorDoneButtonProps {
  isSaving: boolean;
  onSave: () => void;
}

export const EditorDoneButton = memo(({ isSaving, onSave }: EditorDoneButtonProps) => {
  const tCommon = useTranslations("Common");

  return (
    <DialogFooter className="mt-4">
      <Button type="button" onClick={onSave} disabled={isSaving} className="min-w-[80px]">
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {tCommon("saving")}
          </>
        ) : (
          tCommon("done")
        )}
      </Button>
    </DialogFooter>
  );
});

EditorDoneButton.displayName = "EditorDoneButton";
