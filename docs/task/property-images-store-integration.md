# Property Images Store Integration Task

## Overview

Refactor property image management to use the images slice as single source of truth, eliminating dual management between `property.images` and separate image handling.

## Current State Analysis

### ✅ What Works

- Images slice exists with proper file handling, temporary IDs, and cleanup
- Property store includes images slice via composition
- Persistence correctly excludes images (files would be lost)
- Hydration handles legacy base64 cleanup
- Existing `is_new` pattern in `MutableProperty`

### ❌ Critical Issues

1. **Type Mismatch**: `ImageData` (File-based) ≠ `DBImage` (URL-based)
2. **Broken Logic**: `convertToMutableProperty` line 27: `is_new: !property` → always `false`
3. **Dual Management**: Images stored in both `property.images` and slice
4. **Architecture Confusion**: Two different image systems competing

### 🎯 Target Architecture

- `MutableImage extends DBImage` + browser fields (`is_new`, file handling)
- Images slice = single source of truth
- Remove `images` from `MutableProperty` for clarity
- Initialize slice from `property.images` on mount
- RPC batch updates using `is_new` pattern

---

## Implementation Plan

### Phase 1: Type System Unification

**Checkpoint 1.1: Fix DBImage Schema**

- [ ] Remove `order` field from `DBImageSchema` (arrays maintain order)
- [ ] Keep `alt` field for accessibility
- [ ] Validate against existing data

**Checkpoint 1.2: Create MutableImage Type**

- [ ] Define `MutableImage extends DBImage`
- [ ] Add browser-specific fields:
  ```typescript
  interface MutableImage extends DBImage {
    is_new: boolean;
    file?: File; // For new uploads
    previewUrl?: string; // For File preview
    uploadedAt?: Date; // Upload timestamp
    name?: string; // Original filename
    size?: number; // File size
  }
  ```

**Checkpoint 1.3: Update Images Slice**

- [ ] Replace `ImageData` with `MutableImage`
- [ ] Update slice methods to handle both DB images and file uploads
- [ ] Add initialization from `DBImage[]` array

### Phase 2: Store Integration

**Checkpoint 2.1: Fix Property Store Bug**

- [ ] Fix `convertToMutableProperty` line 27: `is_new: false`
- [ ] Add comprehensive tests for this function

**Checkpoint 2.2: Remove Images from MutableProperty**

- [ ] Remove `images` field from `MutablePropertySchema`
- [ ] Update all property form hooks that reference `property.images`
- [ ] Ensure no breaking changes to existing components

**Checkpoint 2.3: Store Initialization**

- [ ] Initialize images slice with `property.images` in store creator
- [ ] Convert `DBImage[]` to `MutableImage[]` with `is_new: false`
- [ ] Handle empty/null images array gracefully

### Phase 3: Hook Refactoring

**Checkpoint 3.1: Update usePropertyImagesInput**

- [ ] Replace `useState` with slice actions
- [ ] Use `addImage`, `deleteImage`, `getImagesByIds` from slice
- [ ] Handle reordering via slice `imageIds` array
- [ ] Return combined view: existing + new images

**Checkpoint 3.2: Dual Image Type Handling**

- [ ] Display existing images (DBImage with URLs)
- [ ] Display new uploads (MutableImage with File previews)
- [ ] Convert between File uploads and DBImage format
- [ ] Handle URL cleanup for removed File objects

**Checkpoint 3.3: Component Updates**

- [ ] Update `PropertyImagesInput` to use new hook signature
- [ ] Update image components to handle `MutableImage` type
- [ ] Maintain existing UI behavior and interactions

### Phase 4: Persistence Integration

**Checkpoint 4.1: Form Submission Preparation**

- [ ] Create method to extract final images for submission:
  ```typescript
  getImagesForSubmission(): {
    existingImages: DBImage[];     // is_new: false
    newImages: MutableImage[];     // is_new: true (with Files)
    deletedImageIds: DBSerialID[]; // Track deletions
  }
  ```

**Checkpoint 4.2: RPC Integration Planning**

- [ ] Document expected RPC signature for batch image updates
- [ ] Plan File upload handling (separate from batch RPC)
- [ ] Design ID mapping strategy for new images post-upload

### Phase 5: Testing & Validation

**Checkpoint 5.1: Unit Tests**

- [ ] Test `MutableImage` type conversions
- [ ] Test slice initialization with existing images
- [ ] Test hook behavior with mixed image types
- [ ] Fix broken `convertToMutableProperty` tests

**Checkpoint 5.2: Integration Tests**

- [ ] Test complete image workflow: add → reorder → delete → submit
- [ ] Test store persistence and hydration
- [ ] Test File cleanup on component unmount

**Checkpoint 5.3: Visual Testing**

- [ ] Verify UI displays existing images correctly
- [ ] Verify File upload previews work
- [ ] Verify reordering and deletion interactions
- [ ] Test responsive behavior

---

## Risk Assessment

### 🔴 High Risk

- **Type system breaking changes** - Affects multiple components
- **Store initialization** - Could break persistence/hydration

### 🟡 Medium Risk

- **Hook signature changes** - May require component updates
- **File URL cleanup** - Memory leaks if not handled properly

### 🟢 Low Risk

- **UI components** - Already handle `DBImage` format
- **RPC integration** - Future work, well-isolated

---

## Success Criteria

### Functional

- [ ] Single source of truth for all image management
- [ ] Seamless handling of existing + new images
- [ ] Proper File cleanup and memory management
- [ ] Maintained UI/UX behavior

### Technical

- [ ] Type safety across entire image pipeline
- [ ] No dual management or state conflicts
- [ ] Clean separation: display logic vs. file handling
- [ ] Ready for RPC batch upload integration

### Quality

- [ ] All existing tests pass
- [ ] New functionality thoroughly tested
- [ ] No memory leaks or performance regressions
- [ ] Clear, maintainable code following project patterns

---

## Dependencies & Considerations

- **Supabase File Upload**: May need integration for new image uploads
- **Form Validation**: Ensure image validation works with new structure
- **Error Handling**: Plan for upload failures and network issues
- **Performance**: Consider lazy loading for large image lists

---

## Next Steps

1. Fix critical bug in `convertToMutableProperty` (immediate)
2. Review and approve type system changes (architectural)
3. Begin Phase 1 implementation with small, testable iterations
4. Validate each checkpoint before proceeding to next phase
