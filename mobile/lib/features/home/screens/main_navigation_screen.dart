import 'package:flutter/material.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../discovery/screens/discover_screen.dart';
import '../../requests/screens/requests_screen.dart';
import '../../matches/screens/matches_screen.dart';
import '../../settings/screens/profile_settings_screen.dart';

/// Navigation item model
class NavigationTab {
  final String label;
  final IconData icon;
  final IconData activeIcon;

  const NavigationTab({
    required this.label,
    required this.icon,
    required this.activeIcon,
  });
}

/// Persistent 4-Tab Bottom Navigation matching reference designs.
class MainNavigationScreen extends StatefulWidget {
  final int initialIndex;

  const MainNavigationScreen({super.key, this.initialIndex = 0});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  late int _currentIndex;

  final List<NavigationTab> _tabs = const [
    NavigationTab(
      label: 'Home',
      icon: Icons.home_outlined,
      activeIcon: Icons.home_rounded,
    ),
    NavigationTab(
      label: 'Requests',
      icon: Icons.mail_outline_rounded,
      activeIcon: Icons.mark_email_unread_rounded,
    ),
    NavigationTab(
      label: 'Matches',
      icon: Icons.favorite_outline_rounded,
      activeIcon: Icons.favorite_rounded,
    ),
    NavigationTab(
      label: 'Profile',
      icon: Icons.person_outline_rounded,
      activeIcon: Icons.person_rounded,
    ),
  ];

  @override
  void initState() {
    super.initState();
    _currentIndex = widget.initialIndex;
  }

  void _onTabSelected(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: const [
          DiscoverScreen(),
          RequestsScreen(),
          MatchesScreen(),
          ProfileSettingsScreen(),
        ],
      ),
      bottomNavigationBar: Container(
        height: 72,
        decoration: BoxDecoration(
          color: AppColors.surface,
          boxShadow: AppSpacing.bottomNavShadow,
          border: const Border(
            top: BorderSide(color: AppColors.border, width: 1),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: List.generate(_tabs.length, (index) {
            final tab = _tabs[index];
            final isSelected = _currentIndex == index;

            return Expanded(
              child: InkWell(
                onTap: () => _onTabSelected(index),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      isSelected ? tab.activeIcon : tab.icon,
                      color: isSelected ? AppColors.primary : AppColors.textSecondary,
                      size: 24,
                    ),
                    const SizedBox(height: 4),
                    Text(
                      tab.label,
                      style: AppTypography.caption.copyWith(
                        color: isSelected ? AppColors.primary : AppColors.textSecondary,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ),
      ),
    );
  }
}
