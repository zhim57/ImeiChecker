const request = require('supertest');
const app = require('../server');

describe('GET /api/imei1F/:imei', () => {
  it('responds with 200', async () => {
    const imei = '123456789012345';
    const res = await request(app).get(`/api/imei1F/${imei}`);
    expect(res.status).toBe(200);
  });
});
