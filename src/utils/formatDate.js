import { format, endOfDay, formatRelative, isSameDay } from "date-fns";

export function formatRelativeDate(seconds) {
  let formattedDate = "";

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

export function formatDate(seconds, formatType) {
  let formattedDate = "";
  const today = new Date();

  if (
    formatType == "PPPP" &&
    isSameDate(seconds, Math.floor(today.getTime() / 1000))
  ) {
    return "Today";
  }

  if (seconds) {
    formattedDate = format(new Date(seconds * 1000), formatType);
    // formattedDate =
    //   formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }

  return formattedDate;
}

export const isSameDate = (sec1, sec2) => {
 
  if (sec1 && sec2) {
    return isSameDay(
      endOfDay(new Date(sec1 * 1000)),
      endOfDay(new Date(sec2 * 1000))
    );
  } else return false;
};
