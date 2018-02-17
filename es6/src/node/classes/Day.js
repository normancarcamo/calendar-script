import Observer from './Observer'

class Day extends Observer {
  constructor(key, name, summary) {
    super();

    if (typeof key !== 'number') {
      throw new Error('Invalid "key" for Day');
    };

    if (!name || typeof name !== 'string') {
      throw new Error('Invalid "name" for Day');
    };

    if (summary) {
      this.summary = summary;
    };

    this.key = key;
    this.name = name ? name.toLowerCase() : '';
    this.letter = this.name.charAt(0);
    this.abbr = this.name.substring(0, 3);
  }
}

export default Day;
