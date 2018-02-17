import { expect } from 'chai'
import Observer from '../../src/node/classes/Observer'

export default function() {
  describe('Observer:', () => {
    let observer;

    before(() => {
      observer = new Observer();
    });

    context('#constructor()', () => {
      it('should be able to create a new instance', () => {
        expect(observer).to.be.an.instanceof(Observer);
      });
      it('should have a property called "actions"', () => {
        expect(observer)
        .to.have.a.property('actions')
        .that.is.an('object')
        .that.is.empty;
      });
    });

    context('#on(name: string, action: function)', () => {
      it('should be a function', () => {
        expect(observer).to.have.a.property('on').that.is.a('function');
      });
      it('should throw error when the "name" parameter is missing', () => {
        expect(() => observer.on()).to.Throw(
          'Parameter "name" must be passed as a string'
        );
      });
      it('should throw error when the "action" parameter is missing', () => {
        expect(() => observer.on('add', null)).to.Throw(
          'Parameter "action" must be passed as a function'
        );
      });
      it('should add new actions in the list', () => {
        observer.on('add', function(data) {});
        expect(observer).to.have.a.property('actions');
      });
      it('should return the observer instance', () => {
        expect(observer.on('add', function(data) {})).to.be.instanceof(Observer);
      });
    });

    context('#off(name: string[, callback: function])', () => {
      it('should be a function', () => {
        expect(observer).to.have.a.property('off').that.is.a('function');
      });
      it('should throw error when the "name" parameter is missing', () => {
        expect(() => observer.off()).to.Throw(
          'Parameter "name" must be passed as a string'
        );
      });
      it('should remove actions when passing the "name" parameter', () => {
        observer.on('add', data => {});
        observer.off('add');
        expect(observer.actions).to.not.have.a.property('add');
      });
      it('should return the observer instance', () => {
        observer.on('add', data => {});
        expect(observer.off('add', data => {})).to.be.instanceof(Observer);
      });
    });

    context('#offAll([callback: function])', () => {
      it('should be a function', () => {
        expect(observer).to.have.a.property('offAll').that.is.a('function');
      });
      it('should remove all the actions registered in the observer', () => {
        let called = false;

        observer.on('a', data => {});
        observer.on('b', data => {});
        observer.on('c', data => {});

        observer.offAll(() => { called = true });

        expect(called).to.be.true;
      });
      it('should return the observer instance', () => {
        expect(observer.offAll()).to.be.instanceof(Observer);
      });
    });

    context('#emit(name: string, data: any)', () => {
      it('should be a function', () => {
        expect(observer).to.have.a.property('emit').that.is.a('function');
      });
      it('should throw error when the name of the action is missing', () => {
        expect(() => observer.emit()).to.Throw(
          'Parameter "name" must be passed as a string'
        );
      });
      it('should invoke the action', () => {
        let called = false;

        observer.on('add', (data) => { called = true });
        observer.emit('add');

        expect(called).to.be.true;
      });
      it('should return the observer instance', () => {
        expect(observer.emit('add')).to.be.instanceof(Observer);
      });
    });

    context('#emitAll([callback: function])', () => {
      it('should be a function', () => {
        expect(observer).to.have.a.property('emitAll').that.is.a('function');
      });
      it('should invoke all the actions registered in the observer', () => {
        let a = false, b = false, c = false, d = false;

        observer.on('a', data => { a = true })
        observer.on('b', data => { b = true })
        observer.on('c', data => { c = true })

        observer.emitAll(() => { d = true });

        expect(a).to.be.true
        expect(b).to.be.true
        expect(c).to.be.true
        expect(d).to.be.true
      })
      it('should return the observer instance\n', () => {
        expect(observer.emitAll()).to.be.instanceof(Observer);
      });
    })
  });
};
