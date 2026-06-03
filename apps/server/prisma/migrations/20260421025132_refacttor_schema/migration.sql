/*
  Warnings:

  - You are about to drop the column `refreshTokenUsed` on the `KeyToken` table. All the data in the column will be lost.
  - You are about to drop the column `isDelete` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `documents` table. All the data in the column will be lost.
  - The `metadata` column on the `repair_case_field_history` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `metadata` column on the `repair_case_status_history` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `adjusted_payment_amount` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `branch_transfer_date` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `branch_transfer_reason` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `cs_status` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `cs_status_note` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `cs_status_updated_at` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_approval_metadata` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_approval_notes` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_approval_reference` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_approved` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_approved_at` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_approved_by` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_metadata` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_pending_note` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_pending_status` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_processed_at` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `payment_processed_by` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `rt_status` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `rt_status_updated_at` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `satisfaction_collected_by` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `satisfaction_comment` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `satisfaction_date` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `satisfaction_rating` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_approval_notes` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_approved_at` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_approved_by` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_coordination_instructions` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_deadline` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_metadata` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_receipt_notes` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_received_at` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_received_by` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_rejected_at` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_rejected_by` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_rejection_reason` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_request_notes` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_request_reason` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_requested_at` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transfer_requested_by` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transferred_from_asc_id` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the column `transferred_to_asc_id` on the `repair_cases` table. All the data in the column will be lost.
  - You are about to drop the `error_accessory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `wait_accessory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stocktake_id,accessory_id]` on the table `asc_stocktake_items` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `wards` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stocktake_id,accessory_id]` on the table `warehouse_stocktake_items` will be added. If there are existing duplicate values, this will fail.
  - Made the column `code` on table `wards` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "error_accessory" DROP CONSTRAINT "error_accessory_repair_case_id_fkey";

-- DropForeignKey
ALTER TABLE "repair_cases" DROP CONSTRAINT "repair_cases_payment_approved_by_fkey";

-- DropForeignKey
ALTER TABLE "repair_cases" DROP CONSTRAINT "repair_cases_payment_processed_by_fkey";

-- DropForeignKey
ALTER TABLE "repair_cases" DROP CONSTRAINT "repair_cases_satisfaction_collected_by_fkey";

-- DropForeignKey
ALTER TABLE "repair_cases" DROP CONSTRAINT "repair_cases_transfer_approved_by_fkey";

-- DropForeignKey
ALTER TABLE "repair_cases" DROP CONSTRAINT "repair_cases_transfer_received_by_fkey";

-- DropForeignKey
ALTER TABLE "repair_cases" DROP CONSTRAINT "repair_cases_transfer_rejected_by_fkey";

-- DropForeignKey
ALTER TABLE "repair_cases" DROP CONSTRAINT "repair_cases_transfer_requested_by_fkey";

-- DropForeignKey
ALTER TABLE "repair_cases" DROP CONSTRAINT "repair_cases_transferred_from_asc_id_fkey";

-- DropForeignKey
ALTER TABLE "repair_cases" DROP CONSTRAINT "repair_cases_transferred_to_asc_id_fkey";

-- DropForeignKey
ALTER TABLE "wait_accessory" DROP CONSTRAINT "wait_accessory_repair_case_id_fkey";

-- DropIndex
DROP INDEX "areas_province_id_idx";

-- DropIndex
DROP INDEX "documents_isActive_createdAt_idx";

-- DropIndex
DROP INDEX "employees_department_idx";

-- DropIndex
DROP INDEX "employees_position_idx";

-- DropIndex
DROP INDEX "employees_status_idx";

-- DropIndex
DROP INDEX "total_warehouses_created_by_idx";

-- DropIndex
DROP INDEX "total_warehouses_updated_at_idx";

-- DropIndex
DROP INDEX "total_warehouses_updated_by_idx";

-- AlterTable
ALTER TABLE "KeyToken" DROP COLUMN "refreshTokenUsed",
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "RoleClosure" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "RolePermission" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isDelete",
ADD COLUMN     "deleted_at" TIMESTAMPTZ(3),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "UserRole" ALTER COLUMN "assignedAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "accessories" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "accessory_is_used_outside_of_warranty" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "accessory_issues" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "accessory_requests" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "accessory_retail_vouchers" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "accessory_stock_transactions" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "accessory_supply_voucher_items" ALTER COLUMN "reject_handled_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "accessory_supply_vouchers" ALTER COLUMN "received_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "appointment_notifications" ALTER COLUMN "notification_time" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "sent_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "areas" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "asc_accessory_stock" ALTER COLUMN "last_updated" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "asc_centers" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "asc_stocktakes" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "broadcast_notifications" ALTER COLUMN "scheduled_for" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "sent_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "document_access_logs" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "documents" DROP COLUMN "isActive",
ADD COLUMN     "deleted_at" TIMESTAMPTZ(3),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "error_phenomena" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "error_phenomenon_solutions" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "models" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "notification_templates" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "notifications" ALTER COLUMN "read_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "archived_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "payment_periods" ALTER COLUMN "start_date" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "end_date" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "payments" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "changed_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "product_replacement_recall_items" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "product_replacement_recalls" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "product_warranties" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "provinces" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "purchase_location_groups" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "purchase_locations" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "purchase_orders" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "quotations" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "reasons" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "repair_appointments" ALTER COLUMN "confirmed_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "repair_case_accessories" ALTER COLUMN "added_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "repair_case_error_phenomena" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "repair_case_field_history" ALTER COLUMN "changed_at" SET DATA TYPE TIMESTAMPTZ(3),
DROP COLUMN "metadata",
ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "repair_case_images" ALTER COLUMN "uploaded_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "repair_case_reasons" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "repair_case_status_history" DROP COLUMN "metadata",
ADD COLUMN     "metadata" JSONB,
ALTER COLUMN "changed_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "repair_cases" DROP COLUMN "adjusted_payment_amount",
DROP COLUMN "branch_transfer_date",
DROP COLUMN "branch_transfer_reason",
DROP COLUMN "cs_status",
DROP COLUMN "cs_status_note",
DROP COLUMN "cs_status_updated_at",
DROP COLUMN "payment_approval_metadata",
DROP COLUMN "payment_approval_notes",
DROP COLUMN "payment_approval_reference",
DROP COLUMN "payment_approved",
DROP COLUMN "payment_approved_at",
DROP COLUMN "payment_approved_by",
DROP COLUMN "payment_metadata",
DROP COLUMN "payment_pending_note",
DROP COLUMN "payment_pending_status",
DROP COLUMN "payment_processed_at",
DROP COLUMN "payment_processed_by",
DROP COLUMN "rt_status",
DROP COLUMN "rt_status_updated_at",
DROP COLUMN "satisfaction_collected_by",
DROP COLUMN "satisfaction_comment",
DROP COLUMN "satisfaction_date",
DROP COLUMN "satisfaction_rating",
DROP COLUMN "transfer_approval_notes",
DROP COLUMN "transfer_approved_at",
DROP COLUMN "transfer_approved_by",
DROP COLUMN "transfer_coordination_instructions",
DROP COLUMN "transfer_deadline",
DROP COLUMN "transfer_metadata",
DROP COLUMN "transfer_receipt_notes",
DROP COLUMN "transfer_received_at",
DROP COLUMN "transfer_received_by",
DROP COLUMN "transfer_rejected_at",
DROP COLUMN "transfer_rejected_by",
DROP COLUMN "transfer_rejection_reason",
DROP COLUMN "transfer_request_notes",
DROP COLUMN "transfer_request_reason",
DROP COLUMN "transfer_requested_at",
DROP COLUMN "transfer_requested_by",
DROP COLUMN "transferred_from_asc_id",
DROP COLUMN "transferred_to_asc_id",
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "distance_fee_calculated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "solutions" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "technician_profiles" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "total_warehouse_stock" ALTER COLUMN "last_restocked" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "last_updated" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "total_warehouses" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "wards" ALTER COLUMN "code" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "warehouse_stocktakes" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "warranty_claims" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "warranty_coordination" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "responded_at" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "warranty_policies" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMPTZ(3);

-- DropTable
DROP TABLE "error_accessory";

-- DropTable
DROP TABLE "wait_accessory";

-- CreateTable
CREATE TABLE "repair_case_transfers" (
    "repair_case_id" TEXT NOT NULL,
    "branch_transfer_reason" TEXT,
    "branch_transfer_date" DATE,
    "transferred_from_asc_id" TEXT,
    "transferred_to_asc_id" TEXT,
    "transfer_approved_by" TEXT,
    "transfer_request_reason" TEXT,
    "transfer_request_notes" TEXT,
    "transfer_requested_at" TIMESTAMPTZ(3),
    "transfer_requested_by" TEXT,
    "transfer_rejected_by" TEXT,
    "transfer_rejected_at" TIMESTAMPTZ(3),
    "transfer_rejection_reason" TEXT,
    "transfer_approved_at" TIMESTAMPTZ(3),
    "transfer_approval_notes" TEXT,
    "transfer_coordination_instructions" TEXT,
    "transfer_deadline" TIMESTAMPTZ(3),
    "transfer_received_by" TEXT,
    "transfer_received_at" TIMESTAMPTZ(3),
    "transfer_receipt_notes" TEXT,
    "transfer_metadata" JSONB,

    CONSTRAINT "repair_case_transfers_pkey" PRIMARY KEY ("repair_case_id")
);

-- CreateTable
CREATE TABLE "repair_case_payment_details" (
    "repair_case_id" TEXT NOT NULL,
    "payment_processed_by" TEXT,
    "payment_processed_at" TIMESTAMPTZ(3),
    "payment_metadata" JSONB,
    "payment_approved" BOOLEAN,
    "payment_approved_by" TEXT,
    "payment_approved_at" TIMESTAMPTZ(3),
    "payment_approval_notes" TEXT,
    "payment_approval_reference" TEXT,
    "adjusted_payment_amount" DECIMAL(10,2),
    "payment_approval_metadata" JSONB,
    "payment_pending_status" "PaymentPendingStatus",
    "payment_pending_note" TEXT,

    CONSTRAINT "repair_case_payment_details_pkey" PRIMARY KEY ("repair_case_id")
);

-- CreateTable
CREATE TABLE "repair_case_satisfactions" (
    "repair_case_id" TEXT NOT NULL,
    "satisfaction_rating" "SatisfactionRating",
    "satisfaction_comment" TEXT,
    "satisfaction_date" DATE,
    "satisfaction_collected_by" TEXT,

    CONSTRAINT "repair_case_satisfactions_pkey" PRIMARY KEY ("repair_case_id")
);

-- CreateTable
CREATE TABLE "repair_case_cs_rt_statuses" (
    "repair_case_id" TEXT NOT NULL,
    "cs_status" "CSStatus",
    "cs_status_note" TEXT,
    "cs_status_updated_at" TIMESTAMPTZ(3),
    "rt_status" "RTStatus",
    "rt_status_updated_at" TIMESTAMPTZ(3),

    CONSTRAINT "repair_case_cs_rt_statuses_pkey" PRIMARY KEY ("repair_case_id")
);

-- CreateTable
CREATE TABLE "wait_accessory_items" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "part_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "wait_accessory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_accessory_items" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "part_name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "error_accessory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "used_refresh_tokens" (
    "id" TEXT NOT NULL,
    "key_token_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "used_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "used_refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "wait_accessory_items_repair_case_id_idx" ON "wait_accessory_items"("repair_case_id");

-- CreateIndex
CREATE INDEX "error_accessory_items_repair_case_id_idx" ON "error_accessory_items"("repair_case_id");

-- CreateIndex
CREATE INDEX "used_refresh_tokens_key_token_id_idx" ON "used_refresh_tokens"("key_token_id");

-- CreateIndex
CREATE UNIQUE INDEX "used_refresh_tokens_key_token_id_token_key" ON "used_refresh_tokens"("key_token_id", "token");

-- CreateIndex
CREATE INDEX "KeyToken_userId_idx" ON "KeyToken"("userId");

-- CreateIndex
CREATE INDEX "accessory_issue_items_issue_id_idx" ON "accessory_issue_items"("issue_id");

-- CreateIndex
CREATE INDEX "accessory_issue_items_accessory_id_idx" ON "accessory_issue_items"("accessory_id");

-- CreateIndex
CREATE INDEX "accessory_stock_transactions_accessory_id_created_at_idx" ON "accessory_stock_transactions"("accessory_id", "created_at");

-- CreateIndex
CREATE INDEX "accessory_stock_transactions_asc_center_id_created_at_idx" ON "accessory_stock_transactions"("asc_center_id", "created_at");

-- CreateIndex
CREATE INDEX "accessory_stock_transactions_total_warehouse_id_created_at_idx" ON "accessory_stock_transactions"("total_warehouse_id", "created_at");

-- CreateIndex
CREATE INDEX "accessory_stock_transactions_transaction_type_operation_idx" ON "accessory_stock_transactions"("transaction_type", "operation");

-- CreateIndex
CREATE INDEX "appointment_notifications_appointment_id_idx" ON "appointment_notifications"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "asc_stocktake_items_stocktake_id_accessory_id_key" ON "asc_stocktake_items"("stocktake_id", "accessory_id");

-- CreateIndex
CREATE INDEX "broadcast_notifications_target_roles_idx" ON "broadcast_notifications" USING GIN ("target_roles");

-- CreateIndex
CREATE INDEX "broadcast_notifications_target_users_idx" ON "broadcast_notifications" USING GIN ("target_users");

-- CreateIndex
CREATE INDEX "broadcast_notifications_target_centers_idx" ON "broadcast_notifications" USING GIN ("target_centers");

-- CreateIndex
CREATE INDEX "documents_deleted_at_createdAt_idx" ON "documents"("deleted_at", "createdAt");

-- CreateIndex
CREATE INDEX "error_phenomenon_solutions_solution_id_idx" ON "error_phenomenon_solutions"("solution_id");

-- CreateIndex
CREATE INDEX "notification_preferences_user_id_idx" ON "notification_preferences"("user_id");

-- CreateIndex
CREATE INDEX "purchase_order_items_purchase_order_id_idx" ON "purchase_order_items"("purchase_order_id");

-- CreateIndex
CREATE INDEX "purchase_order_items_accessory_id_idx" ON "purchase_order_items"("accessory_id");

-- CreateIndex
CREATE INDEX "repair_case_accessories_repair_case_id_idx" ON "repair_case_accessories"("repair_case_id");

-- CreateIndex
CREATE INDEX "repair_case_accessories_accessory_id_idx" ON "repair_case_accessories"("accessory_id");

-- CreateIndex
CREATE UNIQUE INDEX "wards_code_key" ON "wards"("code");

-- CreateIndex
CREATE INDEX "wards_province_id_idx" ON "wards"("province_id");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_stocktake_items_stocktake_id_accessory_id_key" ON "warehouse_stocktake_items"("stocktake_id", "accessory_id");

-- CreateIndex
CREATE INDEX "warranty_coordination_warranty_claim_id_idx" ON "warranty_coordination"("warranty_claim_id");

-- CreateIndex
CREATE INDEX "warranty_coordination_coordinator_asc_id_idx" ON "warranty_coordination"("coordinator_asc_id");

-- CreateIndex
CREATE INDEX "warranty_coordination_created_by_idx" ON "warranty_coordination"("created_by");

-- AddForeignKey
ALTER TABLE "repair_case_transfers" ADD CONSTRAINT "repair_case_transfers_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_transfers" ADD CONSTRAINT "repair_case_transfers_transfer_approved_by_fkey" FOREIGN KEY ("transfer_approved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_transfers" ADD CONSTRAINT "repair_case_transfers_transfer_requested_by_fkey" FOREIGN KEY ("transfer_requested_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_transfers" ADD CONSTRAINT "repair_case_transfers_transfer_rejected_by_fkey" FOREIGN KEY ("transfer_rejected_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_transfers" ADD CONSTRAINT "repair_case_transfers_transfer_received_by_fkey" FOREIGN KEY ("transfer_received_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_transfers" ADD CONSTRAINT "repair_case_transfers_transferred_from_asc_id_fkey" FOREIGN KEY ("transferred_from_asc_id") REFERENCES "asc_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_transfers" ADD CONSTRAINT "repair_case_transfers_transferred_to_asc_id_fkey" FOREIGN KEY ("transferred_to_asc_id") REFERENCES "asc_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_payment_details" ADD CONSTRAINT "repair_case_payment_details_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_payment_details" ADD CONSTRAINT "repair_case_payment_details_payment_processed_by_fkey" FOREIGN KEY ("payment_processed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_payment_details" ADD CONSTRAINT "repair_case_payment_details_payment_approved_by_fkey" FOREIGN KEY ("payment_approved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_satisfactions" ADD CONSTRAINT "repair_case_satisfactions_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_satisfactions" ADD CONSTRAINT "repair_case_satisfactions_satisfaction_collected_by_fkey" FOREIGN KEY ("satisfaction_collected_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_cs_rt_statuses" ADD CONSTRAINT "repair_case_cs_rt_statuses_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wait_accessory_items" ADD CONSTRAINT "wait_accessory_items_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_accessory_items" ADD CONSTRAINT "error_accessory_items_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "used_refresh_tokens" ADD CONSTRAINT "used_refresh_tokens_key_token_id_fkey" FOREIGN KEY ("key_token_id") REFERENCES "KeyToken"("id") ON DELETE CASCADE ON UPDATE CASCADE;
