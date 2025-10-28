/**
 * Migration Script: Migrate from old schema (Imei, Imei1) to new schema (ImeiCheck, enhanced PhoneModel)
 *
 * This script:
 * 1. Reads all Imei1 records (old IMEI check results)
 * 2. Creates ImeiCheck records for each unique IMEI
 * 3. Updates PhoneModel records with new fields (manuallyUpdated, dataCompleteness, etc.)
 * 4. Ensures data consistency
 *
 * Usage:
 *   node scripts/migrate-to-new-schema.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Import models
const Imei1 = require('../models/imei1');
const PhoneModel = require('../models/phoneModel');
const ImeiCheck = require('../models/imeiCheck');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Calculate data completeness percentage
 */
function calculateDataCompleteness(modelData) {
  let totalFields = 0;
  let filledFields = 0;

  const essentialFields = ['modelName', 'deviceImage', 'netTech', 'speed'];
  essentialFields.forEach(field => {
    totalFields++;
    if (modelData[field]) filledFields++;
  });

  const bandFields = ['twoG', 'wcdma', 'lte'];
  bandFields.forEach(field => {
    totalFields++;
    if (modelData.bands && modelData.bands[field] && modelData.bands[field].length > 0) {
      filledFields++;
    }
  });

  return Math.round((filledFields / totalFields) * 100);
}

/**
 * Main migration function
 */
async function migrate() {
  try {
    console.log('🚀 Starting migration...\n');

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');

    // Step 1: Migrate Imei1 records to ImeiCheck
    console.log('📊 Step 1: Migrating Imei1 records to ImeiCheck...');
    const imei1Records = await Imei1.find({});
    console.log(`   Found ${imei1Records.length} Imei1 records`);

    let imeiCheckCreated = 0;
    let imeiCheckSkipped = 0;

    for (const record of imei1Records) {
      try {
        // Extract IMEI and model from the requests object
        const requests = record.requests;
        const deviceImei = requests.deviceImei || requests.query;

        if (!deviceImei) {
          console.log(`   ⚠️  Skipping record ${record._id}: No IMEI found`);
          imeiCheckSkipped++;
          continue;
        }

        // Extract model
        const data = requests.data || requests;
        const deviceModel = data.models?.[0] || data.model;

        if (!deviceModel) {
          console.log(`   ⚠️  Skipping IMEI ${deviceImei}: No model found`);
          imeiCheckSkipped++;
          continue;
        }

        // Check if ImeiCheck already exists
        const existingCheck = await ImeiCheck.findOne({ imei: String(deviceImei) });

        if (existingCheck) {
          // Update check count
          existingCheck.checkCount += 1;
          existingCheck.lastCheckedAt = record.day || new Date();
          await existingCheck.save();
          imeiCheckSkipped++;
        } else {
          // Create new ImeiCheck record
          await ImeiCheck.create({
            imei: String(deviceImei),
            phoneModel: deviceModel,
            checkedAt: record.day || new Date(),
            source: 'api',
            checkCount: 1,
            lastCheckedAt: record.day || new Date(),
          });
          imeiCheckCreated++;
        }
      } catch (err) {
        console.log(`   ❌ Error processing record ${record._id}:`, err.message);
      }
    }

    console.log(`   ✅ Created ${imeiCheckCreated} new ImeiCheck records`);
    console.log(`   ℹ️  Skipped ${imeiCheckSkipped} existing/invalid records\n`);

    // Step 2: Update PhoneModel records with new fields
    console.log('📊 Step 2: Updating PhoneModel records...');
    const phoneModels = await PhoneModel.find({});
    console.log(`   Found ${phoneModels.length} PhoneModel records`);

    let modelsUpdated = 0;

    for (const model of phoneModels) {
      try {
        let updated = false;

        // Initialize manuallyUpdated if not present
        if (!model.manuallyUpdated) {
          model.manuallyUpdated = {
            twoG: false,
            wcdma: false,
            lte: false,
          };
          updated = true;
        }

        // Initialize lastUpdatedBy if not present
        if (!model.lastUpdatedBy) {
          model.lastUpdatedBy = 'system';
          updated = true;
        }

        // Initialize lastUpdatedAt if not present
        if (!model.lastUpdatedAt) {
          model.lastUpdatedAt = new Date();
          updated = true;
        }

        // Calculate and set dataCompleteness
        const completeness = calculateDataCompleteness(model);
        if (model.dataCompleteness !== completeness) {
          model.dataCompleteness = completeness;
          updated = true;
        }

        // Initialize checkCount if not present
        if (model.checkCount === undefined) {
          // Count how many times this model appears in ImeiCheck
          const checkCount = await ImeiCheck.countDocuments({ phoneModel: model.model });
          model.checkCount = checkCount;
          updated = true;
        }

        if (updated) {
          await model.save();
          modelsUpdated++;
        }
      } catch (err) {
        console.log(`   ❌ Error updating model ${model.model}:`, err.message);
      }
    }

    console.log(`   ✅ Updated ${modelsUpdated} PhoneModel records\n`);

    // Step 3: Summary
    console.log('📊 Migration Summary:');
    const totalImeiChecks = await ImeiCheck.countDocuments();
    const totalPhoneModels = await PhoneModel.countDocuments();
    const incompleteModels = await PhoneModel.countDocuments({ dataCompleteness: { $lt: 100 } });
    const completeModels = await PhoneModel.countDocuments({ dataCompleteness: 100 });

    console.log(`   Total ImeiCheck records: ${totalImeiChecks}`);
    console.log(`   Total PhoneModel records: ${totalPhoneModels}`);
    console.log(`   Complete models (100%): ${completeModels}`);
    console.log(`   Incomplete models: ${incompleteModels}`);

    console.log('\n✨ Migration completed successfully!\n');

    // Close connection
    await mongoose.connection.close();
    console.log('👋 Disconnected from MongoDB');

  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
}

// Run migration
if (require.main === module) {
  migrate()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal error:', err);
      process.exit(1);
    });
}

module.exports = { migrate };
