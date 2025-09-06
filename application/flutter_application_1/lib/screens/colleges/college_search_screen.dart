import 'package:flutter/material.dart';
import '../../models/college_model.dart';
import '../../services/api_service.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/custom_text_field.dart';

class CollegeSearchScreen extends StatefulWidget {
  const CollegeSearchScreen({super.key});

  @override
  State<CollegeSearchScreen> createState() => _CollegeSearchScreenState();
}

class _CollegeSearchScreenState extends State<CollegeSearchScreen> {
  final ApiService _apiService = ApiService();
  final _searchController = TextEditingController();

  List<College> _colleges = [];
  bool _isLoading = false;
  String? _error;
  String? _selectedState;
  String? _selectedType;
  double _maxFees = 500000;

  final List<String> _states = [
    'Delhi',
    'Maharashtra',
    'Karnataka',
    'Tamil Nadu',
    'Uttar Pradesh',
    'West Bengal',
    'Rajasthan',
    'Gujarat',
    'Andhra Pradesh',
    'Kerala',
  ];

  final List<String> _collegeTypes = [
    'Government',
    'Private',
    'Deemed',
    'Central',
  ];

  @override
  void initState() {
    super.initState();
    _searchColleges();
  }

  Future<void> _searchColleges() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final queryParams = <String, String>{'limit': '20'};

      if (_selectedState != null) {
        queryParams['state'] = _selectedState!;
      }

      if (_selectedType != null) {
        queryParams['type'] = _selectedType!;
      }

      if (_maxFees < 500000) {
        queryParams['maxFees'] = _maxFees.toInt().toString();
      }

      if (_searchController.text.isNotEmpty) {
        queryParams['course'] = _searchController.text;
      }

      final response = await _apiService.get<Map<String, dynamic>>(
        '/colleges/search',
        queryParams: queryParams,
        fromJsonT: (data) => data as Map<String, dynamic>,
        includeAuth: false,
      );

      if (response.success && response.data != null) {
        final collegesData = response.data!['colleges'] as List;
        setState(() {
          _colleges = collegesData
              .map((json) => College.fromJson(json))
              .toList();
          _isLoading = false;
        });
      } else {
        setState(() {
          _error = response.message;
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _error = 'Failed to search colleges: $e';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('College Search'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: () => _showFilterDialog(),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildSearchBar(),
          Expanded(child: _buildCollegeList()),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.grey[50],
      child: CustomTextField(
        controller: _searchController,
        labelText: 'Search courses...',
        prefixIcon: Icons.search,
        suffixIcon: IconButton(
          icon: const Icon(Icons.clear),
          onPressed: () {
            _searchController.clear();
            _searchColleges();
          },
        ),
      ),
    );
  }

  Widget _buildCollegeList() {
    if (_isLoading) {
      return const LoadingWidget(message: 'Searching colleges...');
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 64, color: Colors.red[300]),
            const SizedBox(height: 16),
            Text(_error!, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            ElevatedButton(
              onPressed: _searchColleges,
              child: const Text('Retry'),
            ),
          ],
        ),
      );
    }

    if (_colleges.isEmpty) {
      return const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.school_outlined, size: 64, color: Colors.grey),
            SizedBox(height: 16),
            Text('No colleges found', style: TextStyle(fontSize: 16)),
            Text('Try adjusting your search criteria'),
          ],
        ),
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

  Widget _buildCollegeCard(College college) {
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
                    college.name,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                _buildRatingChip(college.ratings.overall),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(Icons.location_on, size: 16, color: Colors.grey[600]),
                const SizedBox(width: 4),
                Text(
                  '${college.location.city}, ${college.location.state}',
                  style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                ),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.blue[100],
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    college.type,
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.blue[700],
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            if (college.courses.isNotEmpty) ...[
              Text(
                'Popular Courses:',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                  color: Colors.grey[700],
                ),
              ),
              const SizedBox(height: 4),
              Wrap(
                spacing: 8,
                runSpacing: 4,
                children: college.courses.take(3).map((course) {
                  return Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.green[100],
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      course.name,
                      style: TextStyle(fontSize: 12, color: Colors.green[700]),
                    ),
                  );
                }).toList(),
              ),
            ],
            if (college.placementStats != null) ...[
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.work, size: 16, color: Colors.grey[600]),
                  const SizedBox(width: 4),
                  Text(
                    'Avg Package: ₹${_formatAmount(college.placementStats!.averagePackage ?? 0)}',
                    style: TextStyle(fontSize: 14, color: Colors.grey[600]),
                  ),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildRatingChip(double rating) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: _getRatingColor(rating),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.star, size: 14, color: Colors.white),
          const SizedBox(width: 4),
          Text(
            rating.toStringAsFixed(1),
            style: const TextStyle(
              fontSize: 12,
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Color _getRatingColor(double rating) {
    if (rating >= 4.5) return Colors.green;
    if (rating >= 4.0) return Colors.orange;
    if (rating >= 3.5) return Colors.amber;
    return Colors.red;
  }

  String _formatAmount(int amount) {
    if (amount >= 100000) {
      return '${(amount / 100000).toStringAsFixed(1)}L';
    }
    return '${(amount / 1000).toStringAsFixed(0)}K';
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Colleges'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                initialValue: _selectedState,
                decoration: const InputDecoration(labelText: 'State'),
                items: [
                  const DropdownMenuItem(
                    value: null,
                    child: Text('All States'),
                  ),
                  ..._states.map(
                    (state) =>
                        DropdownMenuItem(value: state, child: Text(state)),
                  ),
                ],
                onChanged: (value) => setState(() => _selectedState = value),
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                initialValue: _selectedType,
                decoration: const InputDecoration(labelText: 'College Type'),
                items: [
                  const DropdownMenuItem(value: null, child: Text('All Types')),
                  ..._collegeTypes.map(
                    (type) => DropdownMenuItem(value: type, child: Text(type)),
                  ),
                ],
                onChanged: (value) => setState(() => _selectedType = value),
              ),
              const SizedBox(height: 16),
              Text('Max Fees: ₹${_formatAmount(_maxFees.toInt())}'),
              Slider(
                value: _maxFees,
                min: 0,
                max: 500000,
                divisions: 10,
                onChanged: (value) => setState(() => _maxFees = value),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(context).pop();
              _searchColleges();
            },
            child: const Text('Apply'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }
}
