# Dictionary System Implementation Plan

## Original Requirements

**User Request:**

> Based on my db schema and copy-pasted templates from another module I placed in I would like to have
>
> 1. zod schemas in @1_dictionaries.sql @dictionary-entries.ts @dictionaries.ts for db and form. for db it's called DBDictionary and DBDictionaryEntry and Dictionary, DictionaryEntry for UI representation with extra constraints like in @property.types.ts
> 2. All localized texts (dictionaries.name, dictionary_entries.name) should be type of LocalizedText@localized-text.type.ts
> 3. We need a store similar to @property.store.ts but having dictionaries: Record<string, Dictionary>; and entries: Record<string, Record<string, DictionaryEntry>>, where string is a dictionary_type and dictionary_entries.code. Also no need sorting as it's unrelated for dictionaries and entries will be sorted alphabetical later. Also need to update hooks and contexts in
> 4. we need a hooks for useDictionaryType and useDictionaryName(locale) and for entries useDictionaryEntryCode and useDictionaryEntryInput (displays and controlled inputs)
> 5. simple field components for displaying and controlled inputs using FloatingInput. Components accepts type and code as a props, memorized and using other performance mechanism we already used in our examples.
> 6. Implement simple tests for hooks as it's gonna test store as well.
> 7. Clean up the to remove example or old data.
>
> Please deeply analyze related sources and pther patterns and create very full and clear document for the plan to follow with a checkboxes to test after each step is done. Please double validate that all my requirements are fit there.
>
> If you have any questions to clarify that would affect implementation, then please ask but keep in mind that we just copy working flow from so no need to improvise and think something, it's more like a careful mechanical work for copy-pasting, name chages and slight code change.

## Overview

Implement a complete dictionary system following the established patterns from the properties module. This includes types, store, hooks, components, and tests with a UI-first approach. Database integration will be added later.

## Database Schema Analysis (Updated with ID-based architecture)

- **dictionaries**: `id SERIAL PRIMARY KEY`, `type VARCHAR(50) UNIQUE NOT NULL`, `name JSONB NOT NULL`
- **dictionary_entries**: `dictionary_id INTEGER FK REFERENCES dictionaries(id)`, `code VARCHAR(50)`, `name JSONB NOT NULL`, `UNIQUE (dictionary_id, code)`

**Architectural Decision:**

- Dictionaries use stable ID for references, type becomes editable field
- Entries reference dictionary by ID, not by type (prevents FK breaks on type changes)
- Type remains unique for business logic but is no longer primary key

## Implementation Steps

### Phase 1: Database and Form Types

#### 1.1 Database Types (cms-data module)

- [ ] Create `src/entities/dictionaries/types/dictionary.types.ts`
  - [ ] Export table constants: `DICTIONARIES_TABLE`, `DICTIONARY_ENTRIES_TABLE`
  - [ ] Create `DBDictionarySchema` with `id`, `type`, and `name` (LocalizedText)
  - [ ] Create `DBDictionaryEntrySchema` with `dictionary_id`, `code`, and `name` (LocalizedText)
  - [ ] Export types: `DBDictionary`, `DBDictionaryEntry`

#### 1.2 Form Types (cms module)

- [ ] Create `src/entities/dictionaries/types/dictionary.types.ts`
  - [ ] Export all from cms-data module
  - [ ] Extend DB schemas for form-friendly types:
    - [ ] `DictionarySchema` extends `DBDictionarySchema` - adds `is_new` field
    - [ ] `DictionaryEntrySchema` extends `DBDictionaryEntrySchema` - adds `is_new` field
  - [ ] Export types: `Dictionary`, `DictionaryEntry`

#### 1.3 Update LocalizedText Usage

- [ ] Verify `LocalizedTextSchema` is properly imported
- [ ] Ensure all `name` fields use `LocalizedTextSchema`

### Phase 2: Store Implementation

#### 2.1 Dictionary Store

