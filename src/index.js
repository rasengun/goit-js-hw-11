import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { refs } from './js/refs';
import { createGallery } from './js/createGallery';
import { PixabayAPI } from './js/PixabayAPI';

const pixabayApi = new PixabayAPI();

refs.loadMoreBtn.setAttribute('disabled', true);

async function onFormSubmit(e) {
  e.preventDefault();

  const {
    elements: { searchQuery },
  } = e.currentTarget;

  const searchValue = searchQuery.value.trim();

  if (!searchValue) {
    Notify.failure('What would you like to see?');
    return;
  }

  pixabayApi.resetPage();
  pixabayApi.query = searchValue;

  const data = await pixabayApi.getImagesByQuery(pixabayApi.page);

  if (data.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }

  Notify.success(`Hooray! We found ${data.totalHits} images.`);

  const markup = createGallery(data.hits);
  refs.gallery.innerHTML = markup;
  lightbox.refresh();

  if (pixabayApi.page < Math.ceil(data.totalHits / 40)) {
    refs.loadMoreBtn.removeAttribute('disabled');
  }
  if (pixabayApi.page >= Math.ceil(data.totalHits / 40)) {
    refs.loadMoreBtn.setAttribute('disabled', true);
  }
  refs.searchForm.reset();
}

async function onLoadMore(e) {
  pixabayApi.incrementPage();
  const data = await pixabayApi.getImagesByQuery(pixabayApi.page);
  lightbox.refresh();

  const markup = createGallery(data.hits);
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  const totalPage = data.totalHits / 40;
  if (pixabayApi.page >= totalPage) {
    Notify.info("We're sorry, but you've reached the end of search results.");
    refs.loadMoreBtn.setAttribute('disabled', true);
  }
  await smoothScroll();
}

async function smoothScroll() {
  const { height: cardHeight } =
    refs.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
});

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
