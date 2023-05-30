import { fetchSearchedPhotos } from './fetchPhotos';
import Notiflix from 'notiflix';

const searchBar = document.querySelector('input');
const submitBtn = document.querySelector('button');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

const privateKey = '35496971-fbfc726ccc8da9a7b0725eb09';

let numberOfTotalHits;
let nextPageNumber;

submitBtn.addEventListener('click', event => {
  event.preventDefault();
  search();
});

loadMoreBtn.addEventListener('click', event => {
  event.preventDefault();
  nextPage();
});

async function search() {
  clear();

  const listOfPhotos = await fetchSearchedPhotos(
    searchBar.value,
    privateKey,
    1
  );

  nextPageNumber = 2;
  numberOfTotalHits = listOfPhotos.data.totalHits;

  console.log(listOfPhotos.data);

  addPhotos(listOfPhotos.data.hits);

  if (listOfPhotos.data.totalHits > 0) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
  }
}

async function nextPage() {
  const listOfPhotos = await fetchSearchedPhotos(
    searchBar.value,
    privateKey,
    nextPageNumber
  );
  addPhotos(listOfPhotos.data.hits);
  let tempVar = nextPageNumber * listOfPhotos.data.hits.length;

  numberOfTotalHits = listOfPhotos.data.totalHits - tempVar;
  console.log(numberOfTotalHits);
  if (numberOfTotalHits < 0) {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
  nextPageNumber++;
}

function clear() {
  const galleryItems = document.querySelectorAll('.gallery .photo-card');
  galleryItems.forEach(element => {
    element.remove();
  });
}

function addPhotos(photos) {
  photos.forEach(element => {
    const htmlCard = `
        <div class="photo-card">
            <img src="${element.webformatURL}" alt="${element.tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                    <b>Likes: </b><span class="number">${element.likes}</span>
                </p>
                <p class="info-item">
                    <b>Views: </b><span class="number">${element.views}</span>
                </p>
                <p class="info-item">
                    <b>Comments: </b><span class="number">${element.comments}</span>
                </p>
                <p class="info-item">
                    <b>Downloads: </b><span class="number">${element.downloads}</span>
                </p>
            </div>
        </div>`;
    gallery.insertAdjacentHTML('beforeend', htmlCard);
  });
}
