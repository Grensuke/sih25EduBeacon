class RiskAnalysisService {
  /**
   * Calculates the risk analysis for a student user
   * @param {Object} user - The user document
   * @returns {Object} The updated risk analysis object
   */
  static calculateRiskAnalysis(user) {
    if (user.role !== 'student') return null;

    const riskFactors = [];
    let attendanceRisk = 'low';
    let academicRisk = 'low';
    let financialRisk = 'low';

    // Attendance Risk Analysis
    const attendancePercentage = user.attendanceData?.percentage || 0;
    if (attendancePercentage < 60) {
      attendanceRisk = 'high';
      riskFactors.push('Critical attendance below 60%');
    } else if (attendancePercentage < 75) {
      attendanceRisk = 'medium';
      riskFactors.push('Low attendance below 75%');
    }

    // Academic Risk Analysis
    const gpa = user.academicData?.gpa || 0;
    const recentTests = user.academicData?.testResults?.slice(-3) || [];
    const recentAverage = recentTests.length > 0
      ? recentTests.reduce((sum, test) => sum + test.percentage, 0) / recentTests.length
      : 0;

    if (gpa < 2.0 || recentAverage < 50) {
      academicRisk = 'high';
      riskFactors.push('Poor academic performance (GPA < 2.0 or recent tests < 50%)');
    } else if (gpa < 2.5 || recentAverage < 65) {
      academicRisk = 'medium';
      riskFactors.push('Declining academic performance');
    }

    // Financial Risk Analysis
    const feeStatus = user.feeData?.paymentStatus || 'pending';
    const pendingAmount = user.feeData?.pendingAmount || 0;
    const dueDate = user.feeData?.dueDate;

    if (feeStatus === 'overdue' || (dueDate && new Date() > dueDate && pendingAmount > 0)) {
      financialRisk = 'high';
      riskFactors.push('Overdue fee payments');
    } else if (feeStatus === 'partial' || pendingAmount > 0) {
      financialRisk = 'medium';
      riskFactors.push('Pending fee payments');
    }

    // Overall Risk Calculation
    let overallRiskLevel = 'low';
    const highRiskCount = [attendanceRisk, academicRisk, financialRisk].filter(risk => risk === 'high').length;
    const mediumRiskCount = [attendanceRisk, academicRisk, financialRisk].filter(risk => risk === 'medium').length;

    if (highRiskCount >= 2) {
      overallRiskLevel = 'critical';
      riskFactors.push('Multiple high-risk factors detected');
    } else if (highRiskCount >= 1) {
      overallRiskLevel = 'high';
    } else if (mediumRiskCount >= 2) {
      overallRiskLevel = 'high';
    } else if (mediumRiskCount >= 1) {
      overallRiskLevel = 'medium';
    }

    // Return the calculated risk object
    return {
      overallRiskLevel,
      attendanceRisk,
      academicRisk,
      financialRisk,
      riskFactors,
      lastAnalysisDate: new Date(),
      alertsGenerated: user.riskAnalysis?.alertsGenerated || []
    };
  }

  /**
   * Generates a risk alert if risk threshold is met
   * @param {Object} user - The user document
   * @returns {Object|null} The generated alert or null
   */
  static generateRiskAlert(user) {
    const riskAnalysis = this.calculateRiskAnalysis(user);
    if (!riskAnalysis) return null;

    user.riskAnalysis = riskAnalysis; // apply the updated risk analysis

    const { overallRiskLevel, riskFactors } = riskAnalysis;

    // Generate alert for high or critical risk
    if (overallRiskLevel === 'high' || overallRiskLevel === 'critical') {
      const alert = {
        type: 'multi-factor',
        severity: overallRiskLevel,
        message: `Student ${user.name} (${user.rollNumber || user.email}) requires immediate attention: ${riskFactors.join(', ')}`,
        date: new Date(),
        acknowledged: false
      };

      // Add to alerts if not already present
      const existingAlert = user.riskAnalysis.alertsGenerated.find(
        a => a.type === alert.type && a.severity === alert.severity && !a.acknowledged
      );

      if (!existingAlert) {
        user.riskAnalysis.alertsGenerated.push(alert);
        return alert;
      }
    }

    return null;
  }
}

module.exports = RiskAnalysisService;
