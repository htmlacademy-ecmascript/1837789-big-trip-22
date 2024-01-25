export default class DestinationsModel {
  #pointsApiService = null;
  #destinations = null;

  constructor({pointsApiService}) {
    this.#pointsApiService = pointsApiService;
  }

  get() {
    return this.#destinations;
  }

  async init() {
    this.#destinations = await this.#pointsApiService.destinations;
    return this.#destinations;
  }

  getById(id) {
    const foundDestination = this.#destinations.find((destination) => destination.id === id);
    return foundDestination || null;
  }
}
