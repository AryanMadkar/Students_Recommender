import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'providers/auth_provider.dart';
import 'providers/assessment_provider.dart';
import 'providers/user_provider.dart';
import 'screens/splash_screen.dart';
import 'screens/auth/login_screen.dart';
import 'screens/auth/register_screen.dart';
import 'screens/home/home_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/assessments/assessment_list_screen.dart';
import 'screens/assessments/assessment_screen.dart';
import 'screens/colleges/college_search_screen.dart';
import 'screens/recommendations/recommendations_screen.dart';
import 'utils/themes.dart';

void main() {
  runApp(const PathPilotApp());
}

class PathPilotApp extends StatelessWidget {
  const PathPilotApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => AssessmentProvider()),
        ChangeNotifierProvider(create: (_) => UserProvider()),
      ],
      child: Consumer<AuthProvider>(
        builder: (context, authProvider, _) {
          return MaterialApp.router(
            title: 'PathPilot',
            theme: AppThemes.lightTheme,
            routerConfig: _createRouter(authProvider),
            debugShowCheckedModeBanner: false,
          );
        },
      ),
    );
  }

  GoRouter _createRouter(AuthProvider authProvider) {
    return GoRouter(
      initialLocation: '/',
      redirect: (context, state) {
        final isLoggedIn = authProvider.isAuthenticated;
        final isLoggingIn =
            state.matchedLocation == '/login' ||
            state.matchedLocation == '/register';

        if (!isLoggedIn && !isLoggingIn) return '/login';
        if (isLoggedIn && isLoggingIn) return '/home';
        return null;
      },
      routes: [
        GoRoute(path: '/', builder: (context, state) => const SplashScreen()),
        GoRoute(
          path: '/login',
          builder: (context, state) => const LoginScreen(),
        ),
        GoRoute(
          path: '/register',
          builder: (context, state) => const RegisterScreen(),
        ),
        GoRoute(path: '/home', builder: (context, state) => const HomeScreen()),
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfileScreen(),
        ),
        GoRoute(
          path: '/assessments',
          builder: (context, state) => const AssessmentListScreen(),
        ),
        GoRoute(
          path: '/assessment/:id',
          builder: (context, state) =>
              AssessmentScreen(assessmentId: state.pathParameters['id']!),
        ),
        GoRoute(
          path: '/colleges',
          builder: (context, state) => const CollegeSearchScreen(),
        ),
        GoRoute(
          path: '/recommendations',
          builder: (context, state) => const RecommendationsScreen(),
        ),
      ],
    );
  }
}
