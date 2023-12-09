import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import EditPointView from '../view/edit-point-view.js';
import PointView from '../view/point-view.js';
import {render} from '../render.js';

export default class TripPresenter {
  pointsListComponent = new PointListView();

  constructor({pointsContainer}) {
    this.pointsContainer = pointsContainer;
  }

  init() {
    render(new SortView(), this.pointsContainer);
    render(this.pointsListComponent, this.pointsContainer);
    render(new EditPointView(), this.pointsListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.pointsListComponent.getElement());
    }
  }
}
