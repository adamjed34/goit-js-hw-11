import axios from 'axios';
import Notiflix from 'notiflix';
// Opisany w dokumentacji
import SimpleLightbox from 'simplelightbox';
// Dodatkowy import stylów
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEl = document.querySelector('.search-form');
const inputEl = document.querySelector('input');
const buttonEl = document.querySelector('button');
const loadButtonEl = document.querySelector('.load-button');
const galleryEl = document.querySelector(`.gallery`);

const API_URL = `https://pixabay.com/api/`;
const API_KEY = '35858797-639b225fbbec7c1b27496629b';

let picturesShown = 40;
let currentPage = 1;

// fetching photos
async function getPhotos() {
  const response = await axios.get(API_URL, {
    params: {
      key: API_KEY,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      q: inputEl.value,
      per_page: picturesShown,
      page: currentPage,
    },
  });
  return response;
}

// photo card drawer
const drawPhotos = pictures => {
  return pictures.data.hits
    .map(
      picture =>
        `<div class="photo-card">
    <a href="${picture.largeImageURL}" class="photo-link">
    <img src="${picture.webformatURL}" alt="${picture.tags} loading="lazy"/></a>
    <div class="photo-info">
    <div>Likes
    <p>${picture.likes}</p>
    </div>
    <div>Views
    <p>${picture.views}</p>
    </div>
    <div>Comments
    <p>${picture.comments}</p>
    </div>
    <div>Downloads
    <p>${picture.downloads}</p>
    </div>
    </div>
    </div>
    `
    )
    .join('');
};

// loading photos on page
const loadPhotos = () => {
  getPhotos()
    .then(pictures => {
      const totalHits = pictures.data.total;
      galleryEl.innerHTML = drawPhotos(pictures);
      loadButtonEl.style.visibility = 'visible';
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
      var lightbox = new SimpleLightbox('.gallery a');
      if (pictures.data.hits.length === 0) throw new Error();
    })
    .catch(error => {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    });
};

buttonEl.addEventListener('click', e => {
  e.preventDefault();
  currentPage = 1;
  loadPhotos();
});

// loading more photos on "load more" button click
const loadMorePhotos = () => {
  getPhotos().then(pictures => {
    const totalHits = pictures.data.total;
    galleryEl.insertAdjacentHTML('beforeend', drawPhotos(pictures));
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    var lightbox = new SimpleLightbox('.gallery a');

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
};

loadButtonEl.addEventListener('click', e => {
  e.preventDefault();
  currentPage++;
  loadMorePhotos();
});
