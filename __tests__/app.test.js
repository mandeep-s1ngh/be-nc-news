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
  describe("GET /api/topics", () => {
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
  describe("GET /api/articles", () => {
    it("200: GET - Responds with an array of article objects. each object should have the correct properties", () => {
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
  describe("GET /api/articles/:article_id", () => {
    it("200: GET - Responds with an article object", () => {
      return request(app)
        .get("/api/articles/6")
        .expect(200)
        .then((response) => {
          ({ article } = response.body);
          expect(typeof article).toBe("object");
        });
    });

    it("200: GET - object contains the correct properties", () => {
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
  describe("GET /api/articles/:article_id/comments", () => {
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

    it("404: POST - returns a 404 error msg for a invalid username", () => {
      const requestBody = {
        author: "cool_dude",
        body: "No, you are not a cat",
      };
      return request(app)
        .post("/api/articles/8/comments")
        .send(requestBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Not found");
        });
    });

    it("404: POST - returns a 404 error msg for a non existent article_id", () => {
      const requestBody = {
        author: "lurker",
        body: "No, you are not a cat",
      };
      return request(app)
        .post("/api/articles/999/comments")
        .send(requestBody)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Not found");
        });
    });
  });
});

describe("app", () => {
  describe("PATCH /api/articles/:article_id", () => {
    it("200: PATCH - Responds with an object", () => {
      const requestBody = {
        inc_votes: 1,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(requestBody)
        .expect(200)
        .then(({ body }) => {
          ({ updatedArticle } = body);
          expect(typeof updatedArticle).toBe("object");
        });
    });

    it("200: PATCH - Responds with the correct properties on the object ", () => {
      const requestBody = {
        inc_votes: 5,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(requestBody)
        .expect(200)
        .then(({ body }) => {
          ({ updatedArticle } = body);
          expect(updatedArticle).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              body: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
    });

    it("200: PATCH - Responds with the votes property on article incremented when inc_votes is a positive integer", () => {
      const requestBody = {
        inc_votes: 15,
      };
      return request(app)
        .patch("/api/articles/3")
        .send(requestBody)
        .expect(200)
        .then(({ body }) => {
          ({ updatedArticle } = body);
          expect(updatedArticle.votes).toBe(15);
        });
    });

    it("200: PATCH - Responds with the votes property on article decremented when inc_votes is a negative integer", () => {
      const requestBody = {
        inc_votes: -100,
      };
      return request(app)
        .patch("/api/articles/1")
        .send(requestBody)
        .expect(200)
        .then(({ body }) => {
          ({ updatedArticle } = body);
          expect(updatedArticle.votes).toBe(0);
        });
    });

    it("400: PATCH - Responds with a 400 error msg when missing a required field", () => {
      const requestBody = {};
      return request(app)
        .patch("/api/articles/1")
        .send(requestBody)
        .expect(400)
        .then(({ body }) => {
          ({ updatedArticle } = body);
          expect(body.msg).toBe("Bad Request");
        });
    });

    it("400: PATCH - Responds with a 400 error msg for incorrect data type in request body", () => {
      const requestBody = {
        inc_votes: "banana",
      };
      return request(app)
        .patch("/api/articles/1")
        .send(requestBody)
        .expect(400)
        .then(({ body }) => {
          ({ updatedArticle } = body);
          expect(body.msg).toBe("Bad Request");
        });
    });

    it("400: PATCH - Responds with a 400 error msg for invalid article id", () => {
      const requestBody = {
        inc_votes: 5,
      };
      return request(app)
        .patch("/api/articles/notAnId")
        .send(requestBody)
        .expect(400)
        .then(({ body }) => {
          ({ updatedArticle } = body);
          expect(body.msg).toBe("Bad Request");
        });
    });

    it("404: PATCH - Responds with a 404 error msg for a valid but non existent article_id", () => {
      const requestBody = {
        inc_votes: 5,
      };
      return request(app)
        .patch("/api/articles/999")
        .send(requestBody)
        .expect(404)
        .then(({ body }) => {
          ({ updatedArticle } = body);
          expect(body.msg).toBe("No article found");
        });
    });
  });
});

describe("app", () => {
  describe("GET /api/users", () => {
    it("200: GET - Responds with an array of objects that contain the correct properties", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          ({ users } = response.body);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });

    it("200: GET - Responds with the correct number of users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((response) => {
          ({ users } = response.body);
          expect(users).toHaveLength(4);
        });
    });
  });
});

describe("app", () => {
  describe("GET /api/articles (queries)", () => {
    it("200: GET - Responds with an array of objects containing all the corresponding articles from a specific topic query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((response) => {
          ({ articles } = response.body);
          const filteredTopic = "mitch";
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: filteredTopic,
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String),
              })
            );
            expect(articles).toHaveLength(11);
          });
        });
    });

    it("200: GET - Responds with no articles for a valid topic that has no articles associated with it", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((response) => {
          ({ articles } = response.body);
          expect(articles).toHaveLength(0);
        });
    });

    it("200: GET - Responds with the articles sorted by any valid column", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then((response) => {
          ({ articles } = response.body);
          expect(articles).toBeSortedBy("title", { descending: true });
        });
    });

    it("200: GET - Responds with the articles ordered by date in ascending order", () => {
      return request(app)
        .get("/api/articles?&order=asc")
        .expect(200)
        .then((response) => {
          ({ articles } = response.body);
          expect(articles).toBeSortedBy("created_at", { descending: false });
        });
    });

    it("200: GET - Responds with the articles ordered by date in descending order", () => {
      return request(app)
        .get("/api/articles?&order=DESC")
        .expect(200)
        .then((response) => {
          ({ articles } = response.body);
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });

    it("400: GET - Responds with a 400 error msg for an invalid sort by option", () => {
      return request(app)
        .get("/api/articles?sort_by=banana")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    it("400: GET - Responds with a 400 error msg for an invalid order query", () => {
      return request(app)
        .get("/api/articles?&order=newest")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    it("404: GET - Responds with a 404 error msg for a non existent topic", () => {
      return request(app)
        .get("/api/articles?topic=banana")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No topic found");
        });
    });
  });
});

