import { RandomId } from "~/types/randomId.type";

export function validateVirtualTourId(virtualTourId: RandomId) {
    const isString =
        typeof virtualTourId.key === "string" &&
        typeof virtualTourId.checksum === "string";
    const isEmpty =
        virtualTourId.key.trim() === "" && virtualTourId.checksum.trim() === "";
    return isString && !isEmpty;
};
