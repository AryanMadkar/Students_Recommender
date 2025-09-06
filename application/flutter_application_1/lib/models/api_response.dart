class ApiResponse<T> {
  final bool success;
  final String message;
  final T? data;
  final List<dynamic>? errors;
  final String? timestamp;

  ApiResponse({
    required this.success,
    required this.message,
    this.data,
    this.errors,
    this.timestamp,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic)? fromJsonT,
  ) {
    return ApiResponse<T>(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      data: json['data'] != null && fromJsonT != null 
          ? fromJsonT(json['data']) 
          : json['data'],
      errors: json['errors'],
      timestamp: json['timestamp'],
    );
  }
}
