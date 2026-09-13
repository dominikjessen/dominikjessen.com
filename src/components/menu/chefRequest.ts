/**
 * Optional WhatsApp number in international format, digits only (e.g. "4915112345678").
 * Left empty on purpose: wa.me then lets guests pick the chat themselves,
 * so the number isn't published on the site.
 */
const CHEF_WHATSAPP_NUMBER = "";

/** WhatsApp link with a ready-made "can you make this?" message for the chef. */
export function chefRequestUrl(title: string): string {
  const text = `Dom, can you make the ${title} next time?`;
  return `https://wa.me/${CHEF_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
