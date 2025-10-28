// Enhanced IMEI Processing with Manual Band Update Support
import { API } from "/api.js";

console.log("Enhanced IMEI checker with crowd-sourcing support loaded");

/**
 * Process IMEI using the new intelligent API
 * @param {string} imei - The IMEI number to check
 * @param {string} userId - Optional user identifier
 */
export async function processImeiEnhanced(imei, userId = null) {
  try {
    // Show loading state
    $("#score-dump").html('<div class="text-center"><h3>Checking IMEI...</h3></div>');
    $("#main-dump").html('');
    $("#model-dump").html('');
    $("#update-form-container").hide();

    // Call the new intelligent endpoint
    const response = await API.checkImei(imei, userId);

    // Handle error messages from API
    if (response.message) {
      const errorHtml = `
        <h1 class="text-center red1">${response.message}</h1>
        <h1 class="text-center red1">NO INFO FOR THE DEVICE IN DATABASE</h1>
      `;
      $("#score-dump").html(errorHtml);
      $("#main-dump").html(errorHtml);
      return;
    }

    // Render the results
    await renderEnhancedResults(response);

  } catch (err) {
    console.error('Error processing IMEI:', err);
    const errorHtml = `
      <h1 class="text-center red1">Error: ${err.message}</h1>
      <p class="text-center">Please try again or contact support.</p>
    `;
    $("#score-dump").html(errorHtml);
    $("#main-dump").html(errorHtml);
  }
}

/**
 * Render results with data completeness indicators and manual update form
 */
