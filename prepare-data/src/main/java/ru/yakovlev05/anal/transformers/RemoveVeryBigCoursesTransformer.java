package ru.yakovlev05.anal.transformers;

import ru.yakovlev05.anal.model.data.Semester;
import ru.yakovlev05.anal.model.data.StudentsByDiscipline;

import java.util.Set;

/**
 * Удаляем курсы, которые очень большие (были у всех или большинства).
 * Например, физра, проектный практикум.
 */
public class RemoveVeryBigCoursesTransformer {

    private static final Set<String> COURSES_NAMES = Set.of(
            "Прикладная физическая культура Часть 3",
            "Прикладная физическая культура Часть 4",
            "Учебная практика, ознакомительная",
            "Введение в профессиональную деятельность",
            "Проектный практикум 2 (09 УГН)",
            "Проектный практикум 3 ИРИТ-РТФ (09УГН)"
    );

    public static void process(StudentsByDiscipline data) {
        for (Semester semester : data.semesters()) {
            semester.courses().removeIf(course -> COURSES_NAMES.contains(course.course()));
        }
    }

}
