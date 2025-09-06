import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:fluttertoast/fluttertoast.dart';
import '../../providers/assessment_provider.dart';
import '../../models/assessment_model.dart';
import '../../widgets/loading_widget.dart';
import '../../widgets/custom_button.dart';
import 'result_screen.dart';

class AssessmentScreen extends StatefulWidget {
  final String assessmentId;

  const AssessmentScreen({
    super.key,
    required this.assessmentId,
  });

  @override
  State<AssessmentScreen> createState() => _AssessmentScreenState();
}

class _AssessmentScreenState extends State<AssessmentScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _startAssessment();
    });
  }

  Future<void> _startAssessment() async {
    final provider = Provider.of<AssessmentProvider>(context, listen: false);
    final success = await provider.startAssessment(widget.assessmentId);
    
    if (!success && mounted) {
      Fluttertoast.showToast(
        msg: provider.error ?? 'Failed to start assessment',
        backgroundColor: Colors.red,
        textColor: Colors.white,
      );
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Assessment'),
        leading: IconButton(
          icon: const Icon(Icons.close),
          onPressed: () => _showExitDialog(),
        ),
      ),
      body: Consumer<AssessmentProvider>(
        builder: (context, provider, _) {
          if (provider.isLoading || provider.currentSession == null) {
            return const LoadingWidget(message: 'Loading assessment...');
          }

          if (provider.currentResult != null) {
            return ResultScreen(result: provider.currentResult!);
          }

          return Column(
            children: [
              _buildProgressBar(provider),
              Expanded(
                child: _buildQuestionCard(provider),
              ),
              _buildNavigationBar(provider),
            ],
          );
        },
      ),
    );
  }

  Widget _buildProgressBar(AssessmentProvider provider) {
    return Container(
      padding: const EdgeInsets.all(16),
      color: Colors.grey[50],
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Question ${provider.currentQuestionIndex + 1} of ${provider.totalQuestions}',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Text(
                '${(provider.progress * 100).toInt()}%',
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: Colors.blue,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          LinearProgressIndicator(
            value: provider.progress,
            backgroundColor: Colors.grey[300],
            valueColor: AlwaysStoppedAnimation(
              Theme.of(context).primaryColor,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuestionCard(AssessmentProvider provider) {
    final question = provider.getCurrentQuestion();
    if (question == null) return const SizedBox.shrink();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                question.question,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 20),
              _buildAnswerOptions(question, provider),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildAnswerOptions(Question question, AssessmentProvider provider) {
    switch (question.type) {
      case 'multiple_choice':
        return _buildMultipleChoice(question, provider);
      case 'rating':
        return _buildRatingScale(question, provider);
      case 'boolean':
        return _buildBooleanOptions(question, provider);
      default:
        return const Text('Question type not supported');
    }
  }

  Widget _buildMultipleChoice(Question question, AssessmentProvider provider) {
    if (question.options == null) return const SizedBox.shrink();

    return Column(
      children: question.options!.map((option) {
        // Fix: Use the getter method instead of accessing private member
        final isSelected = provider.getCurrentResponse(question.id) == option.value;

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          child: InkWell(
            onTap: () {
              provider.answerQuestion(question.id, option.value);
            },
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border.all(
                  color: isSelected
                      ? Theme.of(context).primaryColor
                      : Colors.grey[300]!,
                  width: isSelected ? 2 : 1,
                ),
                borderRadius: BorderRadius.circular(12),
                color: isSelected
                    ? Theme.of(context).primaryColor.withOpacity(0.1)
                    : null,
              ),
              child: Row(
                children: [
                  Icon(
                    isSelected
                        ? Icons.radio_button_checked
                        : Icons.radio_button_unchecked,
                    color: isSelected
                        ? Theme.of(context).primaryColor
                        : Colors.grey,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      option.text,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: isSelected
                            ? FontWeight.w500
                            : FontWeight.normal,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildRatingScale(Question question, AssessmentProvider provider) {
    final currentRating = provider.getCurrentResponse(question.id) as int?;

    return Column(
      children: [
        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Strongly Disagree'),
            Text('Strongly Agree'),
          ],
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: List.generate(5, (index) {
            final rating = index + 1;
            final isSelected = currentRating == rating;

            return InkWell(
              onTap: () {
                provider.answerQuestion(question.id, rating);
              },
              child: Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isSelected
                      ? Theme.of(context).primaryColor
                      : Colors.grey[200],
                  border: Border.all(
                    color: isSelected
                        ? Theme.of(context).primaryColor
                        : Colors.grey[400]!,
                  ),
                ),
                child: Center(
                  child: Text(
                    rating.toString(),
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: isSelected ? Colors.white : Colors.grey[700],
                    ),
                  ),
                ),
              ),
            );
          }),
        ),
      ],
    );
  }

  Widget _buildBooleanOptions(Question question, AssessmentProvider provider) {
    final currentAnswer = provider.getCurrentResponse(question.id) as bool?;

    return Row(
      children: [
        Expanded(
          child: _buildBooleanOption(
            'Yes',
            true,
            currentAnswer == true,
            () => provider.answerQuestion(question.id, true),
          ),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildBooleanOption(
            'No',
            false,
            currentAnswer == false,
            () => provider.answerQuestion(question.id, false),
          ),
        ),
      ],
    );
  }

  Widget _buildBooleanOption(
    String text,
    bool value,
    bool isSelected,
    VoidCallback onTap,
  ) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          border: Border.all(
            color: isSelected
                ? Theme.of(context).primaryColor
                : Colors.grey[300]!,
            width: isSelected ? 2 : 1,
          ),
          borderRadius: BorderRadius.circular(12),
          color: isSelected
              ? Theme.of(context).primaryColor.withOpacity(0.1)
              : null,
        ),
        child: Center(
          child: Text(
            text,
            style: TextStyle(
              fontSize: 16,
              fontWeight: isSelected ? FontWeight.w500 : FontWeight.normal,
              color: isSelected
                  ? Theme.of(context).primaryColor
                  : Colors.grey[700],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildNavigationBar(AssessmentProvider provider) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.grey.withOpacity(0.2),
            spreadRadius: 1,
            blurRadius: 4,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: Row(
        children: [
          if (provider.currentQuestionIndex > 0)
            Expanded(
              child: OutlinedButton(
                onPressed: () => provider.previousQuestion(),
                child: const Text('Previous'),
              ),
            ),
          if (provider.currentQuestionIndex > 0)
            const SizedBox(width: 16),
          Expanded(
            child: CustomButton(
              text: provider.currentQuestionIndex == provider.totalQuestions - 1
                  ? 'Submit Assessment'
                  : 'Next',
              onPressed: provider.isCurrentQuestionAnswered()
                  ? () => _handleNext(provider)
                  : null,
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _handleNext(AssessmentProvider provider) async {
    if (provider.currentQuestionIndex == provider.totalQuestions - 1) {
      // Submit assessment
      final success = await provider.submitAssessment();
      if (!success && mounted) {
        Fluttertoast.showToast(
          msg: provider.error ?? 'Failed to submit assessment',
          backgroundColor: Colors.red,
          textColor: Colors.white,
        );
      }
    } else {
      // Next question
      provider.nextQuestion();
    }
  }

  Future<void> _showExitDialog() async {
    final shouldExit = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Exit Assessment?'),
        content: const Text(
          'Are you sure you want to exit? Your progress will be lost.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Exit'),
          ),
        ],
      ),
    );
    
    if (shouldExit == true && mounted) {
      Provider.of<AssessmentProvider>(context, listen: false).resetAssessment();
      context.pop();
    }
  }
}
