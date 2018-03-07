import { TeamCtrl } from '../controllers';
import { Analytics } from '../services';
import { SELECTORS } from '../utils/constants';

/**
 * App Controller
 *
 * Functions for interacting with the DOM to control
 * the UI related to app-wide elements
 */

// toggle fullscreen mode
const toggleFullScreen = () => {
  const docElem = document.documentElement;
  const doc = document;
  const fullScreen = (
    doc.fullscreenElement || doc.mozFullScreenElement || doc.webkitFullscreenElement
  );

  if (!fullScreen) {
    if (docElem.requestFullscreen) {
      docElem.requestFullscreen();
    } else if (docElem.mozRequestFullScreen) {
      docElem.mozRequestFullScreen();
    } else if (docElem.webkitRequestFullscreen) {
      docElem.webkitRequestFullscreen();
    } else if (docElem.msRequestFullscreen) {
      docElem.msRequestFullscreen();
    }

    return;
  } else if (doc.exitFullscreen) {
    return doc.exitFullscreen();
  } else if (doc.mozCancelFullScreen) {
    return doc.mozCancelFullScreen();
  } else if (doc.webkitExitFullscreen) {
    return doc.webkitExitFullscreen();
  } else if (doc.msExitFullscreen) {
    return doc.msExitFullscreen();
  }

  console.warn('Fullscreen not supported on this device');
};

// Show / Hide loading spinner
const toggleLoading = () => {
  document
    .querySelector(SELECTORS.spinner)
    .classList.toggle(SELECTORS.hideSpinner);
};

// Get stat weightings from modal
const pullWeights = (modal) => {
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
};

// Populate stat weighting modal
const buildWeights = weights => (
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

// Show stat weighting modal
const openModal = () => {
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
};

// Close stat weighting modal
const closeModal = (evt) => {
  const el = evt.target;

  if (el.classList.contains('modal')) {
    el.classList.remove(SELECTORS.modalOpen);
    Analytics.updateStatWeightings(pullWeights(el));
    if (Analytics.isReady()) TeamCtrl.runHeadToHead();
  }
};

export default {
  toggleLoading,
  openModal,
  closeModal,
  toggleFullScreen,
};
