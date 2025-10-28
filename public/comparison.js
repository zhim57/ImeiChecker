// Device Comparison and Market Intelligence Module

class DeviceComparison {
  constructor() {
    this.devices = [];
    this.currentDevice = null;
    this.userPreferences = {
      maxBudget: 800,
      priorities: {
        screenQuality: 10,
        camera: 7,
        battery: 7,
        processor: 5,
        networkGen: 8
      }
    };
    this.loadDeviceDatabase();
  }

  // Load device database
  async loadDeviceDatabase() {
    console.log('📦 Loading device database...');
    try {
      const response = await fetch('/data/device-database.json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      this.devices = data.devices;
      this.screenTechRankings = data.screenTechRankings;
      this.screenQualityNotes = data.screenQualityNotes;
      console.log(`✅ Loaded ${this.devices.length} devices from database`);
      return true;
    } catch (error) {
      console.error('❌ Error loading device database:', error);
      return false;
    }
  }

  // Find device by model name or partial match
  findDevice(searchTerm) {
    if (!searchTerm) {
      console.warn('⚠️ No search term provided to findDevice');
      return null;
    }

    console.log(`🔎 Searching for device: "${searchTerm}"`);
    console.log(`📊 Database has ${this.devices ? this.devices.length : 0} devices`);
    const normalized = searchTerm.toLowerCase().trim();

    if (!this.devices || this.devices.length === 0) {
      console.error('❌ Device database is empty or not loaded!');
      return null;
    }

    const found = this.devices.find(device => {
      const modelLower = device.model.toLowerCase();
      const brandLower = device.brand.toLowerCase();

      const matches = modelLower.includes(normalized) ||
             normalized.includes(modelLower) ||
             `${brandLower} ${modelLower}`.includes(normalized);

      if (matches) {
        console.log(`✅ Found match: ${device.brand} ${device.model}`);
      }

      return matches;
    });

    if (!found) {
      console.warn(`⚠️ No device found matching "${searchTerm}"`);
      console.log('🔍 Search term normalized:', normalized);
      console.log('📋 First 10 available devices:', this.devices.slice(0, 10).map(d => `"${d.brand} ${d.model}"`).join(', '));
    }

    return found;
  }

  // Calculate price-to-value ratio
  calculateValueRatio(device, useNewPrice = false) {
    const price = useNewPrice ? device.priceNew : device.priceUsed;
    if (!price || price === 0) return 0;

    // Value ratio = (Feature Score / Price) * 100
    // Higher is better (more features per dollar)
    return (device.featureScore / price) * 100;
  }

  // Calculate percentile ranking
  calculatePercentile(device) {
    if (!device) return 0;

    const sorted = [...this.devices].sort((a, b) => b.featureScore - a.featureScore);
    const rank = sorted.findIndex(d => d.id === device.id) + 1;
    const percentile = ((sorted.length - rank + 1) / sorted.length) * 100;

    return Math.round(percentile);
  }

  // Get device overview for quick display
  getDeviceOverview(deviceModel) {
    const device = this.findDevice(deviceModel);
    if (!device) return null;

    this.currentDevice = device;
    const percentile = this.calculatePercentile(device);
    const valueRatio = this.calculateValueRatio(device);

    return {
      device,
      percentile,
      valueRatio: valueRatio.toFixed(2),
      rankDescription: this.getPercentileDescription(percentile),
      screenTechInfo: this.screenTechRankings[device.screenTech] || {}
    };
  }

  // Get percentile description
  getPercentileDescription(percentile) {
    if (percentile >= 90) return 'Excellent';
    if (percentile >= 75) return 'Very Good';
    if (percentile >= 50) return 'Good';
    if (percentile >= 25) return 'Fair';
    return 'Entry Level';
  }

  // Find similar devices based on user preferences
  findSimilarDevices(budget, priorities = null) {
    if (priorities) {
      this.userPreferences.priorities = { ...this.userPreferences.priorities, ...priorities };
    }
    this.userPreferences.maxBudget = budget;

    // Filter devices within budget
    const affordable = this.devices.filter(d => d.priceUsed <= budget);

    // Calculate weighted score for each device
    const scored = affordable.map(device => {
      let weightedScore = 0;
      let totalWeight = 0;

      for (const [key, weight] of Object.entries(this.userPreferences.priorities)) {
        if (device[key]) {
          // Normalize networkGen to numeric
          let value = device[key];
          if (key === 'networkGen') {
            value = device.networkGen === '5G' ? 10 : device.networkGen === '4G' ? 6 : 3;
          }
          weightedScore += value * weight;
          totalWeight += weight;
        }
      }

      const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;
      const valueRatio = this.calculateValueRatio(device);

      return {
        ...device,
        weightedScore: finalScore,
        valueRatio: valueRatio
      };
    });

    // Sort by weighted score descending
    return scored.sort((a, b) => b.weightedScore - a.weightedScore);
  }

  // Get best value devices in price range
  getBestValueDevices(minPrice = 0, maxPrice = 2000, limit = 5) {
    const inRange = this.devices.filter(d =>
      d.priceUsed >= minPrice && d.priceUsed <= maxPrice
    );

    const withRatio = inRange.map(device => ({
      ...device,
      valueRatio: this.calculateValueRatio(device)
    }));

    return withRatio
      .sort((a, b) => b.valueRatio - a.valueRatio)
      .slice(0, limit);
  }

  // Get devices by screen quality
  getTopScreenQualityDevices(limit = 10) {
    return [...this.devices]
      .sort((a, b) => b.screenQuality - a.screenQuality)
      .slice(0, limit);
  }

  // Get market leaders by category
  getMarketLeaders() {
    const categories = {
      overall: this.devices.reduce((max, d) => d.featureScore > max.featureScore ? d : max),
      camera: this.devices.reduce((max, d) => d.camera > max.camera ? d : max),
      battery: this.devices.reduce((max, d) => d.battery > max.battery ? d : max),
      screenQuality: this.devices.reduce((max, d) => d.screenQuality > max.screenQuality ? d : max),
      value: this.getBestValueDevices(0, 2000, 1)[0]
    };

    return categories;
  }

  // Compare current device with alternatives
  compareWithAlternatives(deviceModel, budget) {
    const current = this.findDevice(deviceModel);
    if (!current) return null;

    const alternatives = this.findSimilarDevices(budget);
    const bestValue = this.getBestValueDevices(0, budget, 3);
    const leaders = this.getMarketLeaders();

    return {
      currentDevice: {
        ...current,
        percentile: this.calculatePercentile(current),
        valueRatio: this.calculateValueRatio(current)
      },
      alternatives: alternatives.slice(0, 5),
      bestValue: bestValue,
      marketLeaders: leaders,
      recommendations: this.generateRecommendations(current, alternatives, budget)
    };
  }

  // Generate recommendations
  generateRecommendations(currentDevice, alternatives, budget) {
    const recommendations = [];
    const currentRatio = this.calculateValueRatio(currentDevice);

    // Find better value options
    const betterValue = alternatives.filter(d =>
      d.valueRatio > currentRatio && d.id !== currentDevice.id
    );

    if (betterValue.length > 0) {
      recommendations.push({
        type: 'better-value',
        title: 'Better Value Option',
        device: betterValue[0],
        reason: `${betterValue[0].model} offers ${((betterValue[0].valueRatio / currentRatio - 1) * 100).toFixed(0)}% better value for money`
      });
    }

    // Find screen quality upgrade
    const betterScreen = alternatives.filter(d =>
      d.screenQuality > currentDevice.screenQuality &&
      d.priceUsed <= budget * 1.1 &&
      d.id !== currentDevice.id
    );

    if (betterScreen.length > 0) {
      recommendations.push({
        type: 'screen-upgrade',
        title: 'Screen Quality Upgrade',
        device: betterScreen[0],
        reason: `Superior ${betterScreen[0].screenTech} display with better color accuracy`
      });
    }

    // Find similar price better features
    const similarPrice = alternatives.filter(d =>
      Math.abs(d.priceUsed - currentDevice.priceUsed) < 100 &&
      d.featureScore > currentDevice.featureScore &&
      d.id !== currentDevice.id
    );

    if (similarPrice.length > 0) {
      recommendations.push({
        type: 'similar-price',
        title: 'Similar Price, Better Features',
        device: similarPrice[0],
        reason: `Comparable price with ${similarPrice[0].featureScore - currentDevice.featureScore} point higher feature score`
      });
    }

    return recommendations;
  }

  // Format price with currency
  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  // Get all brands
  getBrands() {
    return [...new Set(this.devices.map(d => d.brand))].sort();
  }

  // Filter by brand
  filterByBrand(brand) {
    return this.devices.filter(d => d.brand === brand);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DeviceComparison;
}

// Make available globally in browser
if (typeof window !== 'undefined') {
  window.DeviceComparison = DeviceComparison;
}
