import SimpleLightbox from 'simplelightbox';

export function renderLoader(loading) {
  const loaderElement = document.querySelector('.loader');
  if (loading) {
    loaderElement?.classList.remove('hidden');
  } else {
    loaderElement?.classList.add('hidden');
  }
  return loaderElement;
}

export function renderGallery(images, loading) {
  const galleryEl = document.querySelector('.gallery');

  if (loading) {
    galleryEl?.classList.add('hidden');
  } else {
    galleryEl?.classList.remove('hidden');
  }

  const oldKeys = Array.from(galleryEl.querySelectorAll('a.gallery-link')).map(
    link => link.dataset.id
  );
  const newKeys = images.map(image => image.id);

  if (oldKeys.join('|') === newKeys.join('|')) {
    // console.log('No changes in gallery items, skipping render.');
    return;
  }

  const template = document.querySelector('#gallery-item-template');
  const fragment = document.createDocumentFragment();

  images.forEach(
    ({
      id,
      webformatURL,
      largeImageURL,
      tags,
      likes,
      comments,
      views,
      downloads,
    }) => {
      const clone = template.content.cloneNode(true);
      const link = clone.querySelector('a.gallery-link');
      const img = clone.querySelector('img.gallery-image');

      link.dataset.id = id;
      link.href = largeImageURL;
      img.src = webformatURL;
      img.alt = tags;
      img.title = tags;
      img.dataset.source = largeImageURL;

      const meta = clone.querySelector('.gallery-item-meta');
      const likesValue = meta.querySelector('.meta-likes-value');
      const viewsValue = meta.querySelector('.meta-views-value');
      const commentsValue = meta.querySelector('.meta-comments-value');
      const downloadsValue = meta.querySelector('.meta-downloads-value');

      likesValue.textContent = `${likes || 0}`;
      viewsValue.textContent = `${views || 0}`;
      commentsValue.textContent = `${comments || 0}`;
      downloadsValue.textContent = `${downloads || 0}`;

      fragment.appendChild(clone);
    }
  );
  galleryEl.innerHTML = '';
  galleryEl.appendChild(fragment);

  if (!galleryEl._instance) {
    const instance = new SimpleLightbox('.gallery a', {
      captions: true,
      // captionsData: 'alt',
      captionDelay: 250,
      captionPosition: 'bottom',
    });
    instance.on('show.simplelightbox', function (...rest) {
      // console.log('Lightbox opened', rest);
    });

    instance.on('error.simplelightbox', function (...rest) {
      // console.log('Lightbox error', rest);
    });
    // Store the instance on the gallery element for later use
    galleryEl._instance = instance;
    // console.log('Lightbox instance created');
  } else {
    // If the instance already exists, we can refresh it
    galleryEl._instance.refresh();
    // console.log('Lightbox instance refreshed');
  }
}
