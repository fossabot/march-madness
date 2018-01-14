import { TeamCtrl } from '../controllers';
import { Analytics } from '../services';

const toggleLoading = () => {
  document.querySelector('.spinner').classList.toggle('hide');
};

const pullWeights = (modal) => {
  const weights = {};
  modal.querySelectorAll('.weight').forEach((el) => {
    const input = el.querySelector('input[type="number"]');
    const cb = el.querySelector('input[type="checkbox"]');

    weights[el.getAttribute('for')] = [
      input.value / 100,
      (cb.checked) ? -1 : 1,
    ];
  });

  return weights;
}

const buildWeights = (weights) => {
  return Object.keys(weights).map((key) => (
    `<div class="weight" for="${key}">
      <div class="input-group">
        <input type="number" value="${weights[key][0] * 100}" name="${key}" /> ${key}
      </div>
      <div class="input-group">
        <input type="checkbox" ${(weights[key][1] < 0) ? 'checked' : null}> Invert
      </div>
    </div>`
  )).join('');
}

const openModal = () => (evt) => {
  toggleLoading();
  const el = document.querySelector('.modal');

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

      toggleLoading();
      document.querySelector('.modal').classList.add('open');
    });
}

const closeModal = () => (evt) => {
  const el = evt.target;

  if(el.classList.contains('modal')) {
    el.classList.remove('open');
    Analytics.updateStatWeightings(pullWeights(el));
    TeamCtrl.runHeadToHead();
  }
}

module.exports = {
  toggleLoading,
  openModal,
  closeModal,
};
