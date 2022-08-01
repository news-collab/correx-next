import metascraperFactory from 'metascraper';
import metascraperAuthor from 'metascraper-author';
import metascraperDate from 'metascraper-date';
import metascraperPublisher from 'metascraper-publisher';
import metascraperTitle from 'metascraper-title';
import metascraperURL from 'metascraper-url';
import axios from 'axios';

export async function extractMetadata(url) {
  const metascraper = metascraperFactory([
    metascraperAuthor(),
    metascraperDate(),
    metascraperPublisher(),
    metascraperTitle(),
    metascraperURL()
  ]);

  const response = await axios.get(url, {
    headers: {
      'User-Agent': 'asu-correx / 1.0.0'
    }
  });
  const html = response.data;
  const result = await metascraper({ html, url: url });
  return result;
}
