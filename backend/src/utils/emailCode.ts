import { customAlphabet } from "nanoid";

// we want numbers and small alphabet letters
export const generateEmailCode = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 6);
