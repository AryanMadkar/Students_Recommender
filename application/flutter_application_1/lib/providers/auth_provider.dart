import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';
import '../services/storage_service.dart';

class AuthProvider with ChangeNotifier {
  final AuthService _authService = AuthService();
  final StorageService _storageService = StorageService();

  User? _user;
  bool _isAuthenticated = false;
  bool _isLoading = false;

  User? get user => _user;
  bool get isAuthenticated => _isAuthenticated;
  bool get isLoading => _isLoading;

  AuthProvider() {
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    _isLoading = true;
    notifyListeners();

    try {
      final token = await _storageService.getToken();
      final user = await _storageService.getUser();
      
      if (token != null && user != null) {
        _user = user;
        _isAuthenticated = true;
      }
    } catch (e) {
      _isAuthenticated = false;
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<String?> register({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String educationStage,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _authService.register(
        name: name,
        email: email,
        password: password,
        phone: phone,
        educationStage: educationStage,
      );

      if (response.success && response.data != null) {
        _user = response.data!.user;
        _isAuthenticated = true;
        _isLoading = false;
        notifyListeners();
        return null; // Success
      } else {
        _isLoading = false;
        notifyListeners();
        return response.message;
      }
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return 'Registration failed: $e';
    }
  }

  Future<String?> login({
    required String email,
    required String password,
  }) async {
    _isLoading = true;
    notifyListeners();

    try {
      final response = await _authService.login(
        email: email,
        password: password,
      );

      if (response.success && response.data != null) {
        _user = response.data!.user;
        _isAuthenticated = true;
        _isLoading = false;
        notifyListeners();
        return null; // Success
      } else {
        _isLoading = false;
        notifyListeners();
        return response.message;
      }
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return 'Login failed: $e';
    }
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();

    await _authService.logout();
    _user = null;
    _isAuthenticated = false;
    _isLoading = false;
    notifyListeners();
  }

  Future<void> updateUser(User user) async {
    _user = user;
    await _storageService.saveUser(user);
    notifyListeners();
  }
}
