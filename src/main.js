import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic myxa1';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const tripEventsElement = document.querySelector('.trip-events');
const headerElement = document.querySelector('.trip-main');
const filterElement = document.querySelector('.trip-controls__filters');

const pointsApiService = new PointsApiService(END_POINT, AUTHORIZATION);

const destinationsModel = new DestinationsModel({pointsApiService: pointsApiService});
const offersModel = new OffersModel({pointsApiService: pointsApiService});
const pointsModel = new PointsModel({pointsApiService: pointsApiService, destinationsModel, offersModel});
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: filterElement,
  filterModel,
  pointsModel
});

const tripPresenter = new TripPresenter({
  pointsContainer: tripEventsElement,
  newPointButtonContainer:headerElement,
  destinationsModel,
  offersModel,
  pointsModel,
  filterModel
});

filterPresenter.init();
tripPresenter.init();
pointsModel.init();

