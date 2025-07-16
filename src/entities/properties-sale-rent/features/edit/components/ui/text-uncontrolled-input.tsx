import { useTranslations } from "next-intl";
import { memo } from "react";
import { DBPropertyTextField, usePropertyTextInput } from "@/entities/properties-sale-rent/";
import { Input } from "@/modules/shadcn";
import { useDebugRender } from "@/utils/use-debug-render";

export const PropertyAgentNotesUncontrolledInput = memo(function PropertyAgentNotesUncontrolledInput() {
  const t = useTranslations("PropertiesSaleRent.fields");
  const title = t("agent_notes.label");
  const subtitle = t("agent_notes.subtitle");
  const placeholder = t("agent_notes.placeholder");
  return (
    <PropertyTextUncontrolledInput title={title} placeholder={placeholder} subtitle={subtitle} field="agent_notes" />
  );
});

export const PropertyTextUncontrolledInput = memo(function PropertyTextUncontrolledInput({
  title,
  placeholder,
  subtitle,
  field,
}: {
  title: string;
  placeholder: string;
  subtitle: string;
  field: DBPropertyTextField;
}) {
  const { inputId, value, onChange, error } = usePropertyTextInput(field);
  useDebugRender("TextUncontrolledInput" + title);
  return (
    <div className="flex w-full flex-col bg-transparent">
      <span className="font-open-sans text-md items-center border-0">{title}</span>
      <Input
        id={inputId}
        type="text"
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 border-0 bg-transparent py-0 font-mono text-xs shadow-none dark:bg-transparent"
      />
      <p className="text-muted-foreground text-xs">{subtitle}</p>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
});
