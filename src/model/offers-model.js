export default class OffersModel {
  #pointsApiService = null;
  #offers = null;

  constructor({pointsApiService}) {
    this.#pointsApiService = pointsApiService;
  }

  get() {
    return this.#offers;
  }

  async init() {
    this.#offers = await this.#pointsApiService.offers;
    return this.#offers;
  }

  getByType(type) {
    const foundOffers = this.#offers.find((offer) => offer.type === type).offers;
    return foundOffers || null;
  }
}
