const fetchedData = [
  {
    time_period_start: '2024-02-17T00:00:00.000Z',
    time_period_end: '2024-02-17T23:59:59.999Z',
    time_open: '2024-02-17T08:00:00.000Z',
    time_close: '2024-02-17T16:00:00.000Z',
    price_open: 32,
    price_high: 35,
    price_low: 31,
    price_close: 33,
    volume_traded: 10,
    trades_count: 330,
  },
  {
    time_period_start: '2024-02-18T00:00:00.000Z',
    time_period_end: '2024-02-18T23:59:59.999Z',
    time_open: '2024-02-18T08:00:00.000Z',
    time_close: '2024-02-18T16:00:00.000Z',
    price_open: 34,
    price_high: 36,
    price_low: 33,
    price_close: 12,
    volume_traded: 12,
    trades_count: 400,
  },
  {
    time_period_start: '2024-02-19T00:00:00.000Z',
    time_period_end: '2024-02-19T23:59:59.999Z',
    time_open: '2024-02-19T08:00:00.000Z',
    time_close: '2024-02-19T16:00:00.000Z',
    price_open: 36,
    price_high: 38,
    price_low: 35,
    price_close: 21,
    volume_traded: 15,
    trades_count: 450,
  },
  {
    time_period_start: '2024-02-20T00:00:00.000Z',
    time_period_end: '2024-02-20T23:59:59.999Z',
    time_open: '2024-02-20T08:00:00.000Z',
    time_close: '2024-02-20T16:00:00.000Z',
    price_open: 38,
    price_high: 40,
    price_low: 37,
    price_close: 35,
    volume_traded: 18,
    trades_count: 500,
  },
  {
    time_period_start: '2024-02-21T00:00:00.000Z',
    time_period_end: '2024-02-21T23:59:59.999Z',
    time_open: '2024-02-21T08:00:00.000Z',
    time_close: '2024-02-21T16:00:00.000Z',
    price_open: 40,
    price_high: 42,
    price_low: 39,
    price_close: 41,
    volume_traded: 20,
    trades_count: 550,
  },
  {
    time_period_start: '2024-02-22T00:00:00.000Z',
    time_period_end: '2024-02-22T23:59:59.999Z',
    time_open: '2024-02-22T08:00:00.000Z',
    time_close: '2024-02-22T16:00:00.000Z',
    price_open: 42,
    price_high: 45,
    price_low: 41,
    price_close: 43,
    volume_traded: 22,
    trades_count: 600,
  },
  {
    time_period_start: '2024-02-23T00:00:00.000Z',
    time_period_end: '2024-02-23T23:59:59.999Z',
    time_open: '2024-02-23T08:00:00.000Z',
    time_close: '2024-02-23T16:00:00.000Z',
    price_open: 44,
    price_high: 47,
    price_low: 43,
    price_close: 5,
    volume_traded: 25,
    trades_count: 650,
  },
  {
    time_period_start: '2024-02-24T00:00:00.000Z',
    time_period_end: '2024-02-24T23:59:59.999Z',
    time_open: '2024-02-24T08:00:00.000Z',
    time_close: '2024-02-24T16:00:00.000Z',
    price_open: 46,
    price_high: 49,
    price_low: 45,
    price_close: 24,
    volume_traded: 28,
    trades_count: 700,
  },
];

const dataToShow: any[] = [];
fetchedData.forEach((data) => {
  const currentDate = new Date(data.time_close);

  const currentDayOfMonth = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const neceseryData = {
    name: `${currentYear}. ${currentMonth + 1}. ${currentDayOfMonth}.`,
    value: data.price_close,
  };
  dataToShow.push(neceseryData);
});

export var multi = [
  {
    name: 'Price',
    series: dataToShow,
  },
];
