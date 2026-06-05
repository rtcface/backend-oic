import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GraphQL (POST /graphql) should be available and connected', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: '{ __schema { queryType { name } } }',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.__schema.queryType.name).toBeDefined();
      });
  });
});
