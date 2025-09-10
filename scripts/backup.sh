#!/bin/bash

# Automated Backup Script
# מערכת ניהול אומדני עלויות רכש - Automated Backup

set -e

# ==============================================================================
# CONFIGURATION
# ==============================================================================
BACKUP_DIR="/backups"
LOG_FILE="/var/log/procurement/backup.log"
RETENTION_DAYS=30
DATABASE_URL=${DATABASE_URL:-"postgresql://postgres:password@postgres:5432/procurement_prod"}
APP_DIR="/app"

# Timestamp for backup files
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="procurement_backup_$TIMESTAMP"

# Colors for logging
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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
# BACKUP FUNCTIONS
# ==============================================================================
create_directories() {
    log_info "יוצר תיקיות גיבוי..."
    
    mkdir -p "$BACKUP_DIR/database"
    mkdir -p "$BACKUP_DIR/files"
    mkdir -p "$BACKUP_DIR/logs"
    mkdir -p "$(dirname "$LOG_FILE")"
    
    log_success "תיקיות גיבוי נוצרו"
}

backup_database() {
    log_info "מתחיל גיבוי מסד נתונים..."
    
    local db_backup_file="$BACKUP_DIR/database/${BACKUP_NAME}_database.sql"
    local db_backup_compressed="$BACKUP_DIR/database/${BACKUP_NAME}_database.sql.gz"
    
    # Extract DB connection details from DATABASE_URL to avoid exposing password in command line
    local db_host=$(echo "$DATABASE_URL" | sed -n 's#.*://[^:]*:[^@]*@\([^:]*\):.*#\1#p')
    local db_port=$(echo "$DATABASE_URL" | sed -n 's#.*://[^:]*:[^@]*@[^:]*:\([^/]*\)/.*#\1#p')
    local db_name=$(echo "$DATABASE_URL" | sed -n 's#.*://[^:]*:[^@]*@[^:]*/\(.*\)#\1#p')
    local db_user=$(echo "$DATABASE_URL" | sed -n 's#.*://\([^:]*\):.*#\1#p')
    export PGPASSWORD=$(echo "$DATABASE_URL" | sed -n 's#.*://[^:]*:\([^@]*\)@.*#\1#p')
    
    # Create database dump with environment variables (secure)
    if pg_dump -h "$db_host" -p "$db_port" -U "$db_user" -d "$db_name" > "$db_backup_file"; then
        log_success "גיבוי מסד נתונים נוצר: $(basename "$db_backup_file")"
        
        # Compress the backup
        if gzip "$db_backup_file"; then
            log_success "גיבוי מסד נתונים נדחס: $(basename "$db_backup_compressed")"
            
            # Verify compressed file
            if gzip -t "$db_backup_compressed"; then
                log_success "קובץ הגיבוי המדחס תקין"
            else
                log_error "קובץ הגיבוי המדחס פגום"
                return 1
            fi
        else
            log_error "שגיאה בדחיסת גיבוי מסד נתונים"
            return 1
        fi
        
        # Get backup size
        local backup_size=$(du -h "$db_backup_compressed" | cut -f1)
        log_info "גודל גיבוי מסד נתונים: $backup_size"
        
    else
        log_error "שגיאה ביצירת גיבוי מסד נתונים"
        return 1
    fi
}

backup_uploads() {
    log_info "מתחיל גיבוי קבצי העלאות..."
    
    local uploads_dir="$APP_DIR/uploads"
    local uploads_backup="$BACKUP_DIR/files/${BACKUP_NAME}_uploads.tar.gz"
    
    if [ -d "$uploads_dir" ] && [ "$(ls -A "$uploads_dir")" ]; then
        if tar -czf "$uploads_backup" -C "$APP_DIR" uploads/; then
            log_success "גיבוי קבצי העלאות נוצר: $(basename "$uploads_backup")"
            
            # Get backup size
            local backup_size=$(du -h "$uploads_backup" | cut -f1)
            log_info "גודל גיבוי קבצי העלאות: $backup_size"
        else
            log_error "שגיאה בגיבוי קבצי העלאות"
            return 1
        fi
    else
        log_info "אין קבצי העלאות לגיבוי"
        touch "$uploads_backup.empty"
    fi
}

