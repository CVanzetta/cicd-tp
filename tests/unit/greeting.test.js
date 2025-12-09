const { getGreeting } = require("../../src/greeting");

describe("getGreeting", () => {
  // ✅ Cas nominal : sans paramètre
  it("returns the hello world message", () => {
    expect(getGreeting()).toBe("Hello world!");
  });

  // ✅ Cas nominal : avec un nom valide
  it("returns personalized greeting with valid name", () => {
    expect(getGreeting("Charles")).toBe("Hello world! From Charles");
  });

  // ✅ Cas nominal : avec un nom multi-mots
  it("returns personalized greeting with multi-word name", () => {
    expect(getGreeting("Charles Vanzetta")).toBe("Hello world! From Charles Vanzetta");
  });

  // 🔍 Cas limite : chaîne vide
  it("returns generic greeting when name is empty string", () => {
    expect(getGreeting("")).toBe("Hello world!");
  });

  // 🔍 Cas limite : espaces uniquement (note: Express trim les headers HTTP)
  it("returns personalized greeting with spaces (truthy value)", () => {
    expect(getGreeting("   ")).toBe("Hello world! From    ");
  });

  // 🔍 Cas limite : undefined explicite
  it("returns generic greeting when name is undefined", () => {
    expect(getGreeting(undefined)).toBe("Hello world!");
  });

  // 🔍 Cas limite : null
  it("returns generic greeting when name is null", () => {
    expect(getGreeting(null)).toBe("Hello world!");
  });

  // 🔍 Cas limite : false
  it("returns generic greeting when name is false", () => {
    expect(getGreeting(false)).toBe("Hello world!");
  });

  // 🔍 Cas limite : 0
  it("returns generic greeting when name is 0", () => {
    expect(getGreeting(0)).toBe("Hello world!");
  });

  // 🔍 Cas limite : NaN
  it("returns generic greeting when name is NaN", () => {
    expect(getGreeting(NaN)).toBe("Hello world!");
  });

  // ⚠️ Cas limite : nombre valide (truthy)
  it("returns personalized greeting with number", () => {
    expect(getGreeting(123)).toBe("Hello world! From 123");
  });

  // ⚠️ Cas limite : objet (truthy mais comportement inattendu)
  it("returns personalized greeting with object (converted to string)", () => {
    expect(getGreeting({ name: "Charles" })).toBe("Hello world! From [object Object]");
  });

  // ⚠️ Cas limite : array (truthy)
  it("returns personalized greeting with array (converted to string)", () => {
    expect(getGreeting(["Charles", "Vanzetta"])).toBe("Hello world! From Charles,Vanzetta");
  });

  // 🛡️ Cas sécurité : caractères spéciaux (pas d'injection, mais vérification comportement)
  it("handles special characters without sanitization", () => {
    expect(getGreeting("<script>alert('XSS')</script>")).toBe("Hello world! From <script>alert('XSS')</script>");
  });

  // 🛡️ Cas sécurité : très longue chaîne
  it("handles very long name without crashing", () => {
    const longName = "A".repeat(10000);
    expect(getGreeting(longName)).toBe(`Hello world! From ${longName}`);
  });

  // 🔍 Cas limite : caractères unicode et émojis
  it("handles unicode and emoji characters", () => {
    expect(getGreeting("Charles 👋🌍")).toBe("Hello world! From Charles 👋🌍");
  });

  // 🔍 Cas limite : retours à la ligne
  it("handles newline characters", () => {
    expect(getGreeting("Charles\nVanzetta")).toBe("Hello world! From Charles\nVanzetta");
  });
});