async function renderEnhancedResults(data) {
  const display = val => (val === undefined || val === null || val === '' ? 'N/A' : val);

  const getClassRemark = score => {
    if (score > 74) return ["green-score", "expecting good signal."];
    if (score > 45) return ["yellow-score", "intermittent connection expected."];
    if (score > 0) return ["orange-score", "connection may be poor."];
    return ["red-score", "no reliable connection expected."];
  };

  const [score1Class, remarks1] = getClassRemark(data.scores.att4g);
  const [score2Class, remarks2] = getClassRemark(data.scores.tmobile4g);
  const [score4Class, remarks4] = getClassRemark(data.scores.verizon4g);

  // Data source indicator
  const sourcebadge = data.source === 'cache'
    ? '<span class="badge badge-success">✓ Cached</span>'
    : '<span class="badge badge-info">⟳ Fresh from API</span>';

  // Scores table
  const scoreDump = `
    <div class="text-center">
      <h2>Carrier Compatibility Results ${sourcebadge}</h2>
    </div>
    <table class="table table-striped">
      <tr><th>IMEI</th><td>${display(data.imei)}</td></tr>
      <tr><th class="${score1Class}">AT&T 4G</th><td>${display(data.scores.att4g)}% - ${remarks1}</td></tr>
      <tr><th class="${score2Class}">T-Mobile 4G</th><td>${display(data.scores.tmobile4g)}% - ${remarks2}</td></tr>
      <tr><th class="${score4Class}">Verizon 4G</th><td>${display(data.scores.verizon4g)}% - ${remarks4}</td></tr>
    </table>
  `;

  // Manual update badges
  const twoGBadge = data.manuallyUpdated?.twoG ? '<span class="badge badge-success ml-2">✓ Verified</span>' : '';
  const wcdmaBadge = data.manuallyUpdated?.wcdma ? '<span class="badge badge-success ml-2">✓ Verified</span>' : '';
  const lteBadge = data.manuallyUpdated?.lte ? '<span class="badge badge-success ml-2">✓ Verified</span>' : '';

  // Device info table
  const twoGDisplay = data.bands?.twoG && data.bands.twoG.length > 0 ? data.bands.twoG.join(', ') : 'N/A';
  const wcdmaDisplay = data.bands?.wcdma && data.bands.wcdma.length > 0 ? data.bands.wcdma.join(', ') : 'N/A';
  const lteDisplay = data.bands?.lte && data.bands.lte.length > 0 ? data.bands.lte.join(', ') : 'N/A';

  const mainDump = `
    <div class="device text-center">
      <img src="${display(data.deviceImage)}" alt="Device Image" style="max-width: 300px;"/>
      <h1 style="color:#fff;">${display(data.modelName)}</h1>
      <p style="color:#ccc;">Model: ${display(data.model)}</p>
    </div>
    <table class="table table-striped">
      <tr><th>Net Tech</th><td>${display(data.netTech)}</td></tr>
      <tr><th>Speed</th><td>${display(data.speed)}</td></tr>
      <tr><th>2G Bands${twoGBadge}</th><td>${twoGDisplay}</td></tr>
      <tr><th>WCDMA Bands${wcdmaBadge}</th><td>${wcdmaDisplay}</td></tr>
      <tr><th>LTE Bands${lteBadge}</th><td>${lteDisplay}</td></tr>
    </table>
  `;

  // Data completeness indicator
  const completenessClass = data.dataCompleteness === 100 ? 'bg-success' :
                           data.dataCompleteness > 50 ? 'bg-warning' : 'bg-danger';

  const completenessHtml = `
    <div class="data-completeness mb-3">
      <h5>Data Completeness</h5>
      <div class="progress" style="height: 25px;">
        <div class="progress-bar ${completenessClass}" style="width: ${data.dataCompleteness}%">
          ${data.dataCompleteness}% Complete
        </div>
      </div>
      ${data.missingFields && data.missingFields.length > 0 ?
        `<p class="mt-2 text-warning">Missing: ${data.missingFields.join(', ')}</p>` :
        '<p class="mt-2 text-success">All data complete!</p>'}
    </div>
  `;

  // Render to page
  $("#score-dump").html(scoreDump);
  $("#main-dump").html(mainDump);
  $("#model-dump").html(completenessHtml);

  // Show manual update form if data is incomplete
  if (data.dataCompleteness < 100 && data.model) {
    renderUpdateForm(data);
  } else {
    $("#update-form-container").hide();
  }

  // Show device comparison overview if available
  if (data.modelName) {
    console.log('📱 Device model detected:', data.modelName);

    // Function to show comparison when ready
    const showComparison = () => {
      if (window.comparisonUI) {
        console.log('🔍 Attempting to show comparison overview...');
        try {
          window.comparisonUI.showOverview(data.modelName, 'model-dump');
          console.log('✅ Comparison overview displayed');
        } catch (error) {
          console.error('❌ Error showing comparison:', error);
        }
      } else {
        console.warn('⚠️ Comparison tool not yet initialized, waiting...');
        // Wait for comparison tool to initialize
        setTimeout(showComparison, 300);
      }
    };

    // Check if comparison is ready, or wait for the event
    if (window.comparisonUI) {
      showComparison();
    } else {
      console.log('⏳ Waiting for comparison tool to initialize...');
      window.addEventListener('comparisonReady', showComparison, { once: true });
      // Fallback timeout
      setTimeout(showComparison, 2000);
    }
  } else {
    console.log('ℹ️ No model name available for comparison');
  }
}

/**
 * Render the manual band update form - Only shows fields for missing data
 * Prioritizes LTE/4G bands as they're critical for compatibility
 */
