#!/bin/bash

# Production Deployment Script
# מערכת ניהול אומדני עלויות רכש - Production Deployment

set -e  # Exit on any error

# ==============================================================================
# CONFIGURATION
# ==============================================================================
APP_NAME="procurement-system"
APP_DIR="/var/www/procurement"
BACKUP_DIR="/var/backups/procurement"
LOG_FILE="/var/log/procurement/deployment.log"
SERVICE_NAME="procurement-system"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==============================================================================
# LOGGING FUNCTIONS
# ==============================================================================
log_info() {
    echo -e "${BLUE}[INFO]${NC} $(date): $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $(date): $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $(date): $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $(date): $1" | tee -a "$LOG_FILE"
}

# ==============================================================================
# VALIDATION FUNCTIONS
# ==============================================================================
check_prerequisites() {
    log_info "בדיקת דרישות מוקדמות..."
    
    # Check if running as root or with sudo
    if [[ $EUID -ne 0 ]]; then
        log_error "הסקריפט חייב לרוץ עם הרשאות sudo"
        exit 1
    fi
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        log_error "Node.js לא מותקן במערכת"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "נדרש Node.js גרסה 18 ומעלה, גרסה נוכחית: $(node --version)"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm לא מותקן במערכת"
        exit 1
    fi
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        log_error "PostgreSQL לא מותקן במערכת"
        exit 1
    fi
    
    # Check disk space (minimum 2GB)
    AVAILABLE_SPACE=$(df / | tail -1 | awk '{print $4}')
    if [ "$AVAILABLE_SPACE" -lt 2097152 ]; then
        log_warning "מקום דיסק נמוך (פחות מ-2GB זמין)"
    fi
    
    log_success "כל הדרישות המוקדמות מתקיימות"
}

check_environment() {
    log_info "בדיקת הגדרות סביבה..."
    
    if [ ! -f ".env.production" ]; then
        log_error "קובץ .env.production לא נמצא"
        log_info "אנא העתקו את .env.production.example ו-עדכנו את הערכים"
        exit 1
    fi
    
    # Source environment variables
    set -a
    source .env.production
    set +a
    
    # Check critical environment variables
    REQUIRED_VARS=(
        "DATABASE_URL"
        "SESSION_SECRET" 
        "NODE_ENV"
    )
    
    for var in "${REQUIRED_VARS[@]}"; do
        if [ -z "${!var}" ]; then
            log_error "משתנה סביבה חסר: $var"
            exit 1
        fi
    done
    
    # Check database connection
    if ! psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
        log_error "לא ניתן להתחבר למסד הנתונים"
        log_info "בדקו את DATABASE_URL ו-הגדרות מסד הנתונים"
        exit 1
    fi
    
    log_success "הגדרות הסביבה תקינות"
}

# ==============================================================================
# BACKUP FUNCTIONS
# ==============================================================================
create_backup() {
    log_info "יוצר גיבוי מלא לפני העדכון..."
    
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_NAME="procurement_backup_$TIMESTAMP"
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    # Backup application files
    if [ -d "$APP_DIR" ]; then
        log_info "מגבה קבצי אפליקציה..."
        tar -czf "$BACKUP_DIR/${BACKUP_NAME}_files.tar.gz" -C "$APP_DIR" . 2>/dev/null || true
    fi
    
    # Backup database
    log_info "מגבה מסד נתונים..."
    if pg_dump "$DATABASE_URL" > "$BACKUP_DIR/${BACKUP_NAME}_database.sql"; then
        log_success "גיבוי מסד נתונים הושלם"
    else
        log_error "שגיאה בגיבוי מסד נתונים"
        exit 1
    fi
    
    # Backup configuration files
    if [ -f ".env.production" ]; then
        cp .env.production "$BACKUP_DIR/${BACKUP_NAME}_env"
    fi
    
    # Set backup file permissions
    chmod 600 "$BACKUP_DIR/${BACKUP_NAME}"*
    
    log_success "גיבוי הושלם: $BACKUP_NAME"
    
    # Clean old backups (keep last 5)
    cd "$BACKUP_DIR"
    ls -t procurement_backup_*_files.tar.gz | tail -n +6 | xargs rm -f 2>/dev/null || true
    ls -t procurement_backup_*_database.sql | tail -n +6 | xargs rm -f 2>/dev/null || true
    ls -t procurement_backup_*_env | tail -n +6 | xargs rm -f 2>/dev/null || true
}

