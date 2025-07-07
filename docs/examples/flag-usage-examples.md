# Flag Usage Examples

## Simple Flag API

The new flag API provides a clean, flexible way to use country flags without per-language imports in components.

### Basic Usage

```tsx
import { LocalizedFlag } from '@/modules/i18n/components';

// Simple usage
<LocalizedFlag locale="en" />
<LocalizedFlag locale="ru" className="w-8 h-5" />
<LocalizedFlag locale="th" size={24} />
```

### Using with Hooks

```tsx
import { useFlag } from "@/modules/i18n/components";
import { getFlagComponent } from "@/modules/i18n/types/locale-types";

function MyComponent({ locale }: { locale: string }) {
  // Method 1: Using the hook
  const { component: FlagComponent } = useFlag(locale);

  // Method 2: Direct access
  const FlagComponent = getFlagComponent(locale);

  return (
    <div>
      <FlagComponent className="h-4 w-6" title={`Flag of ${locale}`} />
    </div>
  );
}
```

### Direct Access to Flag Components

```tsx
import { FLAGS } from "@/modules/i18n/types/locale-types";

function LocaleSwitcher() {
  return (
    <div className="flex gap-2">
      {Object.entries(FLAGS).map(([locale, FlagComponent]) => (
        <button key={locale} onClick={() => setLocale(locale)}>
          <FlagComponent className="h-4 w-6" />
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
```

### Benefits

1. **No per-language imports**: All flag components are imported once in `locale-types.ts`
2. **Simple API**: Use `getFlagComponent(locale)` or direct access via `FLAGS[locale]`
3. **Type-safe**: Full TypeScript support with `LocaleType`
4. **Flexible**: Works with hooks, direct component usage, or mapping over all flags
5. **Reliable**: Uses `country-flag-icons` library (124 GitHub stars, lightweight SVG icons)

### Available Locales

- `en` - United States flag (🇺🇸 → SVG)
- `ru` - Russia flag (🇷🇺 → SVG)
- `th` - Thailand flag (🇹🇭 → SVG)

All flags are now crisp SVG icons that work consistently across all platforms.
