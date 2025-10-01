#!/bin/bash

# Script to get Android SHA-1 fingerprint for Firebase configuration

echo "🔍 Getting Android SHA-1 fingerprint..."

# Check if we're in the right directory
if [ ! -d "android" ]; then
    echo "❌ Error: android directory not found. Please run this from the project root."
    exit 1
fi

# Navigate to android directory
cd android

# Check if gradlew exists
if [ ! -f "gradlew" ]; then
    echo "❌ Error: gradlew not found in android directory."
    exit 1
fi

# Make gradlew executable
chmod +x gradlew

echo "📱 Running gradlew signingReport..."
echo ""

# Run the signing report
./gradlew signingReport

echo ""
echo "✅ SHA-1 fingerprint generated!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the SHA-1 fingerprint from the output above"
echo "2. Go to Firebase Console → Project Settings → Your Apps"
echo "3. Add the SHA-1 fingerprint to your Android app"
echo "4. Download the updated google-services.json"
echo "5. Replace the current google-services.json file"
echo ""
echo "🔗 Firebase Console: https://console.firebase.google.com/"
