export default class OffersModel {
  #service = null;
  #offers = null;

  constructor(service) {
    this.#service = service;
    this.#offers = this.#service.getOffers();
  }

  get() {
    return this.#offers;
  }

  getByType(type) {
    const findOffers = this.#offers.find((offer) => offer.type === type).offers;
    return findOffers || null;
  }
}