backup_configuration() {
    log_info "מתחיל גיבוי קבצי הגדרה..."
    
    local config_backup="$BACKUP_DIR/files/${BACKUP_NAME}_config.tar.gz"
    local temp_config_dir="/tmp/config_backup_$$"
    
    mkdir -p "$temp_config_dir"
    
    # Copy configuration files (excluding sensitive data)
    if [ -f "$APP_DIR/package.json" ]; then
        cp "$APP_DIR/package.json" "$temp_config_dir/"
    fi
    
    if [ -f "$APP_DIR/package-lock.json" ]; then
        cp "$APP_DIR/package-lock.json" "$temp_config_dir/"
    fi
    
    if [ -f "$APP_DIR/.env.production.example" ]; then
        cp "$APP_DIR/.env.production.example" "$temp_config_dir/"
    fi
    
    # Create version info file
    cat > "$temp_config_dir/backup_info.txt" << EOF
Backup Date: $(date)
Backup Type: Automated
Node Version: $(node --version 2>/dev/null || echo "N/A")
NPM Version: $(npm --version 2>/dev/null || echo "N/A")
System: $(uname -a)
EOF
    
    if tar -czf "$config_backup" -C "$temp_config_dir" .; then
        log_success "גיבוי קבצי הגדרה נוצר: $(basename "$config_backup")"
    else
        log_error "שגיאה בגיבוי קבצי הגדרה"
    fi
    
    # Cleanup
    rm -rf "$temp_config_dir"
}

backup_logs() {
    log_info "מתחיל גיבוי קבצי לוג..."
    
    local logs_dir="/var/log/procurement"
    local logs_backup="$BACKUP_DIR/logs/${BACKUP_NAME}_logs.tar.gz"
    
    if [ -d "$logs_dir" ] && [ "$(ls -A "$logs_dir")" ]; then
        # Exclude current log file to avoid issues
        if tar -czf "$logs_backup" -C "/var/log" procurement/ --exclude="backup.log"; then
            log_success "גיבוי קבצי לוג נוצר: $(basename "$logs_backup")"
            
            local backup_size=$(du -h "$logs_backup" | cut -f1)
            log_info "גודל גיבוי קבצי לוג: $backup_size"
        else
            log_error "שגיאה בגיבוי קבצי לוג"
        fi
    else
        log_info "אין קבצי לוג לגיבוי"
        touch "$logs_backup.empty"
    fi
}

verify_backups() {
    log_info "מתחיל אימות גיבויים..."
    
    local verification_failed=false
    
    # Verify database backup
    local db_backup="$BACKUP_DIR/database/${BACKUP_NAME}_database.sql.gz"
    if [ -f "$db_backup" ]; then
        if gzip -t "$db_backup"; then
            log_success "גיבוי מסד נתונים תקין"
        else
            log_error "גיבוי מסד נתונים פגום"
            verification_failed=true
        fi
    else
        log_error "גיבוי מסד נתונים לא נמצא"
        verification_failed=true
    fi
    
    # Verify uploads backup
    local uploads_backup="$BACKUP_DIR/files/${BACKUP_NAME}_uploads.tar.gz"
    if [ -f "$uploads_backup" ]; then
        if tar -tzf "$uploads_backup" > /dev/null 2>&1; then
            log_success "גיבוי קבצי העלאות תקין"
        else
            log_error "גיבוי קבצי העלאות פגום"
            verification_failed=true
        fi
    fi
    
    # Verify config backup
    local config_backup="$BACKUP_DIR/files/${BACKUP_NAME}_config.tar.gz"
    if [ -f "$config_backup" ]; then
        if tar -tzf "$config_backup" > /dev/null 2>&1; then
            log_success "גיבוי קבצי הגדרה תקין"
        else
            log_error "גיבוי קבצי הגדרה פגום"
            verification_failed=true
        fi
    fi
    
    if [ "$verification_failed" = true ]; then
        log_error "אימות גיבויים נכשל"
        return 1
    else
        log_success "כל הגיבויים תקינים"
        return 0
    fi
}

