import { format, subDays } from "date-fns";

export const getDate = (sub: number = 0) => {
    return format(subDays(new Date(), sub), "dd/MM/yyyy");
};
