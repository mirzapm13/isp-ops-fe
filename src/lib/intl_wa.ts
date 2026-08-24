export function formatIndonesianNumber(phone: string) {
  // Remove any non-digit characters (spaces, dashes, etc.)
  const cleaned = phone.replace(/\D/g, "");

  // Replace leading '0' with '+62'
  return cleaned.replace(/^0/, "62");
}
