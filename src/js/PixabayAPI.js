import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '31903568-48a67c50eab509e503da8cf28';
  #query = '';

  get query() {
    return this.#query;
  }

  set query(newQuery) {
    this.#query = newQuery;
  }

  async getImagesByQuery(page) {
    const response = await axios.get(
      `${this.#BASE_URL}?key=${this.#API_KEY}&q=${
        this.#query
      }&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
    );

    return response.data;
  }
}
