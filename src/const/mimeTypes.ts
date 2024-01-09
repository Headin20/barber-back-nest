export const mimeTypes = {
  jpg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
} as const;

type ReversedMimeTypes = {
  [M in keyof typeof mimeTypes as (typeof mimeTypes)[M]]: M;
};
export const reversedMimeTypes = Object.entries(mimeTypes).reduce(
  (acc, [ext, mimeType]) => {
    acc[mimeType] = ext as keyof typeof mimeTypes;
    return acc;
  },
  {},
);

export type ImageFileType = (typeof mimeTypes)[keyof typeof mimeTypes];
