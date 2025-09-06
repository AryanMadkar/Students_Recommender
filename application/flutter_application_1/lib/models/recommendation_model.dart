class Recommendation {
  final String type;
  final String title;
  final String description;
  final int? matchPercentage;
  final String? salaryRange;
  final String? location;
  final String? fees;
  final List<String>? reasons;

  Recommendation({
    required this.type,
    required this.title,
    required this.description,
    this.matchPercentage,
    this.salaryRange,
    this.location,
    this.fees,
    this.reasons,
  });

  factory Recommendation.fromJson(Map<String, dynamic> json) {
    return Recommendation(
      type: json['type'] ?? '',
      title: json['title'] ?? json['name'] ?? '',
      description: json['description'] ?? '',
      matchPercentage: json['matchPercentage'] ?? json['matchScore'],
      salaryRange: json['salaryRange'],
      location: json['location'],
      fees: json['fees'],
      reasons: json['reasons']?.cast<String>(),
    );
  }
}

class CareerRecommendation extends Recommendation {
  CareerRecommendation({
    required super.title,
    required super.description,
    super.matchPercentage,
    super.salaryRange,
  }) : super(type: 'career');

  factory CareerRecommendation.fromJson(Map<String, dynamic> json) {
    return CareerRecommendation(
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      matchPercentage: json['matchPercentage'],
      salaryRange: json['salaryRange'],
    );
  }
}

class CollegeRecommendation extends Recommendation {
  CollegeRecommendation({
    required super.title,
    required super.description,
    super.matchPercentage,
    super.location,
    super.fees,
  }) : super(type: 'college');

  factory CollegeRecommendation.fromJson(Map<String, dynamic> json) {
    return CollegeRecommendation(
      title: json['name'] ?? json['title'] ?? '',
      description: json['description'] ?? '',
      matchPercentage: json['matchPercentage'],
      location: json['location'],
      fees: json['fees'],
    );
  }
}

class SkillRoadmap {
  final List<SkillItem> immediate;
  final List<SkillItem> shortTerm;
  final List<SkillItem> longTerm;

  SkillRoadmap({
    required this.immediate,
    required this.shortTerm,
    required this.longTerm,
  });

  factory SkillRoadmap.fromJson(Map<String, dynamic> json) {
    return SkillRoadmap(
      immediate: (json['immediate'] as List?)
          ?.map((item) => SkillItem.fromJson(item))
          .toList() ?? [],
      shortTerm: (json['shortTerm'] as List?)
          ?.map((item) => SkillItem.fromJson(item))
          .toList() ?? [],
      longTerm: (json['longTerm'] as List?)
          ?.map((item) => SkillItem.fromJson(item))
          .toList() ?? [],
    );
  }
}

class SkillItem {
  final String skill;
  final String? description;
  final String? timeline;

  SkillItem({
    required this.skill,
    this.description,
    this.timeline,
  });

  factory SkillItem.fromJson(Map<String, dynamic> json) {
    if (json is String) {
      return SkillItem(skill: json.toString());
    }
    return SkillItem(
      skill: json['skill'] ?? json.toString(),
      description: json['description'],
      timeline: json['timeline'],
    );
  }
}