create_backup_manifest() {
    log_info "יוצר מניפסט גיבוי..."
    
    local manifest_file="$BACKUP_DIR/${BACKUP_NAME}_manifest.json"
    
    cat > "$manifest_file" << EOF
{
  "backup_name": "$BACKUP_NAME",
  "backup_date": "$(date -Iseconds)",
  "backup_type": "automated",
  "files": {
    "database": {
      "file": "database/${BACKUP_NAME}_database.sql.gz",
      "size": "$(du -b "$BACKUP_DIR/database/${BACKUP_NAME}_database.sql.gz" 2>/dev/null | cut -f1 || echo 0)",
      "checksum": "$(sha256sum "$BACKUP_DIR/database/${BACKUP_NAME}_database.sql.gz" 2>/dev/null | cut -f1 || echo 'N/A')"
    },
    "uploads": {
      "file": "files/${BACKUP_NAME}_uploads.tar.gz",
      "size": "$(du -b "$BACKUP_DIR/files/${BACKUP_NAME}_uploads.tar.gz" 2>/dev/null | cut -f1 || echo 0)",
      "exists": $([ -f "$BACKUP_DIR/files/${BACKUP_NAME}_uploads.tar.gz" ] && echo true || echo false)
    },
    "configuration": {
      "file": "files/${BACKUP_NAME}_config.tar.gz",
      "size": "$(du -b "$BACKUP_DIR/files/${BACKUP_NAME}_config.tar.gz" 2>/dev/null | cut -f1 || echo 0)"
    },
    "logs": {
      "file": "logs/${BACKUP_NAME}_logs.tar.gz", 
      "size": "$(du -b "$BACKUP_DIR/logs/${BACKUP_NAME}_logs.tar.gz" 2>/dev/null | cut -f1 || echo 0)",
      "exists": $([ -f "$BACKUP_DIR/logs/${BACKUP_NAME}_logs.tar.gz" ] && echo true || echo false)
    }
  },
  "total_size": "$(du -sb "$BACKUP_DIR" | grep "$BACKUP_NAME" | awk '{sum+=$1} END {print sum}' || echo 0)",
  "retention_date": "$(date -d "+$RETENTION_DAYS days" -Iseconds)"
}
EOF
    
    log_success "מניפסט גיבוי נוצר: $(basename "$manifest_file")"
}

cleanup_old_backups() {
    log_info "מנקה גיבויים ישנים (מעל $RETENTION_DAYS ימים)..."
    
    local deleted_count=0
    
    # Find and delete old backups
    find "$BACKUP_DIR" -name "procurement_backup_*" -type f -mtime +$RETENTION_DAYS -print0 | while IFS= read -r -d '' file; do
        log_info "מוחק גיבוי ישן: $(basename "$file")"
        rm -f "$file"
        ((deleted_count++))
    done
    
    # Clean up empty directories
    find "$BACKUP_DIR" -type d -empty -delete 2>/dev/null || true
    
    if [ $deleted_count -gt 0 ]; then
        log_success "נמחקו $deleted_count קבצי גיבוי ישנים"
    else
        log_info "לא נמצאו גיבויים ישנים למחיקה"
    fi
}

send_notification() {
    local status=$1
    local message=$2
    
    # Here you can add notification logic (email, Slack, etc.)
    log_info "הודעה: $status - $message"
    
    # Example: Send email notification (requires mailutils)
    # if command -v mail &> /dev/null; then
    #     echo "$message" | mail -s "Procurement System Backup - $status" admin@yourcompany.co.il
    # fi
}

