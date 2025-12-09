const axios = require("axios");
const app = require("../../src/server");
let server;
let baseURL;

beforeAll((done) => {
  server = app.listen(0, () => {
    const { port } = server.address();
    baseURL = `http://127.0.0.1:${port}`;
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe("E2E GET /hello", () => {
  // ✅ Cas nominal : requête GET sans paramètre
  it("responds with Hello world", async () => {
    const res = await axios.get(`${baseURL}/hello`);
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world!");
  });

  // ✅ Cas nominal : requête GET avec nom
  it("responds with personalized greeting when name is provided", async () => {
    const res = await axios.get(`${baseURL}/hello/Charles`);
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world! From Charles");
  });

  // 🔍 Cas limite : nom avec espaces (axios encode automatiquement)
  it("handles name with spaces", async () => {
    const res = await axios.get(`${baseURL}/hello/Charles Vanzetta`);
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world! From Charles Vanzetta");
  });

  // 🔍 Cas limite : caractères spéciaux
  it("handles special characters in name", async () => {
    const res = await axios.get(`${baseURL}/hello/${encodeURIComponent("<test>")}`);
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world! From <test>");
  });

  // 🛡️ Vérification : headers de réponse
  it("returns correct content-type header", async () => {
    const res = await axios.get(`${baseURL}/hello`);
    expect(res.headers["content-type"]).toMatch(/text\/html/);
  });

  // 🔍 Cas limite : route inexistante (404)
  it("returns 404 for non-existent route", async () => {
    try {
      await axios.get(`${baseURL}/nonexistent`);
      fail("Should have thrown 404 error");
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });
});

describe("E2E POST /hello", () => {
  // ✅ Cas nominal : POST avec header x-name
  it("responds with personalized greeting from x-name header", async () => {
    const res = await axios.post(`${baseURL}/hello`, null, {
      headers: { "x-name": "Charles" }
    });
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world! From Charles");
  });

  // ✅ Cas nominal : POST sans header
  it("responds with generic greeting when x-name header is missing", async () => {
    const res = await axios.post(`${baseURL}/hello`);
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world!");
  });

  // 🔍 Cas limite : POST avec header vide
  it("handles empty x-name header", async () => {
    const res = await axios.post(`${baseURL}/hello`, null, {
      headers: { "x-name": "" }
    });
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world!");
  });

  // 🔍 Cas limite : POST avec caractères spéciaux dans header
  it("handles special characters in x-name header", async () => {
    const res = await axios.post(`${baseURL}/hello`, null, {
      headers: { "x-name": "<script>test</script>" }
    });
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world! From <script>test</script>");
  });

  // 🔍 Cas limite : POST avec body (devrait être ignoré)
  it("ignores request body and uses only x-name header", async () => {
    const res = await axios.post(
      `${baseURL}/hello`,
      { name: "BodyName" },
      { headers: { "x-name": "HeaderName" } }
    );
    expect(res.status).toBe(200);
    expect(res.data).toBe("Hello world! From HeaderName");
  });

  // 🛡️ Vérification : headers de réponse
  it("returns correct content-type header for POST", async () => {
    const res = await axios.post(`${baseURL}/hello`);
    expect(res.headers["content-type"]).toMatch(/text\/html/);
  });
});

describe("E2E Server Behavior", () => {
  // ✅ Vérification : serveur fonctionne sur port dynamique
  it("server is running and accessible", async () => {
    expect(baseURL).toMatch(/http:\/\/127\.0\.0\.1:\d+/);
    const res = await axios.get(`${baseURL}/hello`);
    expect(res.status).toBe(200);
  });

  // 🔍 Vérification : méthodes HTTP non supportées
  it("returns 404 for unsupported HTTP methods on /hello", async () => {
    try {
      await axios.put(`${baseURL}/hello`);
      fail("Should have thrown error");
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  it("returns 404 for DELETE method on /hello", async () => {
    try {
      await axios.delete(`${baseURL}/hello`);
      fail("Should have thrown error");
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  // 🔍 Test de concurrence : requêtes simultanées
  it("handles concurrent requests correctly", async () => {
    const requests = [
      axios.get(`${baseURL}/hello/User1`),
      axios.get(`${baseURL}/hello/User2`),
      axios.post(`${baseURL}/hello`, null, { headers: { "x-name": "User3" } }),
      axios.get(`${baseURL}/hello`),
    ];

    const results = await Promise.all(requests);

    expect(results[0].data).toBe("Hello world! From User1");
    expect(results[1].data).toBe("Hello world! From User2");
    expect(results[2].data).toBe("Hello world! From User3");
    expect(results[3].data).toBe("Hello world!");
  });
});