describe("app", () => {
  describe("GET /api/articles/:article_id (comment count)", () => {
    it("200: GET - Responds with an article object", () => {
      return request(app)
        .get("/api/articles/5")
        .expect(200)
        .then((response) => {
          ({ article } = response.body);
          expect(typeof article).toBe("object");
        });
    });

    it("200: GET - object contains the correct properties", () => {
      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then((response) => {
          ({ article } = response.body);
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
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

    it("404: GET - Responds with a 404 error msg for a valid but non existent article id", () => {
      return request(app)
        .get("/api/articles/999")
        .expect(404)
        .then((response) => {
          ({ msg } = response.body);
          expect(msg).toBe("No article found");
        });
    });
  });
});

describe("app", () => {
  describe("DELETE /api/comments/:comment_id", () => {
    it("204: DELETE - Responds with an object", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(typeof body).toBe("object");
        });
    });

    it("204: DELETE - Responds with an empty object ", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });

    it("400: DELETE - Responds with a 400 error msg for an invalid comment id", () => {
      return request(app)
        .delete("/api/comments/banana")
        .expect(400)
        .then((response) => {
          ({ msg } = response.body);
          expect(msg).toBe("Bad Request");
        });
    });

    it("404: DELETE - Responds with a 404 error msg for a valid but non existent comment id", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then((response) => {
          ({ msg } = response.body);
          expect(msg).toBe("No comment found");
        });
    });
  });
});

describe("app", () => {
  describe("GET /api", () => {
    it("200: GET - Responds with an object", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          ({ endpoints } = response.body);
          expect(typeof endpoints).toBe("object");
        });
    });

    it("200: GET - Responds with all the endpoint objects from the endpoints.json file", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          ({ endpoints } = response.body);
          expect(Object.keys(endpoints).length).toBe(11);
        });
    });
  });
});
