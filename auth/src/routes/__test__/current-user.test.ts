import request from 'supertest';
import { app } from '../../app';

it('Should return null if not signin or signup', async () => {
  const response = await request(app).get('/api/users/currentuser').expect(200);

  expect(response.body).toEqual({ currentUser: null });
});

it('Should return UserPayload after signup ', async () => {
  const cookie = await global.signin();

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual('test@test.com');
});
