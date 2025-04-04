/*
  Warnings:

  - The primary key for the `Contectus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Contectus` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contectus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "neme" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "Collaborator_request_code" TEXT NOT NULL,
    "Content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Contectus" ("Collaborator_request_code", "Content", "email", "id", "neme", "subject") SELECT "Collaborator_request_code", "Content", "email", "id", "neme", "subject" FROM "Contectus";
DROP TABLE "Contectus";
ALTER TABLE "new_Contectus" RENAME TO "Contectus";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
