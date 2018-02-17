// Common dependencies:
import mocha from 'mocha';

// Classes:
import Observer from './classes/Observer';
import Day from './classes/Day';
import Month from './classes/Month';
import Year from './classes/Year';
import Calendar from './classes/Calendar';

// Helpers:
import WeekDay from './helpers/WeekDay';
import Months from './helpers/Months';

// Test suites:
describe('Classes\n', () => {
  Observer();
  Day();
  Month();
  Year();
  Calendar();
});

describe('Helpers\n', () => {
  WeekDay();
  Months();
});
