export const TagUtil = {
  getTagsFromText: (text: string): string[] => {
    const matches = [...text.matchAll(/(\#\w+)/g)];
    return matches.map((match) => match[1]);
  },
};
