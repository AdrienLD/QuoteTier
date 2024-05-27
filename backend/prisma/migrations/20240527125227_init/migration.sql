-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Citation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "texte" TEXT NOT NULL,
    "auteur" TEXT,
    "annee" INTEGER,
    "verified" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Citation" ("annee", "auteur", "id", "texte") SELECT "annee", "auteur", "id", "texte" FROM "Citation";
DROP TABLE "Citation";
ALTER TABLE "new_Citation" RENAME TO "Citation";
PRAGMA foreign_key_check("Citation");
PRAGMA foreign_keys=ON;
