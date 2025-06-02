import iziToast from 'izitoast';
import FlatStateManager from './js/FlatStateManager.js';
import fetchPixabayImages from './js/pixabay-api.js';
import {
  renderButtonMore,
  renderGallery,
  renderLoader,
} from './js/render-functions.js';
import scrollToTile from './js/scrollToTile.js';

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

const state = new FlatStateManager({
  loading: false,
  images: [],
  page: 1,
  search: '',
});

state.subscribe('loading', renderLoader);
state.subscribe('loading', (loading, { images }) =>
  renderGallery(images, loading)
);
state.subscribe('images', (images, { loading }) =>
  renderGallery(images, loading)
);
state.subscribe('loading', (loading, { images, page }) =>
  renderButtonMore(images, loading, page)
);
state.subscribe('images', (images, { loading, page }) =>
  renderButtonMore(images, loading, page)
);

(function initializeForm() {
  const formElement = document.querySelector('.form');

  formElement?.addEventListener('submit', async event => {
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

    state.setState('images', []);
    state.setState('search', data.search);
    state.setState('page', 1);
    state.setState('loading', true);

    try {
      const responseData = await fetchPixabayImages(data.search, '1');
      if (responseData.hits.length === 0) {
        showSnackbar(
          `We're sorry, but you've reached the end of search results.`,
          'error'
        );
      } else {
        state.setState('images', responseData.hits);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      showSnackbar(`Error fetching images`, 'error');
    }
    state.setState('loading', false);
  });
})();

(function initializeLoadMoreButton() {
  const buttonElement = document.querySelector('.button-load-more');

  buttonElement?.addEventListener('click', async () => {
    const searchQuery = state.getState('search');

    state.setState('loading', true);
    const page = state.getState('page') + 1;
    state.setState('page', page);

    try {
      const responseData = await fetchPixabayImages(searchQuery, page);
      if (responseData.hits.length === 0) {
        showSnackbar(
          `We're sorry, but you've reached the end of search results.`,
          'error'
        );
        state.setState('page', -1);
      } else {
        state.setState('images', [
          ...state.getState('images'),
          ...responseData.hits,
        ]);
        scrollToTile(responseData.hits[0]?.id);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      showSnackbar(`Error fetching images`, 'error');
    }
    state.setState('loading', false);
  });
})();
