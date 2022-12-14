import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '31903568-48a67c50eab509e503da8cf28';

export class PixabayAPI {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  async getImagesByQuery() {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${this.query}&image_type=photo&orientation=horizontal&per_page=40&page=${this.page}`
    );

    return response.data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
