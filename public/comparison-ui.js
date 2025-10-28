// Comparison UI Handler

class ComparisonUI {
  constructor(comparisonEngine) {
    this.comparison = comparisonEngine;
    this.modal = null;
    this.currentDeviceModel = null;
    this.userBudget = 800;
    this.userPriorities = {
      screenQuality: true,
      camera: true,
      battery: true,
      processor: false,
      networkGen: true
    };
  }

  // Initialize the comparison UI
  async init() {
    await this.comparison.loadDeviceDatabase();
    this.setupModalHTML();
  }

  // Show basic overview after IMEI check
  showOverview(deviceModel, targetElementId = 'model-dump') {
    const overview = this.comparison.getDeviceOverview(deviceModel);

    if (!overview) {
      console.log('Device not found in comparison database');
      return;
    }

    this.currentDeviceModel = deviceModel;
    const targetElement = document.getElementById(targetElementId);

    if (!targetElement) return;

    const percentileClass = this.getPercentileClass(overview.rankDescription);

    const overviewHTML = `
      <div class="comparison-overview fade-in">
        <h3>📊 Device Market Position</h3>

        <div class="comparison-stats">
          <div class="stat-item">
            <div class="stat-label">Overall Ranking</div>
            <div class="stat-value">
              <span class="percentile-badge percentile-${percentileClass}">
                Top ${overview.percentile}%
              </span>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-label">Value Rating</div>
            <div class="stat-value">${overview.rankDescription}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">Price/Value Ratio</div>
            <div class="stat-value">${overview.valueRatio}</div>
            <small style="color: var(--text-secondary);">Higher is better</small>
          </div>
        </div>

        <div class="screen-quality-info">
          <span class="screen-tech-badge">${overview.device.screenTech}</span>
          <strong>Screen Quality: ${overview.device.screenQuality}/10</strong>
          <p style="margin-top: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
            ${overview.screenTechInfo.description || 'Quality display technology'}
          </p>
          <p style="margin-top: 0.5rem; font-size: 0.85rem; font-style: italic;">
            <strong>Important:</strong> Original manufacturer screens provide superior color accuracy and
            brightness uniformity. Aftermarket replacements often have washed-out colors, even with identical specs.
          </p>
        </div>

        <button class="btn-primary btn-block" onclick="comparisonUI.openComparisonModal()">
          🔍 Compare with Other Devices
        </button>
      </div>
    `;

    // Append to target element
    targetElement.insertAdjacentHTML('beforeend', overviewHTML);
  }

  // Get percentile class for styling
  getPercentileClass(description) {
    const map = {
      'Excellent': 'excellent',
      'Very Good': 'very-good',
      'Good': 'good',
      'Fair': 'fair',
      'Entry Level': 'entry'
    };
    return map[description] || 'good';
  }

