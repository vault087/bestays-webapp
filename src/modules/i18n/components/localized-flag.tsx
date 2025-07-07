import React from "react";
import { getFlagComponent, FLAGS, type LocaleType } from "@/modules/i18n/types/locale-types";

interface FlagProps {
  locale: LocaleType;
  className?: string;
  size?: number;
}

export const LocalizedFlag: React.FC<FlagProps> = ({ locale, className = "w-6 h-4", size }) => {
  const FlagComponent = getFlagComponent(locale);

  const sizeProps = size ? { width: size, height: size * 0.67 } : {};

  return <FlagComponent className={className} title={`Flag of ${locale}`} {...sizeProps} />;
};

// Hook example for easy flag access
export const useFlag = (locale: LocaleType) => {
  return React.useMemo(
    () => ({
      component: FLAGS[locale] || FLAGS.en,
      getFlagComponent: () => getFlagComponent(locale),
    }),
    [locale],
  );
};

export default LocalizedFlag;
