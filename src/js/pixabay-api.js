/*******************************************************************************************
 * WARNING! Do not use the API key openly, as it may be unsafe; only through a proxy server *
 *******************************************************************************************/

/**
 * Pixabay api doc https://pixabay.com/api/docs/
 *
 * Pixabay API Proxy
 * This module provides a function to fetch images from the Pixabay API.
 * It uses a proxy server to avoid exposing the API key directly in the client code.
 */

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://us-central1-dev-test-448809.cloudfunctions.net/pixabayProxy/'
    : 'http://localhost:3000/';

/**
 * Fetches images from the Pixabay API based on the provided search query.
 *
 * @param {string} search - The search term to query images for.
 * @returns {Promise<PixabayResponse>} A promise that resolves to an object containing image search results.
 * @throws {Error} If the network request fails or the response is not OK.
 *
 * @example
 * fetchPixabayImages('cats').then(data => {
 *   // handle data
 * });
 *
 * @typedef {Object} PixabayImage
 * @property {string} webformatURL - URL to a small image for gallery card display.
 * @property {string} largeImageURL - URL to a large image for modal display.
 * @property {string} tags - Comma-separated string describing the image, suitable for alt attribute.
 * @property {number} likes - Number of likes the image has received.
 * @property {number} views - Number of times the image has been viewed.
 * @property {number} comments - Number of comments on the image.
 * @property {number} downloads - Number of times the image has been downloaded.
 *
 * @typedef {Object} PixabayResponse
 * @property {number} total - Total number of images matching the query.
 * @property {number} totalHits - Number of images returned in the current response.
 * @property {PixabayImage[]} hits - Array of image objects matching the query.
 */

function fetchPixabayImages(search) {
  const queryParams = new URLSearchParams({
    // See the warning above
    // key: process.env.PIXABAY_KEY,
    q: encodeURIComponent(search),
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: '9',
    page: '1', // Default to the first page
  });

  // See the warning above
  // const url = `https://pixabay.com/api/?${queryParams}`;
  // Using proxy server
  const url = `${baseUrl}?${queryParams}`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error fetching images: ${response.statusText}`);
      }
      return response.json();
    })
    .catch(error => {
      // Processing the error
      // This could be a network error or an issue with the response
      // Log the error to the console for debugging
      console.error('Error:', error);
      throw error;
    });
}

export default fetchPixabayImages;
