const expect = require('chai').expect;
const nock = require('nock');
const request = require('../index');
const testUrl = 'https://test.com';

describe('request-axios', () => {
  beforeEach(() => {
    nock(testUrl).get('/test').reply(200, 'ok');
    nock(testUrl).post('/test').reply(200, 'ok-post');
  });

  it('Should call request', (done) => {
    request({ url: `${testUrl}/test`, method: 'GET' }, (error, response, body) => {
      expect(body).to.equal('ok');
      done();
    });
  });

  it('Should get request', (done) => {
    request.get({ url: `${testUrl}/test` }, (error, response, body) => {
      expect(body).to.equal('ok');
      done();
    });
  });

  it('Should post request', (done) => {
    request.post({ url: `${testUrl}/test` }, (error, response, body) => {
      expect(body).to.equal('ok-post');
      done();
    });
  });
});