  // Setup modal HTML structure
  setupModalHTML() {
    if (document.getElementById('comparison-modal')) return;

    const modalHTML = `
      <div id="comparison-modal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Device Comparison & Market Intelligence</h2>
            <button class="modal-close" onclick="comparisonUI.closeModal()">&times;</button>
          </div>
          <div class="modal-body" id="comparison-modal-body">
            <!-- Content will be dynamically loaded -->
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('comparison-modal');

    // Close modal on overlay click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
  }

  // Open comparison modal
  openComparisonModal() {
    if (!this.modal) this.setupModalHTML();

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    this.showPreferenceForm();
  }

  // Close modal
  closeModal() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Show preference collection form
  showPreferenceForm() {
    const modalBody = document.getElementById('comparison-modal-body');

    const formHTML = `
      <div class="preference-form">
        <div class="form-group">
          <h3>What's your budget?</h3>
          <p style="color: var(--text-secondary);">Move the slider to set your maximum price for a used device</p>

          <div class="budget-slider-container">
            <input
              type="range"
              id="budget-slider"
              class="budget-slider"
              min="100"
              max="1500"
              step="50"
              value="${this.userBudget}"
            />
            <div class="budget-value" id="budget-display">$${this.userBudget}</div>
          </div>
        </div>

        <div class="form-group">
          <h3>What matters most to you?</h3>
          <p style="color: var(--text-secondary);">Select the features you care about most</p>

          <div class="priority-options">
            <label class="priority-checkbox ${this.userPriorities.screenQuality ? 'checked' : ''}">
              <input type="checkbox" id="priority-screen" ${this.userPriorities.screenQuality ? 'checked' : ''} />
              Screen Quality
            </label>

            <label class="priority-checkbox ${this.userPriorities.camera ? 'checked' : ''}">
              <input type="checkbox" id="priority-camera" ${this.userPriorities.camera ? 'checked' : ''} />
              Camera
            </label>

            <label class="priority-checkbox ${this.userPriorities.battery ? 'checked' : ''}">
              <input type="checkbox" id="priority-battery" ${this.userPriorities.battery ? 'checked' : ''} />
              Battery Life
            </label>

            <label class="priority-checkbox ${this.userPriorities.processor ? 'checked' : ''}">
              <input type="checkbox" id="priority-processor" ${this.userPriorities.processor ? 'checked' : ''} />
              Performance
            </label>

            <label class="priority-checkbox ${this.userPriorities.networkGen ? 'checked' : ''}">
              <input type="checkbox" id="priority-network" ${this.userPriorities.networkGen ? 'checked' : ''} />
              5G Support
            </label>
          </div>
        </div>

        <button class="btn-primary btn-block" onclick="comparisonUI.showComparison()">
          Show Comparisons
        </button>
      </div>
    `;

    modalBody.innerHTML = formHTML;

    // Setup event listeners
    const budgetSlider = document.getElementById('budget-slider');
    const budgetDisplay = document.getElementById('budget-display');

    budgetSlider.addEventListener('input', (e) => {
      this.userBudget = parseInt(e.target.value);
      budgetDisplay.textContent = `$${this.userBudget}`;
    });

    // Setup checkbox listeners
    const checkboxes = ['screen', 'camera', 'battery', 'processor', 'network'];
    checkboxes.forEach(name => {
      const checkbox = document.getElementById(`priority-${name}`);
      const label = checkbox.parentElement;

      checkbox.addEventListener('change', (e) => {
        const priorityMap = {
          'screen': 'screenQuality',
          'camera': 'camera',
          'battery': 'battery',
          'processor': 'processor',
          'network': 'networkGen'
        };

        this.userPriorities[priorityMap[name]] = e.target.checked;

        if (e.target.checked) {
          label.classList.add('checked');
        } else {
          label.classList.remove('checked');
        }
      });
    });
  }

  // Show comparison results
  showComparison() {
    const modalBody = document.getElementById('comparison-modal-body');

    // Show loading state
    modalBody.innerHTML = `
      <div class="comparison-loading">
        <div class="spinner"></div>
        <p>Analyzing devices and market data...</p>
      </div>
    `;

    // Simulate API delay for better UX
    setTimeout(() => {
      const priorities = {};
      Object.keys(this.userPriorities).forEach(key => {
        if (this.userPriorities[key]) {
          priorities[key] = 10; // Full weight for selected priorities
        }
      });

      const comparison = this.comparison.compareWithAlternatives(
        this.currentDeviceModel,
        this.userBudget
      );

      if (!comparison) {
        modalBody.innerHTML = '<p>Unable to load comparison data. Please try again.</p>';
        return;
      }

      this.renderComparison(comparison);
    }, 800);
  }

  // Render comparison results
  renderComparison(data) {
    const modalBody = document.getElementById('comparison-modal-body');

    const currentDevice = data.currentDevice;
    const alternatives = data.alternatives.slice(0, 5);
    const recommendations = data.recommendations;

    let html = `
      <div class="comparison-results">
        <h3>Your Device</h3>
        ${this.renderDeviceCard(currentDevice, true)}

        ${recommendations.length > 0 ? `
          <div class="recommendations-section">
            <h3>💡 Recommendations for You</h3>
            ${recommendations.map(rec => this.renderRecommendation(rec)).join('')}
          </div>
        ` : ''}

        <h3 style="margin-top: 2rem;">Alternatives Within Your Budget</h3>
        <div class="comparison-grid">
          ${alternatives.map(device => this.renderDeviceCard(device, false)).join('')}
        </div>

        <div style="margin-top: 2rem; padding: 1rem; background: var(--bg-main); border-radius: var(--radius-md);">
          <h4>Market Leaders by Category</h4>
          <div class="comparison-stats" style="margin-top: 1rem;">
            <div class="stat-item">
              <div class="stat-label">Best Screen</div>
              <div class="stat-value" style="font-size: 1rem;">${data.marketLeaders.screenQuality.model}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Best Camera</div>
              <div class="stat-value" style="font-size: 1rem;">${data.marketLeaders.camera.model}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">Best Value</div>
              <div class="stat-value" style="font-size: 1rem;">${data.marketLeaders.value.model}</div>
            </div>
          </div>
        </div>

        <button class="btn-primary btn-block" style="margin-top: 2rem;" onclick="comparisonUI.showPreferenceForm()">
          ← Adjust Preferences
        </button>
      </div>
    `;

    modalBody.innerHTML = html;
  }

  // Render device card
  renderDeviceCard(device, isCurrent = false) {
    const cardClass = isCurrent ? 'current' : '';

    return `
      <div class="device-card ${cardClass}">
        ${isCurrent ? '<div style="text-align: center; margin-bottom: 0.5rem; color: var(--success-color); font-weight: 700;">✓ YOUR DEVICE</div>' : ''}

        <div class="device-header">
          <div class="device-brand">${device.brand}</div>
          <div class="device-model">${device.model}</div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.25rem;">
            ${device.year} • ${device.networkGen}
          </div>
        </div>

        <div class="device-specs">
          <div class="spec-row">
            <span class="spec-label">Screen</span>
            <span class="spec-value">${device.screenTech}</span>
          </div>
          <div class="spec-bar">
            <div class="spec-bar-fill" style="width: ${device.screenQuality * 10}%"></div>
          </div>

          <div class="spec-row">
            <span class="spec-label">Camera</span>
            <span class="spec-value">${device.camera}/10</span>
          </div>
          <div class="spec-bar">
            <div class="spec-bar-fill" style="width: ${device.camera * 10}%"></div>
          </div>

          <div class="spec-row">
            <span class="spec-label">Battery</span>
            <span class="spec-value">${device.battery}/10</span>
          </div>
          <div class="spec-bar">
            <div class="spec-bar-fill" style="width: ${device.battery * 10}%"></div>
          </div>

          <div class="spec-row">
            <span class="spec-label">Overall Score</span>
            <span class="spec-value">${device.featureScore}/100</span>
          </div>
        </div>

        <div class="device-pricing">
          <div>
            <div class="price-new">${this.comparison.formatPrice(device.priceNew)}</div>
            <div class="price-used">${this.comparison.formatPrice(device.priceUsed)}</div>
          </div>
          <div class="value-ratio">
            ${device.valueRatio ? device.valueRatio.toFixed(2) : this.comparison.calculateValueRatio(device).toFixed(2)} Value
          </div>
        </div>
      </div>
    `;
  }

  // Render recommendation card
  renderRecommendation(rec) {
    return `
      <div class="recommendation-card">
        <span class="recommendation-type">${rec.title}</span>
        ${this.renderDeviceCard(rec.device, false)}
        <p class="recommendation-reason">${rec.reason}</p>
      </div>
    `;
  }
}

// Initialize globally
let comparisonUI;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const comparison = new DeviceComparison();
    comparisonUI = new ComparisonUI(comparison);
    comparisonUI.init();
  });
} else {
  const comparison = new DeviceComparison();
  comparisonUI = new ComparisonUI(comparison);
  comparisonUI.init();
}

// Make available globally
if (typeof window !== 'undefined') {
  window.comparisonUI = comparisonUI;
  window.ComparisonUI = ComparisonUI;
}
