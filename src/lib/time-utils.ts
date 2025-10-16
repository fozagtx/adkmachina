export function parseTimeToHHMMSS(input: string): string {
  const trimmed = input.trim().toLowerCase();

  if (/^\d{2}:\d{2}:\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
    return `00:${trimmed.padStart(5, "0")}`;
  }

  const hourMatch = trimmed.match(/(\d+)\s*(h|hour|hours)/);
  const minuteMatch = trimmed.match(/(\d+)\s*(m|min|minute|minutes)/);
  const secondMatch = trimmed.match(/(\d+)\s*(s|sec|second|seconds)/);

  if (hourMatch || minuteMatch || secondMatch) {
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
    const seconds = secondMatch ? parseInt(secondMatch[1]) : 0;
    return formatTime(hours, minutes, seconds);
  }

  const numMatch = trimmed.match(/^\d+$/);
  if (numMatch) {
    const totalSeconds = parseInt(trimmed);
    return secondsToHHMMSS(totalSeconds);
  }

  throw new Error(
    `Invalid time format: "${input}". Use formats like "5s", "2m", "1:30", or "00:01:30"`,
  );
}

function secondsToHHMMSS(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return formatTime(hours, minutes, seconds);
}

function formatTime(hours: number, minutes: number, seconds: number): string {
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}
