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
    //console.log(this.tripPoints);
    render(new SortView(), this.pointsContainer);
    render(this.pointsListComponent, this.pointsContainer);

    for(let i = 0; i < 1; i++) {
      render(
        new PointView({
          point: this.points[i],
          pointDestinations: this.destinations.getById(this.points[i].destination),
          pointOffers: this.offers.getByType(this.points[i].type)
        }),
        this.pointsListComponent.getElement()
      );
    }

    render(new EditPointView({
      point: this.points[0],
      pointDestinations: this.destinations.getById(this.points[0].destination),
      pointOffers: this.offers.getByType(this.points[0].type)
    }), this.pointsListComponent.getElement());

    for(let i = 1; i < this.points.length; i++) {
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
