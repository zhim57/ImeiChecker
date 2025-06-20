const request = require('supertest');

// Mock database models before requiring the server
jest.mock('../models/imei1.js', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));
jest.mock('../models/phoneModel.js', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
}));

process.env.MONGODB_URI = 'mongodb://localhost/test';
process.env.IMEI_API_TOKEN = 'token';

const Imei1 = require('../models/imei1.js');
const PhoneModel = require('../models/phoneModel.js');

global.fetch = jest.fn();

const app = require('../server');

const IMEI = '123456789012345';

describe('GET /api/imei1F/:imei', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns cached record when present', async () => {
    const cached = { requests: { deviceImei: Number(IMEI), models: ['M1'], frequency: ['F1'] } };
    Imei1.findOne.mockResolvedValue(cached);
    PhoneModel.findOne.mockResolvedValue(null);

    const res = await request(app).get(`/api/imei1F/${IMEI}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(cached);
    expect(global.fetch).not.toHaveBeenCalled();
    expect(PhoneModel.create).toHaveBeenCalled();
  });

  it('fetches from API when not cached', async () => {
    Imei1.findOne.mockResolvedValue(null);
    const apiData = { deviceImei: Number(IMEI), models: ['M1'], frequency: ['F1'] };
    global.fetch.mockResolvedValue({ ok: true, json: () => Promise.resolve(apiData) });
    Imei1.create.mockResolvedValue({ requests: apiData });
    PhoneModel.findOne.mockResolvedValue(null);

    const res = await request(app).get(`/api/imei1F/${IMEI}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ requests: apiData });
    expect(global.fetch).toHaveBeenCalled();
    expect(Imei1.create).toHaveBeenCalledWith({ requests: apiData });
    expect(PhoneModel.create).toHaveBeenCalled();
  });
});

describe('GET /result1/:imei', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('proxies response from external API', async () => {
    const body = 'body text';
    global.fetch.mockResolvedValue({ ok: true, text: () => Promise.resolve(body) });

    const res = await request(app).get(`/result1/${IMEI}`);
    expect(res.status).toBe(200);
    expect(res.text).toBe(body);
    expect(global.fetch).toHaveBeenCalled();
  });
});

describe('PUT /api/phone-model/:model', () => {
  const model = 'M1';
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates an existing phone model', async () => {
    const updated = { model, modelName: 'Model 1', note: 'test' };
    PhoneModel.findOneAndUpdate.mockResolvedValue(updated);

    const res = await request(app)
      .put(`/api/phone-model/${model}`)
      .send(updated);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(updated);
    expect(PhoneModel.findOneAndUpdate).toHaveBeenCalledWith(
      { model },
      updated,
      expect.any(Object)
    );
  });

  it('returns 404 when model does not exist', async () => {
    PhoneModel.findOneAndUpdate.mockResolvedValue(null);

    const res = await request(app)
      .put(`/api/phone-model/${model}`)
      .send({});

    expect(res.status).toBe(404);
  });
});
