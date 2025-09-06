import 'package:flutter/material.dart';
import '../models/assessment_model.dart';
import '../services/api_service.dart';

class AssessmentProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  List<Assessment> _assessments = [];
  AssessmentSession? _currentSession;
  AssessmentResult? _currentResult;
  bool _isLoading = false;
  String? _error;

  // Current assessment progress
  int _currentQuestionIndex = 0;
  final Map<String, dynamic> _responses = {};
  final Map<String, int> _timeSpent = {};
  DateTime? _startTime;

  // Getters
  List<Assessment> get assessments => _assessments;
  AssessmentSession? get currentSession => _currentSession;
  AssessmentResult? get currentResult => _currentResult;
  bool get isLoading => _isLoading;
  String? get error => _error;
  int get currentQuestionIndex => _currentQuestionIndex;
  int get totalQuestions => _currentSession?.questions.length ?? 0;
  double get progress => totalQuestions > 0 ? _currentQuestionIndex / totalQuestions : 0.0;

  // Add method to get current response
  dynamic getCurrentResponse(String questionId) {
    return _responses[questionId];
  }

  // Load assessments
  Future<void> loadAssessments() async {
    _setLoading(true);
    _setError(null);
    
    try {
      final response = await _apiService.get<List>(
        '/assessments',
        fromJsonT: (data) => data as List,
      );
      
      if (response.success && response.data != null) {
        _assessments = response.data!
            .map((json) => Assessment.fromJson(json))
            .toList();
      } else {
        _setError(response.message);
      }
    } catch (e) {
      _setError('Failed to load assessments: $e');
    }
    
    _setLoading(false);
  }

  // Start assessment
  Future<bool> startAssessment(String assessmentId) async {
    _setLoading(true);
    _setError(null);
    
    try {
      final response = await _apiService.get<Map<String, dynamic>>(
        '/assessments/$assessmentId/start',
        fromJsonT: (data) => data as Map<String, dynamic>,
      );
      
      if (response.success && response.data != null) {
        _currentSession = AssessmentSession.fromJson(response.data!);
        _currentQuestionIndex = 0;
        _responses.clear();
        _timeSpent.clear();
        _startTime = DateTime.now();
        _setLoading(false);
        return true;
      } else {
        _setError(response.message);
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Failed to start assessment: $e');
      _setLoading(false);
      return false;
    }
  }

  // Answer question
  void answerQuestion(String questionId, dynamic answer) {
    _responses[questionId] = answer;
    // Calculate time spent on this question
    if (_startTime != null) {
      _timeSpent[questionId] = DateTime.now().difference(_startTime!).inSeconds;
    }
    notifyListeners();
  }

  // Navigate to next question
  void nextQuestion() {
    if (_currentQuestionIndex < totalQuestions - 1) {
      _currentQuestionIndex++;
      _startTime = DateTime.now(); // Reset timer for next question
      notifyListeners();
    }
  }

  // Navigate to previous question
  void previousQuestion() {
    if (_currentQuestionIndex > 0) {
      _currentQuestionIndex--;
      _startTime = DateTime.now();
      notifyListeners();
    }
  }

  // Submit assessment
  Future<bool> submitAssessment() async {
    if (_currentSession == null) return false;
    
    _setLoading(true);
    _setError(null);
    
    try {
      // Calculate total time spent
      final totalTime = _timeSpent.values.fold(0, (sum, time) => sum + time);
      
      final submissionData = {
        'responses': _responses,
        'timeSpent': {
          ..._timeSpent,
          'total': totalTime,
        },
      };

      final response = await _apiService.post<Map<String, dynamic>>(
        '/assessments/${_currentSession!.assessment.id}/submit',
        body: submissionData,
        fromJsonT: (data) => data as Map<String, dynamic>,
      );
      
      if (response.success && response.data != null) {
        _currentResult = AssessmentResult.fromJson(response.data!['result']);
        _setLoading(false);
        return true;
      } else {
        _setError(response.message);
        _setLoading(false);
        return false;
      }
    } catch (e) {
      _setError('Failed to submit assessment: $e');
      _setLoading(false);
      return false;
    }
  }

  // Get current question
  Question? getCurrentQuestion() {
    if (_currentSession == null || _currentQuestionIndex >= totalQuestions) {
      return null;
    }
    return _currentSession!.questions[_currentQuestionIndex];
  }

  // Check if current question is answered
  bool isCurrentQuestionAnswered() {
    final question = getCurrentQuestion();
    if (question == null) return false;
    return _responses.containsKey(question.id);
  }

  // Reset assessment state
  void resetAssessment() {
    _currentSession = null;
    _currentResult = null;
    _currentQuestionIndex = 0;
    _responses.clear();
    _timeSpent.clear();
    _startTime = null;
    notifyListeners();
  }

  // Private methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }
}
