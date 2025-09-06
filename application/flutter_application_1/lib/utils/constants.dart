class AppConstants {
  static const String baseUrl = "http://localhost:3000";
 // Replace xxx with your IP
  // Alternative: Use ADB reverse proxy (recommended)
  // static const String baseUrl = "http://localhost:3000"; // Use with adb reverse
  static const String apiUrl = "$baseUrl/api";
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  
  static const List<String> educationStages = [
    'after10th',
    'after12th',
    'ongoing',
  ];
  
  static const List<String> assessmentTypes = [
    "aptitude",
    "interest",
    "iq",
    "personality",
    "subject_preference",
  ];
}
