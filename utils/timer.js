function getCurrentTime() {
  var date = new Date();
  var currentTime =
    leadingZeros(date.getFullYear(), 4).substring(2, 4)   + "-" +
    leadingZeros(date.getMonth() + 1, 2) + "-" +
    leadingZeros(date.getDate(), 2) + " " +
    leadingZeros(date.getHours(), 2) + ":" +
    leadingZeros(date.getMinutes(), 2);
  return currentTime;
}

function leadingZeros(data, size) {
  var zero = '';
  data = data.toString();
  if (data.length < size) {
    for (i = 0; i < size - data.length; i++)
      zero += '0';
  }
  return zero + data;
}
module.exports.getCurrentTime = getCurrentTime;
