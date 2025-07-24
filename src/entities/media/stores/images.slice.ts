import { produce } from "immer";
import { StateCreator } from "zustand";
import { DBSerialID, DBTemporarySerialID, generateTemporarySerialId } from "@/entities/common/";

// Image entity types
export interface ImageData {
  id: DBSerialID;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export interface MutableImage extends ImageData {
  is_new: boolean;
}

// Image Store Slice State
export interface ImageStoreSliceState {
  images: Record<DBSerialID, MutableImage>;
  imageIds: DBSerialID[];
  deletedImageIds: DBSerialID[];
  temporaryImageId: DBTemporarySerialID;
}

// Image Store Slice Actions
export interface ImageStoreSliceActions {
  addImage: (file: File) => MutableImage;
  updateImage: (imageId: DBSerialID, updater: (draft: MutableImage) => void) => void;
  deleteImage: (imageId: DBSerialID) => void;
  clearImages: () => void;
  getImageById: (imageId: DBSerialID) => MutableImage | undefined;
  getImagesByIds: (imageIds: DBSerialID[]) => MutableImage[];
}

export interface ImageStoreSlice extends ImageStoreSliceState, ImageStoreSliceActions {}

export const createImageStoreSlice = (
  initialImages: ImageData[] = [],
): StateCreator<ImageStoreSlice, [], [], ImageStoreSlice> => {
  const convertedImages: Record<DBSerialID, MutableImage> = {};
  const imageIds: DBSerialID[] = [];

  initialImages.forEach((image) => {
    convertedImages[image.id] = { ...image, is_new: false };
    imageIds.push(image.id);
  });

  return (set, get) => ({
    images: convertedImages,
    imageIds: imageIds,
    deletedImageIds: [],
    temporaryImageId: generateTemporarySerialId(),

    addImage: (file: File) => {
      let newImage: MutableImage;

      set(
        produce((draft: ImageStoreSlice) => {
          newImage = {
            id: draft.temporaryImageId,
            file,
            previewUrl: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date(),
            is_new: true,
          };

          draft.images[newImage.id] = newImage;
          draft.imageIds.push(newImage.id);
          draft.temporaryImageId--;
        }),
      );

      return newImage!;
    },

    updateImage: (imageId: DBSerialID, updater: (draft: MutableImage) => void) => {
      set(
        produce((draft: ImageStoreSlice) => {
          if (draft.images[imageId]) {
            updater(draft.images[imageId]);
          }
        }),
      );
    },

    deleteImage: (imageId: DBSerialID) => {
      set(
        produce((draft: ImageStoreSlice) => {
          const image = draft.images[imageId];
          if (!image) return;

          // Clean up object URL
          if (image.previewUrl) {
            URL.revokeObjectURL(image.previewUrl);
          }

          if (!image.is_new) {
            draft.deletedImageIds.push(imageId);
          }

          delete draft.images[imageId];
          draft.imageIds = draft.imageIds.filter((id) => id !== imageId);
        }),
      );
    },

    clearImages: () => {
      set(
        produce((draft: ImageStoreSlice) => {
          Object.values(draft.images).forEach((image) => {
            if (image.previewUrl) {
              URL.revokeObjectURL(image.previewUrl);
            }
            if (!image.is_new) {
              draft.deletedImageIds.push(image.id);
            }
          });

          draft.images = {};
          draft.imageIds = [];
        }),
      );
    },

    getImageById: (imageId: DBSerialID) => {
      return get().images[imageId];
    },

    getImagesByIds: (imageIds: DBSerialID[]) => {
      const state = get();
      return imageIds.map((id) => state.images[id]).filter((image): image is MutableImage => image !== undefined);
    },
  });
};
