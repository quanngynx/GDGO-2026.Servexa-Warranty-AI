 import fs from 'fs';
import path from 'path';
import translate from 'google-translate-api-x';

const enPath = path.join('public', 'locales', 'en', 'translation.json');
const viPath = path.join('public', 'locales', 'vi', 'translation.json');

async function main() {
  const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  let vi = {};
  if (fs.existsSync(viPath)) {
    vi = JSON.parse(fs.readFileSync(viPath, 'utf8'));
  }

  const entries = Object.entries(en);
  let totalTranslated = 0;

  // Translate in batches to avoid overwhelming the API
  const batchSize = 20;
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize);
    
    // Find missing translations
    const toTranslate = batch.filter(([key]) => !vi[key]);
    
    if (toTranslate.length === 0) continue;

    console.log(`Translating batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(entries.length / batchSize)}...`);
    
    try {
      const texts = toTranslate.map(([, val]) => val);
      const res = await translate(texts, { to: 'vi' });
      
      const translations = Array.isArray(res) ? res : [res];
      
      toTranslate.forEach(([key], index) => {
        vi[key] = translations[index].text;
      });

      // Save progress after each successful batch
      fs.writeFileSync(viPath, JSON.stringify(vi, null, 2));
      totalTranslated += toTranslate.length;
      
      // Sleep slightly to prevent rate limits
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error('Translation failed for batch:', e);
      break;
    }
  }

  console.log(`Finished translating ${totalTranslated} new keys!`);
}

main();
