import { hashPassword, comparePassword } from "../../utils/password";

describe("Password Utilities", () => {
  describe("hashPassword()", () => {
    it("should hash a password successfully", async () => {
      const plainPassword = "MySecurePassword123";

      const hashedPassword = await hashPassword(plainPassword);

      // Hash harus ada dan bukan string kosong
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword.length).toBeGreaterThan(0);
      // Hash harus berbeda dari plaintext
      expect(hashedPassword).not.toBe(plainPassword);
    });

    it("should produce different hash for same password each time", async () => {
      const plainPassword = "MySecurePassword123";

      const hash1 = await hashPassword(plainPassword);
      const hash2 = await hashPassword(plainPassword);

      // Dua hash dari password yang sama harus berbeda (karena salt random)
      expect(hash1).not.toBe(hash2);
    });
  });

  describe("comparePassword()", () => {
    let hashedPassword: string;

    beforeAll(async () => {
      // Setup: hash password yang akan digunakan di semua test
      hashedPassword = await hashPassword("CorrectPassword123");
    });

    it("should return true when password matches the hash", async () => {
      const isMatch = await comparePassword("CorrectPassword123", hashedPassword);

      expect(isMatch).toBe(true);
    });

    it("should return false when password does not match", async () => {
      const isMatch = await comparePassword("WrongPassword123", hashedPassword);

      expect(isMatch).toBe(false);
    });

    it("should return false for empty password", async () => {
      const isMatch = await comparePassword("", hashedPassword);

      expect(isMatch).toBe(false);
    });
  });
});