- [ ] Create `src/entities/dictionaries/stores/dictionary.store.ts`
  - [ ] Create `DictionaryStoreState` interface:
    - [ ] `dictionaries: Record<number, Dictionary>` (keyed by id)
    - [ ] `entries: Record<number, Record<number, DictionaryEntry>>` (dictionary_id -> entry_id -> entry)
    - [ ] `hasChanged: boolean`
    - [ ] `deletedDictionaryIds: number[]`
    - [ ] `deletedEntryIds: number[]`
  - [ ] Create `DictionaryStoreActions` interface:
    - [ ] `addDictionary(dictionary: Dictionary): void`
    - [ ] `updateDictionary(id: number, updater: (draft: Dictionary) => void): void`
    - [ ] `deleteDictionary(id: number): void`
    - [ ] `addEntry(dictionaryId: number, entry: DictionaryEntry): void`
    - [ ] `updateEntry(dictionaryId: number, entryId: number, updater: (draft: DictionaryEntry) => void): void`
    - [ ] `deleteEntry(dictionaryId: number, entryId: number): void`
  - [ ] Create `DictionaryStore` type combining state and actions
  - [ ] Create `createDictionaryStore` StateCreator function
  - [ ] Create `createStandaloneDictionaryStore` utility function

#### 2.2 Store Context and Providers

- [ ] Create `src/entities/dictionaries/stores/contexts/dictionary-store.context.tsx`
  - [ ] Create context with proper type safety
  - [ ] Create provider component
  - [ ] Export context hook

#### 2.3 Store Hooks

- [ ] Create `src/entities/dictionaries/stores/hooks/use-dictionary-store.ts`
  - [ ] Create hook to access dictionary store
  - [ ] Create hook to access dictionary actions
  - [ ] Create hook to access specific dictionary by id
  - [ ] Create hook to access specific entry by dictionary_id and entry_id
  - [ ] Create hook to get sorted entry IDs:
    ```typescript
    // Sorts entries alphabetically by their code property
    useDictionaryEntriesSorted(dictionaryId: number): number[];
    ```

### Phase 3: Business Logic Hooks

#### 3.1 Dictionary Hooks

- [ ] Create `src/entities/dictionaries/hooks/use-dictionary-type.ts`
  - [ ] `useDictionaryTypeDisplay(id: number): string | undefined`
  - [ ] `useDictionaryTypeInput(id: number): { inputId: string; value: string; onChange: (value: string) => void; placeholder: string; error?: string }`

- [ ] Create `src/entities/dictionaries/hooks/use-dictionary-name.ts`
  - [ ] `useDictionaryNameDisplay(id: number, locale: string): string | undefined`
  - [ ] `useDictionaryNameInput(id: number, locale: string): { inputId: string; value: string; onChange: (value: string) => void; placeholder: string; error?: string }`

#### 3.2 Dictionary Entry Hooks

- [ ] Create `src/entities/dictionaries/hooks/use-dictionary-entry-code.ts`
  - [ ] `useDictionaryEntryCodeDisplay(dictionaryId: number, entryId: number): string | undefined`
  - [ ] `useDictionaryEntryCodeInput(dictionaryId: number, entryId: number): { inputId: string; value: string; onChange: (value: string) => void; placeholder: string; error?: string }`

- [ ] Create `src/entities/dictionaries/hooks/use-dictionary-entry-name.ts`
  - [ ] `useDictionaryEntryNameDisplay(dictionaryId: number, entryId: number, locale: string): string | undefined`
  - [ ] `useDictionaryEntryNameInput(dictionaryId: number, entryId: number, locale: string): { inputId: string; value: string; onChange: (value: string) => void; placeholder: string; error?: string }`

#### 3.3 Hook Index

- [ ] Create `src/entities/dictionaries/hooks/index.ts`
  - [ ] Export all hooks

### Phase 4: Field Components (Props-based, no context)

#### 4.1 Dictionary Components

- [ ] Create `src/entities/dictionaries/components/dictionary-type-input.tsx`
  - [ ] Accept `id: number` as props (no context)
  - [ ] Use standard Input pattern
  - [ ] Memoized component
  - [ ] Use `useDictionaryTypeInput(id)` hook
  - [ ] Handle error display

- [ ] Create `src/entities/dictionaries/components/dictionary-type-display.tsx`
  - [ ] Accept `id: number` as props (no context)
  - [ ] Use `useDictionaryTypeDisplay(id)` hook
  - [ ] Memoized component

