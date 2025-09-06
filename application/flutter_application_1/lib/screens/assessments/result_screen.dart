
import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:go_router/go_router.dart';
import '../../models/assessment_model.dart';
import '../../widgets/custom_button.dart';

class ResultScreen extends StatelessWidget {
  final AssessmentResult result;

  const ResultScreen({
    super.key,
    required this.result,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Assessment Results'),
        automaticallyImplyLeading: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildOverallScore(),
            const SizedBox(height: 24),
            _buildScoreChart(),
            const SizedBox(height: 24),
            if (result.analysis != null) ...[
              _buildAnalysis(),
              const SizedBox(height: 24),
            ],
            _buildActionButtons(context),
          ],
        ),
      ),
    );
  }

  Widget _buildOverallScore() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            const Text(
              'Overall Score',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 12),
            Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _getScoreColor(result.scores.overall),
              ),
              child: Center(
                child: Text(
                  '${result.scores.overall}%',
                  style: const TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              _getScoreDescription(result.scores.overall),
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey[600],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildScoreChart() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Detailed Scores',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(height: 20),
            SizedBox(
              height: 200,
              child: BarChart(
                BarChartData(
                  alignment: BarChartAlignment.spaceAround,
                  maxY: 100,
                  barTouchData: BarTouchData(enabled: false),
                  titlesData: FlTitlesData(
                    show: true,
                    bottomTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        getTitlesWidget: (value, meta) {
                          final categories = result.scores.toMap();
                          final keys = categories.keys.toList();
                          if (value.toInt() < keys.length) {
                            return Padding(
                              padding: const EdgeInsets.only(top: 8),
                              child: Text(
                                keys[value.toInt()],
                                style: const TextStyle(fontSize: 12),
                              ),
                            );
                          }
                          return const Text('');
                        },
                      ),
                    ),
                    leftTitles: AxisTitles(
                      sideTitles: SideTitles(
                        showTitles: true,
                        reservedSize: 40,
                        getTitlesWidget: (value, meta) {
                          return Text(
                            value.toInt().toString(),
                            style: const TextStyle(fontSize: 12),
                          );
                        },
                      ),
                    ),
                    topTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                    rightTitles: const AxisTitles(
                      sideTitles: SideTitles(showTitles: false),
                    ),
                  ),
                  borderData: FlBorderData(show: false),
                  barGroups: _buildBarGroups(),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  List<BarChartGroupData> _buildBarGroups() {
    final scores = result.scores.toMap();
    final entries = scores.entries.toList();
    
    return entries.asMap().entries.map((entry) {
      final index = entry.key;
      final score = entry.value.value;
      
      return BarChartGroupData(
        x: index,
        barRods: [
          BarChartRodData(
            toY: score.toDouble(),
            color: _getScoreColor(score),
            width: 20,
            borderRadius: const BorderRadius.vertical(
              top: Radius.circular(4),
            ),
          ),
        ],
      );
    }).toList();
  }

  Widget _buildAnalysis() {
    final analysis = result.analysis!;
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (analysis.strengths.isNotEmpty) ...[
          _buildAnalysisSection(
            'Strengths',
            analysis.strengths,
            Colors.green[100]!,
            Colors.green[700]!,
            Icons.trending_up,
          ),
          const SizedBox(height: 16),
        ],
        if (analysis.weaknesses.isNotEmpty) ...[
          _buildAnalysisSection(
            'Areas for Improvement',
            analysis.weaknesses,
            Colors.orange[100]!,
            Colors.orange[700]!,
            Icons.trending_down,
          ),
          const SizedBox(height: 16),
        ],
        if (analysis.recommendations.isNotEmpty) ...[
          _buildAnalysisSection(
            'Recommendations',
            analysis.recommendations,
            Colors.blue[100]!,
            Colors.blue[700]!,
            Icons.lightbulb_outline,
          ),
          const SizedBox(height: 16),
        ],
        if (analysis.learningStyle.isNotEmpty) ...[
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Icon(
                    Icons.psychology,
                    color: Colors.purple[700],
                    size: 24,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Learning Style',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w500,
                            color: Colors.purple[700],
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          analysis.learningStyle,
                          style: const TextStyle(fontSize: 14),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildAnalysisSection(
    String title,
    List<String> items,
    Color backgroundColor,
    Color iconColor,
    IconData icon,
  ) {
    return Card(
      color: backgroundColor,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: iconColor, size: 24),
                const SizedBox(width: 8),
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w500,
                    color: iconColor,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ...items.map((item) => Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '• ',
                    style: TextStyle(
                      fontSize: 16,
                      color: iconColor,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Expanded(
                    child: Text(
                      item,
                      style: const TextStyle(fontSize: 14),
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

  Widget _buildActionButtons(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        CustomButton(
          text: 'Get Recommendations',
          onPressed: () {
            context.go('/recommendations');
          },
        ),
        const SizedBox(height: 12),
        OutlinedButton(
          onPressed: () {
            context.go('/home');
          },
          child: const Text('Back to Home'),
        ),
      ],
    );
  }

  Color _getScoreColor(int score) {
    if (score >= 80) return Colors.green;
    if (score >= 60) return Colors.orange;
    return Colors.red;
  }

  String _getScoreDescription(int score) {
    if (score >= 80) return 'Excellent Performance!';
    if (score >= 60) return 'Good Performance';
    if (score >= 40) return 'Average Performance';
    return 'Needs Improvement';
  }
}
