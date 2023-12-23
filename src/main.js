import TripInfo from './view/trip-info-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import {render, RenderPosition} from './framework/render.js';
import PointsModel from './model/points-model.js';
import ServiceMock from './mock/service-mock.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import {FilterType} from './const/filter-const.js';

const controlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const infoTripElement = document.querySelector('.trip-main');

const serviceMock = new ServiceMock();
const destinationsModel = new DestinationsModel(serviceMock);
const offersModel = new OffersModel(serviceMock);
const pointsModel = new PointsModel(serviceMock);
const filterType = FilterType.EVERYTHING;

const tripPresenter = new TripPresenter({
  pointsContainer: tripEventsElement,
  destinationsModel,
  offersModel,
  pointsModel,
});

const filterPresenter = new FilterPresenter({
  pointsModel,
  filterType,
  filtersContainer: controlsFiltersElement,
});

render(new TripInfo(), infoTripElement, RenderPosition.AFTERBEGIN);

tripPresenter.init();

filterPresenter.init();

