import * as receiver from '../src/receiver';
import { expect } from 'chai';

describe('authorize service', function () {
  it('function should exist', function () {
    expect(receiver.handler).to.be.a('function');
  });

});
