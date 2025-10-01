# Firebase SMS Setup Guide

This guide will help you set up real SMS authentication using Firebase Phone Authentication.

## 🔧 **Step 1: Firebase Console Configuration**

### 1.1 Enable Phone Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `encoded-joy-472514-n7`
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Phone** provider
5. Toggle **Enable** to ON
6. Click **Save**

### 1.2 Configure App for Phone Auth
1. Go to **Project Settings** → **General**
2. Add your app's SHA-1 fingerprint (for Android)
3. Download the updated `google-services.json` if needed

## 📱 **Step 2: Platform-Specific Setup**

### 2.1 For Android
1. **Get SHA-1 fingerprint:**
   ```bash
   cd android
   ./gradlew signingReport
   ```
2. **Add SHA-1 to Firebase Console:**
   - Go to Project Settings → Your Apps
   - Add SHA-1 fingerprint
   - Download updated `google-services.json`

### 2.2 For iOS
1. **Configure iOS app:**
   - Go to Project Settings → Your Apps
   - Add iOS app with bundle ID: `com.anonymous.exponativewind`
   - Download `GoogleService-Info.plist`

### 2.3 For Web
1. **Configure Web app:**
   - Go to Project Settings → Your Apps
   - Add Web app
   - Copy the config object
   - Update `lib/firebase.ts` with web config

## 🔑 **Step 3: Test Phone Numbers**

### 3.1 Add Test Phone Numbers (Development)
1. Go to **Authentication** → **Sign-in method**
2. Scroll down to **Phone numbers for testing**
3. Add test phone numbers:
   - `+1 650-555-3434` (US)
   - `+44 7700 900000` (UK)
   - Your personal number for testing

### 3.2 Test Phone Number Format
- **US**: `+1 650-555-3434`
- **UK**: `+44 7700 900000`
- **India**: `+91 9876543210`
- **International**: Always include country code with `+`

## 🚀 **Step 4: Testing Real SMS**

### 4.1 Test with Test Numbers
1. Use Firebase Console test numbers first
2. These will receive SMS without charges
3. Verify the flow works correctly

### 4.2 Test with Real Numbers
1. Use your personal phone number
2. You'll receive real SMS messages
3. Firebase charges apply for real SMS

## 💰 **Step 5: SMS Costs**

### 5.1 Firebase SMS Pricing
- **US**: ~$0.01 per SMS
- **International**: Varies by country
- **Test numbers**: Free

### 5.2 Cost Management
- Use test numbers during development
- Monitor usage in Firebase Console
- Set up billing alerts

## 🔧 **Step 6: Troubleshooting**

### 6.1 Common Issues
- **"Phone authentication not enabled"**: Enable in Firebase Console
- **"Invalid phone number"**: Check format (include country code)
- **"reCAPTCHA failed"**: Configure reCAPTCHA for web
- **"SMS not received"**: Check spam folder, try test numbers

### 6.2 Debug Steps
1. Check Firebase Console logs
2. Verify phone number format
3. Test with Firebase test numbers
4. Check network connectivity

## 📋 **Step 7: Production Checklist**

### 7.1 Before Going Live
- [ ] Phone authentication enabled
- [ ] SHA-1 fingerprints added
- [ ] Test with real numbers
- [ ] Monitor SMS costs
- [ ] Set up billing alerts
- [ ] Configure rate limiting

### 7.2 Security Considerations
- Implement rate limiting
- Monitor for abuse
- Set up proper error handling
- Consider fallback authentication methods

## 🎯 **Quick Start Commands**

```bash
# Get Android SHA-1 fingerprint
cd android && ./gradlew signingReport

# Test the app
npm run dev

# Check Firebase logs
# Go to Firebase Console → Authentication → Users
```

## 📞 **Test Phone Numbers**

Use these Firebase test numbers for development:
- **US**: `+1 650-555-3434` (Code: 123456)
- **UK**: `+44 7700 900000` (Code: 123456)
- **India**: `+91 9876543210` (Code: 123456)

## 🔍 **Verification**

After setup, you should see:
1. **Console logs**: "✅ SMS sent successfully via Firebase"
2. **Real SMS**: Actual SMS messages on your phone
3. **Firebase Console**: User appears in Authentication → Users
4. **App flow**: Successful login and navigation

## 🆘 **Need Help?**

If you encounter issues:
1. Check Firebase Console → Authentication → Users
2. Verify phone number format
3. Test with Firebase test numbers first
4. Check console logs for specific errors
