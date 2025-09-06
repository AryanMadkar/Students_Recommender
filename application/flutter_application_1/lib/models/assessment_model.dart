class Assessment {
  final String id;
  final String title;
  final String description;
  final String stage;
  final String type;
  final int? duration;
  final int questionCount;
  final bool completed;

  Assessment({
    required this.id,
    required this.title,
    required this.description,
    required this.stage,
    required this.type,
    this.duration,
    required this.questionCount,
    required this.completed,
  });

  factory Assessment.fromJson(Map<String, dynamic> json) {
    return Assessment(
      id: json['_id'] ?? json['id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      stage: json['stage'] ?? '',
      type: json['type'] ?? '',
      duration: json['duration'],
      questionCount: json['questionCount'] ?? 0,
      completed: json['completed'] ?? false,
    );
  }
}

class Question {
  final String id;
  final String question;
  final String type;
  final String category;
  final List<QuestionOption>? options;
  final String difficulty;

  Question({
    required this.id,
    required this.question,
    required this.type,
    required this.category,
    this.options,
    required this.difficulty,
  });

  factory Question.fromJson(Map<String, dynamic> json) {
    return Question(
      id: json['_id'] ?? json['id'] ?? '',
      question: json['question'] ?? '',
      type: json['type'] ?? '',
      category: json['category'] ?? '',
      difficulty: json['difficulty'] ?? 'medium',
      options: json['options'] != null
          ? (json['options'] as List)
                .map((option) => QuestionOption.fromJson(option))
                .toList()
          : null,
    );
  }
}

class QuestionOption {
  final String text;
  final dynamic value;
  final int? weight;

  QuestionOption({required this.text, required this.value, this.weight});

  factory QuestionOption.fromJson(Map<String, dynamic> json) {
    return QuestionOption(
      text: json['text'] ?? '',
      value: json['value'],
      weight: json['weight'],
    );
  }
}

class AssessmentSession {
  final Assessment assessment;
  final List<Question> questions;
  final DateTime startedAt;

  AssessmentSession({
    required this.assessment,
    required this.questions,
    required this.startedAt,
  });

  factory AssessmentSession.fromJson(Map<String, dynamic> json) {
    return AssessmentSession(
      assessment: Assessment.fromJson(json['assessment']),
      questions: (json['questions'] as List)
          .map((q) => Question.fromJson(q))
          .toList(),
      startedAt: DateTime.parse(json['startedAt']),
    );
  }
}

class AssessmentResult {
  final String id;
  final AssessmentScores scores;
  final AssessmentAnalysis? analysis;
  final DateTime completedAt;

  AssessmentResult({
    required this.id,
    required this.scores,
    this.analysis,
    required this.completedAt,
  });

  factory AssessmentResult.fromJson(Map<String, dynamic> json) {
    return AssessmentResult(
      id: json['_id'] ?? json['id'] ?? '',
      scores: AssessmentScores.fromJson(json['scores'] ?? {}),
      analysis: json['analysis'] != null
          ? AssessmentAnalysis.fromJson(json['analysis'])
          : null,
      completedAt: DateTime.parse(json['completedAt']),
    );
  }
}

class AssessmentScores {
  final int analytical;
  final int creative;
  final int technical;
  final int communication;
  final int leadership;
  final int overall;

  AssessmentScores({
    required this.analytical,
    required this.creative,
    required this.technical,
    required this.communication,
    required this.leadership,
    required this.overall,
  });

  factory AssessmentScores.fromJson(Map<String, dynamic> json) {
    return AssessmentScores(
      analytical: json['analytical'] ?? 0,
      creative: json['creative'] ?? 0,
      technical: json['technical'] ?? 0,
      communication: json['communication'] ?? 0,
      leadership: json['leadership'] ?? 0,
      overall: json['overall'] ?? 0,
    );
  }

  Map<String, int> toMap() {
    return {
      'Analytical': analytical,
      'Creative': creative,
      'Technical': technical,
      'Communication': communication,
      'Leadership': leadership,
    };
  }
}

class AssessmentAnalysis {
  final List<String> strengths;
  final List<String> weaknesses;
  final List<String> recommendations;
  final String learningStyle;

  AssessmentAnalysis({
    required this.strengths,
    required this.weaknesses,
    required this.recommendations,
    required this.learningStyle,
  });

  factory AssessmentAnalysis.fromJson(Map<String, dynamic> json) {
    return AssessmentAnalysis(
      strengths: (json['strengths'] as List?)?.cast<String>() ?? [],
      weaknesses: (json['weaknesses'] as List?)?.cast<String>() ?? [],
      recommendations: (json['recommendations'] as List?)?.cast<String>() ?? [],
      learningStyle: json['learningStyle'] ?? '',
    );
  }
}
