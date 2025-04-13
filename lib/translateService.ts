// Hindi translations for common UI elements
const uiTranslations: Record<string, string> = {
  'Like': 'पसंद करें',
  'Comment': 'टिप्पणी करें',
  'Share': 'शेयर करें',
  'Save': 'सहेजें',
  'Swipe up for next': 'अगले के लिए ऊपर स्वाइप करें',
  'Related News': 'संबंधित खबरें',
  'More news coming soon...': 'जल्द ही और समाचार आ रहे हैं...',
  'Stay tuned for related articles': 'संबंधित लेखों के लिए बने रहें',
  'Back to Home': 'होम पेज पर वापस जाएं',
  'Article Not Found': 'लेख नहीं मिला',
  'We couldn\'t find the article you were looking for.': 'हमें आपका वांछित लेख नहीं मिला।',
};

// Cached translations for article content
const cachedTranslations: Map<string, string> = new Map();

/**
 * Translates UI text using predefined translations
 * @param text The English text to translate
 * @returns The Hindi translation if available, otherwise the original text
 */
export function translateUiText(text: string): string {
  return uiTranslations[text] || text;
}

/**
 * Mock translation service for article content
 * In a real application, this would call a translation API like Google Translate
 * @param text Text to translate from English to Hindi
 * @returns Translated text
 */
export async function translateToHindi(text: string): Promise<string> {
  // Check if we already have this translation cached
  if (cachedTranslations.has(text)) {
    return cachedTranslations.get(text)!;
  }

  // In a real app, we would call an API here
  // For now, we'll use a simple mapping for common news terms
  // and return a modified version for demonstration purposes
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // This is a very basic simulation for demonstration
  // In a real app, we would use a proper translation API
  let translatedText = text;
  
  // Demo translations for common news terms
  const wordMap: Record<string, string> = {
    'government': 'सरकार',
    'tech': 'प्रौद्योगिकी',
    'education': 'शिक्षा',
    'health': 'स्वास्थ्य',
    'business': 'व्यापार',
    'sports': 'खेल',
    'Gondia': 'गोंदिया',
    'Maharashtra': 'महाराष्ट्र',
    'India': 'भारत',
    'new': 'नया',
    'innovation': 'नवाचार',
    'development': 'विकास',
    'announces': 'घोषणा करता है',
    'launched': 'लॉन्च किया',
    'digital': 'डिजिटल',
    'policy': 'नीति',
    'student': 'छात्र',
    'research': 'अनुसंधान',
    'science': 'विज्ञान',
    'economy': 'अर्थव्यवस्था',
    'market': 'बाज़ार',
    'conservation': 'संरक्षण',
    'environment': 'पर्यावरण',
    'project': 'परियोजना',
    'AI': 'एआई',
    'artificial intelligence': 'कृत्रिम बुद्धिमत्ता',
    'robot': 'रोबोट',
    'safety': 'सुरक्षा',
    'measure': 'माप',
    'company': 'कंपनी',
    'researchers': 'शोधकर्ता',
    'discovered': 'खोज की',
    'treatment': 'उपचार',
    'news': 'समाचार',
    'festival': 'त्योहार',
    'agriculture': 'कृषि',
    'farmers': 'किसान',
    'railway': 'रेलवे',
    'station': 'स्टेशन',
    'water': 'पानी',
  };
  
  // Very simple word replacement - not grammatically correct Hindi!
  Object.entries(wordMap).forEach(([english, hindi]) => {
    // Case insensitive replace all occurrences
    const regex = new RegExp(english, 'gi');
    translatedText = translatedText.replace(regex, hindi);
  });
  
  // Cache the translation for future use
  cachedTranslations.set(text, translatedText);
  
  return translatedText;
}