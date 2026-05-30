-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "TotalWarehouseStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "RoleScope" AS ENUM ('SYSTEM', 'COMPANY', 'ASC_CENTER', 'DSC_CENTER');

-- CreateEnum
CREATE TYPE "AscCenterStatus" AS ENUM ('active', 'inactive', 'suspended');

-- CreateEnum
CREATE TYPE "CategoryStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ModelStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ErrorPhenomenonStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ReasonStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "SolutionStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "SolutionDifficulty" AS ENUM ('easy', 'medium', 'hard', 'expert');

-- CreateEnum
CREATE TYPE "RepairCaseStatus" AS ENUM ('tiepnhan', 'dangsua', 'chocaplk', 'choykienkhach', 'choykiencongty', 'khachkhongsua', 'khongsuaduoc', 'exchange_completed_asc', 'cs_supported_asc', 'suaxong', 'dagiao', 'hoanthanh', 'huyphieu');

-- CreateEnum
CREATE TYPE "RepairCasePriority" AS ENUM ('low', 'normal', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "RepairCaseResolution" AS ENUM ('repair_completed', 'no_repair_needed');

-- CreateEnum
CREATE TYPE "CSStatus" AS ENUM ('exchange_in_progress', 'exchange_completed_cs', 'defect_product_collected', 'cs_supported');

-- CreateEnum
CREATE TYPE "RTStatus" AS ENUM ('prepare_to_send_defect', 'defect_returned_to_lnl');

-- CreateEnum
CREATE TYPE "WarrantyForm" AS ENUM ('in_warranty', 'warranty_repair', 'no_information', 'product_not_sell');

-- CreateEnum
CREATE TYPE "WarrantyServiceType" AS ENUM ('at_asc', 'at_home', 'pick_up_from_carrier', 'pick_up_from_store', 'repair_at_ware_house');

-- CreateEnum
CREATE TYPE "HouseholdProductType" AS ENUM ('food_storage_container', 'kitchen_appliance', 'water_bottle', 'lunch_box', 'vacuum_container', 'glass_container', 'plastic_container', 'electric_appliance');

-- CreateEnum
CREATE TYPE "FoodSafetyCompliance" AS ENUM ('compliant', 'non_compliant', 'pending_test', 'not_applicable');

-- CreateEnum
CREATE TYPE "SealIntegrityStatus" AS ENUM ('excellent', 'good', 'fair', 'poor', 'failed', 'not_tested');

-- CreateEnum
CREATE TYPE "PlasticDurabilityLevel" AS ENUM ('excellent', 'good', 'fair', 'poor', 'brittle', 'cracked', 'not_tested');

-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('draft', 'pending_approval', 'approved', 'rejected', 'sent_to_customer', 'customer_approved', 'customer_rejected', 'expired');

-- CreateEnum
CREATE TYPE "SatisfactionRating" AS ENUM ('very_dissatisfied', 'dissatisfied', 'neutral', 'satisfied', 'very_satisfied');

-- CreateEnum
CREATE TYPE "TechnicianSkillLevel" AS ENUM ('basic', 'intermediate', 'advanced', 'expert');

-- CreateEnum
CREATE TYPE "TechnicianSpecialization" AS ENUM ('electrical_appliances', 'plastic_products', 'glass_products', 'sealing_systems', 'food_safety', 'general_repair');

-- CreateEnum
CREATE TYPE "GenderEnum" AS ENUM ('male', 'female', 'other');

-- CreateEnum
CREATE TYPE "DepartmentEnum" AS ENUM ('technical', 'coordination');

-- CreateEnum
CREATE TYPE "PositionEnum" AS ENUM ('supervisor', 'receptionist', 'home_appliance_technician', 'home_service_technician', 'workshop_technician', 'warehouse_staff');

-- CreateEnum
CREATE TYPE "EmployeeStatusEnum" AS ENUM ('active', 'resigned', 'on_leave');

-- CreateEnum
CREATE TYPE "RepairCaseImageType" AS ENUM ('model_serial', 'repair_form', 'before_repair', 'after_repair', 'parts_components', 'warranty_invoice', 'shipping_fee_invoice', 'repair_completion_receipt');

-- CreateEnum
CREATE TYPE "AccessoryStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "AccessoryRequestStatus" AS ENUM ('draft', 'submitted', 'approved', 'rejected', 'partially_approved', 'shipped', 'received');

-- CreateEnum
CREATE TYPE "StatusRecall" AS ENUM ('not_recalled', 'in_recalled', 'sent', 'null_value');

-- CreateEnum
CREATE TYPE "AccessoryRequestUrgency" AS ENUM ('low', 'normal', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "AccessoryRequestItemStatus" AS ENUM ('pending', 'partially_approved', 'fully_approved', 'fulfilled', 'cancelled');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('draft', 'submitted', 'approved', 'ordered', 'partially_received', 'received', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'partial', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentPendingStatus" AS ENUM ('waiting_for_information', 'information_provided', 'waiting_for_payment', 'paid');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('pending', 'partial', 'received', 'cancelled');

-- CreateEnum
CREATE TYPE "SupplyVoucherStatus" AS ENUM ('issued', 'received', 'partially_received', 'cancelled');

-- CreateEnum
CREATE TYPE "AccessoryIssueStatus" AS ENUM ('issued', 'in_use', 'partially_returned', 'returned', 'consumed');

-- CreateEnum
CREATE TYPE "IssuePurpose" AS ENUM ('repair_case', 'maintenance', 'testing', 'other');

-- CreateEnum
CREATE TYPE "AccessoryIssueItemStatus" AS ENUM ('issued', 'in_use', 'returned', 'consumed');

-- CreateEnum
CREATE TYPE "StockTransactionType" AS ENUM ('purchase_order', 'issue', 'return', 'adjustment', 'transfer', 'initial_stock', 'supply', 'warehouse_import', 'warehouse_transfer', 'retail_sale');

-- CreateEnum
CREATE TYPE "StockOperation" AS ENUM ('in', 'out');

-- CreateEnum
CREATE TYPE "WarrantyType" AS ENUM ('standard', 'extended', 'premium');

-- CreateEnum
CREATE TYPE "WarrantyPolicyStatus" AS ENUM ('active', 'inactive');

-- CreateEnum
CREATE TYPE "ProductWarrantyStatus" AS ENUM ('active', 'expired', 'voided', 'transferred');

-- CreateEnum
CREATE TYPE "WarrantyClaimType" AS ENUM ('repair', 'replacement', 'refund');

-- CreateEnum
CREATE TYPE "WarrantyClaimStatus" AS ENUM ('submitted', 'under_review', 'approved', 'rejected', 'completed');

-- CreateEnum
CREATE TYPE "WarrantyClaimUrgency" AS ENUM ('low', 'normal', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "WarrantyCoordinationType" AS ENUM ('part_request', 'technical_support', 'escalation', 'manufacturer_contact');

-- CreateEnum
CREATE TYPE "WarrantyCoordinationPriority" AS ENUM ('low', 'normal', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "WarrantyCoordinationStatus" AS ENUM ('pending', 'in_progress', 'resolved', 'closed');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('drop_off', 'pickup', 'inspection', 'consultation');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rescheduled');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('sms', 'email', 'phone_call');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('pending', 'sent', 'failed');

-- CreateEnum
CREATE TYPE "CustomerGroup" AS ENUM ('individual', 'dealer_store', 'store_representative', 'supplier', 'invoice', 'company');

-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('repair_case', 'inventory', 'appointment', 'warranty', 'system', 'announcement', 'task', 'approval', 'alert', 'promotion', 'policy', 'maintenance');

-- CreateEnum
CREATE TYPE "BroadcastTargetType" AS ENUM ('all', 'roles', 'users', 'asc_centers', 'mixed');

-- CreateEnum
CREATE TYPE "BroadcastStatus" AS ENUM ('draft', 'scheduled', 'sending', 'sent', 'failed', 'cancelled');

-- CreateEnum
CREATE TYPE "NotificationPriority" AS ENUM ('low', 'normal', 'high', 'urgent');

-- CreateEnum
CREATE TYPE "NotificationType_New" AS ENUM ('info', 'success', 'warning', 'error', 'announcement');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('TECHNICAL', 'PROCESS', 'USER_MANUAL');

-- CreateEnum
CREATE TYPE "DocumentAction" AS ENUM ('VIEW', 'DOWNLOAD', 'EDIT', 'DELETE', 'UPLOAD', 'DEACTIVATE', 'ACTIVATE');

-- CreateTable
CREATE TABLE "accessory_issues" (
    "id" TEXT NOT NULL,
    "issue_number" TEXT NOT NULL,
    "asc_center_id" TEXT NOT NULL,
    "issued_to_user_id" TEXT NOT NULL,
    "issuePurpose" "IssuePurpose" NOT NULL DEFAULT 'repair_case',
    "repair_case_id" TEXT,
    "issue_date" DATE NOT NULL,
    "expected_return_date" DATE,
    "status" "AccessoryIssueStatus" NOT NULL DEFAULT 'issued',
    "notes" TEXT,
    "issued_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accessory_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessory_issue_items" (
    "id" TEXT NOT NULL,
    "issue_id" TEXT NOT NULL,
    "accessory_id" TEXT NOT NULL,
    "issued_quantity" INTEGER NOT NULL,
    "returned_quantity" INTEGER NOT NULL DEFAULT 0,
    "consumed_quantity" INTEGER NOT NULL DEFAULT 0,
    "unit_price" DECIMAL(10,2),
    "status" "AccessoryIssueItemStatus" NOT NULL DEFAULT 'issued',

    CONSTRAINT "accessory_issue_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessory_is_used_outside_of_warranty" (
    "id" TEXT NOT NULL,
    "asc_center_id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "accessory_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "used_quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "tax_rate" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "remark" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accessory_is_used_outside_of_warranty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessory_requests" (
    "id" TEXT NOT NULL,
    "request_number" TEXT NOT NULL,
    "asc_center_id" TEXT NOT NULL,
    "repair_case_id" TEXT,
    "requested_by" TEXT NOT NULL,
    "request_date" DATE NOT NULL,
    "urgency" "AccessoryRequestUrgency" NOT NULL DEFAULT 'normal',
    "justification" TEXT,
    "status" "AccessoryRequestStatus" NOT NULL DEFAULT 'draft',
    "status_recall" "StatusRecall",
    "approved_by" TEXT,
    "approved_date" DATE,
    "rejection_reason" TEXT,
    "total_estimated_cost" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accessory_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessory_request_items" (
    "id" TEXT NOT NULL,
    "request_id" TEXT NOT NULL,
    "accessory_id" TEXT NOT NULL,
    "requested_quantity" INTEGER NOT NULL,
    "approved_quantity" INTEGER NOT NULL DEFAULT 0,
    "fulfilled_quantity" INTEGER NOT NULL DEFAULT 0,
    "unit_price" DECIMAL(10,2),
    "total_price" DECIMAL(10,2),
    "notes" TEXT,
    "status" "AccessoryRequestItemStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "accessory_request_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessory_stock_transactions" (
    "id" TEXT NOT NULL,
    "accessory_id" TEXT NOT NULL,
    "asc_center_id" TEXT,
    "total_warehouse_id" TEXT,
    "transaction_type" "StockTransactionType" NOT NULL,
    "operation" "StockOperation" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2),
    "total_value" DECIMAL(10,2),
    "reference_id" TEXT,
    "reference_type" TEXT,
    "notes" TEXT,
    "balance_after" INTEGER NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accessory_stock_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessory_retail_vouchers" (
    "id" TEXT NOT NULL,
    "voucherNumber" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "asc_center_id" TEXT NOT NULL,
    "created_by" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accessory_retail_vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessory_retail_voucher_items" (
    "id" TEXT NOT NULL,
    "voucher_id" TEXT NOT NULL,
    "accessory_id" TEXT NOT NULL,
    "qty_issued" INTEGER NOT NULL,

    CONSTRAINT "accessory_retail_voucher_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessory_supply_vouchers" (
    "id" TEXT NOT NULL,
    "voucherNumber" TEXT NOT NULL,
    "asc_center_id" TEXT NOT NULL,
    "total_warehouse_id" TEXT,
    "issue_date" DATE NOT NULL,
    "status" "SupplyVoucherStatus" NOT NULL DEFAULT 'issued',
    "issued_by" TEXT NOT NULL,
    "received_by" TEXT,
    "received_at" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "request_id" TEXT,

    CONSTRAINT "accessory_supply_vouchers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessory_supply_voucher_items" (
    "id" TEXT NOT NULL,
    "voucher_id" TEXT NOT NULL,
    "accessory_id" TEXT NOT NULL,
    "qty_issued" INTEGER NOT NULL,
    "request_item_id" TEXT,
    "qty_accepted" INTEGER,
    "qty_rejected" INTEGER NOT NULL DEFAULT 0,
    "reject_reason" TEXT,
    "reject_note" TEXT,
    "reject_handled" BOOLEAN NOT NULL DEFAULT false,
    "reject_handled_by" TEXT,
    "reject_handled_at" TIMESTAMP(3),

    CONSTRAINT "accessory_supply_voucher_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asc_accessory_stock" (
    "id" TEXT NOT NULL,
    "asc_center_id" TEXT NOT NULL,
    "accessory_id" TEXT NOT NULL,
    "current_stock" INTEGER NOT NULL DEFAULT 0,
    "reserved_stock" INTEGER NOT NULL DEFAULT 0,
    "min_stock_level" INTEGER NOT NULL DEFAULT 5,
    "max_stock_level" INTEGER NOT NULL DEFAULT 100,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asc_accessory_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asc_centers" (
    "id" TEXT NOT NULL,
    "center_name" TEXT NOT NULL,
    "center_code" TEXT NOT NULL,
    "company_name" TEXT,
    "region" TEXT,
    "email" TEXT,
    "address" TEXT,
    "ward_id" TEXT,
    "province_id" TEXT,
    "phone" TEXT,
    "license_number" TEXT,
    "status" "AscCenterStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "asc_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asc_stocktakes" (
    "id" TEXT NOT NULL,
    "asc_center_id" TEXT NOT NULL,
    "notes" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "asc_stocktakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asc_stocktake_items" (
    "id" TEXT NOT NULL,
    "stocktake_id" TEXT NOT NULL,
    "accessory_id" TEXT NOT NULL,
    "previous_qty" INTEGER NOT NULL,
    "new_qty" INTEGER NOT NULL,
    "delta_qty" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "asc_stocktake_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_accessory" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "error_accessory1" TEXT,
    "error_qty1" INTEGER,
    "error_accessory2" TEXT,
    "error_qty2" INTEGER,
    "error_accessory3" TEXT,
    "error_qty3" INTEGER,
    "error_accessory4" TEXT,
    "error_qty4" INTEGER,
    "error_accessory5" TEXT,
    "error_qty5" INTEGER,

    CONSTRAINT "error_accessory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "payment_number" TEXT,
    "repair_case_id" TEXT NOT NULL,
    "case_number" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "asc_center_id" TEXT NOT NULL,
    "total_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "labor_or_inspection" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "shipping_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "distance_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "warranty_form" "WarrantyForm",
    "payment_period_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "changed_by" TEXT,
    "changed_at" TIMESTAMP(3),

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_periods" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_warranties" (
    "id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "customer_name" TEXT,
    "customer_phone" TEXT,
    "customer_email" TEXT,
    "customer_address" TEXT,
    "purchase_date" DATE NOT NULL,
    "purchase_location" TEXT,
    "warranty_start_date" DATE NOT NULL,
    "warranty_end_date" DATE NOT NULL,
    "warranty_policy_id" TEXT NOT NULL,
    "registration_date" DATE,
    "registered_by" TEXT,
    "asc_center_id" TEXT NOT NULL,
    "status" "ProductWarrantyStatus" NOT NULL DEFAULT 'active',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_warranties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_orders" (
    "id" TEXT NOT NULL,
    "order_number" TEXT NOT NULL,
    "asc_center_id" TEXT NOT NULL,
    "supplier_name" TEXT NOT NULL,
    "supplier_contact" TEXT,
    "order_date" DATE NOT NULL,
    "expected_delivery_date" DATE,
    "actual_delivery_date" DATE,
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'draft',
    "total_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "notes" TEXT,
    "created_by" TEXT NOT NULL,
    "approved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchase_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_order_items" (
    "id" TEXT NOT NULL,
    "purchase_order_id" TEXT NOT NULL,
    "accessory_id" TEXT NOT NULL,
    "ordered_quantity" INTEGER NOT NULL,
    "received_quantity" INTEGER NOT NULL DEFAULT 0,
    "unit_price" DECIMAL(10,2) NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "deliveryStatus" "DeliveryStatus" NOT NULL DEFAULT 'pending',

    CONSTRAINT "purchase_order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotations" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "quotation_number" TEXT NOT NULL,
    "status" "QuotationStatus" NOT NULL DEFAULT 'draft',
    "labor_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "parts_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "service_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "final_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "description" TEXT,
    "notes" TEXT,
    "valid_until" DATE,
    "created_by" TEXT NOT NULL,
    "approved_by" TEXT,
    "rejected_by" TEXT,
    "rejection_reason" TEXT,
    "sent_to_customer_date" DATE,
    "customer_response_date" DATE,
    "customer_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quotations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_replacement_recalls" (
    "id" TEXT NOT NULL,
    "recall_number" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "notes" TEXT,
    "total_cases" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_replacement_recalls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_replacement_recall_items" (
    "id" TEXT NOT NULL,
    "recall_id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_replacement_recall_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_cases" (
    "id" TEXT NOT NULL,
    "case_number" TEXT NOT NULL,
    "asc_center_id" TEXT NOT NULL,
    "area_id" TEXT,
    "customer_id" TEXT NOT NULL,
    "status" "RepairCaseStatus" NOT NULL DEFAULT 'tiepnhan',
    "priority" "RepairCasePriority" NOT NULL DEFAULT 'normal',
    "model_id" TEXT,
    "serial_number" TEXT,
    "purchase_date" DATE,
    "purchase_location" TEXT,
    "purchase_location_id" TEXT,
    "purchase_order_number" TEXT,
    "product_warranty_id" TEXT,
    "product_notes" TEXT,
    "locknlock_case_number" TEXT,
    "warranty_form" "WarrantyForm",
    "warranty_service_type" "WarrantyServiceType",
    "solution_id" TEXT,
    "damage_description" TEXT NOT NULL,
    "diagnosis" TEXT,
    "exchange_product" TEXT,
    "invoice_code" TEXT,
    "repair_solution" TEXT,
    "repair_notes" TEXT,
    "total_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "labor_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "parts_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "service_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "shipping_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "shipping_province_id" TEXT,
    "shipping_ward_id" TEXT,
    "discount_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "other_fee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "other_fee_note" TEXT,
    "received_date" DATE NOT NULL,
    "estimated_completion_date" DATE,
    "promised_delivery_date" DATE,
    "actual_completion_date" DATE,
    "payment_date" DATE,
    "payment_method" TEXT,
    "payment_reference" TEXT,
    "payment_notes" TEXT,
    "delivery_notes" TEXT,
    "asc_payment_amount" DECIMAL(10,2),
    "company_deduction" DECIMAL(10,2),
    "tax_amount" DECIMAL(10,2),
    "processing_fee" DECIMAL(10,2),
    "net_payment" DECIMAL(10,2),
    "payment_processed_by" TEXT,
    "payment_processed_at" TIMESTAMP(3),
    "payment_metadata" TEXT,
    "final_completion_date" DATE,
    "assigned_employee_id" TEXT,
    "assigned_technician_id" TEXT,
    "technician_name" TEXT,
    "created_by" TEXT NOT NULL,
    "approved_by" TEXT,
    "receiver_name" TEXT,
    "receiver_phone" TEXT,
    "household_product_type" "HouseholdProductType",
    "food_safety_compliance" "FoodSafetyCompliance",
    "seal_integrity_status" "SealIntegrityStatus",
    "plastic_durability_level" "PlasticDurabilityLevel",
    "branch_transfer_reason" TEXT,
    "branch_transfer_date" DATE,
    "transferred_from_asc_id" TEXT,
    "transferred_to_asc_id" TEXT,
    "transfer_approved_by" TEXT,
    "transfer_request_reason" TEXT,
    "transfer_request_notes" TEXT,
    "transfer_requested_at" TIMESTAMP(3),
    "transfer_requested_by" TEXT,
    "transfer_rejected_by" TEXT,
    "transfer_rejected_at" TIMESTAMP(3),
    "transfer_rejection_reason" TEXT,
    "transfer_approved_at" TIMESTAMP(3),
    "transfer_approval_notes" TEXT,
    "transfer_coordination_instructions" TEXT,
    "transfer_deadline" TIMESTAMP(3),
    "transfer_received_by" TEXT,
    "transfer_received_at" TIMESTAMP(3),
    "transfer_receipt_notes" TEXT,
    "transfer_metadata" TEXT,
    "estimated_start_date" DATE,
    "estimated_cost" DECIMAL(10,2),
    "actual_repair_time" INTEGER,
    "estimated_repair_time" INTEGER,
    "payment_approved" BOOLEAN,
    "payment_approved_by" TEXT,
    "payment_approved_at" TIMESTAMP(3),
    "payment_approval_notes" TEXT,
    "payment_approval_reference" TEXT,
    "adjusted_payment_amount" DECIMAL(10,2),
    "payment_approval_metadata" TEXT,
    "payment_pending_status" "PaymentPendingStatus",
    "payment_pending_note" TEXT,
    "resolution" "RepairCaseResolution",
    "satisfaction_rating" "SatisfactionRating",
    "satisfaction_comment" TEXT,
    "satisfaction_date" DATE,
    "satisfaction_collected_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "distance_fee" DECIMAL(10,2),
    "distance_fee_calculated_at" TIMESTAMP(3),
    "distance_fee_calculated_by" TEXT,
    "service_distance" DECIMAL(6,2),
    "error_source" TEXT,
    "error_group" TEXT,
    "repair_level" TEXT,
    "warranty_resolution" TEXT,
    "repair_activity" TEXT,
    "cs_status" "CSStatus",
    "cs_status_note" TEXT,
    "cs_status_updated_at" TIMESTAMP(3),
    "rt_status" "RTStatus",
    "rt_status_updated_at" TIMESTAMP(3),
    "status_recall" "StatusRecall",

    CONSTRAINT "repair_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_case_accessories" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "accessory_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DECIMAL(10,2),
    "total_price" DECIMAL(10,2),
    "added_by" TEXT NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repair_case_accessories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_case_error_phenomena" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "error_phenomenon_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "repair_case_error_phenomena_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_case_field_history" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "field_name" TEXT NOT NULL,
    "field_label" TEXT,
    "previous_value" TEXT,
    "new_value" TEXT,
    "change_type" TEXT NOT NULL DEFAULT 'update',
    "changed_by" TEXT NOT NULL,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "metadata" TEXT,

    CONSTRAINT "repair_case_field_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_case_images" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "image_type" "RepairCaseImageType" NOT NULL,
    "image_path" TEXT NOT NULL,
    "original_filename" TEXT,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "description" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repair_case_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_case_reasons" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "reason_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "repair_case_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_case_status_history" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "previous_status" "RepairCaseStatus",
    "new_status" "RepairCaseStatus" NOT NULL,
    "changed_by" TEXT NOT NULL,
    "reason" TEXT,
    "notes" TEXT,
    "metadata" TEXT,
    "changed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repair_case_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wait_accessory" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT NOT NULL,
    "wait_accessory1" TEXT,
    "wait_qty1" INTEGER,
    "wait_accessory2" TEXT,
    "wait_qty2" INTEGER,
    "wait_accessory3" TEXT,
    "wait_qty3" INTEGER,
    "wait_accessory4" TEXT,
    "wait_qty4" INTEGER,
    "wait_accessory5" TEXT,
    "wait_qty5" INTEGER,

    CONSTRAINT "wait_accessory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warranty_claims" (
    "id" TEXT NOT NULL,
    "claim_number" TEXT NOT NULL,
    "product_warranty_id" TEXT NOT NULL,
    "repair_case_id" TEXT,
    "asc_center_id" TEXT NOT NULL,
    "claim_type" "WarrantyClaimType" NOT NULL,
    "claim_date" DATE NOT NULL,
    "issue_description" TEXT NOT NULL,
    "diagnosis" TEXT,
    "recommended_action" TEXT,
    "estimated_cost" DECIMAL(10,2),
    "status" "WarrantyClaimStatus" NOT NULL DEFAULT 'submitted',
    "reviewed_by" TEXT,
    "review_date" DATE,
    "review_notes" TEXT,
    "approval_amount" DECIMAL(10,2),
    "rejection_reason" TEXT,
    "completed_date" DATE,
    "urgency_level" "WarrantyClaimUrgency" NOT NULL DEFAULT 'normal',
    "actual_cost" DECIMAL(10,2),
    "completed_by" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warranty_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warranty_coordination" (
    "id" TEXT NOT NULL,
    "warranty_claim_id" TEXT NOT NULL,
    "coordination_type" "WarrantyCoordinationType" NOT NULL,
    "coordinator_asc_id" TEXT NOT NULL,
    "target_asc_id" TEXT,
    "message" TEXT NOT NULL,
    "response" TEXT,
    "priority" "WarrantyCoordinationPriority" NOT NULL DEFAULT 'normal',
    "status" "WarrantyCoordinationStatus" NOT NULL DEFAULT 'pending',
    "created_by" TEXT NOT NULL,
    "responded_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),

    CONSTRAINT "warranty_coordination_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "detailed_description" TEXT,
    "documentType" "DocumentType" NOT NULL,
    "filePath" TEXT,
    "originalFileName" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "checksum" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "ascCenterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_access_logs" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "DocumentAction" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "customer_group" "CustomerGroup" NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone_1" TEXT NOT NULL,
    "phone_2" TEXT,
    "email" TEXT,
    "province_id" TEXT,
    "ward_id" TEXT,
    "address" TEXT,
    "tax_code" TEXT,
    "bank_name" TEXT,
    "account_number" TEXT,
    "contact_person" TEXT,
    "asc_center_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employee_code" TEXT NOT NULL,
    "gender" "GenderEnum" NOT NULL,
    "full_name" TEXT NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "primary_phone" TEXT NOT NULL,
    "secondary_phone" TEXT,
    "email" TEXT NOT NULL,
    "permanent_address" TEXT NOT NULL,
    "avatar" TEXT,
    "department" "DepartmentEnum" NOT NULL,
    "position" "PositionEnum" NOT NULL,
    "start_date" DATE NOT NULL,
    "asc_center_id" TEXT NOT NULL,
    "base_salary" DECIMAL(15,2),
    "status" "EmployeeStatusEnum" NOT NULL DEFAULT 'active',
    "national_id" TEXT NOT NULL,
    "id_issue_date" DATE NOT NULL,
    "id_address" TEXT NOT NULL,
    "id_issuing_authority" TEXT NOT NULL,
    "bank_account" TEXT,
    "tax_id" TEXT,
    "bank_name" TEXT,
    "emergency_contact_name" TEXT,
    "emergency_contact_phone" TEXT,
    "user_id" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technician_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "skill_level" "TechnicianSkillLevel" NOT NULL DEFAULT 'basic',
    "specializations" "TechnicianSpecialization"[],
    "certifications" TEXT,
    "experience_years" INTEGER NOT NULL DEFAULT 0,
    "max_concurrent_cases" INTEGER NOT NULL DEFAULT 5,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "average_repair_time" INTEGER,
    "customer_rating" DECIMAL(3,2),
    "completed_cases" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technician_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KeyToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "privateKey" TEXT NOT NULL,
    "publicKey" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "refreshTokenUsed" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" VARCHAR(255),
    "updatedBy" VARCHAR(255),

    CONSTRAINT "KeyToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleClosure" (
    "id" TEXT NOT NULL,
    "ancestorId" TEXT NOT NULL,
    "descendantId" TEXT NOT NULL,
    "depth" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleClosure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "company_email" TEXT,
    "personal_email" TEXT,
    "avatar" TEXT,
    "phone" VARCHAR(20),
    "password" TEXT NOT NULL,
    "secretOtp" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'active',
    "asc_center_id" TEXT,
    "ward_id" TEXT,
    "province_id" TEXT,
    "role_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" VARCHAR(255),
    "updatedBy" VARCHAR(255),
    "isDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "areas" (
    "id" TEXT NOT NULL,
    "province_id" TEXT NOT NULL,
    "ward_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cay_so" TEXT,
    "tien_cong_1" DECIMAL(10,2),
    "tien_cong_2" DECIMAL(10,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provinces" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wards" (
    "id" TEXT NOT NULL,
    "province_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "detail" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "broadcast_notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "action_url" TEXT,
    "icon" TEXT,
    "category" "NotificationCategory" NOT NULL DEFAULT 'system',
    "priority" "NotificationPriority" NOT NULL DEFAULT 'normal',
    "type" "NotificationType_New" NOT NULL DEFAULT 'info',
    "target_type" "BroadcastTargetType" NOT NULL,
    "target_roles" TEXT[],
    "target_users" TEXT[],
    "target_centers" TEXT[],
    "send_immediately" BOOLEAN NOT NULL DEFAULT true,
    "scheduled_for" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "status" "BroadcastStatus" NOT NULL DEFAULT 'draft',
    "recipient_count" INTEGER NOT NULL DEFAULT 0,
    "read_count" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "broadcast_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "template_code" TEXT,
    "broadcast_id" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "action_url" TEXT,
    "icon" TEXT,
    "category" "NotificationCategory" NOT NULL,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'normal',
    "type" "NotificationType_New" NOT NULL DEFAULT 'info',
    "metadata" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category" "NotificationCategory" NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "show_popup" BOOLEAN NOT NULL DEFAULT true,
    "play_sound" BOOLEAN NOT NULL DEFAULT false,
    "allow_broadcasts" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_templates" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "NotificationCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "actionUrl" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "priority" "NotificationPriority" NOT NULL DEFAULT 'normal',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accessories" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "part_number" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "part_group_number" TEXT,
    "part_group_name" TEXT,
    "part_description" TEXT,
    "item_number" TEXT,
    "english_name" TEXT,
    "customer_price" TEXT,
    "unit_price" DECIMAL(10,2),
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "min_stock_level" INTEGER NOT NULL DEFAULT 5,
    "supplier" TEXT,
    "status" "AccessoryStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accessories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "CategoryStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "labor_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "inspection_cost" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_phenomena" (
    "id" TEXT NOT NULL,
    "category_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "status" "ErrorPhenomenonStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "error_phenomena_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "error_phenomenon_solutions" (
    "id" TEXT NOT NULL,
    "error_phenomenon_id" TEXT NOT NULL,
    "solution_id" TEXT NOT NULL,
    "is_preferred" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_phenomenon_solutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model_code" TEXT NOT NULL,
    "image" TEXT,
    "status" "ModelStatus" NOT NULL DEFAULT 'active',
    "stock_number" INTEGER NOT NULL DEFAULT 0,
    "labor_cost" DECIMAL(10,2),
    "inspection_cost" DECIMAL(10,2),
    "item_name" TEXT,
    "global_category" TEXT,
    "large_category" TEXT,
    "medium_category" TEXT,
    "product_name" TEXT,
    "product_description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reasons" (
    "id" TEXT NOT NULL,
    "error_phenomenon_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "estimated_repair_time" INTEGER,
    "status" "ReasonStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solutions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT NOT NULL,
    "estimated_time" INTEGER,
    "difficulty" "SolutionDifficulty" NOT NULL DEFAULT 'medium',
    "required_tools" TEXT,
    "required_parts" TEXT,
    "status" "SolutionStatus" NOT NULL DEFAULT 'active',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "total_warehouses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "status" "TotalWarehouseStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "total_warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "total_warehouse_stock" (
    "id" TEXT NOT NULL,
    "total_warehouse_id" TEXT NOT NULL,
    "accessory_id" TEXT NOT NULL,
    "current_stock" INTEGER NOT NULL DEFAULT 0,
    "reserved_stock" INTEGER NOT NULL DEFAULT 0,
    "min_stock_level" INTEGER NOT NULL DEFAULT 10,
    "max_stock_level" INTEGER NOT NULL DEFAULT 1000,
    "location" TEXT,
    "last_restocked" TIMESTAMP(3),
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "total_warehouse_stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_stocktakes" (
    "id" TEXT NOT NULL,
    "total_warehouse_id" TEXT NOT NULL,
    "notes" TEXT,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "warehouse_stocktakes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_stocktake_items" (
    "id" TEXT NOT NULL,
    "stocktake_id" TEXT NOT NULL,
    "accessory_id" TEXT NOT NULL,
    "previous_qty" INTEGER NOT NULL,
    "new_qty" INTEGER NOT NULL,
    "delta_qty" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "warehouse_stocktake_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warranty_policies" (
    "id" TEXT NOT NULL,
    "category_id" TEXT,
    "model_id" TEXT,
    "warranty_type" "WarrantyType" NOT NULL,
    "warranty_duration_months" INTEGER NOT NULL,
    "coverage_description" TEXT,
    "terms_conditions" TEXT,
    "effective_from" DATE NOT NULL,
    "effective_to" DATE,
    "status" "WarrantyPolicyStatus" NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warranty_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_locations" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "address" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "purchase_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchase_location_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "purchase_location_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointment_notifications" (
    "id" TEXT NOT NULL,
    "appointment_id" TEXT NOT NULL,
    "notification_type" "NotificationType" NOT NULL,
    "notification_time" TIMESTAMP(3) NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'pending',
    "recipient" TEXT NOT NULL,
    "message" TEXT,
    "sent_at" TIMESTAMP(3),
    "delivery_status" TEXT,

    CONSTRAINT "appointment_notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repair_appointments" (
    "id" TEXT NOT NULL,
    "repair_case_id" TEXT,
    "asc_center_id" TEXT NOT NULL,
    "appointment_type" "AppointmentType" NOT NULL,
    "appointment_date" DATE NOT NULL,
    "appointment_time" TIME(6) NOT NULL,
    "estimated_duration" INTEGER,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'scheduled',
    "customer_name" TEXT NOT NULL,
    "customer_phone" TEXT NOT NULL,
    "customer_notes" TEXT,
    "assigned_staff_id" TEXT,
    "asc_notes" TEXT,
    "preparation_required" TEXT,
    "created_by" TEXT NOT NULL,
    "confirmed_by" TEXT,
    "confirmed_at" TIMESTAMP(3),
    "cancelled_reason" TEXT,
    "rescheduled_from_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repair_appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accessory_issues_issue_number_key" ON "accessory_issues"("issue_number");

-- CreateIndex
CREATE INDEX "accessory_issues_asc_center_id_idx" ON "accessory_issues"("asc_center_id");

-- CreateIndex
CREATE INDEX "accessory_issues_status_idx" ON "accessory_issues"("status");

-- CreateIndex
CREATE INDEX "accessory_issues_issued_to_user_id_idx" ON "accessory_issues"("issued_to_user_id");

-- CreateIndex
CREATE INDEX "accessory_issues_repair_case_id_idx" ON "accessory_issues"("repair_case_id");

-- CreateIndex
CREATE INDEX "accessory_is_used_outside_of_warranty_asc_center_id_idx" ON "accessory_is_used_outside_of_warranty"("asc_center_id");

-- CreateIndex
CREATE INDEX "accessory_is_used_outside_of_warranty_repair_case_id_idx" ON "accessory_is_used_outside_of_warranty"("repair_case_id");

-- CreateIndex
CREATE INDEX "accessory_is_used_outside_of_warranty_accessory_id_idx" ON "accessory_is_used_outside_of_warranty"("accessory_id");

-- CreateIndex
CREATE UNIQUE INDEX "accessory_requests_request_number_key" ON "accessory_requests"("request_number");

-- CreateIndex
CREATE INDEX "accessory_requests_asc_center_id_idx" ON "accessory_requests"("asc_center_id");

-- CreateIndex
CREATE INDEX "accessory_requests_status_idx" ON "accessory_requests"("status");

-- CreateIndex
CREATE INDEX "accessory_requests_status_recall_idx" ON "accessory_requests"("status_recall");

-- CreateIndex
CREATE INDEX "accessory_requests_requested_by_idx" ON "accessory_requests"("requested_by");

-- CreateIndex
CREATE INDEX "accessory_request_items_request_id_idx" ON "accessory_request_items"("request_id");

-- CreateIndex
CREATE INDEX "accessory_request_items_accessory_id_idx" ON "accessory_request_items"("accessory_id");

-- CreateIndex
CREATE UNIQUE INDEX "accessory_retail_vouchers_voucherNumber_key" ON "accessory_retail_vouchers"("voucherNumber");

-- CreateIndex
CREATE INDEX "accessory_retail_vouchers_asc_center_id_customer_id_idx" ON "accessory_retail_vouchers"("asc_center_id", "customer_id");

-- CreateIndex
CREATE INDEX "accessory_retail_vouchers_created_by_idx" ON "accessory_retail_vouchers"("created_by");

-- CreateIndex
CREATE INDEX "accessory_retail_voucher_items_accessory_id_idx" ON "accessory_retail_voucher_items"("accessory_id");

-- CreateIndex
CREATE UNIQUE INDEX "accessory_retail_voucher_items_voucher_id_accessory_id_key" ON "accessory_retail_voucher_items"("voucher_id", "accessory_id");

-- CreateIndex
CREATE UNIQUE INDEX "accessory_supply_vouchers_voucherNumber_key" ON "accessory_supply_vouchers"("voucherNumber");

-- CreateIndex
CREATE INDEX "accessory_supply_vouchers_total_warehouse_id_asc_center_id__idx" ON "accessory_supply_vouchers"("total_warehouse_id", "asc_center_id", "issue_date");

-- CreateIndex
CREATE INDEX "accessory_supply_voucher_items_accessory_id_idx" ON "accessory_supply_voucher_items"("accessory_id");

-- CreateIndex
CREATE INDEX "accessory_supply_voucher_items_request_item_id_idx" ON "accessory_supply_voucher_items"("request_item_id");

-- CreateIndex
CREATE INDEX "accessory_supply_voucher_items_reject_handled_voucher_id_idx" ON "accessory_supply_voucher_items"("reject_handled", "voucher_id");

-- CreateIndex
CREATE UNIQUE INDEX "accessory_supply_voucher_items_voucher_id_accessory_id_key" ON "accessory_supply_voucher_items"("voucher_id", "accessory_id");

-- CreateIndex
CREATE UNIQUE INDEX "asc_accessory_stock_asc_center_id_accessory_id_key" ON "asc_accessory_stock"("asc_center_id", "accessory_id");

-- CreateIndex
CREATE UNIQUE INDEX "asc_centers_center_code_key" ON "asc_centers"("center_code");

-- CreateIndex
CREATE INDEX "asc_stocktakes_asc_center_id_created_at_idx" ON "asc_stocktakes"("asc_center_id", "created_at");

-- CreateIndex
CREATE INDEX "asc_stocktake_items_stocktake_id_idx" ON "asc_stocktake_items"("stocktake_id");

-- CreateIndex
CREATE INDEX "asc_stocktake_items_accessory_id_idx" ON "asc_stocktake_items"("accessory_id");

-- CreateIndex
CREATE INDEX "error_accessory_repair_case_id_idx" ON "error_accessory"("repair_case_id");

-- CreateIndex
CREATE INDEX "payments_repair_case_id_idx" ON "payments"("repair_case_id");

-- CreateIndex
CREATE INDEX "payments_asc_center_id_idx" ON "payments"("asc_center_id");

-- CreateIndex
CREATE INDEX "payments_payment_period_id_idx" ON "payments"("payment_period_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_warranties_model_id_serial_number_key" ON "product_warranties"("model_id", "serial_number");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_orders_order_number_key" ON "purchase_orders"("order_number");

-- CreateIndex
CREATE INDEX "purchase_orders_asc_center_id_idx" ON "purchase_orders"("asc_center_id");

-- CreateIndex
CREATE INDEX "purchase_orders_status_idx" ON "purchase_orders"("status");

-- CreateIndex
CREATE INDEX "purchase_orders_created_by_idx" ON "purchase_orders"("created_by");

-- CreateIndex
CREATE UNIQUE INDEX "quotations_quotation_number_key" ON "quotations"("quotation_number");

-- CreateIndex
CREATE INDEX "quotations_repair_case_id_idx" ON "quotations"("repair_case_id");

-- CreateIndex
CREATE INDEX "quotations_status_idx" ON "quotations"("status");

-- CreateIndex
CREATE INDEX "quotations_quotation_number_idx" ON "quotations"("quotation_number");

-- CreateIndex
CREATE UNIQUE INDEX "product_replacement_recalls_recall_number_key" ON "product_replacement_recalls"("recall_number");

-- CreateIndex
CREATE INDEX "product_replacement_recalls_created_by_idx" ON "product_replacement_recalls"("created_by");

-- CreateIndex
CREATE INDEX "product_replacement_recalls_created_at_idx" ON "product_replacement_recalls"("created_at");

-- CreateIndex
CREATE INDEX "product_replacement_recall_items_recall_id_idx" ON "product_replacement_recall_items"("recall_id");

-- CreateIndex
CREATE INDEX "product_replacement_recall_items_repair_case_id_idx" ON "product_replacement_recall_items"("repair_case_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_replacement_recall_items_recall_id_repair_case_id_key" ON "product_replacement_recall_items"("recall_id", "repair_case_id");

-- CreateIndex
CREATE UNIQUE INDEX "repair_cases_case_number_key" ON "repair_cases"("case_number");

-- CreateIndex
CREATE INDEX "repair_cases_asc_center_id_idx" ON "repair_cases"("asc_center_id");

-- CreateIndex
CREATE INDEX "repair_cases_status_idx" ON "repair_cases"("status");

-- CreateIndex
CREATE INDEX "repair_cases_status_recall_idx" ON "repair_cases"("status_recall");

-- CreateIndex
CREATE INDEX "repair_cases_created_by_idx" ON "repair_cases"("created_by");

-- CreateIndex
CREATE INDEX "repair_cases_customer_id_idx" ON "repair_cases"("customer_id");

-- CreateIndex
CREATE INDEX "repair_cases_assigned_employee_id_idx" ON "repair_cases"("assigned_employee_id");

-- CreateIndex
CREATE INDEX "repair_cases_serial_number_idx" ON "repair_cases"("serial_number");

-- CreateIndex
CREATE INDEX "repair_cases_locknlock_case_number_idx" ON "repair_cases"("locknlock_case_number");

-- CreateIndex
CREATE INDEX "repair_cases_warranty_form_idx" ON "repair_cases"("warranty_form");

-- CreateIndex
CREATE INDEX "repair_cases_promised_delivery_date_idx" ON "repair_cases"("promised_delivery_date");

-- CreateIndex
CREATE INDEX "repair_cases_purchase_location_id_idx" ON "repair_cases"("purchase_location_id");

-- CreateIndex
CREATE INDEX "repair_cases_case_number_idx" ON "repair_cases"("case_number");

-- CreateIndex
CREATE INDEX "repair_cases_status_asc_center_id_idx" ON "repair_cases"("status", "asc_center_id");

-- CreateIndex
CREATE INDEX "repair_cases_assigned_employee_id_status_idx" ON "repair_cases"("assigned_employee_id", "status");

-- CreateIndex
CREATE INDEX "repair_cases_status_created_at_idx" ON "repair_cases"("status", "created_at");

-- CreateIndex
CREATE INDEX "repair_cases_customer_id_status_idx" ON "repair_cases"("customer_id", "status");

-- CreateIndex
CREATE INDEX "repair_cases_asc_center_id_status_created_at_idx" ON "repair_cases"("asc_center_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "repair_cases_shipping_province_id_idx" ON "repair_cases"("shipping_province_id");

-- CreateIndex
CREATE INDEX "repair_cases_shipping_ward_id_idx" ON "repair_cases"("shipping_ward_id");

-- CreateIndex
CREATE INDEX "repair_case_error_phenomena_repair_case_id_idx" ON "repair_case_error_phenomena"("repair_case_id");

-- CreateIndex
CREATE INDEX "repair_case_error_phenomena_error_phenomenon_id_idx" ON "repair_case_error_phenomena"("error_phenomenon_id");

-- CreateIndex
CREATE UNIQUE INDEX "repair_case_error_phenomena_repair_case_id_error_phenomenon_key" ON "repair_case_error_phenomena"("repair_case_id", "error_phenomenon_id");

-- CreateIndex
CREATE INDEX "repair_case_field_history_repair_case_id_idx" ON "repair_case_field_history"("repair_case_id");

-- CreateIndex
CREATE INDEX "repair_case_field_history_field_name_idx" ON "repair_case_field_history"("field_name");

-- CreateIndex
CREATE INDEX "repair_case_field_history_changed_by_idx" ON "repair_case_field_history"("changed_by");

-- CreateIndex
CREATE INDEX "repair_case_field_history_changed_at_idx" ON "repair_case_field_history"("changed_at");

-- CreateIndex
CREATE INDEX "repair_case_field_history_repair_case_id_changed_at_idx" ON "repair_case_field_history"("repair_case_id", "changed_at");

-- CreateIndex
CREATE INDEX "repair_case_field_history_repair_case_id_field_name_idx" ON "repair_case_field_history"("repair_case_id", "field_name");

-- CreateIndex
CREATE INDEX "repair_case_images_repair_case_id_image_type_idx" ON "repair_case_images"("repair_case_id", "image_type");

-- CreateIndex
CREATE INDEX "repair_case_reasons_repair_case_id_idx" ON "repair_case_reasons"("repair_case_id");

-- CreateIndex
CREATE INDEX "repair_case_reasons_reason_id_idx" ON "repair_case_reasons"("reason_id");

-- CreateIndex
CREATE UNIQUE INDEX "repair_case_reasons_repair_case_id_reason_id_key" ON "repair_case_reasons"("repair_case_id", "reason_id");

-- CreateIndex
CREATE INDEX "repair_case_status_history_repair_case_id_idx" ON "repair_case_status_history"("repair_case_id");

-- CreateIndex
CREATE INDEX "repair_case_status_history_new_status_idx" ON "repair_case_status_history"("new_status");

-- CreateIndex
CREATE INDEX "repair_case_status_history_changed_by_idx" ON "repair_case_status_history"("changed_by");

-- CreateIndex
CREATE INDEX "repair_case_status_history_changed_at_idx" ON "repair_case_status_history"("changed_at");

-- CreateIndex
CREATE INDEX "repair_case_status_history_repair_case_id_changed_at_idx" ON "repair_case_status_history"("repair_case_id", "changed_at");

-- CreateIndex
CREATE INDEX "wait_accessory_repair_case_id_idx" ON "wait_accessory"("repair_case_id");

-- CreateIndex
CREATE UNIQUE INDEX "warranty_claims_claim_number_key" ON "warranty_claims"("claim_number");

-- CreateIndex
CREATE INDEX "warranty_claims_asc_center_id_idx" ON "warranty_claims"("asc_center_id");

-- CreateIndex
CREATE INDEX "warranty_claims_status_idx" ON "warranty_claims"("status");

-- CreateIndex
CREATE INDEX "warranty_claims_created_by_idx" ON "warranty_claims"("created_by");

-- CreateIndex
CREATE INDEX "warranty_claims_product_warranty_id_idx" ON "warranty_claims"("product_warranty_id");

-- CreateIndex
CREATE INDEX "documents_documentType_idx" ON "documents"("documentType");

-- CreateIndex
CREATE INDEX "documents_ascCenterId_idx" ON "documents"("ascCenterId");

-- CreateIndex
CREATE INDEX "documents_isActive_createdAt_idx" ON "documents"("isActive", "createdAt");

-- CreateIndex
CREATE INDEX "documents_title_idx" ON "documents"("title");

-- CreateIndex
CREATE INDEX "document_access_logs_documentId_action_idx" ON "document_access_logs"("documentId", "action");

-- CreateIndex
CREATE INDEX "document_access_logs_userId_createdAt_idx" ON "document_access_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "customers_phone_1_idx" ON "customers"("phone_1");

-- CreateIndex
CREATE INDEX "customers_customer_group_idx" ON "customers"("customer_group");

-- CreateIndex
CREATE INDEX "customers_full_name_idx" ON "customers"("full_name");

-- CreateIndex
CREATE INDEX "customers_created_at_idx" ON "customers"("created_at");

-- CreateIndex
CREATE INDEX "customers_updated_at_idx" ON "customers"("updated_at");

-- CreateIndex
CREATE INDEX "customers_created_by_idx" ON "customers"("created_by");

-- CreateIndex
CREATE INDEX "customers_updated_by_idx" ON "customers"("updated_by");

-- CreateIndex
CREATE INDEX "customers_asc_center_id_idx" ON "customers"("asc_center_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employee_code_key" ON "employees"("employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "employees_national_id_key" ON "employees"("national_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_user_id_key" ON "employees"("user_id");

-- CreateIndex
CREATE INDEX "employees_asc_center_id_idx" ON "employees"("asc_center_id");

-- CreateIndex
CREATE INDEX "employees_position_idx" ON "employees"("position");

-- CreateIndex
CREATE INDEX "employees_department_idx" ON "employees"("department");

-- CreateIndex
CREATE INDEX "employees_status_idx" ON "employees"("status");

-- CreateIndex
CREATE INDEX "employees_employee_code_idx" ON "employees"("employee_code");

-- CreateIndex
CREATE INDEX "employees_national_id_idx" ON "employees"("national_id");

-- CreateIndex
CREATE INDEX "employees_primary_phone_idx" ON "employees"("primary_phone");

-- CreateIndex
CREATE INDEX "employees_asc_center_id_position_idx" ON "employees"("asc_center_id", "position");

-- CreateIndex
CREATE INDEX "employees_position_status_idx" ON "employees"("position", "status");

-- CreateIndex
CREATE INDEX "employees_department_position_idx" ON "employees"("department", "position");

-- CreateIndex
CREATE INDEX "employees_asc_center_id_status_idx" ON "employees"("asc_center_id", "status");

-- CreateIndex
CREATE INDEX "employees_position_status_asc_center_id_idx" ON "employees"("position", "status", "asc_center_id");

-- CreateIndex
CREATE UNIQUE INDEX "technician_profiles_user_id_key" ON "technician_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE INDEX "RoleClosure_descendantId_idx" ON "RoleClosure"("descendantId");

-- CreateIndex
CREATE INDEX "RoleClosure_ancestorId_idx" ON "RoleClosure"("ancestorId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleClosure_ancestorId_descendantId_key" ON "RoleClosure"("ancestorId", "descendantId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE INDEX "UserRole_userId_idx" ON "UserRole"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "areas_province_id_idx" ON "areas"("province_id");

-- CreateIndex
CREATE INDEX "areas_ward_id_idx" ON "areas"("ward_id");

-- CreateIndex
CREATE INDEX "areas_province_id_ward_id_idx" ON "areas"("province_id", "ward_id");

-- CreateIndex
CREATE INDEX "areas_name_idx" ON "areas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "areas_ward_id_name_key" ON "areas"("ward_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "provinces_code_key" ON "provinces"("code");

-- CreateIndex
CREATE INDEX "broadcast_notifications_status_scheduled_for_idx" ON "broadcast_notifications"("status", "scheduled_for");

-- CreateIndex
CREATE INDEX "notifications_user_id_is_read_created_at_idx" ON "notifications"("user_id", "is_read", "created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_category_idx" ON "notifications"("user_id", "category");

-- CreateIndex
CREATE INDEX "notifications_broadcast_id_idx" ON "notifications"("broadcast_id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_user_id_category_key" ON "notification_preferences"("user_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "notification_templates_code_key" ON "notification_templates"("code");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE INDEX "error_phenomena_category_id_idx" ON "error_phenomena"("category_id");

-- CreateIndex
CREATE INDEX "error_phenomena_status_idx" ON "error_phenomena"("status");

-- CreateIndex
CREATE UNIQUE INDEX "error_phenomena_category_id_name_key" ON "error_phenomena"("category_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "error_phenomenon_solutions_error_phenomenon_id_solution_id_key" ON "error_phenomenon_solutions"("error_phenomenon_id", "solution_id");

-- CreateIndex
CREATE UNIQUE INDEX "models_model_code_key" ON "models"("model_code");

-- CreateIndex
CREATE UNIQUE INDEX "reasons_error_phenomenon_id_name_key" ON "reasons"("error_phenomenon_id", "name");

-- CreateIndex
CREATE INDEX "total_warehouses_name_idx" ON "total_warehouses"("name");

-- CreateIndex
CREATE INDEX "total_warehouses_created_at_idx" ON "total_warehouses"("created_at");

-- CreateIndex
CREATE INDEX "total_warehouses_updated_at_idx" ON "total_warehouses"("updated_at");

-- CreateIndex
CREATE INDEX "total_warehouses_created_by_idx" ON "total_warehouses"("created_by");

-- CreateIndex
CREATE INDEX "total_warehouses_updated_by_idx" ON "total_warehouses"("updated_by");

-- CreateIndex
CREATE INDEX "total_warehouse_stock_accessory_id_idx" ON "total_warehouse_stock"("accessory_id");

-- CreateIndex
CREATE INDEX "total_warehouse_stock_current_stock_idx" ON "total_warehouse_stock"("current_stock");

-- CreateIndex
CREATE UNIQUE INDEX "total_warehouse_stock_total_warehouse_id_accessory_id_key" ON "total_warehouse_stock"("total_warehouse_id", "accessory_id");

-- CreateIndex
CREATE INDEX "warehouse_stocktakes_total_warehouse_id_created_at_idx" ON "warehouse_stocktakes"("total_warehouse_id", "created_at");

-- CreateIndex
CREATE INDEX "warehouse_stocktake_items_stocktake_id_idx" ON "warehouse_stocktake_items"("stocktake_id");

-- CreateIndex
CREATE INDEX "warehouse_stocktake_items_accessory_id_idx" ON "warehouse_stocktake_items"("accessory_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_locations_code_key" ON "purchase_locations"("code");

-- CreateIndex
CREATE INDEX "purchase_locations_group_id_idx" ON "purchase_locations"("group_id");

-- CreateIndex
CREATE INDEX "purchase_locations_code_idx" ON "purchase_locations"("code");

-- CreateIndex
CREATE INDEX "purchase_locations_is_active_idx" ON "purchase_locations"("is_active");

-- CreateIndex
CREATE INDEX "purchase_locations_group_id_is_active_idx" ON "purchase_locations"("group_id", "is_active");

-- CreateIndex
CREATE INDEX "purchase_locations_sortOrder_idx" ON "purchase_locations"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "purchase_location_groups_code_key" ON "purchase_location_groups"("code");

-- CreateIndex
CREATE INDEX "purchase_location_groups_code_idx" ON "purchase_location_groups"("code");

-- CreateIndex
CREATE INDEX "purchase_location_groups_is_active_idx" ON "purchase_location_groups"("is_active");

-- CreateIndex
CREATE INDEX "purchase_location_groups_sortOrder_idx" ON "purchase_location_groups"("sortOrder");

-- CreateIndex
CREATE INDEX "repair_appointments_asc_center_id_idx" ON "repair_appointments"("asc_center_id");

-- CreateIndex
CREATE INDEX "repair_appointments_status_idx" ON "repair_appointments"("status");

-- CreateIndex
CREATE INDEX "repair_appointments_appointment_date_idx" ON "repair_appointments"("appointment_date");

-- CreateIndex
CREATE INDEX "repair_appointments_repair_case_id_idx" ON "repair_appointments"("repair_case_id");

-- CreateIndex
CREATE INDEX "repair_appointments_assigned_staff_id_idx" ON "repair_appointments"("assigned_staff_id");

-- AddForeignKey
ALTER TABLE "accessory_issues" ADD CONSTRAINT "accessory_issues_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_issues" ADD CONSTRAINT "accessory_issues_issued_by_fkey" FOREIGN KEY ("issued_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_issues" ADD CONSTRAINT "accessory_issues_issued_to_user_id_fkey" FOREIGN KEY ("issued_to_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_issues" ADD CONSTRAINT "accessory_issues_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_issue_items" ADD CONSTRAINT "accessory_issue_items_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_issue_items" ADD CONSTRAINT "accessory_issue_items_issue_id_fkey" FOREIGN KEY ("issue_id") REFERENCES "accessory_issues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_is_used_outside_of_warranty" ADD CONSTRAINT "accessory_is_used_outside_of_warranty_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_is_used_outside_of_warranty" ADD CONSTRAINT "accessory_is_used_outside_of_warranty_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_is_used_outside_of_warranty" ADD CONSTRAINT "accessory_is_used_outside_of_warranty_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "accessories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_requests" ADD CONSTRAINT "accessory_requests_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_requests" ADD CONSTRAINT "accessory_requests_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_requests" ADD CONSTRAINT "accessory_requests_requested_by_fkey" FOREIGN KEY ("requested_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_requests" ADD CONSTRAINT "accessory_requests_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_request_items" ADD CONSTRAINT "accessory_request_items_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_request_items" ADD CONSTRAINT "accessory_request_items_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "accessory_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_stock_transactions" ADD CONSTRAINT "accessory_stock_transactions_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_stock_transactions" ADD CONSTRAINT "accessory_stock_transactions_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_stock_transactions" ADD CONSTRAINT "accessory_stock_transactions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_stock_transactions" ADD CONSTRAINT "accessory_stock_transactions_total_warehouse_id_fkey" FOREIGN KEY ("total_warehouse_id") REFERENCES "total_warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_retail_vouchers" ADD CONSTRAINT "accessory_retail_vouchers_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_retail_vouchers" ADD CONSTRAINT "accessory_retail_vouchers_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_retail_vouchers" ADD CONSTRAINT "accessory_retail_vouchers_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_retail_voucher_items" ADD CONSTRAINT "accessory_retail_voucher_items_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_retail_voucher_items" ADD CONSTRAINT "accessory_retail_voucher_items_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "accessory_retail_vouchers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_supply_vouchers" ADD CONSTRAINT "accessory_supply_vouchers_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_supply_vouchers" ADD CONSTRAINT "accessory_supply_vouchers_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "accessory_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_supply_vouchers" ADD CONSTRAINT "accessory_supply_vouchers_total_warehouse_id_fkey" FOREIGN KEY ("total_warehouse_id") REFERENCES "total_warehouses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_supply_voucher_items" ADD CONSTRAINT "accessory_supply_voucher_items_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "accessory_supply_vouchers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_supply_voucher_items" ADD CONSTRAINT "accessory_supply_voucher_items_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessory_supply_voucher_items" ADD CONSTRAINT "accessory_supply_voucher_items_request_item_id_fkey" FOREIGN KEY ("request_item_id") REFERENCES "accessory_request_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asc_accessory_stock" ADD CONSTRAINT "asc_accessory_stock_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asc_accessory_stock" ADD CONSTRAINT "asc_accessory_stock_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asc_centers" ADD CONSTRAINT "asc_centers_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asc_centers" ADD CONSTRAINT "asc_centers_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "wards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asc_stocktakes" ADD CONSTRAINT "asc_stocktakes_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asc_stocktakes" ADD CONSTRAINT "asc_stocktakes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asc_stocktake_items" ADD CONSTRAINT "asc_stocktake_items_stocktake_id_fkey" FOREIGN KEY ("stocktake_id") REFERENCES "asc_stocktakes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asc_stocktake_items" ADD CONSTRAINT "asc_stocktake_items_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_accessory" ADD CONSTRAINT "error_accessory_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_payment_period_id_fkey" FOREIGN KEY ("payment_period_id") REFERENCES "payment_periods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_warranties" ADD CONSTRAINT "product_warranties_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_warranties" ADD CONSTRAINT "product_warranties_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_warranties" ADD CONSTRAINT "product_warranties_registered_by_fkey" FOREIGN KEY ("registered_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_warranties" ADD CONSTRAINT "product_warranties_warranty_policy_id_fkey" FOREIGN KEY ("warranty_policy_id") REFERENCES "warranty_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_id_fkey" FOREIGN KEY ("purchase_order_id") REFERENCES "purchase_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_rejected_by_fkey" FOREIGN KEY ("rejected_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotations" ADD CONSTRAINT "quotations_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_replacement_recalls" ADD CONSTRAINT "product_replacement_recalls_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_replacement_recall_items" ADD CONSTRAINT "product_replacement_recall_items_recall_id_fkey" FOREIGN KEY ("recall_id") REFERENCES "product_replacement_recalls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_replacement_recall_items" ADD CONSTRAINT "product_replacement_recall_items_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_assigned_employee_id_fkey" FOREIGN KEY ("assigned_employee_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_distance_fee_calculated_by_fkey" FOREIGN KEY ("distance_fee_calculated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_product_warranty_id_fkey" FOREIGN KEY ("product_warranty_id") REFERENCES "product_warranties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_purchase_location_id_fkey" FOREIGN KEY ("purchase_location_id") REFERENCES "purchase_locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_satisfaction_collected_by_fkey" FOREIGN KEY ("satisfaction_collected_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "solutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_transfer_approved_by_fkey" FOREIGN KEY ("transfer_approved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_transfer_requested_by_fkey" FOREIGN KEY ("transfer_requested_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_transfer_rejected_by_fkey" FOREIGN KEY ("transfer_rejected_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_transfer_received_by_fkey" FOREIGN KEY ("transfer_received_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_payment_processed_by_fkey" FOREIGN KEY ("payment_processed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_payment_approved_by_fkey" FOREIGN KEY ("payment_approved_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_transferred_from_asc_id_fkey" FOREIGN KEY ("transferred_from_asc_id") REFERENCES "asc_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_transferred_to_asc_id_fkey" FOREIGN KEY ("transferred_to_asc_id") REFERENCES "asc_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_shipping_province_id_fkey" FOREIGN KEY ("shipping_province_id") REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_cases" ADD CONSTRAINT "repair_cases_shipping_ward_id_fkey" FOREIGN KEY ("shipping_ward_id") REFERENCES "wards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_accessories" ADD CONSTRAINT "repair_case_accessories_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_accessories" ADD CONSTRAINT "repair_case_accessories_added_by_fkey" FOREIGN KEY ("added_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_accessories" ADD CONSTRAINT "repair_case_accessories_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_error_phenomena" ADD CONSTRAINT "repair_case_error_phenomena_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_error_phenomena" ADD CONSTRAINT "repair_case_error_phenomena_error_phenomenon_id_fkey" FOREIGN KEY ("error_phenomenon_id") REFERENCES "error_phenomena"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_error_phenomena" ADD CONSTRAINT "repair_case_error_phenomena_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_field_history" ADD CONSTRAINT "repair_case_field_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_field_history" ADD CONSTRAINT "repair_case_field_history_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_images" ADD CONSTRAINT "repair_case_images_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_images" ADD CONSTRAINT "repair_case_images_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_reasons" ADD CONSTRAINT "repair_case_reasons_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_reasons" ADD CONSTRAINT "repair_case_reasons_reason_id_fkey" FOREIGN KEY ("reason_id") REFERENCES "reasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_reasons" ADD CONSTRAINT "repair_case_reasons_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_status_history" ADD CONSTRAINT "repair_case_status_history_changed_by_fkey" FOREIGN KEY ("changed_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_case_status_history" ADD CONSTRAINT "repair_case_status_history_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wait_accessory" ADD CONSTRAINT "wait_accessory_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_claims" ADD CONSTRAINT "warranty_claims_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_claims" ADD CONSTRAINT "warranty_claims_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_claims" ADD CONSTRAINT "warranty_claims_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_claims" ADD CONSTRAINT "warranty_claims_product_warranty_id_fkey" FOREIGN KEY ("product_warranty_id") REFERENCES "product_warranties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_claims" ADD CONSTRAINT "warranty_claims_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_claims" ADD CONSTRAINT "warranty_claims_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_coordination" ADD CONSTRAINT "warranty_coordination_coordinator_asc_id_fkey" FOREIGN KEY ("coordinator_asc_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_coordination" ADD CONSTRAINT "warranty_coordination_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_coordination" ADD CONSTRAINT "warranty_coordination_responded_by_fkey" FOREIGN KEY ("responded_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_coordination" ADD CONSTRAINT "warranty_coordination_target_asc_id_fkey" FOREIGN KEY ("target_asc_id") REFERENCES "asc_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_coordination" ADD CONSTRAINT "warranty_coordination_warranty_claim_id_fkey" FOREIGN KEY ("warranty_claim_id") REFERENCES "warranty_claims"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_ascCenterId_fkey" FOREIGN KEY ("ascCenterId") REFERENCES "asc_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_access_logs" ADD CONSTRAINT "document_access_logs_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_access_logs" ADD CONSTRAINT "document_access_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "wards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "technician_profiles" ADD CONSTRAINT "technician_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleClosure" ADD CONSTRAINT "RoleClosure_ancestorId_fkey" FOREIGN KEY ("ancestorId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleClosure" ADD CONSTRAINT "RoleClosure_descendantId_fkey" FOREIGN KEY ("descendantId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "wards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "wards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wards" ADD CONSTRAINT "wards_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "broadcast_notifications" ADD CONSTRAINT "broadcast_notifications_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_broadcast_id_fkey" FOREIGN KEY ("broadcast_id") REFERENCES "broadcast_notifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accessories" ADD CONSTRAINT "accessories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_phenomena" ADD CONSTRAINT "error_phenomena_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_phenomenon_solutions" ADD CONSTRAINT "error_phenomenon_solutions_error_phenomenon_id_fkey" FOREIGN KEY ("error_phenomenon_id") REFERENCES "error_phenomena"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "error_phenomenon_solutions" ADD CONSTRAINT "error_phenomenon_solutions_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "solutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reasons" ADD CONSTRAINT "reasons_error_phenomenon_id_fkey" FOREIGN KEY ("error_phenomenon_id") REFERENCES "error_phenomena"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solutions" ADD CONSTRAINT "solutions_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "total_warehouse_stock" ADD CONSTRAINT "total_warehouse_stock_total_warehouse_id_fkey" FOREIGN KEY ("total_warehouse_id") REFERENCES "total_warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "total_warehouse_stock" ADD CONSTRAINT "total_warehouse_stock_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stocktakes" ADD CONSTRAINT "warehouse_stocktakes_total_warehouse_id_fkey" FOREIGN KEY ("total_warehouse_id") REFERENCES "total_warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stocktakes" ADD CONSTRAINT "warehouse_stocktakes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stocktake_items" ADD CONSTRAINT "warehouse_stocktake_items_stocktake_id_fkey" FOREIGN KEY ("stocktake_id") REFERENCES "warehouse_stocktakes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_stocktake_items" ADD CONSTRAINT "warehouse_stocktake_items_accessory_id_fkey" FOREIGN KEY ("accessory_id") REFERENCES "accessories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_policies" ADD CONSTRAINT "warranty_policies_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warranty_policies" ADD CONSTRAINT "warranty_policies_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_locations" ADD CONSTRAINT "purchase_locations_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "purchase_location_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_locations" ADD CONSTRAINT "purchase_locations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_locations" ADD CONSTRAINT "purchase_locations_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_location_groups" ADD CONSTRAINT "purchase_location_groups_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchase_location_groups" ADD CONSTRAINT "purchase_location_groups_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment_notifications" ADD CONSTRAINT "appointment_notifications_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "repair_appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_appointments" ADD CONSTRAINT "repair_appointments_asc_center_id_fkey" FOREIGN KEY ("asc_center_id") REFERENCES "asc_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_appointments" ADD CONSTRAINT "repair_appointments_assigned_staff_id_fkey" FOREIGN KEY ("assigned_staff_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_appointments" ADD CONSTRAINT "repair_appointments_confirmed_by_fkey" FOREIGN KEY ("confirmed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_appointments" ADD CONSTRAINT "repair_appointments_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_appointments" ADD CONSTRAINT "repair_appointments_repair_case_id_fkey" FOREIGN KEY ("repair_case_id") REFERENCES "repair_cases"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repair_appointments" ADD CONSTRAINT "repair_appointments_rescheduled_from_id_fkey" FOREIGN KEY ("rescheduled_from_id") REFERENCES "repair_appointments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
