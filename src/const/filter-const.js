import dayjs from 'dayjs';

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => dayjs().isBefore(dayjs(point.dateFrom))),
  [FilterType.PRESENT]: (points) => points.filter((point) => dayjs().isBefore(dayjs(point.dateTo)) && dayjs().isAfter(dayjs(point.dateFrom))),
  [FilterType.PAST]: (points) => points.filter((point) => dayjs().isAfter(dayjs(point.dateTo)))
};

const filterValues = Object.entries(filter).map(([type, getPoints]) => ({
  type,
  getPoints,
}));

export {FilterType, filter, filterValues};
