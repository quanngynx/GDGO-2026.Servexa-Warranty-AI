/*
  Warnings:

  - Added the required column `asc_center_id` to the `technician_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "technician_profiles" ADD COLUMN     "asc_center_id" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "technician_profiles_user_id_idx" ON "technician_profiles"("user_id");

-- CreateIndex
CREATE INDEX "technician_profiles_asc_center_id_idx" ON "technician_profiles"("asc_center_id");

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_assigned_technician_id_fkey" FOREIGN KEY ("assigned_technician_id") REFERENCES "technician_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technician_profiles" ADD CONSTRAINT "technician_profiles_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
