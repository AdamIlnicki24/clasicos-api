import { PASSWORD_MIN_LENGTH } from "./lengths";

export const PASSWORD_REGEX = new RegExp(`^(?=.*[A-Z])(?=.*\\d).{${PASSWORD_MIN_LENGTH},}$`);