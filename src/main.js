import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';
import ServiceMock from './mock/service-mock.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import HeaderPresenter from './presenter/header-presenter.js';
import {FilterType} from './const/filter-const.js';

const tripEventsElement = document.querySelector('.trip-events');
const headerElement = document.querySelector('.trip-main');

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

const headerPresenter = new HeaderPresenter({
  pointsModel,
  filterType,
  headerContainer: headerElement,
});

tripPresenter.init();

headerPresenter.init();

