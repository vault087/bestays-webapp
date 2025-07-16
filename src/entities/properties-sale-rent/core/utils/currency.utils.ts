import { DBCurrency } from "@/entities/properties-sale-rent/core/types/property.types";

export function getCurrencySymbol(currency: DBCurrency): string {
  switch (currency) {
    case "thb":
      return "฿";
  }
}