# ==============================================================================
# DEPLOYMENT FUNCTIONS
# ==============================================================================
stop_application() {
    log_info "עוצר את האפליקציה..."
    
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        systemctl stop "$SERVICE_NAME"
        log_success "האפליקציה נעצרה"
    else
        log_info "האפליקציה כבר עצורה"
    fi
    
    # Kill any remaining Node.js processes
    pkill -f "node.*server/index.ts" 2>/dev/null || true
    pkill -f "tsx.*server/index.ts" 2>/dev/null || true
    
    sleep 3
}

deploy_application() {
    log_info "מתחיל פריסת אפליקציה..."
    
    # Create application directory
    mkdir -p "$APP_DIR"
    mkdir -p "$APP_DIR/uploads" 
    mkdir -p "/var/log/procurement"
    
    # Copy application files
    log_info "מעתיק קבצי אפליקציה..."
    rsync -av --exclude=node_modules --exclude=.git --exclude=uploads . "$APP_DIR/"
    
    # Set proper permissions
    chown -R www-data:www-data "$APP_DIR"
    chmod -R 755 "$APP_DIR"
    chmod -R 777 "$APP_DIR/uploads"
    
    # Install dependencies
    cd "$APP_DIR"
    log_info "מתקין dependencies..."
    npm ci --production --silent
    
    # Build application
    log_info "בונה אפליקציה לפרודקשן..."
    npm run build
    
    # Update database schema
    log_info "מעדכן סכמת מסד נתונים..."
    npm run db:push --force
    
    log_success "פריסת האפליקציה הושלמה"
}

configure_systemd() {
    log_info "מגדיר שירות systemd..."
    
    cat > "/etc/systemd/system/$SERVICE_NAME.service" << EOL
[Unit]
Description=Procurement Cost Estimation System
Documentation=https://github.com/yourorg/procurement-system
After=network.target postgresql.service

[Service]
Environment=NODE_ENV=production
Type=simple
User=www-data
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=10
KillMode=mixed
TimeoutStopSec=30

# Security settings
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$APP_DIR/uploads /var/log/procurement
PrivateTmp=true

# Resource limits
LimitNOFILE=65536
LimitNPROC=32768

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=procurement-system

[Install]
WantedBy=multi-user.target
EOL
    
    systemctl daemon-reload
    systemctl enable "$SERVICE_NAME"
    
    log_success "שירות systemd הוגדר בהצלחה"
}

