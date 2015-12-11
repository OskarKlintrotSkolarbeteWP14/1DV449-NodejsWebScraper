export let TwoDigits = (number) => {
  return (
    ('0' + number.toString()).slice(-2).toString()
  );
};

export let JsonDateToDate = (date) => {
  return new Date(JSON.parse(parseInt(date.slice(6, 19)) + parseInt(date.slice(20, 22))*3600000));
};

export let FormatDate = (date) => {
  return date.getFullYear() + '-' + TwoDigits(parseInt(date.getMonth()) + 1) + '-' + TwoDigits(date.getDate()) + ' ' + TwoDigits(date.getHours()) + ':' + TwoDigits(date.getMinutes());
};
