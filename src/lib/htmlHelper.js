export default function htmlDecode(input) {
  if (!input) return "";

  return (
    input
      // Standard HTML entities
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')

      // Apostrophes and quotes in various encodings
      .replace(/&#039;/g, "'")
      .replace(/&#8216;/g, "'") // Left single quotation mark
      .replace(/&#8217;/g, "'") // Right single quotation mark (apostrophe)
      .replace(/&apos;/g, "'")
      .replace(/&#8220;/g, '"') // Left double quotation mark
      .replace(/&#8221;/g, '"') // Right double quotation mark

      // Dashes and other special characters
      .replace(/&#8211;/g, "-") // En dash
      .replace(/&#8212;/g, "—") // Em dash
      .replace(/&nbsp;/g, " ") // Non-breaking space
      .replace(/&#8230;/g, "...")
  ); // Ellipsis
}