- [ ] Create `src/entities/dictionaries/components/dictionary-name-floating-input.tsx`
  - [ ] Accept `id: number` and `locale: string` as props (no context)
  - [ ] Use FloatingInput pattern
  - [ ] Memoized component
  - [ ] Use `useDictionaryNameInput(id, locale)` hook
  - [ ] Handle error display

- [ ] Create `src/entities/dictionaries/components/dictionary-name-display.tsx`
  - [ ] Accept `id: number` and `locale: string` as props (no context)
  - [ ] Use `useDictionaryNameDisplay(id, locale)` hook
  - [ ] Memoized component

#### 4.2 Dictionary Entry Components

- [ ] Create `src/entities/dictionaries/components/dictionary-entry-code-input.tsx`
  - [ ] Accept `dictionaryId: number` and `entryId: number` as props (no context)
  - [ ] Use standard Input pattern
  - [ ] Memoized component
  - [ ] Use `useDictionaryEntryCodeInput(dictionaryId, entryId)` hook

- [ ] Create `src/entities/dictionaries/components/dictionary-entry-name-floating-input.tsx`
  - [ ] Accept `dictionaryId: number`, `entryId: number`, and `locale: string` as props (no context)
  - [ ] Use FloatingInput pattern
  - [ ] Memoized component
  - [ ] Use `useDictionaryEntryNameInput(dictionaryId, entryId, locale)` hook

- [ ] Create `src/entities/dictionaries/components/dictionary-entry-name-display.tsx`
  - [ ] Accept `dictionaryId: number`, `entryId: number`, and `locale: string` as props (no context)
  - [ ] Use `useDictionaryEntryNameDisplay(dictionaryId, entryId, locale)` hook
  - [ ] Memoized component

#### 4.3 Component Index

- [ ] Create `src/entities/dictionaries/components/index.ts`
  - [ ] Export all components

### Phase 5: Test Implementation

#### 5.1 Test Utilities

- [ ] Create `src/entities/dictionaries/mocks/test-utils.tsx`
  - [ ] `createMockDictionary` function
  - [ ] `createMockDictionaryEntry` function
  - [ ] `createTestDictionaryStore` function
  - [ ] `renderWithDictionaryProviders` function
  - [ ] Follow existing test-utils pattern

#### 5.2 Store Tests

- [ ] Create `src/entities/dictionaries/stores/__tests__/dictionary.store.test.ts`
  - [ ] Test dictionary CRUD operations
  - [ ] Test entry CRUD operations
  - [ ] Test change tracking
  - [ ] Test deletion tracking
  - [ ] Follow existing store test patterns

#### 5.3 Hook Tests (These will test store functionality as well)

- [ ] Create `src/entities/dictionaries/hooks/__tests__/use-dictionary-type.test.ts`
  - [ ] Test type display and input hooks
  - [ ] Test store integration
  - [ ] Test type tracking and updates

- [ ] Create `src/entities/dictionaries/hooks/__tests__/use-dictionary-name.test.ts`
  - [ ] Test display and input hooks
  - [ ] Test store integration
  - [ ] Test localization

- [ ] Create `src/entities/dictionaries/hooks/__tests__/use-dictionary-entry-code.test.ts`
  - [ ] Test code display and input hooks
  - [ ] Test store integration

- [ ] Create `src/entities/dictionaries/hooks/__tests__/use-dictionary-entry-name.test.ts`
  - [ ] Test display and input hooks
  - [ ] Test store integration
  - [ ] Test localization

### Phase 6: Module Integration

#### 6.1 Main Module Index

- [ ] Create `src/entities/dictionaries/index.ts`
  - [ ] Export all types
  - [ ] Export all hooks
  - [ ] Export all components
  - [ ] Export store context (only dictionary store context needed)

### Phase 7: Clean Up Existing Files

#### 7.1 Remove Misplaced Files

**Delete specific hook files:**

