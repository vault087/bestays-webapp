import { ModeSwitcher } from "@/components/theme/components/theme-switcher";

interface ColorSwatch {
  name: string;
  cssVar: string;
  description?: string;
}

const colorCategories = [
  {
    title: "Base Colors",
    colors: [
      { name: "Background", cssVar: "var(--background)", description: "Main background color" },
      { name: "Foreground", cssVar: "var(--foreground)", description: "Primary text color" },
      { name: "Card", cssVar: "var(--card)", description: "Card background" },
      { name: "Card Foreground", cssVar: "var(--card-foreground)", description: "Card text color" },
      { name: "Popover", cssVar: "var(--popover)", description: "Popover background" },
      { name: "Popover Foreground", cssVar: "var(--popover-foreground)", description: "Popover text color" },
    ],
  },
  {
    title: "Interactive Colors",
    colors: [
      { name: "Primary", cssVar: "var(--primary)", description: "Primary brand color" },
      {
        name: "Primary Foreground",
        cssVar: "var(--primary-foreground)",
        description: "Text on primary background",
      },
      { name: "Secondary", cssVar: "var(--secondary)", description: "Secondary color" },
      {
        name: "Secondary Foreground",
        cssVar: "var(--secondary-foreground)",
        description: "Text on secondary background",
      },
      { name: "Accent", cssVar: "var(--accent)", description: "Accent color for highlights" },
      { name: "Accent Foreground", cssVar: "var(--accent-foreground)", description: "Text on accent background" },
      { name: "Destructive", cssVar: "var(--destructive)", description: "Error/danger color" },
    ],
  },
  {
    title: "Neutral Colors",
    colors: [
      { name: "Muted", cssVar: "var(--muted)", description: "Muted background color" },
      { name: "Muted Foreground", cssVar: "var(--muted-foreground)", description: "Muted text color" },
      { name: "Border", cssVar: "var(--border)", description: "Default border color" },
      { name: "Input", cssVar: "var(--input)", description: "Input field border" },
      { name: "Ring", cssVar: "var(--ring)", description: "Focus ring color" },
    ],
  },
  {
    title: "Chart Colors",
    colors: [
      { name: "Chart 1", cssVar: "var(--chart-1)", description: "First chart color" },
      { name: "Chart 2", cssVar: "var(--chart-2)", description: "Second chart color" },
      { name: "Chart 3", cssVar: "var(--chart-3)", description: "Third chart color" },
      { name: "Chart 4", cssVar: "var(--chart-4)", description: "Fourth chart color" },
      { name: "Chart 5", cssVar: "var(--chart-5)", description: "Fifth chart color" },
    ],
  },
  {
    title: "Sidebar Colors",
    colors: [
      { name: "Sidebar", cssVar: "var(--sidebar)", description: "Sidebar background" },
      { name: "Sidebar Foreground", cssVar: "var(--sidebar-foreground)", description: "Sidebar text" },
      { name: "Sidebar Primary", cssVar: "var(--sidebar-primary)", description: "Sidebar primary color" },
      {
        name: "Sidebar Primary Foreground",
        cssVar: "var(--sidebar-primary-foreground)",
        description: "Sidebar primary text",
      },
      { name: "Sidebar Accent", cssVar: "var(--sidebar-accent)", description: "Sidebar accent color" },
      {
        name: "Sidebar Accent Foreground",
        cssVar: "var(--sidebar-accent-foreground)",
        description: "Sidebar accent text",
      },
      { name: "Sidebar Border", cssVar: "var(--sidebar-border)", description: "Sidebar border color" },
      { name: "Sidebar Ring", cssVar: "var(--sidebar-ring)", description: "Sidebar focus ring" },
    ],
  },
];

function ColorSwatch({ color }: { color: ColorSwatch }) {
  return (
    <div className="bg-card hover:bg-accent/50 flex items-center space-x-3 rounded-lg border p-3 transition-colors">
      <div
        className="border-border h-12 w-12 rounded-md border-2 shadow-sm"
        style={{ backgroundColor: color.cssVar }}
      />
      <div className="min-w-0 flex-1">
        <h3 className="text-foreground text-sm font-medium">{color.name}</h3>
        <p className="text-muted-foreground font-mono text-xs">{color.cssVar}</p>
        {color.description && <p className="text-muted-foreground mt-1 text-xs">{color.description}</p>}
      </div>
    </div>
  );
}

