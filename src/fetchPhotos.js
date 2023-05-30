import Notiflix from 'notiflix';
import axios from 'axios';

// export async function fetchCountries(name) {
//     try {
//       const response = await fetch(
//         `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
//       );
//       if (!response.ok) {
//         if (response.status == 404) {
//           Notiflix.Notify.failure('Oops, there is no country with that name');
//         }
//         throw new Error(response.status);
//       }
//       const countriesInfo = await response.json();
//       return await countriesInfo;
//     } catch (error) {
//       console.error(error);
//     }
//   }

export async function fetchSearchedPhotos(keyWord, APIKey, currentPage) {
  try {
    // let response = await axios.get(
    //   `https://pixabay.com/api/?key=${APIKey}&q=${keyWord}&image_type=photo&orientation=horizontal&safesearch=true`
    // );

    let response = await axios.get(`https://pixabay.com/api/`, {
      params: {
        key: APIKey,
        q: keyWord,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: currentPage,
      },
    });

    if (response.data.hits.length == 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return await response;
  } catch (error) {
    console.error(error);
  }
}
