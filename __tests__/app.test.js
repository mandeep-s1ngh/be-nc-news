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

describe("app", () => {
  describe("/api/articles/:article_id", () => {
    it("200: GET - Responds with an article object", () => {
      return request(app)
        .get("/api/articles/6")
        .expect(200)
        .then((response) => {
          ({ article } = response.body);
          expect(typeof article).toBe("object");
        });
    });

    it("200: GET - object contains these properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          ({ article } = response.body);
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
    });

    it("400: GET - Responds with a 400 error msg for an invalid article id", () => {
      return request(app)
        .get("/api/articles/notAnId")
        .expect(400)
        .then((response) => {
          ({ msg } = response.body);
          expect(msg).toBe("Bad Request");
        });
    });

    it("404: GET - responds with 404 error msg for a valid but non-existent article id", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then((response) => {
          ({ msg } = response.body);
          expect(msg).toBe("No article found");
        });
    });
  });
});

describe("app", () => {
  describe("/api/articles/:article_id/comments", () => {
    it("200: GET - Responds with an array for an article that has any comments", () => {
      return request(app)
        .get("/api/articles/6/comments")
        .expect(200)
        .then((response) => {
          ({ comments } = response.body);
          expect(comments).toBeInstanceOf(Array);
        });
    });

    it("200: GET - Responds with the correct array length for an article that has more than 1 comment", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then((response) => {
          ({ comments } = response.body);
          expect(comments).toHaveLength(2);
        });
    });

    it("200: GET - Responds with the array of object/s that have the following properties: comment_id, body, article_id, author, votes: created_at", () => {
      return request(app)
        .get("/api/articles/6/comments")
        .expect(200)
        .then((response) => {
          ({ comments } = response.body);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            });
          });
          expect(comments).toHaveLength(1);
        });
    });

    it("200: GET - Responds with the array of comments in descending order if article has more than 1 comment", () => {
      return request(app)
        .get("/api/articles/9/comments")
        .expect(200)
        .then((response) => {
          ({ comments } = response.body);
          expect(comments).toBeSortedBy("created_at", { descending: true });
        });
    });

    it("200: GET - Responds with 200 error msg for a valid article id that has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({ comments: [] });
        });
    });

    it("400: GET - Responds with 400 error msg for an invalid article id", () => {
      return request(app)
        .get("/api/articles/notAnId/comments")
        .expect(400)
        .then((response) => {
          ({ msg } = response.body);
          expect(msg).toBe("Bad Request");
        });
    });

    it("404: GET = Responds with 404 error msg for a article id that does not exist", () => {
      return request(app)
        .get("/api/articles/999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("No article found");
        });
    });
  });
});

describe("app", () => {
  describe("POST /api/articles/:article_id/comments", () => {
    it("201: POST - Responds with an object ", () => {
      const requestBody = {
        author: "rogersop",
        body: "you aint you when you are hungry",
      };
      return request(app)
        .post("/api/articles/7/comments")
        .send(requestBody)
        .expect(201)
        .then(({ body }) => {
          ({ comment } = body);
          expect(typeof comment).toBe("object");
        });
    });

    it("201: POST - Responds with the correct properties on the object", () => {
      const requestBody = {
        author: "butter_bridge",
        body: "You are better off getting a mac",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(requestBody)
        .expect(201)
        .then(({ body }) => {
          ({ comment } = body);
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              article_id: expect.any(Number),
              author: expect.any(String),
              votes: expect.any(Number),
              created_at: expect.any(String),
            })
          );
        });
    });

    it("201: POST - should ignore additional properties in the request body object and respond with an object that does not contain those properties ", () => {
      const requestBody = {
        author: "icellusedkars",
        body: "You cannot sue Mitch",
        posted_from: "Mobile",
      };
      return request(app)
        .post("/api/articles/4/comments")
        .send(requestBody)
        .expect(201)
        .then(({ body }) => {
          ({ comment } = body);
          expect(comment).toEqual(
            expect.not.objectContaining({ posted_from: expect.any(String) })
          );
        });
    });

    it("400: POST - Responds with a 400 error msg when a missing a required field", () => {
      const requestBody = {
        author: "icellusedkars",
      };
      return request(app)
        .post("/api/articles/12/comments")
        .send(requestBody)
        .expect(400)
        .then(({ body }) => {
          ({ comment } = body);
          expect(body.msg).toBe("Bad Request");
        });
    });

    it("400: POST - Responds with a 400 error msg for an invalid id", () => {
      const requestBody = {
        author: "icellusedkars",
        body: "Wow, that is a big moustache",
      };
      return request(app)
        .post("/api/articles/notAnId/comments")
        .send(requestBody)
        .expect(400)
        .then(({ body }) => {
          ({ comment } = body);
          expect(body.msg).toBe("Bad Request");
        });
    });

    it("400: POST - Responds with a 400 error msg for invalid schema validation", () => {
      const requestBody = {
        author: 62345,
        body: "No, you are not a cat",
      };
      return request(app)
        .post("/api/articles/11/comments")
        .send(requestBody)
        .expect(400)
        .then(({ body }) => {
          ({ comment } = body);
          expect(body.msg).toBe("Bad Request");
        });
    });
  });
});
