
export const formatWhatsAppUrl = (number: string, text: string) => {
    if (!number) return '#';

    let cleaned = number.replace(/\D/g, '');

    // Handle Rwandan local format (078...)
    if (cleaned.startsWith('0')) {
        cleaned = '25' + cleaned;
    }
    // Handle missing country code (788...)
    else if (cleaned.length === 9) {
        cleaned = '250' + cleaned;
    }
    // Ensure 250 prefix for any other format that isn't already correct
    else if (!cleaned.startsWith('250')) {
        cleaned = '250' + cleaned;
    }

    return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
};
