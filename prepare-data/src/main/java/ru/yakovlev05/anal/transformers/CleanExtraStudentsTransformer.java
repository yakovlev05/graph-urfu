package ru.yakovlev05.anal.transformers;

import ru.yakovlev05.anal.model.data.Group;
import ru.yakovlev05.anal.model.data.StudentsByDiscipline;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Удаляем студентов, которых нет на 4 курсе (7 семестр).
 */
public class CleanExtraStudentsTransformer {

    private static final Integer SEMESTER = 7; // 4 курс 1 семестр

    public static void process(StudentsByDiscipline data) {
        Set<String> allowedStudents = data.semesters().stream()
                .filter(semester -> semester.semester() == SEMESTER)
                .flatMap(semester -> semester.courses().stream())
                .flatMap(course -> course.realizations().stream())
                .flatMap(realization -> realization.groups().stream())
                .flatMap(group -> group.students().stream())
                .collect(Collectors.toSet());

        List<Group> groups = data.semesters().stream()
                .flatMap(semester -> semester.courses().stream())
                .flatMap(course -> course.realizations().stream())
                .flatMap(realization -> realization.groups().stream())
                .toList();

        for (Group group : groups) {
            group.students().removeIf(student -> !allowedStudents.contains(student));
        }

    }

}