function RadiusShowcase() {
  const radiusValues = [
    { name: "Small", value: "var(--radius-sm)", description: "calc(var(--radius) - 4px)" },
    { name: "Medium", value: "var(--radius-md)", description: "calc(var(--radius) - 2px)" },
    { name: "Large", value: "var(--radius-lg)", description: "var(--radius)" },
    { name: "Extra Large", value: "var(--radius-xl)", description: "calc(var(--radius) + 4px)" },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-foreground text-xl font-semibold">Border Radius</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {radiusValues.map((radius) => (
          <div key={radius.name} className="bg-card flex flex-col items-center space-y-2 rounded-lg border p-4">
            <div className="bg-primary h-16 w-16" style={{ borderRadius: radius.value }} />
            <div className="text-center">
              <h3 className="text-sm font-medium">{radius.name}</h3>
              <p className="text-muted-foreground font-mono text-xs">{radius.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ThemePage() {
  return (
    <div className="container mx-auto space-y-8 py-8">
      {/* Header with Theme Switcher */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-3xl font-bold">Theme Showcase</h1>
          <p className="text-muted-foreground mt-2">
            Explore all available colors and design tokens from your theme system
          </p>
        </div>
        <ModeSwitcher />
      </div>

      {/* Color Categories */}
      <div className="space-y-8">
        {colorCategories.map((category) => (
          <div key={category.title} className="space-y-4">
            <h2 className="text-foreground text-xl font-semibold">{category.title}</h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {category.colors.map((color) => (
                <ColorSwatch key={color.name} color={color} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Border Radius Showcase */}
      <RadiusShowcase />

      {/* Usage Examples */}
      <div className="space-y-4">
        <h2 className="text-foreground text-xl font-semibold">Usage Examples</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Primary Button Example */}
          <div className="space-y-3">
            <h3 className="font-medium">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 transition-colors">
                Primary
              </button>
              <button className="bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md px-4 py-2 transition-colors">
                Secondary
              </button>
              <button className="bg-destructive hover:bg-destructive/90 rounded-md px-4 py-2 text-white transition-colors">
                Destructive
              </button>
              <button className="bg-accent text-accent-foreground hover:bg-accent/80 rounded-md px-4 py-2 transition-colors">
                Accent
              </button>
            </div>
          </div>

          {/* Card Example */}
          <div className="space-y-3">
            <h3 className="font-medium">Cards</h3>
            <div className="bg-card text-card-foreground rounded-lg border p-4 shadow-sm">
              <h4 className="mb-2 font-medium">Sample Card</h4>
              <p className="text-muted-foreground text-sm">This card uses the card background and foreground colors.</p>
            </div>
          </div>

          {/* Input Example */}
          <div className="space-y-3">
            <h3 className="font-medium">Form Elements</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Sample input"
                className="bg-background border-input focus:ring-ring w-full rounded-md border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
              />
              <div className="bg-muted text-muted-foreground rounded-md p-3 text-sm">Muted background example</div>
            </div>
          </div>

          {/* Chart Colors Example */}
          <div className="space-y-3">
            <h3 className="font-medium">Chart Colors</h3>
            <div className="flex h-20 gap-1">
              {colorCategories
                .find((cat) => cat.title === "Chart Colors")
                ?.colors.map((color) => (
                  <div
                    key={color.name}
                    className="flex-1 rounded-sm"
                    style={{ backgroundColor: color.cssVar }}
                    title={color.name}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Variables Reference */}
      <div className="space-y-4">
        <h2 className="text-foreground text-xl font-semibold">CSS Variables Reference</h2>
        <div className="bg-muted/50 overflow-x-auto rounded-lg p-4">
          <pre className="text-muted-foreground text-sm whitespace-pre-wrap">
            {`/* Usage in CSS */
.custom-element {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border: 1px solid hsl(var(--border));
  border-radius: var(--radius-lg);
}

/* Usage in Tailwind */
<div className="bg-primary text-primary-foreground border-border rounded-lg">
  Custom element
</div>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
