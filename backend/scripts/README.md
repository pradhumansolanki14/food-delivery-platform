# Backend Scripts

This directory contains utility scripts for database initialization, migration, and seeding.

---

## Quick Reference

| Script | Purpose | Run Once? |
|---|---|---|
| `initPlatformAdmin.js` | Create the first Platform Admin account | Yes (idempotent) |
| `migrate.js` | Convert String `userId` fields to ObjectId | Yes (idempotent) |
| `seed.js` | Populate default categories and cuisines | Yes (idempotent) |

**Recommended order for fresh deployment:**
```bash
node scripts/initPlatformAdmin.js  # 1. Create admin account
node scripts/seed.js               # 2. Seed categories and cuisines
node scripts/migrate.js            # 3. Migrate existing data (if any)
```

---

## Platform Admin Initialization

### Purpose
Creates the first Platform Admin (superadmin) account if one doesn't already exist.

### Usage

**Basic usage (with default credentials):**
```bash
node scripts/initPlatformAdmin.js
```

**Default credentials:**
- Email: `admin@tomato.com`
- Password: `Admin@123456`
- Name: `Platform Administrator`

### Custom Credentials

Set environment variables before running to customize credentials:

```bash
# Windows (PowerShell)
$env:PLATFORM_ADMIN_EMAIL="myemail@example.com"; $env:PLATFORM_ADMIN_PASSWORD="MySecurePass123"; $env:PLATFORM_ADMIN_NAME="My Name"; node scripts/initPlatformAdmin.js

# Linux/Mac (bash)
PLATFORM_ADMIN_EMAIL=myemail@example.com PLATFORM_ADMIN_PASSWORD=MySecurePass123 PLATFORM_ADMIN_NAME="My Name" node scripts/initPlatformAdmin.js
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | ✅ Yes | - | MongoDB connection string (from `.env`) |
| `PLATFORM_ADMIN_EMAIL` | No | `admin@tomato.com` | Platform Admin email |
| `PLATFORM_ADMIN_PASSWORD` | No | `Admin@123456` | Platform Admin password (min 8 chars) |
| `PLATFORM_ADMIN_NAME` | No | `Platform Administrator` | Platform Admin display name |

### Safety Features

- **Idempotent**: Safe to run multiple times. If a superadmin already exists, the script reports the existing account and exits without making changes.
- **Password hashing**: Uses bcrypt with salt (same mechanism as the registration endpoint).
- **Validation**: Checks password length (minimum 8 characters) and required environment variables.
- **Exit codes**: Returns `0` on success or when admin already exists, `1` on error.

### Sample Output

**First run (creates admin):**
```
✓ Connected to MongoDB

✓ Platform Admin created successfully!
  Email: admin@tomato.com
  Name: Platform Administrator
  Role: superadmin
  ID: 65f8a2b3c4d5e6f7a8b9c0d1

⚠️  IMPORTANT: Save these credentials securely!
  Login Email: admin@tomato.com
  Login Password: Admin@123456

  You can now log in to the Admin dashboard with these credentials.

✓ Disconnected from MongoDB
```

**Subsequent runs (admin already exists):**
```
✓ Connected to MongoDB
✓ Platform Admin already exists:
  Email: admin@tomato.com
  Name: Platform Administrator
  Created: 2024-03-15T10:30:45.123Z

No action taken. Script is idempotent.
```

### Security Best Practices

1. **Change the default password immediately** after first login through the Admin dashboard.
2. **Never commit credentials** to version control.
3. **Use strong passwords** in production (combination of uppercase, lowercase, numbers, and special characters).
4. **Run this script only once** per environment (development, staging, production).
5. **Keep credentials secure** - store them in a password manager.

### When to Use

- **Initial setup**: Run once when setting up a new environment.
- **Fresh database**: Run after dropping/recreating the database.
- **Recovery**: Run if the Platform Admin account is accidentally deleted.

### Troubleshooting

**Error: "MONGODB_URI environment variable is required"**
- Ensure `.env` file exists in the backend directory with `MONGODB_URI` set.

**Error: "Password must be at least 8 characters long"**
- Use a password with at least 8 characters when setting `PLATFORM_ADMIN_PASSWORD`.

**Connection errors:**
- Verify MongoDB Atlas connection string is correct.
- Check network connectivity and firewall settings.
- Ensure IP whitelist includes your current IP (MongoDB Atlas).

---

## Migration Script — `migrate.js`

### Purpose
Converts `userId` fields in `orders`, `favorites`, and `reviews` collections from String to ObjectId, so they properly reference `userModel` documents.

### Why This Is Needed
The original schema stored `userId` as a plain String. The multi-restaurant refactoring changed the intended type to `ObjectId` for proper Mongoose population and query scoping. This script performs the one-time data conversion.

### Usage

```bash
node scripts/migrate.js
```

### What It Does

For each collection (`orders`, `favorites`, `reviews`):
1. Reads all documents
2. Checks if `userId` is a String that looks like a 24-char hex ObjectId
3. If yes and the user exists → converts to ObjectId using `$set`
4. If yes but no matching user → logs a warning, leaves unchanged
5. If already an ObjectId → skips (idempotent)

### Safety Guarantees

- **Idempotent**: Running twice produces zero changes on second run
- **Non-destructive**: Never deletes or overwrites any field except `userId` type
- **Graceful warnings**: Unresolvable IDs are warned about and left untouched
- **Exit code 0**: Always exits 0 on completion (even with warnings)
- **Exit code 1**: Only on unexpected fatal error

### Sample Output

**First run (with data to convert):**
```
Connecting to MongoDB...
✓ Connected

