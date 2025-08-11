import moment from 'moment'

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
export const getSmartDate = (dateStr: string) => {
  const date = moment(dateStr);
  const daysDiff = moment().diff(date, "days");

  return daysDiff < 3 ? date.fromNow() : formatDate(dateStr);
};