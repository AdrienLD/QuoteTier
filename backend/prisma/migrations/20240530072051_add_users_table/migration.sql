-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Citation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "citation" TEXT NOT NULL,
    "auteur" TEXT,
    "annee" INTEGER,
    "verifie" BOOLEAN NOT NULL DEFAULT false,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "dislikes" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Citation" ("annee", "auteur", "citation", "id", "verifie") SELECT "annee", "auteur", "citation", "id", "verifie" FROM "Citation";
DROP TABLE "Citation";
ALTER TABLE "new_Citation" RENAME TO "Citation";
PRAGMA foreign_key_check("Citation");
PRAGMA foreign_keys=ON;
