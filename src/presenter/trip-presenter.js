import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import {render} from '../render.js';

export default class TripPresenter {
  pointsListComponent = new PointListView();

  constructor({pointsContainer, pointsModel, destinationsModel, offersModel}) {
    this.pointsContainer = pointsContainer;
    this.destinations = destinationsModel;
    this.offers = offersModel;
    this.points = pointsModel.get();
  }

  init() {
    this.tripPoints = [...this.points];
    console.log(this.tripPoints);
    render(new SortView(), this.pointsContainer);
    render(this.pointsListComponent, this.pointsContainer);
    render(new EditPointView({
      point: this.points[0],
      pointDestinations: this.destinations.getById(this.points[0].destination),
      pointOffers: this.offers.getByType(this.points[0].type)
    }), this.pointsListComponent.getElement());

    this.points.forEach((point) => {
      render(
        new PointView({
          point,
          pointDestinations: this.destinations.getById(point.destination),
          pointOffers: this.offers.getByType(point.type)
        }),
        this.pointsListComponent.getElement()
      );
    });
  }
}