function renderUpdateForm(data) {
  const missingWcdma = !data.bands?.wcdma || data.bands.wcdma.length === 0;
  const missingLte = !data.bands?.lte || data.bands.lte.length === 0;
  const missing2G = !data.bands?.twoG || data.bands.twoG.length === 0;

  // Count how many fields are missing
  const missingCount = [missingLte, missingWcdma, missing2G].filter(Boolean).length;

  // If nothing is missing, don't show the form
  if (missingCount === 0) {
    $("#update-form-container").hide();
    return;
  }

  // Create header based on what's missing - prioritize LTE
  let headerText = 'Help Complete This Model\'s Data';
  let descriptionText = '';

  if (missingLte) {
    headerText = '4G/LTE Bands Needed - Critical for Compatibility!';
    descriptionText = `<p class="alert alert-warning"><strong>⚠️ Missing LTE bands</strong> - These are essential for accurate carrier compatibility scores.</p>`;
  } else if (missingWcdma) {
    headerText = 'WCDMA Bands Needed';
    descriptionText = `<p class="text-muted">Help complete the 3G band information for <strong>${data.model}</strong>.</p>`;
  } else {
    descriptionText = `<p class="text-muted">Help complete the band information for <strong>${data.model}</strong>.</p>`;
  }

  const formHtml = `
    <div class="card mt-4 shadow">
      <div class="card-header ${missingLte ? 'bg-warning text-dark' : 'bg-info text-white'}">
        <h4 class="mb-0">${headerText}</h4>
      </div>
      <div class="card-body">
        ${descriptionText}

        <form id="bands-update-form">
          ${missingLte ? `
            <div class="form-group mb-4">
              <label for="input-lte" class="font-weight-bold text-danger">
                📶 LTE/4G Bands (comma separated) <span class="badge badge-danger">Required</span>
              </label>
              <input type="text" class="form-control form-control-lg" id="input-lte"
                     placeholder="e.g., 2, 4, 5, 12, 13, 17, 25, 26, 66, 71"
                     style="border: 2px solid #ffc107;">
              <small class="form-text text-muted">
                <strong>Most important!</strong> Enter the 4G LTE bands - Example: 2, 4, 5, 12, 66, 71
                <br>Common US bands: 2, 4, 5, 12, 13, 17, 25, 26, 66, 71
              </small>
            </div>
          ` : ''}

          ${missingWcdma ? `
            <div class="form-group mb-3">
              <label for="input-wcdma" class="font-weight-bold">
                📡 WCDMA/3G Bands (comma separated) ${missingLte ? '<span class="badge badge-secondary">Optional</span>' : ''}
              </label>
              <input type="text" class="form-control" id="input-wcdma"
                     placeholder="e.g., 1, 2, 4, 5, 8">
              <small class="form-text text-muted">Example: 2, 4, 5, 8</small>
            </div>
          ` : ''}

          ${missing2G ? `
            <div class="form-group mb-3">
              <label for="input-2g" class="font-weight-bold">
                📻 2G Bands (comma separated) ${(missingLte || missingWcdma) ? '<span class="badge badge-secondary">Optional</span>' : ''}
              </label>
              <input type="text" class="form-control" id="input-2g"
                     placeholder="e.g., GSM 850, GSM 1900">
              <small class="form-text text-muted">Example: GSM 850, GSM 1900, GSM 1800</small>
            </div>
          ` : ''}

          <div class="form-group mb-4">
            <label for="input-userid">Your Name/Email (optional)</label>
            <input type="text" class="form-control" id="input-userid"
                   placeholder="user@example.com">
            <small class="form-text text-muted">Optional: Help us track contributions</small>
          </div>

          <button type="submit" class="btn ${missingLte ? 'btn-warning' : 'btn-primary'} btn-lg btn-block">
            ${missingLte ? '🚀 Update LTE Bands & Save' : '✓ Update & Save'}
          </button>
        </form>

        <div id="update-result" class="mt-3"></div>
      </div>
    </div>
  `;

  $("#update-form-container").html(formHtml).show();

  // Attach form submit handler
  $("#bands-update-form").on("submit", async function(e) {
    e.preventDefault();
    await handleBandUpdate(data.model);
  });
}

/**
 * Handle band update form submission
 */
