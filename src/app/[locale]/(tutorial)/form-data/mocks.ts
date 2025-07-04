import { ItemsBase } from './types';

export const mockedItems: ItemsBase[] = [
  {
    id: "UUID-ITEM-1",
    name: "Item 1",
    type: "options",
    number: 1,
    options: [
      {
        id: "UUID-TAG-1",
        name: {
          en: "Option 1",
          th: "ตัวอักษร 1",
        },
        parentId: "UUID-ITEM-1",
        meta: {
          url: "https://example.com",
          image: "https://example.com/image.jpg",
        },
        order: 1,
      },
      {
        id: "UUID-TAG-2",
        name: {
          en: "Option 2",
          th: "ตัวอักษร 2",
        },
        parentId: "UUID-ITEM-1",
        meta: {
          url: "https://example.com",
          image: "https://example.com/image.jpg",
        },
        order: 2,
      },
    ],
  },
  {
    id: "UUID-ITEM-2",
    name: "Item 2",
    type: "options",
    number: 2,
    options: [
      {
        id: "UUID-TAG-3",
        name: {
          en: "Option 3",
          th: "ตัวอักษร 3",
        },
        parentId: "UUID-ITEM-2",
        meta: {
          url: "https://example.com",
          image: "https://example.com/image.jpg",
        },
        order: 1,
      },
    ],
  },
  {
    id: "UUID-ITEM-3",
    name: "Username",
    type: "text",
    number: 1,
    options: [],
  },
];
