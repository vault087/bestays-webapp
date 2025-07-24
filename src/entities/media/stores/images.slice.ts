import { produce } from "immer";
import { StateCreator } from "zustand";
import { DBSerialID, DBTemporarySerialID, generateTemporarySerialId } from "@/entities/common/";
import { DBImage, MutableImage } from "@/entities/media/types/image.type";

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
  addDBImages: (dbImages: DBImage[]) => void;
  updateImage: (imageId: DBSerialID, updater: (draft: MutableImage) => void) => void;
  deleteImage: (imageId: DBSerialID) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;
  clearImages: () => void;
  getImageById: (imageId: DBSerialID) => MutableImage | undefined;
  getImagesByIds: (imageIds: DBSerialID[]) => MutableImage[];
  getAllImagesOrdered: () => MutableImage[];
}

export interface ImageStoreSlice extends ImageStoreSliceState, ImageStoreSliceActions {}

// Helper function to convert DBImage to MutableImage
function convertDBImageToMutableImage(dbImage: DBImage, id: DBSerialID): MutableImage {
  return {
    ...dbImage,
    id,
    is_new: false,
  };
}

export const createImageStoreSlice = (
  initialImages: DBImage[] = [],
): StateCreator<ImageStoreSlice, [], [], ImageStoreSlice> => {
  const convertedImages: Record<DBSerialID, MutableImage> = {};
  const imageIds: DBSerialID[] = [];

  initialImages.forEach((dbImage, index) => {
    const id = (index + 1) as DBSerialID; // Generate sequential IDs for DB images
    const mutableImage = convertDBImageToMutableImage(dbImage, id);
    convertedImages[id] = mutableImage;
    imageIds.push(id);
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
            url: URL.createObjectURL(file), // Use as both display URL and previewUrl
            color: null,
            alt: file.name, // Use filename as initial alt text
            is_new: true,
            file,
            previewUrl: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            uploadedAt: new Date(),
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

    getAllImagesOrdered: () => {
      const state = get();
      return state.imageIds.map((id) => state.images[id]).filter((image): image is MutableImage => image !== undefined);
    },

    addDBImages: (dbImages: DBImage[]) => {
      set(
        produce((draft: ImageStoreSlice) => {
          dbImages.forEach((dbImage, index) => {
            const id = (draft.imageIds.length + index + 1) as DBSerialID;
            const mutableImage = convertDBImageToMutableImage(dbImage, id);
            draft.images[id] = mutableImage;
            draft.imageIds.push(id);
          });
        }),
      );
    },

    reorderImages: (fromIndex: number, toIndex: number) => {
      set(
        produce((draft: ImageStoreSlice) => {
          const [removed] = draft.imageIds.splice(fromIndex, 1);
          draft.imageIds.splice(toIndex, 0, removed);
        }),
      );
    },
  });
};
