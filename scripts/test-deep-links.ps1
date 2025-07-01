# Script para probar Deep Links en desarrollo (Windows PowerShell)
# Uso: .\test-deep-links.ps1 [ios|android]

param(
    [Parameter(Position=0)]
    [ValidateSet("ios", "android")]
    [string]$Platform = "android"
)

$BASE_URL = "petopia://auth"

Write-Host "🔗 Probando Deep Links para Petopia" -ForegroundColor Cyan
Write-Host "Plataforma: $Platform" -ForegroundColor Yellow
Write-Host "======================================" -ForegroundColor White

# URLs de prueba
$RESET_PASSWORD_URL = "$BASE_URL/reset-password?token=d4ff8045ad29af7e6148dd6ffc04337bb5d153872d9bdc22c2b46eda7c9e27f7&email=test%40example.com"
$VERIFY_EMAIL_URL = "$BASE_URL/verify-email?id=123&hash=abc123def456&signature=signature123"

if ($Platform -eq "ios") {
    Write-Host "📱 Testeando en iOS Simulator..." -ForegroundColor Blue
    
    Write-Host "1. Testing Reset Password..." -ForegroundColor Green
    & xcrun simctl openurl booted $RESET_PASSWORD_URL
    Write-Host "   URL: $RESET_PASSWORD_URL" -ForegroundColor Gray
    
    Start-Sleep -Seconds 3
    
    Write-Host "2. Testing Verify Email..." -ForegroundColor Green
    & xcrun simctl openurl booted $VERIFY_EMAIL_URL
    Write-Host "   URL: $VERIFY_EMAIL_URL" -ForegroundColor Gray
    
} elseif ($Platform -eq "android") {
    Write-Host "🤖 Testeando en Android Emulator..." -ForegroundColor Blue
    
    Write-Host "1. Testing Reset Password..." -ForegroundColor Green
    & adb shell am start -W -a android.intent.action.VIEW -d "$RESET_PASSWORD_URL"
    Write-Host "   URL: $RESET_PASSWORD_URL" -ForegroundColor Gray
    
    Start-Sleep -Seconds 3
    
    Write-Host "2. Testing Verify Email..." -ForegroundColor Green
    & adb shell am start -W -a android.intent.action.VIEW -d "$VERIFY_EMAIL_URL"
    Write-Host "   URL: $VERIFY_EMAIL_URL" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Testing completado!" -ForegroundColor Green
Write-Host "Revisa los logs de la consola para ver el comportamiento del deep linking." -ForegroundColor White
Write-Host ""
Write-Host "📝 Notas:" -ForegroundColor Yellow
Write-Host "- Asegúrate de que la app esté corriendo en el simulador/emulador" -ForegroundColor Gray
Write-Host "- Los parámetros son de ejemplo, reemplaza con datos reales para testing completo" -ForegroundColor Gray
Write-Host "- Revisa la consola de Metro/Expo para logs detallados" -ForegroundColor Gray