# ==============================================================================
# MAIN BACKUP PROCESS
# ==============================================================================
main() {
    log_info "==== התחלת תהליך גיבוי אוטומטי ===="
    log_info "זמן התחלה: $(date)"
    
    local backup_success=true
    local error_messages=""
    
    # Create necessary directories
    create_directories
    
    # Perform backups
    if ! backup_database; then
        backup_success=false
        error_messages+="Database backup failed. "
    fi
    
    if ! backup_uploads; then
        backup_success=false
        error_messages+="Uploads backup failed. "
    fi
    
    backup_configuration  # Non-critical
    backup_logs           # Non-critical
    
    # Verify backups
    if [ "$backup_success" = true ]; then
        if verify_backups; then
            create_backup_manifest
            cleanup_old_backups
            
            local total_size=$(du -sh "$BACKUP_DIR" | cut -f1)
            log_success "==== גיבוי הושלם בהצלחה ===="
            log_info "גודל כולל של כל הגיבויים: $total_size"
            log_info "מיקום גיבויים: $BACKUP_DIR"
            
            send_notification "SUCCESS" "Backup completed successfully. Total size: $total_size"
        else
            backup_success=false
            error_messages+="Backup verification failed. "
        fi
    fi
    
    # Handle errors
    if [ "$backup_success" = false ]; then
        log_error "==== גיבוי נכשל ===="
        log_error "שגיאות: $error_messages"
        
        send_notification "FAILED" "Backup failed with errors: $error_messages"
        exit 1
    fi
    
    log_info "זמן סיום: $(date)"
}

# ==============================================================================
# RESTORE FUNCTIONS (Bonus)
# ==============================================================================
list_backups() {
    echo "גיבויים זמינים:"
    find "$BACKUP_DIR" -name "*_manifest.json" -type f | sort -r | head -10 | while read manifest; do
        local backup_name=$(basename "$manifest" "_manifest.json")
        local backup_date=$(grep '"backup_date"' "$manifest" | cut -d'"' -f4)
        echo "  $backup_name ($backup_date)"
    done
}

restore_backup() {
    local backup_name=$1
    
    if [ -z "$backup_name" ]; then
        echo "שימוש: $0 restore <backup_name>"
        list_backups
        exit 1
    fi
    
    log_info "משחזר גיבוי: $backup_name"
    
    # Restore database
    local db_backup="$BACKUP_DIR/database/${backup_name}_database.sql.gz"
    if [ -f "$db_backup" ]; then
        log_info "משחזר מסד נתונים..."
        # Use secure connection without exposing credentials in command line
        local db_host=$(echo "$DATABASE_URL" | sed -n 's#.*://[^:]*:[^@]*@\([^:]*\):.*#\1#p')
        local db_port=$(echo "$DATABASE_URL" | sed -n 's#.*://[^:]*:[^@]*@[^:]*:\([^/]*\)/.*#\1#p')
        local db_name=$(echo "$DATABASE_URL" | sed -n 's#.*://[^:]*:[^@]*@[^:]*/\(.*\)#\1#p')
        local db_user=$(echo "$DATABASE_URL" | sed -n 's#.*://\([^:]*\):.*#\1#p')
        export PGPASSWORD=$(echo "$DATABASE_URL" | sed -n 's#.*://[^:]*:\([^@]*\)@.*#\1#p')
        
        gunzip -c "$db_backup" | PGPASSWORD="$PGPASSWORD" psql -h "$db_host" -p "$db_port" -U "$db_user" -d "$db_name"
        log_success "מסד נתונים שוחזר בהצלחה"
    else
        log_error "גיבוי מסד נתונים לא נמצא: $db_backup"
        exit 1
    fi
    
    # Restore uploads if exists
    local uploads_backup="$BACKUP_DIR/files/${backup_name}_uploads.tar.gz"
    if [ -f "$uploads_backup" ]; then
        log_info "משחזר קבצי העלאות..."
        tar -xzf "$uploads_backup" -C "$APP_DIR"
        log_success "קבצי העלאות שוחזרו בהצלחה"
    fi
    
    log_success "שחזור הושלם בהצלחה"
}

# ==============================================================================
# COMMAND LINE INTERFACE
# ==============================================================================
case "${1:-backup}" in
    backup)
        main
        ;;
    list)
        list_backups
        ;;
    restore)
        restore_backup "$2"
        ;;
    *)
        echo "שימוש: $0 {backup|list|restore <backup_name>}"
        echo "  backup  - בצע גיבוי מלא (ברירת מחדל)"
        echo "  list    - הצג רשימת גיבויים זמינים"  
        echo "  restore - שחזר גיבוי ספציפי"
        exit 1
        ;;
esac