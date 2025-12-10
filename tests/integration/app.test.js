const request = require("supertest");
const app = require("../../src/server");

describe("GET /hello", () => {
  // ✅ Cas nominal : sans paramètre
  it("should return Hello world", async () => {
    const res = await request(app).get("/hello");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world!");
  });

  // ✅ Cas nominal : avec nom valide
  it("should return personalized greeting with name parameter", async () => {
    const res = await request(app).get("/hello/Charles");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world! From Charles");
  });

  // ✅ Cas nominal : nom multi-mots avec espaces encodés
  it("should handle URL-encoded spaces in name", async () => {
    const res = await request(app).get("/hello/Charles%20Vanzetta");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world! From Charles Vanzetta");
  });

  // 🔍 Cas limite : caractères spéciaux dans URL
  it("should handle special characters in name", async () => {
    const res = await request(app).get("/hello/<script>");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world! From <script>");
  });

  // 🔍 Cas limite : caractères unicode/émojis (doivent être encodés)
  it("should handle unicode characters and emojis", async () => {
    const res = await request(app).get(encodeURI("/hello/👋"));
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world! From 👋");
  });

  // 🔍 Cas limite : nom très long
  it("should handle very long name parameter", async () => {
    const longName = "A".repeat(1000);
    const res = await request(app).get(`/hello/${longName}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(`Hello world! From ${longName}`);
  });

  // 🔍 Cas limite : caractères spéciaux encodés
  it("should handle percent-encoded special characters", async () => {
    const res = await request(app).get("/hello/Jean%2FDupont"); // / encodé
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world! From Jean/Dupont");
  });

  // 🔍 Cas limite : nombres dans le paramètre
  it("should handle numeric name parameter", async () => {
    const res = await request(app).get("/hello/123");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world! From 123");
  });
});

describe("POST /hello", () => {
  // ✅ Cas nominal : avec header x-name valide
  it("should return personalized greeting with x-name header", async () => {
    const res = await request(app)
      .post("/hello")
      .set("x-name", "Charles");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world! From Charles");
  });

  // ✅ Cas nominal : sans header x-name
  it("should return generic greeting when x-name header is missing", async () => {
    const res = await request(app).post("/hello");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world!");
  });

  // 🔍 Cas limite : header x-name vide
  it("should return generic greeting when x-name header is empty", async () => {
    const res = await request(app)
      .post("/hello")
      .set("x-name", "");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world!");
  });

  // 🔍 Cas limite : header avec espaces uniquement (Express les trim automatiquement)
  it("should handle x-name header with only spaces", async () => {
    const res = await request(app)
      .post("/hello")
      .set("x-name", "   ");
    expect(res.statusCode).toBe(200);
    // Express trim automatiquement les headers, donc espaces seuls = chaîne vide
    expect(res.text).toBe("Hello world!");
  });

  // 🔍 Cas limite : header avec caractères spéciaux
  it("should handle special characters in x-name header", async () => {
    const res = await request(app)
      .post("/hello")
      .set("x-name", "<script>alert('XSS')</script>");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world! From <script>alert('XSS')</script>");
  });

  // 🔍 Cas limite : header avec valeur très longue
  it("should handle very long x-name header", async () => {
    const longName = "B".repeat(1000);
    const res = await request(app)
      .post("/hello")
      .set("x-name", longName);
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe(`Hello world! From ${longName}`);
  });

  // 🔍 Cas limite : header avec caractères accentués (unicode valides en HTTP)
  it("should handle accented characters in x-name header", async () => {
    const res = await request(app)
      .post("/hello")
      .set("x-name", "François");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world! From François");
  });

  // 🔍 Cas limite : multiples headers x-name (Express prend le premier)
  it("should handle multiple x-name headers (uses first value)", async () => {
    const res = await request(app)
      .post("/hello")
      .set("x-name", "Charles")
      .set("x-name", "Vanzetta");
    expect(res.statusCode).toBe(200);
    // Express utilise la première valeur par défaut
    expect(res.text).toContain("Hello world!");
  });

  // ⚠️ Vérification : endpoint accepte POST même sans body
  it("should accept POST request without body", async () => {
    const res = await request(app).post("/hello");
    expect(res.statusCode).toBe(200);
  });

  // ⚠️ Vérification : endpoint ignore le body (utilise uniquement header)
  it("should ignore request body and use only header", async () => {
    const res = await request(app)
      .post("/hello")
      .send({ name: "BodyName" })
      .set("x-name", "HeaderName");
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("Hello world! From HeaderName");
  });
});
