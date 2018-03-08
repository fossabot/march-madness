import { TeamCtrl } from '../controllers';
import { Analytics } from '../services';
import { SELECTORS } from '../utils/constants';

/**
 * App Controller
 *
 * Functions for interacting with the DOM to control
 * the UI related to app-wide elements
 */

// Show / Hide loading spinner
function toggleLoading() {
  document
    .querySelector(SELECTORS.spinner)
    .classList.toggle(SELECTORS.hideSpinner);
}

// Get stat weightings from modal
function pullWeights(modal) {
  const weights = {};
  modal.querySelectorAll(SELECTORS.weight).forEach((el) => {
    const input = el.querySelector(SELECTORS.numberInput);
    const cb = el.querySelector(SELECTORS.checkbox);

    weights[el.getAttribute('for')] = {
      value: input.value / 100,
      invert: cb.checked,
    };
  });

  return weights;
}

// Populate stat weighting modal
function buildWeights(weights) {
  return (
    Object.keys(weights).map(key => (
      `<div class="weight" for="${key}">
        <div class="input-group">
          <input type="number" value="${weights[key].value * 100}" name="${key}" /> ${key}
        </div>
        <div class="input-group">
          <input type="checkbox" ${(weights[key].invert) ? 'checked' : null}> Invert
        </div>
      </div>`
    )).join('')
  );
}

// Show stat weighting modal
function openModal() {
  const el = document.querySelector(SELECTORS.modal);

  return Analytics.getStatWeightings()
    .then((weights) => {
      el.innerHTML = `
        <div class="modal-content">
          <h2 class="title">Weightings</h2>
          <div class="content">
            ${buildWeights(weights)}
            <p>Invert = smaller number is better (ie. Losses)</p>
          </div>
      `;

      document.querySelector(SELECTORS.modal).classList.add(SELECTORS.modalOpen);
    });
}

// Close stat weighting modal
function closeModal(evt) {
  const el = evt.target;

  if (el.classList.contains('modal')) {
    el.classList.remove(SELECTORS.modalOpen);
    Analytics.updateStatWeightings(pullWeights(el));
    if (Analytics.isReady()) TeamCtrl.runHeadToHead();
  }
}

export default {
  toggleLoading,
  openModal,
  closeModal,
};
