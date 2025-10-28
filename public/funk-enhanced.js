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
}

/**
 * Render the manual band update form
 */
function renderUpdateForm(data) {
  const missingWcdma = !data.bands?.wcdma || data.bands.wcdma.length === 0;
  const missingLte = !data.bands?.lte || data.bands.lte.length === 0;
  const missing2G = !data.bands?.twoG || data.bands.twoG.length === 0;

  const formHtml = `
    <div class="card mt-4">
      <div class="card-header bg-info text-white">
        <h4>Help Complete This Model's Data</h4>
      </div>
      <div class="card-body">
        <p>Some band information is missing for <strong>${data.model}</strong>.
           You can help by filling it in! Your contribution will help other users.</p>

        <form id="bands-update-form">
          ${missing2G ? `
            <div class="form-group">
              <label for="input-2g">2G Bands (comma separated)</label>
              <input type="text" class="form-control" id="input-2g"
                     placeholder="GSM 850, GSM 900, GSM 1800, GSM 1900">
              <small class="form-text text-muted">Example: GSM 850, GSM 1900</small>
            </div>
          ` : ''}

          ${missingWcdma ? `
            <div class="form-group">
              <label for="input-wcdma">WCDMA Bands (comma separated)</label>
              <input type="text" class="form-control" id="input-wcdma"
                     placeholder="1, 2, 4, 5, 8">
              <small class="form-text text-muted">Example: 2, 4, 5, 8</small>
            </div>
          ` : ''}

          ${missingLte ? `
            <div class="form-group">
              <label for="input-lte">LTE/4G Bands (comma separated)</label>
              <input type="text" class="form-control" id="input-lte"
                     placeholder="1, 2, 3, 4, 5, 7, 8, 12, 13, 17, 25, 26, 66">
              <small class="form-text text-muted">Example: 2, 4, 5, 12, 66, 71</small>
            </div>
          ` : ''}

          <div class="form-group">
            <label for="input-userid">Your Name/Email (optional)</label>
            <input type="text" class="form-control" id="input-userid"
                   placeholder="user@example.com">
            <small class="form-text text-muted">Optional: Help us track contributions</small>
          </div>

          <button type="submit" class="btn btn-primary btn-lg btn-block">
            Update & Save Bands
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

    // Call API to update bands
    const result = await API.updateBands(model, bandsData);

    // Show success message
    $("#update-result").html(`
      <div class="alert alert-success">
        <strong>Success!</strong> Bands updated successfully. Thank you for your contribution!
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
