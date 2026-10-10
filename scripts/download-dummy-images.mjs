import fs from 'fs';
import path from 'path';
import https from 'https';

const downloads = [
  // Banners
  { url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80', dest: 'public/images/banners/hero-produce.jpg' },
  { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80', dest: 'public/images/banners/wholesale-logistics.jpg' },
  { url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&q=80', dest: 'public/images/banners/farm-fresh.jpg' },
  { url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&q=80', dest: 'public/images/banners/market-yard.jpg' },

  // Categories
  { url: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=600&q=80', dest: 'public/images/categories/vegetables.jpg' },
  { url: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&q=80', dest: 'public/images/categories/fruits.jpg' },
  { url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80', dest: 'public/images/categories/grains.jpg' },
  { url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&q=80', dest: 'public/images/categories/spices.jpg' },
  { url: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=600&q=80', dest: 'public/images/categories/grocery.jpg' },

  // Products
  { url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&q=80', dest: 'public/images/products/onion-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&q=80', dest: 'public/images/products/onion-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&q=80', dest: 'public/images/products/tomato-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1546470427-e26264be0b11?w=600&q=80', dest: 'public/images/products/tomato-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&q=80', dest: 'public/images/products/potato-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1590165482129-1b8b27698980?w=600&q=80', dest: 'public/images/products/potato-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&q=80', dest: 'public/images/products/banana-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&q=80', dest: 'public/images/products/banana-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&q=80', dest: 'public/images/products/mango-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&q=80', dest: 'public/images/products/mango-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80', dest: 'public/images/products/rice-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&q=80', dest: 'public/images/products/rice-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80', dest: 'public/images/products/turmeric-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=600&q=80', dest: 'public/images/products/turmeric-2.jpg' },
  { url: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=600&q=80', dest: 'public/images/products/sugar-1.jpg' },
  { url: 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=600&q=80', dest: 'public/images/products/sugar-2.jpg' },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const fullPath = path.resolve(dest);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    const get = (uri) => {
      https.get(uri, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return get(res.headers.location);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`Failed to download ${uri}: status ${res.statusCode}`));
        }
        const fileStream = fs.createWriteStream(fullPath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });
        fileStream.on('error', reject);
      }).on('error', reject);
    };

    get(url);
  });
}

async function run() {
  console.log(`Starting download of ${downloads.length} dummy images...`);
  for (const item of downloads) {
    try {
      await download(item.url, item.dest);
      console.log(`✓ Saved: ${item.dest}`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.dest}:`, err.message);
    }
  }
  console.log('All downloads finished.');
}

run();
