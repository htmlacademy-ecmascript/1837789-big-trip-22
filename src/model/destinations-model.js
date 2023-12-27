export default class DestinationsModel {
  #service = null;
  #destinations = null;

  constructor(service) {
    this.#service = service;
    this.#destinations = this.#service.getDestinations();
  }

  get() {
    return this.#destinations;
  }

  getById(id) {
    const findDestination = this.#destinations.find((destination) => destination.id === id);
    return findDestination || null;
  }
}
