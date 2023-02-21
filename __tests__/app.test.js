const app = require("../app");
const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("app", () => {
  describe("/api/topics", () => {
    it("200: GET - Responds with an array of topic objects. each object should have a slug and description properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          ({ topics } = response.body);
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(typeof topic).toBe("object");
            expect(topic).toMatchObject({
              slug: expect.any(String),
              description: expect.any(String),
            });
          });
        });
    });
  });
});

describe("app", () => {
  describe("/api/articles", () => {
    it("200: GET - Responds with an array of article objects. each object should have the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          ({ articles } = response.body);
          expect(articles).toHaveLength(12);
          articles.forEach((article) => {
            expect(typeof article).toBe("object");
            expect(article).toHaveProperty("comment_count");
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
    it("200: GET - returns the articles sorted by date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((response) => {
          ({ articles } = response.body);
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
});
