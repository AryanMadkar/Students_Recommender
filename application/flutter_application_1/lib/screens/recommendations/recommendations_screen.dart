import 'package:flutter/material.dart';
import '../../models/recommendation_model.dart';
import '../../services/api_service.dart';
import '../../widgets/loading_widget.dart';

class RecommendationsScreen extends StatefulWidget {
  const RecommendationsScreen({super.key});

  @override
  State<RecommendationsScreen> createState() => _RecommendationsScreenState();
}

class _RecommendationsScreenState extends State<RecommendationsScreen>
    with SingleTickerProviderStateMixin {
  
  late TabController _tabController;
  final ApiService _apiService = ApiService();
  
  List<CareerRecommendation> _careers = [];
  List<CollegeRecommendation> _colleges = [];
  SkillRoadmap? _roadmap;
  
  bool _isLoading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _loadRecommendations();
  }

  Future<void> _loadRecommendations() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      // Load career recommendations
      final careerResponse = await _apiService.get<List<dynamic>>(
        '/recommendations/careers',
        fromJsonT: (data) => data as List<dynamic>,
      );

      if (careerResponse.success && careerResponse.data != null) {
        _careers = careerResponse.data!
            .map((json) => CareerRecommendation.fromJson(json))
            .toList();
      }

      // Load college recommendations
      final collegeResponse = await _apiService.get<List<dynamic>>(
        '/recommendations/colleges',
        fromJsonT: (data) => data as List<dynamic>,
      );

      if (collegeResponse.success && collegeResponse.data != null) {
        _colleges = collegeResponse.data!
            .map((json) => CollegeRecommendation.fromJson(json))
            .toList();
      }

      // Load skill roadmap
      final roadmapResponse = await _apiService.get<Map<String, dynamic>>(
        '/recommendations/roadmap',
        fromJsonT: (data) => data as Map<String, dynamic>,
      );

      if (roadmapResponse.success && roadmapResponse.data != null) {
        _roadmap = SkillRoadmap.fromJson(roadmapResponse.data!);
      }

      setState(() {
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _error = 'Failed to load recommendations: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Recommendations'),
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Careers'),
            Tab(text: 'Colleges'),
            Tab(text: 'Skills'),
          ],
        ),
      ),
      body: _isLoading
          ? const LoadingWidget(message: 'Loading recommendations...')
          : _error != null
              ? _buildErrorWidget()
              : TabBarView(
                  controller: _tabController,
                  children: [
                    _buildCareersTab(),
                    _buildCollegesTab(),
                    _buildSkillsTab(),
                  ],
                ),
    );
  }

  Widget _buildErrorWidget() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 64, color: Colors.red[300]),
          const SizedBox(height: 16),
          Text(_error!, textAlign: TextAlign.center),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: _loadRecommendations,
            child: const Text('Retry'),
          ),
        ],
      ),
    );
  }

  Widget _buildCareersTab() {
    if (_careers.isEmpty) {
      return const Center(
        child: Text('No career recommendations available'),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _careers.length,
      itemBuilder: (context, index) {
        return _buildCareerCard(_careers[index]);
      },
    );
  }

  Widget _buildCareerCard(CareerRecommendation career) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    career.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                if (career.matchPercentage != null)
                  _buildMatchChip(career.matchPercentage!),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              career.description,
              style: TextStyle(
                fontSize: 14,
                color: Colors.grey[600],
              ),
            ),
            if (career.salaryRange != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.attach_money, size: 16, color: Colors.green[600]),
                  const SizedBox(width: 4),
                  Text(
                    career.salaryRange!,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.green[600],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildCollegesTab() {
    if (_colleges.isEmpty) {
      return const Center(
        child: Text('No college recommendations available'),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _colleges.length,
      itemBuilder: (context, index) {
        return _buildCollegeCard(_colleges[index]);
      },
    );
  }

  Widget _buildCollegeCard(CollegeRecommendation college) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    college.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                if (college.matchPercentage != null)
                  _buildMatchChip(college.matchPercentage!),
              ],
            ),
            if (college.location != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.location_on, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    college.location!,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ),
            ],
            if (college.fees != null) ...[
              const SizedBox(height: 8),
              Row(
                children: [
                  Icon(Icons.payment, size: 16, color: Colors.orange[600]),
                  const SizedBox(width: 4),
                  Text(
                    college.fees!,
                    style: TextStyle(
                      fontSize: 14,
                      color: Colors.orange[600],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildSkillsTab() {
    if (_roadmap == null) {
      return const Center(
        child: Text('No skill roadmap available'),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (_roadmap!.immediate.isNotEmpty) ...[
            _buildSkillSection(
              'Immediate (0-3 months)',
              _roadmap!.immediate,
              Colors.red[100]!,
              Colors.red[700]!,
            ),
            const SizedBox(height: 20),
          ],
          if (_roadmap!.shortTerm.isNotEmpty) ...[
            _buildSkillSection(
              'Short Term (3-6 months)',
              _roadmap!.shortTerm,
              Colors.orange[100]!,
              Colors.orange[700]!,
            ),
            const SizedBox(height: 20),
          ],
          if (_roadmap!.longTerm.isNotEmpty) ...[
            _buildSkillSection(
              'Long Term (6+ months)',
              _roadmap!.longTerm,
              Colors.green[100]!,
              Colors.green[700]!,
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildSkillSection(
    String title,
    List<SkillItem> skills,
    Color backgroundColor,
    Color textColor,
  ) {
    return Card(
      color: backgroundColor,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            const SizedBox(height: 12),
            ...skills.map((skill) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 6,
                    height: 6,
                    margin: const EdgeInsets.only(top: 6, right: 8),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: textColor,
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          skill.skill,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        if (skill.description != null) ...[
                          const SizedBox(height: 2),
                          Text(
                            skill.description!,
                            style: TextStyle(
                              fontSize: 12,
                              color: Colors.grey[700],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            )),
          ],
        ),
      ),
    );
  }

  Widget _buildMatchChip(int matchPercentage) {
    Color color;
    if (matchPercentage >= 80) {
      color = Colors.green;
    } else if (matchPercentage >= 60) {
      color = Colors.orange;
    } else {
      color = Colors.red;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        '$matchPercentage% Match',
        style: const TextStyle(
          fontSize: 12,
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }
}
