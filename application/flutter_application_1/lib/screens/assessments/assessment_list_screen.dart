import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../providers/assessment_provider.dart';
import '../../models/assessment_model.dart'; // Add import for Assessment
import '../../widgets/loading_widget.dart';

class AssessmentListScreen extends StatefulWidget {
  const AssessmentListScreen({super.key});

  @override
  State<AssessmentListScreen> createState() => _AssessmentListScreenState();
}

class _AssessmentListScreenState extends State<AssessmentListScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<AssessmentProvider>(context, listen: false).loadAssessments();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Assessments')),
      body: Consumer<AssessmentProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading) {
            return const LoadingWidget(message: 'Loading assessments...');
          }

          if (provider.error != null) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.error_outline, size: 64, color: Colors.red[300]),
                  const SizedBox(height: 16),
                  Text(
                    provider.error!,
                    style: const TextStyle(fontSize: 16),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  ElevatedButton(
                    onPressed: () => provider.loadAssessments(),
                    child: const Text('Retry'),
                  ),
                ],
              ),
            );
          }

          if (provider.assessments.isEmpty) {
            return const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.quiz_outlined, size: 64, color: Colors.grey),
                  SizedBox(height: 16),
                  Text(
                    'No assessments available',
                    style: TextStyle(fontSize: 16),
                  ),
                ],
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: provider.assessments.length,
            itemBuilder: (context, index) {
              final assessment = provider.assessments[index];
              return _buildAssessmentCard(context, assessment);
            },
          );
        },
      ),
    );
  }

  Widget _buildAssessmentCard(BuildContext context, Assessment assessment) {
    // Add type
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
                    assessment.title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                if (assessment.completed)
                  const Icon(Icons.check_circle, color: Colors.green),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              assessment.description,
              style: TextStyle(fontSize: 14, color: Colors.grey[600]),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                _buildInfoChip(
                  Icons.quiz,
                  '${assessment.questionCount} Questions',
                ),
                const SizedBox(width: 8),
                if (assessment.duration != null)
                  _buildInfoChip(Icons.timer, '${assessment.duration} mins'),
                const SizedBox(width: 8),
                _buildInfoChip(Icons.category, assessment.type.toUpperCase()),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: assessment.completed
                    ? null
                    : () => context.push('/assessment/${assessment.id}'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: assessment.completed
                      ? Colors.grey
                      : Theme.of(context).primaryColor,
                ),
                child: Text(
                  assessment.completed ? 'Completed' : 'Start Assessment',
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoChip(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.blue[50],
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: Colors.blue[700]),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Colors.blue[700],
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
