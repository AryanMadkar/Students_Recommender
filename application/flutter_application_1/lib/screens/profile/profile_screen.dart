import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:fluttertoast/fluttertoast.dart';
import '../../providers/auth_provider.dart';
import '../../providers/user_provider.dart';
import '../../models/user_model.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/loading_widget.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _cityController = TextEditingController();
  final _stateController = TextEditingController();
  final _class10PercentageController = TextEditingController();
  final _class12PercentageController = TextEditingController();
  final _collegeController = TextEditingController();
  final _cgpaController = TextEditingController();

  String? _selectedEducationStage;
  String? _selectedStream;
  int? _selectedYear;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  void _loadUserData() {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final user = authProvider.user;

    if (user != null) {
      _nameController.text = user.personalInfo.name;
      _phoneController.text = user.personalInfo.phone ?? '';
      _cityController.text = user.personalInfo.city ?? '';
      _stateController.text = user.personalInfo.state ?? '';
      _selectedEducationStage = user.educationStage;

      if (user.academicInfo?.class10?.percentage != null) {
        _class10PercentageController.text = user
            .academicInfo!
            .class10!
            .percentage
            .toString();
      }

      if (user.academicInfo?.class12?.percentage != null) {
        _class12PercentageController.text = user
            .academicInfo!
            .class12!
            .percentage
            .toString();
        _selectedStream = user.academicInfo!.class12!.stream;
      }

      if (user.academicInfo?.currentCourse != null) {
        _collegeController.text =
            user.academicInfo!.currentCourse!.college ?? '';
        if (user.academicInfo!.currentCourse!.cgpa != null) {
          _cgpaController.text = user.academicInfo!.currentCourse!.cgpa
              .toString();
        }
        _selectedYear = user.academicInfo!.currentCourse!.year;
      }
    }
  }

  Future<void> _saveProfile() async {
    if (_formKey.currentState!.validate()) {
      final userProvider = Provider.of<UserProvider>(context, listen: false);

      final personalInfo = PersonalInfo(
        name: _nameController.text.trim(),
        email: Provider.of<AuthProvider>(
          context,
          listen: false,
        ).user!.personalInfo.email,
        phone: _phoneController.text.trim(),
        city: _cityController.text.trim(),
        state: _stateController.text.trim(),
      );

      AcademicInfo? academicInfo;
      if (_class10PercentageController.text.isNotEmpty ||
          _class12PercentageController.text.isNotEmpty ||
          _collegeController.text.isNotEmpty) {
        ClassInfo? class10;
        if (_class10PercentageController.text.isNotEmpty) {
          class10 = ClassInfo(
            percentage: double.tryParse(_class10PercentageController.text),
          );
        }

        ClassInfo? class12;
        if (_class12PercentageController.text.isNotEmpty) {
          class12 = ClassInfo(
            percentage: double.tryParse(_class12PercentageController.text),
            stream: _selectedStream,
          );
        }

        CurrentCourse? currentCourse;
        if (_collegeController.text.isNotEmpty) {
          currentCourse = CurrentCourse(
            college: _collegeController.text.trim(),
            cgpa: double.tryParse(_cgpaController.text),
            year: _selectedYear,
          );
        }

        academicInfo = AcademicInfo(
          class10: class10,
          class12: class12,
          currentCourse: currentCourse,
        );
      }

      final success = await userProvider.updateProfile(
        personalInfo: personalInfo,
        academicInfo: academicInfo,
      );

      if (success) {
        Fluttertoast.showToast(
          msg: 'Profile updated successfully!',
          backgroundColor: Colors.green,
          textColor: Colors.white,
        );

        // Update auth provider user
        final authProvider = Provider.of<AuthProvider>(context, listen: false);
        if (userProvider.user != null) {
          await authProvider.updateUser(userProvider.user!);
        }
      } else {
        Fluttertoast.showToast(
          msg: userProvider.error ?? 'Failed to update profile',
          backgroundColor: Colors.red,
          textColor: Colors.white,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Profile'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              final authProvider = Provider.of<AuthProvider>(
                context,
                listen: false,
              );
              await authProvider.logout();
            },
          ),
        ],
      ),
      body: Consumer2<UserProvider, AuthProvider>(
        builder: (context, userProvider, authProvider, _) {
          if (userProvider.isLoading) {
            return const LoadingWidget(message: 'Updating profile...');
          }

          return Form(
            key: _formKey,
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildSectionHeader('Personal Information'),
                  CustomTextField(
                    controller: _nameController,
                    labelText: 'Full Name',
                    prefixIcon: Icons.person,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter your name';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    controller: TextEditingController(
                      text: authProvider.user?.personalInfo.email ?? '',
                    ),
                    labelText: 'Email',
                    prefixIcon: Icons.email,
                    enabled: false,
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    controller: _phoneController,
                    labelText: 'Phone Number',
                    prefixIcon: Icons.phone,
                    keyboardType: TextInputType.phone,
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    controller: _cityController,
                    labelText: 'City',
                    prefixIcon: Icons.location_city,
                  ),
                  const SizedBox(height: 16),
                  CustomTextField(
                    controller: _stateController,
                    labelText: 'State',
                    prefixIcon: Icons.location_on,
                  ),

                  const SizedBox(height: 24),
                  _buildSectionHeader('Academic Information'),

                  if (_selectedEducationStage != 'after10th') ...[
                    CustomTextField(
                      controller: _class10PercentageController,
                      labelText: '10th Grade Percentage',
                      prefixIcon: Icons.school,
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: 16),
                  ],

                  if (_selectedEducationStage == 'after12th' ||
                      _selectedEducationStage == 'ongoing') ...[
                    DropdownButtonFormField<String>(
                      initialValue: _selectedStream,
                      decoration: const InputDecoration(
                        labelText: '12th Grade Stream',
                        prefixIcon: Icon(Icons.category),
                      ),
                      items: ['Science', 'Commerce', 'Arts'].map((stream) {
                        return DropdownMenuItem(
                          value: stream,
                          child: Text(stream),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedStream = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _class12PercentageController,
                      labelText: '12th Grade Percentage',
                      prefixIcon: Icons.school,
                      keyboardType: TextInputType.number,
                    ),
                    const SizedBox(height: 16),
                  ],

                  if (_selectedEducationStage == 'ongoing') ...[
                    CustomTextField(
                      controller: _collegeController,
                      labelText: 'College/University',
                      prefixIcon: Icons.account_balance,
                    ),
                    const SizedBox(height: 16),
                    DropdownButtonFormField<int>(
                      initialValue: _selectedYear,
                      decoration: const InputDecoration(
                        labelText: 'Current Year',
                        prefixIcon: Icon(Icons.calendar_today),
                      ),
                      items: [1, 2, 3, 4].map((year) {
                        return DropdownMenuItem(
                          value: year,
                          child: Text('$year${_getOrdinalSuffix(year)} Year'),
                        );
                      }).toList(),
                      onChanged: (value) {
                        setState(() {
                          _selectedYear = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    CustomTextField(
                      controller: _cgpaController,
                      labelText: 'CGPA/Percentage',
                      prefixIcon: Icons.grade,
                      keyboardType: TextInputType.number,
                    ),
                  ],

                  const SizedBox(height: 32),
                  CustomButton(
                    text: 'Save Profile',
                    onPressed: _saveProfile,
                    isLoading: userProvider.isLoading,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Text(
        title,
        style: const TextStyle(
          fontSize: 18,
          fontWeight: FontWeight.bold,
          color: Color(0xFF2196F3),
        ),
      ),
    );
  }

  String _getOrdinalSuffix(int number) {
    if (number >= 11 && number <= 13) return 'th';
    switch (number % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _cityController.dispose();
    _stateController.dispose();
    _class10PercentageController.dispose();
    _class12PercentageController.dispose();
    _collegeController.dispose();
    _cgpaController.dispose();
    super.dispose();
  }
}
