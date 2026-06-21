/*
  Warnings:

  - The `status` column on the `Consultation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Consultation" DROP COLUMN "status",
ADD COLUMN     "status" "ConsultationStatus" NOT NULL DEFAULT 'NEW';
