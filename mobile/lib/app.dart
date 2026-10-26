import 'package:flutter/material.dart';
import 'core/routing/app_routes.dart';
import 'core/theme/app_theme.dart';
import 'features/onboarding/screens/splash_screen.dart';
import 'features/onboarding/screens/welcome_screen.dart';
import 'features/authentication/screens/login_screen.dart';
import 'features/authentication/screens/register_screen.dart';
import 'features/profile/screens/profile_setup_screen.dart';
import 'features/preferences/screens/preferences_setup_screen.dart';
import 'features/home/screens/main_navigation_screen.dart';
import 'features/discovery/screens/profile_detail_screen.dart';
import 'shared/models/candidate_profile.dart';

/// Main LivSync Application Widget configuring themes and route tables.
class LivSyncApp extends StatelessWidget {
  const LivSyncApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LivSync',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      initialRoute: AppRoutes.splash,
      routes: {
        AppRoutes.splash: (context) => const SplashScreen(),
        AppRoutes.welcome: (context) => const WelcomeScreen(),
        AppRoutes.login: (context) => const LoginScreen(),
        AppRoutes.register: (context) => const RegisterScreen(),
        AppRoutes.profileSetup: (context) => const ProfileSetupScreen(),
        AppRoutes.preferencesSetup: (context) => const PreferencesSetupScreen(),
        AppRoutes.mainNavigation: (context) => const MainNavigationScreen(),
      },
      onGenerateRoute: (settings) {
        if (settings.name == AppRoutes.profileDetail) {
          final candidate = settings.arguments as CandidateProfile;
          return MaterialPageRoute(
            builder: (context) => ProfileDetailScreen(candidate: candidate),
          );
        }
        return null;
      },
    );
  }
}