- [ ] Delete `src/entities/dictionaries/hooks/index.ts`
- [ ] Delete `src/entities/dictionaries/hooks/use-code.ts`
- [ ] Delete `src/entities/dictionaries/hooks/use-description.ts`
- [ ] Delete `src/entities/dictionaries/hooks/use-meta-number.ts`
- [ ] Delete `src/entities/dictionaries/hooks/use-meta-option.ts`
- [ ] Delete `src/entities/dictionaries/hooks/use-meta-text.ts`
- [ ] Delete `src/entities/dictionaries/hooks/use-name.ts`
- [ ] Delete `src/entities/dictionaries/hooks/use-type.ts`
- [ ] Delete `src/entities/dictionaries/hooks/utils/index.ts`
- [ ] Delete `src/entities/dictionaries/hooks/utils/use-bool.ts`
- [ ] Delete `src/entities/dictionaries/hooks/utils/use-locale-text.ts`
- [ ] Delete `src/entities/dictionaries/hooks/utils/use-text.ts`
- [ ] Delete any other `.ts` files in `src/entities/dictionaries/hooks/` and subdirectories

**Delete specific component files:**

- [ ] Delete `src/entities/dictionaries/components/fields/code-input.tsx`
- [ ] Delete `src/entities/dictionaries/components/fields/description-display.tsx`
- [ ] Delete `src/entities/dictionaries/components/fields/description-floating-input.tsx`
- [ ] Delete `src/entities/dictionaries/components/fields/utils/property-toggle-button.tsx`
- [ ] Delete `src/entities/dictionaries/components/fields/__tests__/code-input.test.tsx`
- [ ] Delete `src/entities/dictionaries/components/fields/__tests__/description-display.test.tsx`
- [ ] Delete `src/entities/dictionaries/components/fields/__tests__/description-floating-input.test.tsx`
- [ ] Delete `src/entities/dictionaries/components/fields/__tests__/utils/` (directory and contents)
- [ ] Delete any other `.tsx` and `.test.tsx` files in `src/entities/dictionaries/components/fields/` and subdirectories

**Delete specific store files:**

- [ ] Delete `src/entities/dictionaries/stores/property.store.ts`
- [ ] Delete `src/entities/dictionaries/stores/contexts/property-store.context.tsx`
- [ ] Delete `src/entities/dictionaries/stores/hooks/use-property-store.ts`

**Delete specific library files:**

- [ ] Delete `src/entities/dictionaries/libs/property.libs.ts`

**Delete specific type files (these are property-related, not dictionary-related):**

- [ ] Delete `src/entities/dictionaries/types/form-property.ts`
- [ ] Delete any other property-related `.ts` files in `src/entities/dictionaries/types/` directory

#### 7.2 Clean Up Empty Files and Directories

- [ ] Remove empty `src/entities/dictionaries/stores/dictionaries-store.ts`
- [ ] Remove empty `src/entities/dictionaries/stores/index.ts`
- [ ] Remove empty `src/entities/dictionaries/index.ts`
- [ ] Remove empty `src/entities/dictionaries/types/dictionaries.ts`
- [ ] Remove empty `src/entities/dictionaries/types/dictionary-entries.ts`
- [ ] Remove empty directories after file deletion:
  - [ ] `src/entities/dictionaries/hooks/utils/` (if empty)
  - [ ] `src/entities/dictionaries/hooks/` (if empty)
  - [ ] `src/entities/dictionaries/components/fields/__tests__/` (if empty)
  - [ ] `src/entities/dictionaries/components/fields/` (if empty)
  - [ ] `src/entities/dictionaries/components/` (if empty)
  - [ ] `src/entities/dictionaries/stores/contexts/` (if empty)
  - [ ] `src/entities/dictionaries/stores/hooks/` (if empty)
  - [ ] `src/entities/dictionaries/libs/` (if empty)

#### 7.3 Update Git Status

- [ ] Stage deleted files
- [ ] Stage new files
- [ ] Commit changes with descriptive message

### Phase 8: Mock Data and Testing Integration

#### 8.1 Create Mock Data

- [ ] Create `src/entities/dictionaries/mocks/dictionary-mock-data.ts`
  - [ ] Create mock dictionaries matching SQL schema data
  - [ ] Create mock dictionary entries for each dictionary type
  - [ ] Export functions to generate test data
  - [ ] Include all dictionary types from migration: areas, location_strengths, highlights, etc.

