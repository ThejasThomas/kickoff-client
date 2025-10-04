import { parse,format } from "date-fns";

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTimee = (timeString: string) => {
  const [time, modifier] = timeString.toLowerCase().split(/(am|pm)/);
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier.includes("pm") && hours !== 12) hours += 12;
  if (modifier.includes("am") && hours === 12) hours = 0;
  const timeDate = new Date(
    `2000-01-01T${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`
  );
  return timeDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
export const formatTime = (timeString: string) => {
  if (!timeString) return ""; 

  const lower = timeString.toLowerCase();
  let hours: number, minutes: number;

  if (lower.includes("am") || lower.includes("pm")) {
    const [time, modifier] = lower.split(/(am|pm)/);
    [hours, minutes] = time.split(":").map(Number);

    if (modifier === "pm" && hours !== 12) hours += 12;
    if (modifier === "am" && hours === 12) hours = 0;
  } 
  else {
    [hours, minutes] = timeString.split(":").map(Number);
  }

  const timeDate = new Date(
    `2000-01-01T${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`
  );

  return timeDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const convert12To24 = (time12: string): string => {
  try {

    const parsed = parse(time12, "h:mma", new Date());
    if (isNaN(parsed.getTime())) return time12; 
    return format(parsed, "HH:mm");
  } catch {
    return time12;
  }
};

export const formatTimeTo12Hour = (time: string): string => {
  const parsed = parse(time, "HH:mm", new Date()); 
  return format(parsed, "h:mma");
};





export const formatShortDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
