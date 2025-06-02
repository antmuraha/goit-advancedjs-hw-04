import iziToast from 'izitoast';
import FlatStateManager from './js/FlatStateManager.js';
import fetchPixabayImages from './js/pixabay-api.js';
import { renderGallery, renderLoader } from './js/render-functions.js';

iziToast.settings({
  position: 'topRight',
  timeout: 2000,
  close: false,
  progressBar: false,
  transitionIn: 'bounceInUp',
  transitionOut: 'fadeOutDown',
});

const colorMap = {
  success: '#4caf50',
  error: '#f44336',
};
const iconMap = {
  success: 'fas fa-check',
  error: 'fas fa-ban',
};

function showSnackbar(message, type = 'success') {
  iziToast[type]({
    message: message,
    icon: iconMap[type] || 'fas fa-info',
    iconColor: colorMap[type] || '#ddd',
    progressBarColor: colorMap[type] || '#ddd',
  });
}

const state = new FlatStateManager({ loading: false, images: [], search: '' });

state.subscribe('loading', renderLoader);
state.subscribe('loading', (loading, { images }) =>
  renderGallery(images, loading)
);
state.subscribe('images', (images, { loading }) =>
  renderGallery(images, loading)
);

function initializeForm() {
  const formElement = document.querySelector('.form');

  formElement?.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData.entries());

    if (!data.search) {
      showSnackbar(`Please enter a search query`, 'error');
      return;
    }

    if (data.search === state.getState('search')) {
      showSnackbar(`You already searched for "${data.search}"`, 'error');
      return;
    }

    state.setState('loading', true);
    state.setState('search', data.search);

    fetchPixabayImages(data.search)
      .then(data => {
        if (data.hits.length === 0) {
          showSnackbar(
            `Sorry, there are no images matching your search query. Please try again!`,
            'error'
          );
          return;
        }

        state.setState('images', data.hits);
      })
      .catch(error => {
        console.error('Error fetching images:', error);
        showSnackbar(`Error fetching images`, 'error');
      })
      .finally(() => {
        state.setState('loading', false);
      });
  });
}

initializeForm();
