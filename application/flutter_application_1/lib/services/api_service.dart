import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/foundation.dart';
import '../models/api_response.dart';
import '../utils/constants.dart';
import 'storage_service.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final StorageService _storageService = StorageService();

  Future<Map<String, String>> _getHeaders({bool includeAuth = true}) async {
    final headers = {'Content-Type': 'application/json'};

    if (includeAuth) {
      final token = await _storageService.getToken();
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  Future<ApiResponse<T>> _handleResponse<T>(
    http.Response response,
    T Function(dynamic)? fromJsonT,
  ) async {
    if (kDebugMode) {
      print('Response Status: ${response.statusCode}');
      print('Response Body: ${response.body}');
    }

    try {
      final Map<String, dynamic> data = json.decode(response.body);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return ApiResponse.fromJson(data, fromJsonT);
      } else {
        return ApiResponse<T>(
          success: false,
          message: data['message'] ?? 'An error occurred',
          errors: data['errors'],
        );
      }
    } catch (e) {
      return ApiResponse<T>(
        success: false,
        message: 'Failed to parse response: $e',
      );
    }
  }

  // GET Request
  Future<ApiResponse<T>> get<T>(
    String endpoint, {
    Map<String, dynamic>? queryParams,
    T Function(dynamic)? fromJsonT,
    bool includeAuth = true,
  }) async {
    try {
      String url = '${AppConstants.apiUrl}$endpoint';

      if (queryParams != null && queryParams.isNotEmpty) {
        final query = Uri(
          queryParameters: queryParams.map(
            (key, value) => MapEntry(key, value.toString()),
          ),
        ).query;
        url += '?$query';
      }

      final response = await http.get(
        Uri.parse(url),
        headers: await _getHeaders(includeAuth: includeAuth),
      );

      return _handleResponse(response, fromJsonT);
    } catch (e) {
      return ApiResponse<T>(success: false, message: 'Network error: $e');
    }
  }

  // POST Request
  Future<ApiResponse<T>> post<T>(
    String endpoint, {
    Map<String, dynamic>? body,
    T Function(dynamic)? fromJsonT,
    bool includeAuth = true,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.apiUrl}$endpoint'),
        headers: await _getHeaders(includeAuth: includeAuth),
        body: body != null ? json.encode(body) : null,
      );

      return _handleResponse(response, fromJsonT);
    } catch (e) {
      return ApiResponse<T>(success: false, message: 'Network error: $e');
    }
  }

  // PUT Request
  Future<ApiResponse<T>> put<T>(
    String endpoint, {
    Map<String, dynamic>? body,
    T Function(dynamic)? fromJsonT,
    bool includeAuth = true,
  }) async {
    try {
      final response = await http.put(
        Uri.parse('${AppConstants.apiUrl}$endpoint'),
        headers: await _getHeaders(includeAuth: includeAuth),
        body: body != null ? json.encode(body) : null,
      );

      return _handleResponse(response, fromJsonT);
    } catch (e) {
      return ApiResponse<T>(success: false, message: 'Network error: $e');
    }
  }

  // DELETE Request
  Future<ApiResponse<T>> delete<T>(
    String endpoint, {
    T Function(dynamic)? fromJsonT,
    bool includeAuth = true,
  }) async {
    try {
      final response = await http.delete(
        Uri.parse('${AppConstants.apiUrl}$endpoint'),
        headers: await _getHeaders(includeAuth: includeAuth),
      );

      return _handleResponse(response, fromJsonT);
    } catch (e) {
      return ApiResponse<T>(success: false, message: 'Network error: $e');
    }
  }

  // Health Check (special endpoint not under /api)
  Future<ApiResponse<Map<String, dynamic>>> healthCheck() async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.baseUrl}/health'),
        headers: {'Content-Type': 'application/json'},
      );

      return _handleResponse<Map<String, dynamic>>(
        response,
        (data) => data as Map<String, dynamic>,
      );
    } catch (e) {
      return ApiResponse<Map<String, dynamic>>(
        success: false,
        message: 'Health check failed: $e',
      );
    }
  }
}