configure_nginx() {
    log_info "מגדיר Nginx reverse proxy..."
    
    # Create Nginx configuration
    cat > "/etc/nginx/sites-available/$APP_NAME" << EOL
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/procurement.crt;
    ssl_certificate_key /etc/ssl/private/procurement.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # File Upload Limits
    client_max_body_size 11M;

    # Static Files
    location /static/ {
        alias $APP_DIR/dist/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Uploads
    location /uploads/ {
        alias $APP_DIR/uploads/;
        expires 30d;
        add_header Cache-Control "public";
    }

    # API and App Routes
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOL
    
    # Enable site
    ln -sf "/etc/nginx/sites-available/$APP_NAME" "/etc/nginx/sites-enabled/"
    
    # Test Nginx configuration
    if nginx -t; then
        systemctl reload nginx
        log_success "Nginx הוגדר בהצלחה"
    else
        log_error "שגיאה בהגדרת Nginx"
        exit 1
    fi
}

start_application() {
    log_info "מפעיל את האפליקציה..."
    
    systemctl start "$SERVICE_NAME"
    
    # Wait for application to start
    sleep 10
    
    if systemctl is-active --quiet "$SERVICE_NAME"; then
        log_success "האפליקציה הופעלה בהצלחה"
    else
        log_error "שגיאה בהפעלת האפליקציה"
        systemctl status "$SERVICE_NAME"
        exit 1
    fi
}

# ==============================================================================
# HEALTH CHECK FUNCTIONS
# ==============================================================================
run_health_checks() {
    log_info "מבצע בדיקות תקינות..."
    
    # Check if service is running
    if ! systemctl is-active --quiet "$SERVICE_NAME"; then
        log_error "השירות לא פעיל"
        return 1
    fi
    
    # Check HTTP response
    sleep 5
    if curl -f -s http://localhost:5000/health > /dev/null; then
        log_success "בדיקת HTTP עברה בהצלחה"
    else
        log_error "בדיקת HTTP נכשלה"
        return 1
    fi
    
    # Check database connectivity
    if curl -f -s http://localhost:5000/api/dashboard/stats > /dev/null; then
        log_success "חיבור מסד נתונים תקין"
    else
        log_warning "יתכן ובעיה בחיבור למסד נתונים"
    fi
    
    # Check file upload directory
    if [ -w "$APP_DIR/uploads" ]; then
        log_success "תיקיית העלאות נגישה לכתיבה"
    else
        log_warning "בעיה בהרשאות תיקיית העלאות"
    fi
    
    log_success "כל בדיקות התקינות עברו בהצלחה"
}

# ==============================================================================
# ROLLBACK FUNCTIONS
# ==============================================================================
rollback() {
    log_warning "מתחיל rollback למצב קודם..."
    
    # Stop current service
    systemctl stop "$SERVICE_NAME" || true
    
    # Find latest backup
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/procurement_backup_*_files.tar.gz 2>/dev/null | head -1)
    LATEST_DB_BACKUP=$(ls -t "$BACKUP_DIR"/procurement_backup_*_database.sql 2>/dev/null | head -1)
    
    if [ -z "$LATEST_BACKUP" ]; then
        log_error "לא נמצא גיבוי לשחזור"
        exit 1
    fi
    
    log_info "משחזר מגיבוי: $(basename "$LATEST_BACKUP")"
    
    # Restore application files
    rm -rf "$APP_DIR"/*
    tar -xzf "$LATEST_BACKUP" -C "$APP_DIR"
    
    # Restore database
    if [ -n "$LATEST_DB_BACKUP" ]; then
        log_info "משחזר מסד נתונים..."
        psql "$DATABASE_URL" < "$LATEST_DB_BACKUP"
    fi
    
    # Restart service
    systemctl start "$SERVICE_NAME"
    
    log_success "Rollback הושלם בהצלחה"
}

# ==============================================================================
# MAIN DEPLOYMENT FLOW
# ==============================================================================
main() {
    log_info "==== התחלת פריסה לפרודקשן ===="
    log_info "זמן התחלה: $(date)"
    
    # Parse command line arguments
    SKIP_BACKUP=false
    ROLLBACK=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            --rollback)
                ROLLBACK=true
                shift
                ;;
            -h|--help)
                echo "שימוש: $0 [OPTIONS]"
                echo "אפשרויות:"
                echo "  --skip-backup    דלג על יצירת גיבוי"
                echo "  --rollback       בצע rollback למצב קודם"
                echo "  -h, --help       הצג עזרה זו"
                exit 0
                ;;
            *)
                log_error "אפשרות לא מוכרת: $1"
                exit 1
                ;;
        esac
    done
    
    # Handle rollback
    if [ "$ROLLBACK" = true ]; then
        rollback
        exit 0
    fi
    
    # Main deployment flow
    check_prerequisites
    check_environment
    
    if [ "$SKIP_BACKUP" = false ]; then
        create_backup
    fi
    
    stop_application
    deploy_application
    configure_systemd
    
    # Configure Nginx only if not already configured
    if [ ! -f "/etc/nginx/sites-available/$APP_NAME" ]; then
        configure_nginx
    fi
    
    start_application
    
    if run_health_checks; then
        log_success "==== פריסה הושלמה בהצלחה ===="
        log_info "האפליקציה זמינה בכתובת: https://your-domain.com"
        log_info "לוגים: /var/log/procurement/"
        log_info "שירות: systemctl status $SERVICE_NAME"
    else
        log_error "==== פריסה הושלמה עם שגיאות ===="
        log_info "בדקו לוגים: journalctl -u $SERVICE_NAME -f"
        exit 1
    fi
    
    log_info "זמן סיום: $(date)"
}

# Run main function with all arguments
main "$@"