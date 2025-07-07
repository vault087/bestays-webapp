I need you to help me implement@use-property-code-field.tshook and 2 components that consume this hook.

hook:

- hook links to the property store and property by id in props. It also depends on dictionary store. there's a mapping for property fields and dictionaries in @property-field-to-code.ts Based on our @property.type.ts we know chich field has an radio button behavriour, like area: DBCodeSchema.nullish() and so on as it accepts one code value and others have a checkbox behaviour like land_features: z.array(DBCodeSchema).nullish()

First we need a generic / root hook that accepts field name and type (code vs array of code) and provide us reactive display and reactive set functionallity as example in @use-property-localized-field.ts but we don't need an input, we need a code/array (that's generic T) and two other hooks we create in a use-property-area.ts and use-property-highlights in @/hooks that would provide us interface for two new components in @/components named property-area and property-highlights. Follow exactly my coding style and follow exact patterns, keep code simple and clean and readable. For the components let's use shadcn components provided by originui, you can use npx commands to install it but be carefully as it always sets the wrong import paths so you have to go an fix it quickly. As we use originui it fetches json file named as a integer number. So we basically move that file into our components folder and renaming it as we need to name a component, then we do refactoring to access our hooks instead of using static data, so we cleaning up the code.
We will need a implementation in a generic hook to set/get correct codes and it also should validate that provided code belongs to assigned field (from utils). As database cannot protect integrity for code's in array so we have to do that, we need to trigger error that should be shown under the text field.

Here's examples from originUI and copy pasted examples, but you can just pull all dependencies from npx, up to you, but do not override existing components as i may modified them for my needs.

input field:
npx shadcn@latest add https://originui.com/r/comp-234.json
import { useId } from "react"

import { Label } from "ui/label"
import MultipleSelector, { Option } from "ui/multiselect"

const frameworks: Option[] = [
{
value: "next.js",
label: "Next.js",
},
{
value: "sveltekit",
label: "SvelteKit",
},
{
value: "nuxt.js",
label: "Nuxt.js",
disable: true,
},
{
value: "remix",
label: "Remix",
},
{
value: "astro",
label: "Astro",
},
{
value: "angular",
label: "Angular",
},
{
value: "vue",
label: "Vue.js",
},
{
value: "react",
label: "React",
},
{
value: "ember",
label: "Ember.js",
},
{
value: "gatsby",
label: "Gatsby",
},
{
value: "eleventy",
label: "Eleventy",
disable: true,
},
{
value: "solid",
label: "SolidJS",
},
{
value: "preact",
label: "Preact",
},
{
value: "qwik",
label: "Qwik",
},
{
value: "alpine",
label: "Alpine.js",
},
{
value: "lit",
label: "Lit",
},
]

export default function Component() {
const id = useId()
return (
<div className="*:not-first:mt-2">
<Label>Multiselect</Label>
<MultipleSelector
commandProps={{
          label: "Select frameworks",
        }}
value={frameworks.slice(0, 2)}
defaultOptions={frameworks}
placeholder="Select frameworks"
hideClearAllButton
hidePlaceholderWhenSelected
emptyIndicator={<p className="text-center text-sm">No results found</p>}
/>
<p
        className="text-muted-foreground mt-2 text-xs"
        role="region"
        aria-live="polite"
      >
Inspired by{" "}
<a
          className="hover:text-foreground underline"
          href="https://shadcnui-expansions.typeart.cc/docs/multiple-selector"
          target="_blank"
          rel="noopener nofollow"
        >
shadcn/ui expansions
</a>
</p>
</div>
)
}

As you can see we have here everything we need to display a property input, but we don't include it inside the input itself as it should be done by parrent that we need to create called property-input-field inside that components/blocks/, as it's a complex component and it should show another parent compoentn PropertyTitle and PropertyDescription that would use LocalizedText hooks already provided (currently description is a TEXT (string) value, but we have to change it to be a LocalizedText, so title and description hooks should be similar and both components should accept locales.

The next code is for area component to use as it's a single selector:

npx shadcn@latest add https://originui.com/r/comp-219.json
import { useId } from "react"

import { Label } from "@/components/ui/label"
import {
Select,
SelectContent,
SelectItem,
SelectTrigger,
SelectValue,
} from "@/components/ui/select"

export default function Component() {
const id = useId()
return (
<div className="*:not-first:mt-2">
<Label htmlFor={id}>Select with right indicator</Label>
<Select defaultValue="1">
<SelectTrigger id={id}>
<SelectValue placeholder="Select framework" />
</SelectTrigger>
<SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
<SelectItem value="1">React</SelectItem>
<SelectItem value="2">Next.js</SelectItem>
<SelectItem value="3">Astro</SelectItem>
<SelectItem value="4">Gatsby</SelectItem>
</SelectContent>
</Select>
</div>
)
}

So our generic hook as said before validates the code exists in a linked dictionary and dictionary store already has adds/remove functionallity.

I have just introduced new field in a dictionry entry: is_active BOOLEAN NOT NULL DEFAULT TRUE

So we have to filter when we show in a list in component to skip isActive=false, but if property contains this value we still show it in input, but we cna grayscale or but red (do not use direct colors, use theme, so highlight them as a warning). so user can delete them, but we don't delete it from db as we still need to grab a name and code, so delete later in a cron script when no property contain it anymore.

Property contains only codes, so hooks has to map code to title of current locale to show in a badge of input and in the selector.

Use all these requirements as a reference to build all entities mentioned accordigng it's proper file location, ignore tests for now to save time as I need to check myself if it fits my expectations or need to change. As a resut please add these tho components together with property title and property description inputs in the property-sale-rent/page-content
