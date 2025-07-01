#!/bin/bash

# Script para probar Deep Links en desarrollo
# Uso: ./test-deep-links.sh [ios|android]

PLATFORM=${1:-ios}
BASE_URL="petopia://auth"

echo "🔗 Probando Deep Links para Petopia"
echo "Plataforma: $PLATFORM"
echo "======================================"

# URLs de prueba
RESET_PASSWORD_URL="${BASE_URL}/reset-password?token=d4ff8045ad29af7e6148dd6ffc04337bb5d153872d9bdc22c2b46eda7c9e27f7&email=test%40example.com"
VERIFY_EMAIL_URL="${BASE_URL}/verify-email?id=123&hash=abc123def456&signature=signature123"

if [ "$PLATFORM" == "ios" ]; then
    echo "📱 Testeando en iOS Simulator..."
    
    echo "1. Testing Reset Password..."
    xcrun simctl openurl booted "$RESET_PASSWORD_URL"
    echo "   URL: $RESET_PASSWORD_URL"
    
    sleep 3
    
    echo "2. Testing Verify Email..."
    xcrun simctl openurl booted "$VERIFY_EMAIL_URL"
    echo "   URL: $VERIFY_EMAIL_URL"
    
elif [ "$PLATFORM" == "android" ]; then
    echo "🤖 Testeando en Android Emulator..."
    
    echo "1. Testing Reset Password..."
    adb shell am start -W -a android.intent.action.VIEW -d "$RESET_PASSWORD_URL"
    echo "   URL: $RESET_PASSWORD_URL"
    
    sleep 3
    
    echo "2. Testing Verify Email..."
    adb shell am start -W -a android.intent.action.VIEW -d "$VERIFY_EMAIL_URL"
    echo "   URL: $VERIFY_EMAIL_URL"
    
else
    echo "❌ Plataforma no soportada. Usa 'ios' o 'android'"
    exit 1
fi

echo ""
echo "✅ Testing completado!"
echo "Revisa los logs de la consola para ver el comportamiento del deep linking."
echo ""
echo "📝 Notas:"
echo "- Asegúrate de que la app esté corriendo en el simulador/emulador"
echo "- Los parámetros son de ejemplo, reemplaza con datos reales para testing completo"
echo "- Revisa la consola de Metro/Expo para logs detallados"
