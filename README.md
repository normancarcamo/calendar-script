### Installation

#### Browser:
```html
<html>
  <head>
    <!-- ... -->
  </head>
  <body>
    <!-- ... -->
    <script src="https://cdn.rawgit.com/normancarcamo/calendar-script/aeb0d05c/dist/browser/calendar.min.js"></script>
  </body>
</html>
```

### Examples:
```javascript
const calendar = new Calendar();

calendar.on('each:year', function(year) {
  year.on('each:month:added', function(month) {
    let result = calendar.daysWithPadding(month);
    let weeks = calendar.filterDaysPerWeek(result.days);
    month.calendar = weeks;
  });
});

calendar.filter({ from: 2012 });

console.log(calendar);
```
![Image of usage](https://github.com/normancarcamo/calendar-script/blob/master/examples/_screenshot_.png)
<br/>

Check the [examples folder](https://github.com/normancarcamo/calendar-script/tree/master/examples)

### Tests:
``` bash
cd es6 && npm run test
```

## Maintainers:

![Image of Mantainer](http://s.gravatar.com/avatar/c3d34f6dbeeef3c39942d0ecb1247228?s=80)<br/>
[Norman Carcamo](https://github.com/normancarcamo)<br/>
[NPM - modules](https://www.npmjs.com/~normanfx)<br/>
