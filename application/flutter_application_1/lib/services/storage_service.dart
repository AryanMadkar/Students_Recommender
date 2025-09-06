import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user_model.dart';
import '../utils/constants.dart';

class StorageService {
  static final StorageService _instance = StorageService._internal();
  factory StorageService() => _instance;
  StorageService._internal();

  SharedPreferences? _prefs;

  Future<void> _initPrefs() async {
    _prefs ??= await SharedPreferences.getInstance();
  }

  // Token Management
  Future<void> saveToken(String token) async {
    await _initPrefs();
    await _prefs!.setString(AppConstants.tokenKey, token);
  }

  Future<String?> getToken() async {
    await _initPrefs();
    return _prefs!.getString(AppConstants.tokenKey);
  }

  Future<void> clearToken() async {
    await _initPrefs();
    await _prefs!.remove(AppConstants.tokenKey);
  }

  // User Management
  Future<void> saveUser(User user) async {
    await _initPrefs();
    final userJson = json.encode(user.toJson());
    await _prefs!.setString(AppConstants.userKey, userJson);
  }

  Future<User?> getUser() async {
    await _initPrefs();
    final userJson = _prefs!.getString(AppConstants.userKey);
    if (userJson != null) {
      try {
        final userMap = json.decode(userJson) as Map<String, dynamic>;
        return User.fromJson(userMap);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  Future<void> clearUser() async {
    await _initPrefs();
    await _prefs!.remove(AppConstants.userKey);
  }

  // Clear All Data
  Future<void> clearAll() async {
    await _initPrefs();
    await _prefs!.clear();
  }
}
