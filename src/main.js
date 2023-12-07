import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import {render} from './render.js';

const controlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter({pointsContainer: tripEventsElement});

render(new FilterView(), controlsFiltersElement);

tripPresenter.init();

