export const checkEligibility = (student, drive) => {
  const result = {
    eligible: true,
    checks: {
      cgpa: {
        passed: true,
        student: student.cgpa || 0,
        required: drive.minimumCGPA,
      },
      branch: {
        passed: true,
        student: student.branch || '',
        allowed: drive.allowedBranches,
      },
      graduationYear: {
        passed: true,
        student: student.graduationYear || 0,
        required: drive.graduationYears,
      },
      backlogs: {
        passed: true,
        student: student.backlogs || 0,
        maximum: drive.maximumBacklogs,
      },
    },
  };

  // Check CGPA
  if (result.checks.cgpa.student < result.checks.cgpa.required) {
    result.checks.cgpa.passed = false;
    result.eligible = false;
  }

  // Check Branch
  if (!result.checks.branch.allowed.includes(result.checks.branch.student)) {
    result.checks.branch.passed = false;
    result.eligible = false;
  }

  // Check Graduation Year
  if (!result.checks.graduationYear.required.includes(result.checks.graduationYear.student)) {
    result.checks.graduationYear.passed = false;
    result.eligible = false;
  }

  // Check Backlogs
  if (result.checks.backlogs.student > result.checks.backlogs.maximum) {
    result.checks.backlogs.passed = false;
    result.eligible = false;
  }

  return result;
};
