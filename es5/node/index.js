var Calendar = require("./classes/Calendar.js");

var calendar = new Calendar();

console.log('-----------------------------------------------');

calendar.on('each:year', function(year) {
  year.on('each:month:added', function(month) {
    var result = calendar.daysWithPadding(month);
    var weeks = calendar.filterDaysPerWeek(result.days);
    month.calendar = weeks;
  });
});

calendar.filter({ from: 2012 });

console.log('Weeks:', JSON.stringify(calendar.years['2014'].months[4].calendar, null, 2));

console.log('-----------------------------------------------');
