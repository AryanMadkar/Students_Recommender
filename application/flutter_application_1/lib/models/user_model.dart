class User {
  final String id;
  final PersonalInfo personalInfo;
  final String educationStage;
  final AcademicInfo? academicInfo;
  final Progress? progress;
  final List<String>? favoriteColleges;

  User({
    required this.id,
    required this.personalInfo,
    required this.educationStage,
    this.academicInfo,
    this.progress,
    this.favoriteColleges,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['_id'] ?? json['id'] ?? '',
      personalInfo: PersonalInfo.fromJson(json['personalInfo'] ?? {}),
      educationStage: json['educationStage'] ?? '',
      academicInfo: json['academicInfo'] != null 
          ? AcademicInfo.fromJson(json['academicInfo'])
          : null,
      progress: json['progress'] != null 
          ? Progress.fromJson(json['progress'])
          : null,
      favoriteColleges: json['favorites']?['colleges']?.cast<String>(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'personalInfo': personalInfo.toJson(),
      'educationStage': educationStage,
      'academicInfo': academicInfo?.toJson(),
      'progress': progress?.toJson(),
    };
  }
}

class PersonalInfo {
  final String name;
  final String email;
  final String? phone;
  final String? city;
  final String? state;

  PersonalInfo({
    required this.name,
    required this.email,
    this.phone,
    this.city,
    this.state,
  });

  factory PersonalInfo.fromJson(Map<String, dynamic> json) {
    return PersonalInfo(
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      city: json['city'],
      state: json['state'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'email': email,
      'phone': phone,
      'city': city,
      'state': state,
    };
  }
}

class AcademicInfo {
  final ClassInfo? class10;
  final ClassInfo? class12;
  final CurrentCourse? currentCourse;

  AcademicInfo({this.class10, this.class12, this.currentCourse});

  factory AcademicInfo.fromJson(Map<String, dynamic> json) {
    return AcademicInfo(
      class10: json['class10'] != null ? ClassInfo.fromJson(json['class10']) : null,
      class12: json['class12'] != null ? ClassInfo.fromJson(json['class12']) : null,
      currentCourse: json['currentCourse'] != null 
          ? CurrentCourse.fromJson(json['currentCourse']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'class10': class10?.toJson(),
      'class12': class12?.toJson(),
      'currentCourse': currentCourse?.toJson(),
    };
  }
}

class ClassInfo {
  final String? board;
  final double? percentage;
  final String? stream;
  final int? year;

  ClassInfo({this.board, this.percentage, this.stream, this.year});

  factory ClassInfo.fromJson(Map<String, dynamic> json) {
    return ClassInfo(
      board: json['board'],
      percentage: json['percentage']?.toDouble(),
      stream: json['stream'],
      year: json['year'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'board': board,
      'percentage': percentage,
      'stream': stream,
      'year': year,
    };
  }
}

class CurrentCourse {
  final String? degree;
  final String? specialization;
  final String? college;
  final int? year;
  final double? cgpa;

  CurrentCourse({
    this.degree,
    this.specialization,
    this.college,
    this.year,
    this.cgpa,
  });

  factory CurrentCourse.fromJson(Map<String, dynamic> json) {
    return CurrentCourse(
      degree: json['degree'],
      specialization: json['specialization'],
      college: json['college'],
      year: json['year'],
      cgpa: json['cgpa']?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'degree': degree,
      'specialization': specialization,
      'college': college,
      'year': year,
      'cgpa': cgpa,
    };
  }
}

class Progress {
  final int profileCompletion;
  final int assessmentsCompleted;
  final String? lastActive;

  Progress({
    required this.profileCompletion,
    required this.assessmentsCompleted,
    this.lastActive,
  });

  factory Progress.fromJson(Map<String, dynamic> json) {
    return Progress(
      profileCompletion: json['profileCompletion'] ?? 0,
      assessmentsCompleted: json['assessmentsCompleted'] ?? 0,
      lastActive: json['lastActive'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'profileCompletion': profileCompletion,
      'assessmentsCompleted': assessmentsCompleted,
      'lastActive': lastActive,
    };
  }
}
