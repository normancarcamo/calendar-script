## Example of usage:

```javascript
const calendar = new Calendar();

console.log('-----------------------------------------------');

calendar.on('each:year', function(year) {
  year.on('each:month:added', function(month) {
    let result = calendar.daysWithPadding(month);
    let weeks = calendar.filterDaysPerWeek(result.days);
    month.calendar = weeks;
  });
});

calendar.filter({ from: 2012 });

console.log('Weeks:', JSON.stringify(calendar.years['2014'].months[4].calendar, null, 2));
```

## Installation

## Tests:
``` bash
npm run test
```
![Image of Tests](https://raw.githubusercontent.com/normancarcamo/express-react-middleware/master/tests_preview.png)
<br/>

## Examples:
See [examples folder](https://github.com/normancarcamo/express-react-middleware/tree/master/examples)

## Maintainers:

![Image of Mantainer](http://s.gravatar.com/avatar/c3d34f6dbeeef3c39942d0ecb1247228?s=80)<br/>
[Norman Carcamo](https://github.com/normancarcamo)<br/>
[NPM - modules](https://www.npmjs.com/~normanfx)<br/>
