const request = require("supertest");
const app = require("../index");

describe("Search word without param", () => {
  it("should test that no word param is passed in params", async () => {
    const res = await request(app).get("/search").send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", 0);
    expect(res.body).toHaveProperty("data", "Word param missing");
  });
});

describe("Search word with param but no data", () => {
  it("should test that param is passed empty", async () => {
    const res = await request(app).get("/search?word=").send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", 0);
    expect(res.body).toHaveProperty("data", "Word param missing");
  });
});

describe("Search word with param but not available", () => {
  it("should test that param but no data available", async () => {
    const res = await request(app).get("/search?word=ali").send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", 0);
    expect(res.body).toHaveProperty("data", "No match found");
  });
});

describe("Search word with param and is available", () => {
  it("should test that param and is available", async () => {
    const res = await request(app).get("/search?word=from").send();
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("success", 1);
    expect(res.body).toHaveProperty("data", [
      "does it come from? Contrary to popular",
      "classical Latin literature from 45 BC, making",
      "Latin words, consectetur, from a Lorem Ipsum",
      "Lorem Ipsum comes from sections 1.10.32 and",
      'sit amet..", comes from a line in',
      '1.10.32 and 1.10.33 from "de Finibus Bonorum',
      "by English versions from the 1914 translation",
    ]);
  });
});
