
-- יצירת אינדקסים לשיפור ביצועי שאילתות
-- אינדקסים אלה ישפרו את הביצועים של מערכת ה-AI וחיפושי ההיסטוריה

-- אינדקסים עבור historical_procurements
CREATE INDEX IF NOT EXISTS idx_historical_category_code ON historical_procurements(category_code);
CREATE INDEX IF NOT EXISTS idx_historical_completion_date ON historical_procurements(completion_date);
CREATE INDEX IF NOT EXISTS idx_historical_supplier_name ON historical_procurements(supplier_name);
CREATE INDEX IF NOT EXISTS idx_historical_cost_variance ON historical_procurements(cost_variance_pct);
CREATE INDEX IF NOT EXISTS idx_historical_final_cost ON historical_procurements(final_cost);

-- אינדקסים עבור procurement_requests  
CREATE INDEX IF NOT EXISTS idx_requests_category ON procurement_requests(category);
CREATE INDEX IF NOT EXISTS idx_requests_status ON procurement_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_extraction_status ON procurement_requests(extraction_status);
CREATE INDEX IF NOT EXISTS idx_requests_created_at ON procurement_requests(created_at);

-- אינדקסים עבור cost_estimations
CREATE INDEX IF NOT EXISTS idx_estimations_request_id ON cost_estimations(procurement_request_id);
CREATE INDEX IF NOT EXISTS idx_estimations_confidence ON cost_estimations(confidence_level);
CREATE INDEX IF NOT EXISTS idx_estimations_total_cost ON cost_estimations(total_cost);

-- אינדקסים עבור suppliers
CREATE INDEX IF NOT EXISTS idx_suppliers_rating ON suppliers(rating);
CREATE INDEX IF NOT EXISTS idx_suppliers_preferred ON suppliers(is_preferred);

-- אינדקס מורכב לחיפושים מתקדמים
CREATE INDEX IF NOT EXISTS idx_historical_category_date ON historical_procurements(category_code, completion_date);
CREATE INDEX IF NOT EXISTS idx_historical_supplier_category ON historical_procurements(supplier_name, category_code);

COMMIT;
