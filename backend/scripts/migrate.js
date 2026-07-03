/**
 * Migration Script: Convert String userId fields to ObjectId
 *
 * Converts `userId` fields in orderModel, favoriteModel, and reviewModel
 * from String to ObjectId where a matching userModel document exists.
 *
 * - Idempotent: running a second time produces no changes
 * - Logs a warning for any String userId that cannot be matched to a user
 * - Exits with code 0 on completion (even if there were unresolvable ids)
 * - Exits with code 1 only on unexpected fatal error
 *
 * Usage:
 *   node scripts/migrate.js
 *
 * Requirements: 25.1, 25.2, 25.3, 25.5
 */

import 'dotenv/config';
import mongoose from 'mongoose';

// ─── Models (inline schema to avoid circular import issues) ──
// We use raw Mongoose models to bypass Mongoose's type coercion
// so we can read the raw string value stored on disk.

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String,
}, { strict: false, collection: 'users' });

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.Mixed,
}, { strict: false, collection: 'orders' });

const favoriteSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.Mixed,
}, { strict: false, collection: 'favorites' });

const reviewSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.Mixed,
}, { strict: false, collection: 'reviews' });

// Register models (guard against re-registration in case of partial runs)
const UserMigrate = mongoose.models.UserMigrate || mongoose.model('UserMigrate', userSchema);
const OrderMigrate = mongoose.models.OrderMigrate || mongoose.model('OrderMigrate', orderSchema);
const FavoriteMigrate = mongoose.models.FavoriteMigrate || mongoose.model('FavoriteMigrate', favoriteSchema);
const ReviewMigrate = mongoose.models.ReviewMigrate || mongoose.model('ReviewMigrate', reviewSchema);

// ─── Helpers ──────────────────────────────────────────────────

/**
 * Returns true if value is a valid 24-char hex ObjectId string
 * AND is currently stored as a String (not already an ObjectId).
 */
const isStringUserId = (value) => {
  if (typeof value !== 'string') return false;
  return /^[0-9a-fA-F]{24}$/.test(value);
};

/**
 * Migrate userId fields in one collection.
 *
 * @param {Model}  Model        - Mongoose model with loose schema
 * @param {string} collectionName - Display name for logs
 * @param {Map}    userIdSet    - Set of known user _id strings
 *
 * @returns {{ converted: number, skipped: number, warned: number }}
 */
const migrateCollection = async (Model, collectionName, userIdSet) => {
  let converted = 0;
  let skipped = 0;
  let warned = 0;

  // Only fetch documents where userId is stored as a String
  // Documents already converted to ObjectId will have typeof userId !== 'string'
  const docs = await Model.find({}).lean();

  for (const doc of docs) {
    const rawUserId = doc.userId;

    // Already an ObjectId — skip (idempotency: no-op on second run)
    if (!isStringUserId(rawUserId)) {
      skipped++;
      continue;
    }

    // Valid hex string — check if matching user exists
    if (userIdSet.has(rawUserId)) {
      await Model.updateOne(
        { _id: doc._id },
        { $set: { userId: new mongoose.Types.ObjectId(rawUserId) } }
      );
      converted++;
    } else {
      // Cannot resolve — log warning, leave unchanged (Req 25.2, 25.5)
      console.warn(
        `[WARN] ${collectionName} doc ${doc._id}: userId "${rawUserId}" does not match any user — left unchanged`
      );
      warned++;
    }
  }

  return { converted, skipped, warned };
};

// ─── Main ─────────────────────────────────────────────────────

const run = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('[FATAL] MONGODB_URI environment variable is required');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✓ Connected\n');

  // Build a Set of all known user _id strings for O(1) lookup
  console.log('Loading user IDs...');
  const users = await UserMigrate.find({}, { _id: 1 }).lean();
  const userIdSet = new Set(users.map(u => u._id.toString()));
  console.log(`✓ Found ${userIdSet.size} user(s)\n`);

  const results = {};

  // Migrate orders
  console.log('─── Migrating orders ────────────────────────────────');
  results.orders = await migrateCollection(OrderMigrate, 'orders', userIdSet);
  console.log(`  Converted : ${results.orders.converted}`);
  console.log(`  Already ObjectId (skipped): ${results.orders.skipped}`);
  console.log(`  Unresolvable (warned): ${results.orders.warned}\n`);

  // Migrate favorites
  console.log('─── Migrating favorites ─────────────────────────────');
  results.favorites = await migrateCollection(FavoriteMigrate, 'favorites', userIdSet);
  console.log(`  Converted : ${results.favorites.converted}`);
  console.log(`  Already ObjectId (skipped): ${results.favorites.skipped}`);
  console.log(`  Unresolvable (warned): ${results.favorites.warned}\n`);

  // Migrate reviews
  console.log('─── Migrating reviews ───────────────────────────────');
  results.reviews = await migrateCollection(ReviewMigrate, 'reviews', userIdSet);
  console.log(`  Converted : ${results.reviews.converted}`);
  console.log(`  Already ObjectId (skipped): ${results.reviews.skipped}`);
  console.log(`  Unresolvable (warned): ${results.reviews.warned}\n`);

  const totalConverted = results.orders.converted + results.favorites.converted + results.reviews.converted;
  const totalWarned = results.orders.warned + results.favorites.warned + results.reviews.warned;

  console.log('═══ Migration complete ══════════════════════════════');
  console.log(`  Total documents converted : ${totalConverted}`);
  console.log(`  Total warnings            : ${totalWarned}`);
  if (totalWarned > 0) {
    console.log('\n  ⚠  Some userId fields could not be resolved — see warnings above.');
    console.log('     These documents were left unchanged and are safe to investigate manually.');
  } else {
    console.log('\n  ✓ No unresolvable ids.');
  }

  await mongoose.disconnect();
  console.log('\n✓ Disconnected from MongoDB');
  process.exit(0);
};

run().catch(err => {
  console.error('[FATAL] Unexpected error during migration:', err);
  mongoose.disconnect().finally(() => process.exit(1));
});
