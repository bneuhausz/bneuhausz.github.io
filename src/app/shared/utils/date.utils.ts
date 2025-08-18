export const formatDateToYYYYMMDD = (dateStr: string | undefined): string | undefined => {
  if (!dateStr) return undefined;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toISOString().slice(0, 10);
};
