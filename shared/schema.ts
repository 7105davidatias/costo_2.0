import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  displayName: text("display_name").notNull(),
  role: text("role", { enum: ["admin", "procurement_manager", "department_head", "employee"] }).notNull().default("employee"),
  department: text("department"),
  phoneNumber: text("phone_number"),
  isActive: boolean("is_active").default(true),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const procurementRequests = pgTable("procurement_requests", {
  id: serial("id").primaryKey(),
  requestNumber: text("request_number").notNull().unique(),
  itemName: text("item_name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull(),
  priority: text("priority").notNull().default("medium"), // high, medium, low
  targetDate: timestamp("target_date"),
  requestedBy: text("requested_by").notNull(),
  department: text("department").notNull(),
  status: text("status").notNull().default("new"), // new, processing, completed, cancelled
  estimatedCost: decimal("estimated_cost", { precision: 12, scale: 2 }),
  specifications: jsonb("specifications"),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  reliability: integer("reliability"), // 1-100
  deliveryTime: integer("delivery_time"), // days
  discountPolicy: text("discount_policy"),
  warrantyTerms: text("warranty_terms"),
  isPreferred: boolean("is_preferred").default(false),
  contactInfo: jsonb("contact_info"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const costEstimations = pgTable("cost_estimations", {
  id: serial("id").primaryKey(),
  procurementRequestId: integer("procurement_request_id").references(() => procurementRequests.id),
  totalCost: decimal("total_cost", { precision: 12, scale: 2 }).notNull(),
  basePrice: decimal("base_price", { precision: 12, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 12, scale: 2 }).notNull(),
  shippingCost: decimal("shipping_cost", { precision: 12, scale: 2 }),
  discountAmount: decimal("discount_amount", { precision: 12, scale: 2 }),
  confidenceLevel: integer("confidence_level").notNull(), // 1-100
  marketPrice: decimal("market_price", { precision: 12, scale: 2 }),
  potentialSavings: decimal("potential_savings", { precision: 12, scale: 2 }),
  justifications: jsonb("justifications"),
  recommendedSupplierId: integer("recommended_supplier_id").references(() => suppliers.id),
  aiAnalysisResults: jsonb("ai_analysis_results"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const supplierQuotes = pgTable("supplier_quotes", {
  id: serial("id").primaryKey(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  procurementRequestId: integer("procurement_request_id").references(() => procurementRequests.id),
  unitPrice: decimal("unit_price", { precision: 12, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
  deliveryTime: integer("delivery_time"), // days
  validUntil: timestamp("valid_until"),
  terms: text("terms"),
  discounts: jsonb("discounts"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  procurementRequestId: integer("procurement_request_id").references(() => procurementRequests.id),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size"),
  filePath: text("file_path"),
  isAnalyzed: boolean("is_analyzed").default(false),
  analysisResults: jsonb("analysis_results"),
  extractedSpecs: jsonb("extracted_specs"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const marketInsights = pgTable("market_insights", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  averagePrice: decimal("average_price", { precision: 12, scale: 2 }),
  priceStability: integer("price_stability"), // 1-100
  supplierCount: integer("supplier_count"),
  minPrice: decimal("min_price", { precision: 12, scale: 2 }),
  maxPrice: decimal("max_price", { precision: 12, scale: 2 }),
  riskAssessment: jsonb("risk_assessment"),
  priceHistory: jsonb("price_history"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const marketResearch = pgTable("market_research", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => procurementRequests.id),
  category: text("category").notNull(),
  supplierComparison: jsonb("supplier_comparison"),
  marketInsights: jsonb("market_insights"),
  priceTrends: jsonb("price_trends"),
  informationSources: jsonb("information_sources"),
  recommendations: jsonb("recommendations"),
  confidence: integer("confidence"), // 1-100
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type UserRole = "admin" | "procurement_manager" | "department_head" | "employee";
export type ProcurementRequest = typeof procurementRequests.$inferSelect;
export type Supplier = typeof suppliers.$inferSelect;
export type CostEstimation = typeof costEstimations.$inferSelect;
export type MarketResearch = typeof marketResearch.$inferSelect;

export interface MarketInsight {
  id: number;
  title: string;
  description: string;
  trend: string;
  impact: string;
  source: string;
  lastUpdated: string;
}

export interface SupplierData {
  id: number;
  name: string;
  rating: number;
  deliveryTime: string;
  pricePerUnit: string;
  discount: string;
  warranty: string;
  advantages: string[];
  contact: string;
  verified?: boolean;
  lastUpdated?: string;
}

export interface PriceTrends {
  currentQuarter: string;
  yearOverYear: string;
  forecast: string;
  factors: string[];
}

export interface InformationSource {
  title: string;
  description: string;
  lastUpdated: string;
  reliability: string;
}

export interface Recommendation {
  title: string;
  description: string;
  priority: string;
}

export interface MarketResearchData {
  id: number;
  requestId: number;
  category: string;
  supplierComparison: SupplierData[];
  marketInsights: MarketInsight[];
  priceTrends: PriceTrends;
  informationSources: InformationSource[];
  recommendations: Recommendation[];
  confidence: number;
  lastUpdated: string;
}

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLogin: true,
});

export const insertProcurementRequestSchema = createInsertSchema(procurementRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
});

export const insertCostEstimationSchema = createInsertSchema(costEstimations).omit({
  id: true,
  createdAt: true,
});

export const insertSupplierQuoteSchema = createInsertSchema(supplierQuotes).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export const insertMarketInsightSchema = createInsertSchema(marketInsights).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ProcurementRequest = typeof procurementRequests.$inferSelect;
export type InsertProcurementRequest = z.infer<typeof insertProcurementRequestSchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type CostEstimation = typeof costEstimations.$inferSelect;
export type InsertCostEstimation = z.infer<typeof insertCostEstimationSchema>;

export type SupplierQuote = typeof supplierQuotes.$inferSelect;
export type InsertSupplierQuote = z.infer<typeof insertSupplierQuoteSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type MarketInsight = typeof marketInsights.$inferSelect;
export type InsertMarketInsight = z.infer<typeof insertMarketInsightSchema>;