#### 8.2 Update Dictionary Page

- [ ] Update `src/app/[locale]/(protected)/dictionaries/page.tsx`
  - [ ] Import mock data from `mocks/dictionary-mock-data.ts`
  - [ ] Create dictionary store with mock data
  - [ ] Implement basic UI to test components
  - [ ] Add providers for dictionary store
  - [ ] Create simple list/grid view of dictionaries and entries
  - [ ] Test all field components with real data

#### 8.3 Integration Testing

- [ ] Test all components render correctly
- [ ] Test store operations work with mock data
- [ ] Test hooks return expected values
- [ ] Test component interactions update store
- [ ] Verify LocalizedText display works properly
- [ ] Test responsive design and performance

## Validation Checklist

After each phase, verify:

- [ ] All imports resolve correctly
- [ ] TypeScript compilation passes
- [ ] All tests pass
- [ ] ESLint passes
- [ ] Components render without errors
- [ ] Store operations work correctly
- [ ] Hooks return expected values
- [ ] LocalizedText types are used consistently

## Performance Considerations

- [ ] All components are memoized
- [ ] Hooks use proper dependencies
- [ ] Store selectors are optimized
- [ ] No unnecessary re-renders
- [ ] Follow established patterns for performance

## Implementation Notes - UI-First Approach

- **UI-First Development**: Focus on components, store, and hooks first
- **No Database Integration**: Skip server actions and database sync for now
- **No Validation**: Keep schemas simple, add validation in future iterations
- **No Permissions**: No access control requirements for initial version
- **Props-Based Components**: Components accept type/code as props, NO context providers for type/code
- **Mock Data Testing**: Use dictionaries page.tsx for manual testing with mock data
- **Hook Tests Only**: Test hooks only (which will test store integration), NO component tests
- **Mocks Organization**: All mocks and test utilities in ./mocks/ folder
- Follow TDD principles - write tests first where possible
- Use existing patterns from properties module as reference
- Maintain consistency with project conventions
- Keep components simple and focused
- Use proper TypeScript types throughout
- Follow established naming conventions

## 🏗️ Architectural Summary - ID-Based System

### **Key Changes from Original Plan:**

1. **Database Schema**: Added `id SERIAL PRIMARY KEY` to dictionaries, entries reference `dictionary_id` not `type`
2. **Store Structure**: Dictionaries keyed by `id`, entries keyed by `dictionary_id -> entry_id`
3. **Hook Signatures**: All dictionary hooks use `id`, all entry hooks use `dictionaryId`
4. **Component Props**: Dictionary components accept `id`, entry components accept `dictionaryId`

### **Benefits:**

- ✅ **Type Editing**: Can change dictionary types without breaking FK relationships
- ✅ **Data Integrity**: Stable ID references prevent orphaned entries
- ✅ **Performance**: Index-based lookups on integer IDs
- ✅ **Scalability**: Standard relational database patterns

### **Usage Examples:**

```tsx
// Dictionary components
<DictionaryTypeInput id={1} />
<DictionaryNameFloatingInput id={1} locale="en" />

// Entry components (using parent dictionary ID and entry ID)
<DictionaryEntryCodeInput dictionaryId={1} entryId={123} />
<DictionaryEntryNameInput dictionaryId={1} entryId={123} locale="en" />

// Using sorted entries
function DictionaryEntryList({ dictionaryId }: { dictionaryId: number }) {
  const sortedEntryIds = useDictionaryEntriesSorted(dictionaryId);
  return (
    <div>
      {sortedEntryIds.map(entryId => (
        <EntryRow
          key={entryId}
          dictionaryId={dictionaryId}
          entryId={entryId}
        />
      ))}
    </div>
  );
}
```

### **Store Usage:**

```typescript
// Access dictionary by ID
const areasDict = store.dictionaries[1];

// Access entries by dictionary ID and entry ID
const bangkokEntry = store.entries[1][123];

// Update entry
updateEntry(1, 123, (draft) => {
  draft.code = "new_code";
});
```
