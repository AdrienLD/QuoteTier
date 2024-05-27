/*
  Warnings:

  - You are about to drop the column `texte` on the `Citation` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Citation` table. All the data in the column will be lost.
  - Added the required column `citation` to the `Citation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Citation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "citation" TEXT NOT NULL,
    "auteur" TEXT,
    "annee" INTEGER,
    "verifie" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Citation" ("annee", "auteur", "id") SELECT "annee", "auteur", "id" FROM "Citation";
DROP TABLE "Citation";
ALTER TABLE "new_Citation" RENAME TO "Citation";
PRAGMA foreign_key_check("Citation");
PRAGMA foreign_keys=ON;