Loading user IDs...
✓ Found 42 user(s)

─── Migrating orders ────────────────────────────────
  Converted : 123
  Already ObjectId (skipped): 0
  Unresolvable (warned): 2

─── Migrating favorites ─────────────────────────────
  Converted : 87
  Already ObjectId (skipped): 0
  Unresolvable (warned): 0

─── Migrating reviews ───────────────────────────────
  Converted : 34
  Already ObjectId (skipped): 0
  Unresolvable (warned): 0

═══ Migration complete ══════════════════════════════
  Total documents converted : 244
  Total warnings            : 2

  ⚠  Some userId fields could not be resolved — see warnings above.
     These documents were left unchanged and are safe to investigate manually.

✓ Disconnected from MongoDB
```

**Second run (idempotent — nothing to do):**
```
─── Migrating orders ────────────────────────────────
  Converted : 0
  Already ObjectId (skipped): 125
  Unresolvable (warned): 0
...
  Total documents converted : 0
```

### When to Run
- Once, after deploying the multi-restaurant backend to an environment that has existing data
- Safe to run before or after the server is live (uses standard Mongoose `updateOne`)

---

## Seed Script — `seed.js`

### Purpose
Populates the `categories` and `cuisines` collections with default data if they are empty. Mirrors the hardcoded lists that previously lived in the customer frontend.

### Usage

```bash
node scripts/seed.js
```

### What It Seeds

**Categories (8 items — mirrors `frontend/src/assets/assets.js` `menu_list`):**
- Salad, Rolls, Deserts, Sandwich, Cake, Pure Veg, Pasta, Noodles

**Cuisines (8 items — per Requirement 6.6):**
- Italian 🍝, Chinese 🥡, Indian 🍛, American 🍔, Mexican 🌮, Japanese 🍱, Thai 🍜, Mediterranean 🥙

### Safety Guarantees

- **Idempotent**: Checks `countDocuments()` before inserting; if collection is non-empty, skips entirely
- **Non-destructive**: Never modifies existing documents
- **Logs counts**: Prints exact number of inserted documents
- **Exit code 0**: Always exits 0 on completion

### Sample Output

**First run (empty collections):**
```
Connecting to MongoDB...
✓ Connected

─── Seeding categories ──────────────────────────────
  ✓ Inserted 8 categories:
    • Salad
    • Rolls
    • Deserts
    • Sandwich
    • Cake
    • Pure Veg
    • Pasta
    • Noodles

─── Seeding cuisines ────────────────────────────────
  ✓ Inserted 8 cuisines:
    • 🍝  Italian
    • 🥡  Chinese
    • 🍛  Indian
    • 🍔  American
    • 🌮  Mexican
    • 🍱  Japanese
    • 🍜  Thai
    • 🥙  Mediterranean

═══ Seed complete ═══════════════════════════════════
  Categories and cuisines are now available in the database.

✓ Disconnected from MongoDB
```

**Second run (idempotent — collections already have data):**
```
─── Seeding categories ──────────────────────────────
  ✓ Categories collection already has 8 document(s) — skipping (idempotent)

─── Seeding cuisines ────────────────────────────────
  ✓ Cuisines collection already has 8 document(s) — skipping (idempotent)

═══ Seed complete ═══════════════════════════════════
```

### When to Run
- Once, when setting up a new environment
- Before Restaurant Managers start tagging their restaurants with cuisines
- Before the Admin frontend tries to render the category/cuisine management pages
