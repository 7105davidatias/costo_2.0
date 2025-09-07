
-- יצירת Views לניתוחים מתקדמים ודוחות
-- Views אלה יספקו נתונים מעובדים למערכת ה-AI

-- View לסטטיסטיקות קטגוריות
CREATE OR REPLACE VIEW procurement_category_stats AS
SELECT 
    pc.code,
    pc.name,
    pc.average_unit_cost,
    COUNT(hp.id) as historical_count,
    AVG(hp.cost_variance_pct::numeric) as avg_cost_variance,
    AVG(hp.final_cost::numeric) as avg_final_cost,
    MIN(hp.completion_date) as first_procurement,
    MAX(hp.completion_date) as last_procurement
FROM procurement_categories pc
LEFT JOIN historical_procurements hp ON pc.code = hp.category_code
GROUP BY pc.code, pc.name, pc.average_unit_cost;

-- View לביצועי ספקים
CREATE OR REPLACE VIEW supplier_performance AS
SELECT 
    hp.supplier_name,
    hp.category_code,
    COUNT(*) as total_procurements,
    AVG(hp.cost_variance_pct::numeric) as avg_cost_variance,
    AVG(hp.final_cost::numeric) as avg_deal_size,
    MIN(hp.cost_variance_pct::numeric) as best_variance,
    MAX(hp.cost_variance_pct::numeric) as worst_variance,
    COUNT(CASE WHEN hp.cost_variance_pct::numeric < 0 THEN 1 END) as under_budget_count,
    (COUNT(CASE WHEN hp.cost_variance_pct::numeric < 0 THEN 1 END) * 100.0 / COUNT(*)) as under_budget_percentage
FROM historical_procurements hp
GROUP BY hp.supplier_name, hp.category_code
HAVING COUNT(*) >= 1
ORDER BY under_budget_percentage DESC, avg_cost_variance ASC;

-- View למגמות מחירים
CREATE OR REPLACE VIEW price_trends AS
SELECT 
    category_code,
    DATE_TRUNC('quarter', completion_date) as quarter,
    COUNT(*) as procurement_count,
    AVG(final_cost::numeric) as avg_cost,
    AVG(cost_variance_pct::numeric) as avg_variance,
    MIN(final_cost::numeric) as min_cost,
    MAX(final_cost::numeric) as max_cost
FROM historical_procurements
WHERE completion_date >= CURRENT_DATE - INTERVAL '2 years'
GROUP BY category_code, DATE_TRUNC('quarter', completion_date)
ORDER BY category_code, quarter DESC;

-- View לדוח מנהלים
CREATE OR REPLACE VIEW executive_summary AS
SELECT 
    'סך הכל' as metric,
    COUNT(*) as total_procurements,
    SUM(final_cost::numeric) as total_spent,
    SUM(allocated_budget::numeric) as total_budget,
    AVG(cost_variance_pct::numeric) as avg_variance,
    SUM(CASE WHEN cost_variance_pct::numeric < 0 THEN (allocated_budget::numeric - final_cost::numeric) ELSE 0 END) as total_savings
FROM historical_procurements
UNION ALL
SELECT 
    category_code as metric,
    COUNT(*) as total_procurements,
    SUM(final_cost::numeric) as total_spent,
    SUM(allocated_budget::numeric) as total_budget,
    AVG(cost_variance_pct::numeric) as avg_variance,
    SUM(CASE WHEN cost_variance_pct::numeric < 0 THEN (allocated_budget::numeric - final_cost::numeric) ELSE 0 END) as total_savings
FROM historical_procurements
GROUP BY category_code
ORDER BY total_spent DESC;

COMMIT;
