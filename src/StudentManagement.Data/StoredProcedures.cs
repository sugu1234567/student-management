using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StudentManagement.Data
{
    public static class StoredProcedures
    {
        // Authentication
        public const string PRC_USER_LOGIN = "PRC_USER_LOGIN";
        public const string PRC_USER_CHANGE_PASSWORD = "PRC_USER_CHANGE_PASSWORD";

        // User Management
        public const string PRC_USER_SAVE = "PRC_USER_SAVE";
        public const string PRC_USER_DELETE = "PRC_USER_DELETE";
        public const string PRC_USER_GET_BY_ID = "PRC_USER_GET_BY_ID";
        public const string PRC_USER_GET_ALL = "PRC_USER_GET_ALL";
        public const string PRC_USER_SEARCH = "PRC_USER_SEARCH";

        // Student Management
        public const string PRC_STUDENT_SAVE = "PRC_STUDENT_SAVE";
        public const string PRC_STUDENT_DELETE = "PRC_STUDENT_DELETE";
        public const string PRC_STUDENT_GET_BY_ID = "PRC_STUDENT_GET_BY_ID";
        public const string PRC_STUDENT_GET_ALL = "PRC_STUDENT_GET_ALL";
        public const string PRC_STUDENT_SEARCH = "PRC_STUDENT_SEARCH";
        public const string PRC_STUDENT_GET_BY_CLASS = "PRC_STUDENT_GET_BY_CLASS";

        // Teacher Management
        public const string PRC_TEACHER_SAVE = "PRC_TEACHER_SAVE";
        public const string PRC_TEACHER_DELETE = "PRC_TEACHER_DELETE";
        public const string PRC_TEACHER_GET_BY_ID = "PRC_TEACHER_GET_BY_ID";
        public const string PRC_TEACHER_GET_ALL = "PRC_TEACHER_GET_ALL";
        public const string PRC_TEACHER_SEARCH = "PRC_TEACHER_SEARCH";
        public const string PRC_GRADE_GET_ALL = "PRC_GRADE_GET_ALL";
        // Department Management
        public const string PRC_DEPARTMENT_SAVE = "PRC_DEPARTMENT_SAVE";
        public const string PRC_DEPARTMENT_DELETE = "PRC_DEPARTMENT_DELETE";
        public const string PRC_DEPARTMENT_GET_BY_ID = "PRC_DEPARTMENT_GET_BY_ID";
        public const string PRC_DEPARTMENT_GET_ALL = "PRC_DEPARTMENT_GET_ALL";

        // Class Management
        public const string PRC_CLASS_SAVE = "PRC_CLASS_SAVE";
        public const string PRC_CLASS_DELETE = "PRC_CLASS_DELETE";
        public const string PRC_CLASS_GET_BY_ID = "PRC_CLASS_GET_BY_ID";
        public const string PRC_CLASS_GET_ALL = "PRC_CLASS_GET_ALL";
        public const string PRC_CLASS_GET_BY_DEPARTMENT = "PRC_CLASS_GET_BY_DEPARTMENT";
        public const string PRC_CLASS_GET_BY_TEACHER = "PRC_CLASS_GET_BY_TEACHER";

        // Subject Management
        public const string PRC_SUBJECT_SAVE = "PRC_SUBJECT_SAVE";
        public const string PRC_SUBJECT_DELETE = "PRC_SUBJECT_DELETE";
        public const string PRC_SUBJECT_GET_BY_ID = "PRC_SUBJECT_GET_BY_ID";
        public const string PRC_SUBJECT_GET_ALL = "PRC_SUBJECT_GET_ALL";
        public const string PRC_SUBJECT_GET_BY_DEPARTMENT = "PRC_SUBJECT_GET_BY_DEPARTMENT";
        public const string PRC_SUBJECT_GET_BY_TEACHER = "PRC_SUBJECT_GET_BY_TEACHER";

        // Grade Management
        public const string PRC_GRADE_SAVE = "PRC_GRADE_SAVE";
        public const string PRC_GRADE_DELETE = "PRC_GRADE_DELETE";
        public const string PRC_GRADE_GET_BY_ID = "PRC_GRADE_GET_BY_ID";
        public const string PRC_GRADE_GET_BY_STUDENT = "PRC_GRADE_GET_BY_STUDENT";
        public const string PRC_GRADE_GET_BY_SUBJECT = "PRC_GRADE_GET_BY_SUBJECT";
        public const string PRC_GRADE_GET_BY_CLASS = "PRC_GRADE_GET_BY_CLASS";
        public const string PRC_GRADE_GET_BY_TEACHER = "PRC_GRADE_GET_BY_TEACHER";
        public const string PRC_GRADE_SEARCH = "PRC_GRADE_SEARCH";

        // Statistics
        public const string PRC_STATISTICS_STUDENT_BY_DEPARTMENT = "PRC_STATISTICS_STUDENT_BY_DEPARTMENT";
        public const string PRC_STATISTICS_STUDENT_BY_CLASS = "PRC_STATISTICS_STUDENT_BY_CLASS";
        public const string PRC_STATISTICS_OVERVIEW = "PRC_STATISTICS_OVERVIEW";
        public const string PRC_STATISTICS_STUDENTS_BY_CLASS = "PRC_STATISTICS_STUDENTS_BY_CLASS";
        public const string PRC_STATISTICS_STUDENTS_BY_DEPARTMENT = "PRC_STATISTICS_STUDENTS_BY_DEPARTMENT";
        public const string PRC_STATISTICS_AVG_GRADE_BY_CLASS = "PRC_STATISTICS_AVG_GRADE_BY_CLASS";
        public const string PRC_STATISTICS_AVG_GRADE_BY_SUBJECT = "PRC_STATISTICS_AVG_GRADE_BY_SUBJECT";
    }
}
