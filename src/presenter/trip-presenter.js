import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import PointEditView from '../view/point-edit-view.js';
import PointView from '../view/point-view.js';
import {render} from '../render.js';

export default class TripPresenter {
  pointsListComponent = new PointListView();

  constructor({pointsContainer, pointsModel, destinationsModel, offersModel}) {
    this.pointsContainer = pointsContainer;
    this.destinations = destinationsModel;
    this.offers = offersModel;
    this.allOffers = offersModel.get();
    this.points = pointsModel.get();
  }

  init() {
    render(new SortView(), this.pointsContainer);
    render(this.pointsListComponent, this.pointsContainer);

    render(new PointEditView({
      point: this.points[0],
      pointDestinations: this.destinations.getById(this.points[0].destination),
      pointOffers: this.offers.getByType(this.points[0].type),
      allOffers: this.allOffers
    }), this.pointsListComponent.getElement());

    for(let i = 0; i < this.points.length; i++) {
      render(
        new PointView({
          point: this.points[i],
          pointDestinations: this.destinations.getById(this.points[i].destination),
          pointOffers: this.offers.getByType(this.points[i].type)
        }),
        this.pointsListComponent.getElement()
      );
    }
  }
}
