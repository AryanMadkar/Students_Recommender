import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:fluttertoast/fluttertoast.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_text_field.dart';
import '../../widgets/loading_widget.dart';
import '../../utils/constants.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  
  String _selectedStage = AppConstants.educationStages[0];
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  
  // Validation state
  Map<String, String> _errors = {};
  bool _isFormValid = false;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _validateForm() {
    Map<String, String> newErrors = {};

    // Name validation
    if (_nameController.text.trim().isEmpty) {
      newErrors['name'] = 'Name is required';
    } else if (_nameController.text.trim().length < 2) {
      newErrors['name'] = 'Name must be at least 2 characters';
    }

    // Email validation
    if (_emailController.text.trim().isEmpty) {
      newErrors['email'] = 'Email is required';
    } else if (!RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(_emailController.text)) {
      newErrors['email'] = 'Please enter a valid email address';
    }

    // Phone validation
    if (_phoneController.text.trim().isEmpty) {
      newErrors['phone'] = 'Phone number is required';
    } else if (!RegExp(r'^[6-9]\d{9}$').hasMatch(_phoneController.text)) {
      newErrors['phone'] = 'Please enter a valid 10-digit phone number';
    }

    // Password validation
    if (_passwordController.text.isEmpty) {
      newErrors['password'] = 'Password is required';
    } else if (_passwordController.text.length < 6) {
      newErrors['password'] = 'Password must be at least 6 characters';
    } else if (!RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)').hasMatch(_passwordController.text)) {
      newErrors['password'] = 'Password must contain uppercase, lowercase, and number';
    }

    // Confirm password validation
    if (_confirmPasswordController.text != _passwordController.text) {
      newErrors['confirmPassword'] = 'Passwords do not match';
    }

    setState(() {
      _errors = newErrors;
      _isFormValid = newErrors.isEmpty;
    });
  }

  void _onFieldChanged(String field) {
    // Clear error for specific field when user starts typing
    if (_errors.containsKey(field)) {
      setState(() {
        _errors.remove(field);
      });
    }
    // Validate form after a short delay
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) _validateForm();
    });
  }

  Future<void> _register() async {
    _validateForm();
    
    if (!_isFormValid) {
      Fluttertoast.showToast(
        msg: 'Please fix the errors below',
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
      return;
    }

    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    final error = await authProvider.register(
      name: _nameController.text.trim(),
      email: _emailController.text.trim(),
      password: _passwordController.text,
      phone: _phoneController.text.trim(),
      educationStage: _selectedStage,
    );

    if (error != null) {
      Fluttertoast.showToast(
        msg: error,
        toastLength: Toast.LENGTH_LONG,
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
    } else {
      Fluttertoast.showToast(
        msg: 'Registration successful!',
        backgroundColor: Colors.green,
        textColor: Colors.white,
      );
      if (mounted) {
        context.go('/home');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          if (authProvider.isLoading) {
            return const LoadingWidget();
          }

          return SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24.0),
              child: Form(
                key: _formKey,
                child: SingleChildScrollView(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      const SizedBox(height: 40),
                      const Icon(
                        Icons.school,
                        size: 80,
                        color: Color(0xFF2196F3),
                      ),
                      const SizedBox(height: 20),
                      const Text(
                        'Create Account',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        'Start your career journey today',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 40),

                      // Name Field
                      CustomTextField(
                        controller: _nameController,
                        labelText: 'Full Name',
                        prefixIcon: Icons.person,
                        onChanged: (value) => _onFieldChanged('name'),
                      ),
                      if (_errors['name'] != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          _errors['name']!,
                          style: const TextStyle(color: Colors.red, fontSize: 12),
                        ),
                      ],
                      const SizedBox(height: 16),

                      // Email Field
                      CustomTextField(
                        controller: _emailController,
                        labelText: 'Email',
                        prefixIcon: Icons.email,
                        keyboardType: TextInputType.emailAddress,
                        onChanged: (value) => _onFieldChanged('email'),
                      ),
                      if (_errors['email'] != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          _errors['email']!,
                          style: const TextStyle(color: Colors.red, fontSize: 12),
                        ),
                      ],
                      const SizedBox(height: 16),

                      // Phone Field
                      CustomTextField(
                        controller: _phoneController,
                        labelText: 'Phone Number',
                        prefixIcon: Icons.phone,
                        keyboardType: TextInputType.phone,
                        onChanged: (value) => _onFieldChanged('phone'),
                      ),
                      if (_errors['phone'] != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          _errors['phone']!,
                          style: const TextStyle(color: Colors.red, fontSize: 12),
                        ),
                      ],
                      const SizedBox(height: 16),

                      // Education Stage Dropdown
                      DropdownButtonFormField<String>(
                        initialValue: _selectedStage,
                        decoration: const InputDecoration(
                          labelText: 'Education Stage',
                          prefixIcon: Icon(Icons.school),
                        ),
                        items: AppConstants.educationStages.map((stage) {
                          return DropdownMenuItem(
                            value: stage,
                            child: Text(_formatStageName(stage)),
                          );
                        }).toList(),
                        onChanged: (value) {
                          setState(() {
                            _selectedStage = value!;
                          });
                        },
                      ),
                      const SizedBox(height: 16),

                      // Password Field
                      CustomTextField(
                        controller: _passwordController,
                        labelText: 'Password',
                        prefixIcon: Icons.lock,
                        obscureText: _obscurePassword,
                        onChanged: (value) => _onFieldChanged('password'),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscurePassword ? Icons.visibility : Icons.visibility_off,
                          ),
                          onPressed: () {
                            setState(() {
                              _obscurePassword = !_obscurePassword;
                            });
                          },
                        ),
                      ),
                      if (_errors['password'] != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          _errors['password']!,
                          style: const TextStyle(color: Colors.red, fontSize: 12),
                        ),
                      ],
                      const SizedBox(height: 16),

                      // Confirm Password Field
                      CustomTextField(
                        controller: _confirmPasswordController,
                        labelText: 'Confirm Password',
                        prefixIcon: Icons.lock,
                        obscureText: _obscureConfirmPassword,
                        onChanged: (value) => _onFieldChanged('confirmPassword'),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscureConfirmPassword ? Icons.visibility : Icons.visibility_off,
                          ),
                          onPressed: () {
                            setState(() {
                              _obscureConfirmPassword = !_obscureConfirmPassword;
                            });
                          },
                        ),
                      ),
                      if (_errors['confirmPassword'] != null) ...[
                        const SizedBox(height: 4),
                        Text(
                          _errors['confirmPassword']!,
                          style: const TextStyle(color: Colors.red, fontSize: 12),
                        ),
                      ],
                      const SizedBox(height: 24),

                      // Register Button
                      CustomButton(
                        text: 'Create Account',
                        onPressed: _register,
                      ),
                      const SizedBox(height: 16),

                      // Login Link
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('Already have an account? '),
                          TextButton(
                            onPressed: () => context.go('/login'),
                            child: const Text('Sign In'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  String _formatStageName(String stage) {
    switch (stage) {
      case 'after10th':
        return 'After 10th Grade';
      case 'after12th':
        return 'After 12th Grade';
      case 'ongoing':
        return 'Current Student';
      default:
        return stage;
    }
  }
}
