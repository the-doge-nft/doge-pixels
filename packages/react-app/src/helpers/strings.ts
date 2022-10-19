export const abbreviate = (input: string, spaces: number = 4) => {
  return `${input.substring(0, spaces)}...${input.substring(input.length - spaces, input.length)}`;
};
