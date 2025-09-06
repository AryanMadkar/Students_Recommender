class College {
  final String id;
  final String name;
  final String? shortName;
  final Location location;
  final String type;
  final List<Course> courses;
  final Ratings ratings;
  final PlacementStats? placementStats;
  final String? website;

  College({
    required this.id,
    required this.name,
    this.shortName,
    required this.location,
    required this.type,
    required this.courses,
    required this.ratings,
    this.placementStats,
    this.website,
  });

  factory College.fromJson(Map<String, dynamic> json) {
    return College(
      id: json['_id'] ?? json['id'] ?? '',
      name: json['name'] ?? '',
      shortName: json['shortName'],
      location: Location.fromJson(json['location'] ?? {}),
      type: json['type'] ?? '',
      courses: (json['courses'] as List?)
          ?.map((course) => Course.fromJson(course))
          .toList() ?? [],
      ratings: Ratings.fromJson(json['ratings'] ?? {}),
      placementStats: json['placementStats'] != null
          ? PlacementStats.fromJson(json['placementStats'])
          : null,
      website: json['website'],
    );
  }
}

class Location {
  final String? state;
  final String? city;
  final String? address;

  Location({this.state, this.city, this.address});

  factory Location.fromJson(Map<String, dynamic> json) {
    return Location(
      state: json['state'],
      city: json['city'],
      address: json['address'],
    );
  }
}

class Course {
  final String name;
  final String? duration;
  final Fees? fees;
  final Eligibility? eligibility;

  Course({
    required this.name,
    this.duration,
    this.fees,
    this.eligibility,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      name: json['name'] ?? '',
      duration: json['duration'],
      fees: json['fees'] != null ? Fees.fromJson(json['fees']) : null,
      eligibility: json['eligibility'] != null 
          ? Eligibility.fromJson(json['eligibility']) : null,
    );
  }
}

class Fees {
  final int? annual;
  final int? total;

  Fees({this.annual, this.total});

  factory Fees.fromJson(Map<String, dynamic> json) {
    return Fees(
      annual: json['annual'],
      total: json['total'],
    );
  }
}

class Eligibility {
  final List<String>? stream;
  final int? minimumPercentage;
  final String? entranceExam;

  Eligibility({this.stream, this.minimumPercentage, this.entranceExam});

  factory Eligibility.fromJson(Map<String, dynamic> json) {
    return Eligibility(
      stream: json['stream']?.cast<String>(),
      minimumPercentage: json['minimumPercentage'],
      entranceExam: json['entranceExam'],
    );
  }
}

class Ratings {
  final double overall;
  final double? placement;
  final double? infrastructure;
  final double? faculty;

  Ratings({
    required this.overall,
    this.placement,
    this.infrastructure,
    this.faculty,
  });

  factory Ratings.fromJson(Map<String, dynamic> json) {
    return Ratings(
      overall: (json['overall'] ?? 0).toDouble(),
      placement: json['placement']?.toDouble(),
      infrastructure: json['infrastructure']?.toDouble(),
      faculty: json['faculty']?.toDouble(),
    );
  }
}

class PlacementStats {
  final int? averagePackage;
  final int? highestPackage;
  final double? placementPercentage;
  final List<String>? topRecruiters;

  PlacementStats({
    this.averagePackage,
    this.highestPackage,
    this.placementPercentage,
    this.topRecruiters,
  });

  factory PlacementStats.fromJson(Map<String, dynamic> json) {
    return PlacementStats(
      averagePackage: json['averagePackage'],
      highestPackage: json['highestPackage'],
      placementPercentage: json['placementPercentage']?.toDouble(),
      topRecruiters: json['topRecruiters']?.cast<String>(),
    );
  }
}
