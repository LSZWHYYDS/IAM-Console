const state = {
  cron: {
    second: '0',
    minute: '0',
    hour: '*',
    day: '*',
    month: '*',
    week: '?',
    year: '*',
  },
};

//生成cron
export const createCron = (dateValues) => {
  console.log(dateValues);
  const { period, opTime, dayInMonth, dayInWeek } = dateValues;
  state.cron.hour = opTime.join(',');
  switch (period) {
    case 'month':
      state.cron.day = dayInMonth.join(',');
      break;
    case 'week':
      state.cron.week = dayInWeek.join(',');
      break;
    default: //"day":
  }
  let { second, minute, hour, day, month, week, year } = state.cron;
  let cronText =
    second + ' ' + minute + ' ' + hour + ' ' + day + ' ' + month + ' ' + week + ' ' + year;
  console.log('cronText', cronText);
  return cronText;
};
