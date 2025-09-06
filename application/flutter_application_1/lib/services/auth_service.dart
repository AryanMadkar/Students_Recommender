import '../models/api_response.dart';
import '../models/user_model.dart';
import 'api_service.dart';
import 'storage_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();
  final StorageService _storageService = StorageService();

  Future<ApiResponse<AuthResponse>> register({
    required String name,
    required String email,
    required String password,
    required String phone,
    required String educationStage,
  }) async {
    final response = await _apiService.post<Map<String, dynamic>>(
      '/auth/register',
      body: {
        'name': name,
        'email': email,
        'password': password,
        'phone': phone,
        'educationStage': educationStage,
      },
      fromJsonT: (data) => data as Map<String, dynamic>,
      includeAuth: false,
    );

    if (response.success && response.data != null) {
      final authData = AuthResponse.fromJson(response.data!);
      await _storageService.saveToken(authData.token);
      await _storageService.saveUser(authData.user);
      
      return ApiResponse<AuthResponse>(
        success: true,
        message: response.message,
        data: authData,
      );
    }

    return ApiResponse<AuthResponse>(
      success: false,
      message: response.message,
      errors: response.errors,
    );
  }

  Future<ApiResponse<AuthResponse>> login({
    required String email,
    required String password,
  }) async {
    final response = await _apiService.post<Map<String, dynamic>>(
      '/auth/login',
      body: {
        'email': email,
        'password': password,
      },
      fromJsonT: (data) => data as Map<String, dynamic>,
      includeAuth: false,
    );

    if (response.success && response.data != null) {
      final authData = AuthResponse.fromJson(response.data!);
      await _storageService.saveToken(authData.token);
      await _storageService.saveUser(authData.user);
      
      return ApiResponse<AuthResponse>(
        success: true,
        message: response.message,
        data: authData,
      );
    }

    return ApiResponse<AuthResponse>(
      success: false,
      message: response.message,
      errors: response.errors,
    );
  }

  Future<ApiResponse<User>> getCurrentUser() async {
    final response = await _apiService.get<Map<String, dynamic>>(
      '/auth/me',
      fromJsonT: (data) => data as Map<String, dynamic>,
    );

    if (response.success && response.data != null) {
      final user = User.fromJson(response.data!);
      await _storageService.saveUser(user);
      
      return ApiResponse<User>(
        success: true,
        message: response.message,
        data: user,
      );
    }

    return ApiResponse<User>(
      success: false,
      message: response.message,
      errors: response.errors,
    );
  }

  Future<void> logout() async {
    await _storageService.clearToken();
    await _storageService.clearUser();
  }

  Future<bool> isLoggedIn() async {
    final token = await _storageService.getToken();
    return token != null;
  }
}

class AuthResponse {
  final String token;
  final User user;

  AuthResponse({required this.token, required this.user});

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      token: json['token'] ?? '',
      user: User.fromJson(json['user'] ?? {}),
    );
  }
}
