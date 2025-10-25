const mongoose = require('mongoose');
const Listing = require('../models/listings');

const MONGO_URL = 'mongodb://127.0.0.1:27017/Deepak';

async function migrate() {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const listings = await Listing.find({});
    console.log(`Found ${listings.length} listings`);

    let updated = 0;
    for (const lst of listings) {
      // If images already present, skip
      if (Array.isArray(lst.images) && lst.images.length > 0) continue;

      // If old single `image` field exists, move it into `images` array
      if (lst.image && (lst.image.url || lst.image.filename)) {
        lst.images = [lst.image];
        // Optionally remove the old field
        lst.image = undefined;
        await lst.save();
        updated++;
        console.log(`Updated listing ${lst._id}`);
      }
    }

    console.log(`Migration complete. Updated ${updated} listings.`);
  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

migrate();
