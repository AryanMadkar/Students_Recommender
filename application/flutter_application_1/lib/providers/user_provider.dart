import 'package:flutter/material.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

class UserProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  User? _user;
  bool _isLoading = false;
  String? _error;

  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;

  void setUser(User? user) {
    _user = user;
    notifyListeners();
  }

  Future<bool> updateProfile({
    PersonalInfo? personalInfo,
    AcademicInfo? academicInfo,
  }) async {
    _setLoading(true);
    _setError(null);

    try {
      final updateData = <String, dynamic>{};
      
      if (personalInfo != null) {
        updateData['personalInfo'] = personalInfo.toJson();
      }
      
      if (academicInfo != null) {
        updateData['academicInfo'] = academicInfo.toJson();
      }

      final response = await _apiService.put<Map<String, dynamic>>(
        '/users/profile',
        body: updateData,
        fromJsonT: (data) => data as Map<String, dynamic>,
      );

      if (response.success && response.data != null) {
        _user = User.fromJson(response.data!);
        _setLoading(false);
        return true;
      } else {
        _setError(response.message);
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Failed to update profile: $e');
      _setLoading(false);
      return false;
    }
  }

  Future<bool> loadUserProfile() async {
    _setLoading(true);
    _setError(null);

    try {
      final response = await _apiService.get<Map<String, dynamic>>(
        '/users/profile',
        fromJsonT: (data) => data as Map<String, dynamic>,
      );

      if (response.success && response.data != null) {
        _user = User.fromJson(response.data!);
        _setLoading(false);
        return true;
      } else {
        _setError(response.message);
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Failed to load profile: $e');
      _setLoading(false);
      return false;
    }
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }
}