async function handleBandUpdate(model) {
  try {
    // Show loading state
    $("#update-result").html('<div class="alert alert-info">Updating bands...</div>');

    // Parse input values
    const bandsData = {};

    const twoGInput = $("#input-2g").val();
    if (twoGInput) {
      bandsData.twoG = twoGInput.split(',').map(b => b.trim()).filter(b => b);
    }

    const wcdmaInput = $("#input-wcdma").val();
    if (wcdmaInput) {
      bandsData.wcdma = wcdmaInput.split(',').map(b => b.trim()).filter(b => b);
    }

    const lteInput = $("#input-lte").val();
    if (lteInput) {
      bandsData.lte = lteInput.split(',').map(b => b.trim()).filter(b => b);
    }

    const userId = $("#input-userid").val() || 'anonymous';
    bandsData.userId = userId;

    // Validate at least one band is provided
    if (!bandsData.twoG && !bandsData.wcdma && !bandsData.lte) {
      $("#update-result").html('<div class="alert alert-warning">Please fill in at least one band field.</div>');
      return;
    }

    // If LTE field is visible but empty, warn user
    if ($("#input-lte").length > 0 && !bandsData.lte) {
      $("#update-result").html(
        '<div class="alert alert-warning"><strong>LTE bands are critical!</strong> ' +
        'Please fill in the LTE/4G bands field for accurate compatibility scores.</div>'
      );
      return;
    }

    // Call API to update bands
    const result = await API.updateBands(model, bandsData);

    // Show success message with emphasis on LTE if updated
    const lteUpdated = bandsData.lte && bandsData.lte.length > 0;
    const successMessage = lteUpdated
      ? '<strong>Excellent!</strong> LTE bands updated - compatibility scores will now be accurate! 🎉'
      : '<strong>Success!</strong> Bands updated successfully. Thank you for your contribution!';

    $("#update-result").html(`
      <div class="alert alert-success">
        ${successMessage}
        <br>
        <small>Data completeness: ${result.dataCompleteness}%</small>
      </div>
    `);

    // Refresh the display with updated data
    setTimeout(() => {
      $("#update-form-container").slideUp();

      // Re-render with updated data
      const updatedData = {
        imei: $("#score-dump").find('td').first().text(),
        model: result.model,
        bands: result.bands,
        manuallyUpdated: result.manuallyUpdated,
        scores: result.scores,
        dataCompleteness: result.dataCompleteness,
        missingFields: result.missingFields,
      };

      // Update the band rows in the existing table
      if (result.bands.twoG && result.bands.twoG.length > 0) {
        $("#main-dump table tr").filter(function() {
          return $(this).find('th').text().includes('2G Bands');
        }).find('td').html(result.bands.twoG.join(', '));
      }

      if (result.bands.wcdma && result.bands.wcdma.length > 0) {
        $("#main-dump table tr").filter(function() {
          return $(this).find('th').text().includes('WCDMA');
        }).find('td').html(result.bands.wcdma.join(', '));
      }

      if (result.bands.lte && result.bands.lte.length > 0) {
        $("#main-dump table tr").filter(function() {
          return $(this).find('th').text().includes('LTE');
        }).find('td').html(result.bands.lte.join(', '));
      }

      // Update completeness indicator
      const completenessClass = result.dataCompleteness === 100 ? 'bg-success' :
                               result.dataCompleteness > 50 ? 'bg-warning' : 'bg-danger';

      const completenessHtml = `
        <div class="data-completeness mb-3">
          <h5>Data Completeness</h5>
          <div class="progress" style="height: 25px;">
            <div class="progress-bar ${completenessClass}" style="width: ${result.dataCompleteness}%">
              ${result.dataCompleteness}% Complete
            </div>
          </div>
          ${result.missingFields && result.missingFields.length > 0 ?
            `<p class="mt-2 text-warning">Missing: ${result.missingFields.join(', ')}</p>` :
            '<p class="mt-2 text-success">All data complete! Thank you!</p>'}
        </div>
      `;
      $("#model-dump").html(completenessHtml);
    }, 2000);

  } catch (err) {
    console.error('Error updating bands:', err);
    $("#update-result").html(`
      <div class="alert alert-danger">
        <strong>Error:</strong> ${err.message}
      </div>
    `);
  }
}

// Backward compatibility: keep the old function name
export async function processImeiActual(response, type) {
  // If called with response object, extract IMEI and process
  if (typeof response === 'object' && response.query) {
    await processImeiEnhanced(response.query);
  } else if (typeof response === 'string') {
    await processImeiEnhanced(response);
  }
}
