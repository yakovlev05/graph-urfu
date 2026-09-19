package ru.yakovlev05.anal.transformers;

import ru.yakovlev05.anal.model.data.*;
import ru.yakovlev05.anal.model.helpers.Pair;
import ru.yakovlev05.anal.model.helpers.PairStats;
import ru.yakovlev05.anal.model.react2d.CommonGroup;
import ru.yakovlev05.anal.model.react2d.GraphData;
import ru.yakovlev05.anal.model.react2d.Link;
import ru.yakovlev05.anal.model.react2d.Node;

import java.util.*;
import java.util.stream.IntStream;

public class React2dGraphDataTransformer {

    private static final double MIN_WEIGHT = 0.35;

    public static GraphData process(StudentsByDiscipline data) {
        List<Group> groups = data.semesters().stream()
                .flatMap(semester -> semester.courses().stream())
                .flatMap(course -> course.realizations().stream())
                .flatMap(realization -> realization.groups().stream())
                .toList();

        List<String> students = groups.stream()
                .flatMap(group -> group.students().stream())
                .distinct()
                .toList();

        Map<String, Integer> studentToId = new HashMap<>();
        IntStream.range(0, students.size())
                .forEach(index -> studentToId.put(students.get(index), index + 1));

        return new GraphData(
                buildNodes(data, studentToId),
                buildLinks(data, studentToId)
        );
    }

    private static List<Node> buildNodes(StudentsByDiscipline data, Map<String, Integer> studentToId) {
        Map<String, Set<CommonGroup>> studentRealizations = new HashMap<>();
        for (Semester semester : data.semesters()) {
            for (Course course : semester.courses()) {
                for (Realization realization : course.realizations()) {
                    CommonGroup studentRealization = new CommonGroup(semester.semester(), realization.realization());

                    for (Group group : realization.groups()) {
                        for (String student : group.students()) {
                            studentRealizations.computeIfAbsent(student, s -> new LinkedHashSet<>())
                                    .add(studentRealization);
                        }
                    }
                }
            }
        }

        return studentToId.entrySet().stream()
                .sorted(Map.Entry.comparingByValue())
                .map(entry -> new Node(
                        entry.getValue(),
                        entry.getKey(),
                        List.copyOf(studentRealizations.get(entry.getKey()))
                ))
                .toList();
    }

    private static List<Link> buildLinks(StudentsByDiscipline data, Map<String, Integer> studentToId) {
        Map<Pair, PairStats> pairStats = new HashMap<>();

        for (Semester semester : data.semesters()) {
            for (Course course : semester.courses()) {
                for (Realization realization : course.realizations()) {
                    CommonGroup commonGroup = new CommonGroup(semester.semester(), realization.realization());

                    for (Group group : realization.groups()) {
                        int[] ids = group.students().stream()
                                .mapToInt(studentToId::get)
                                .distinct()
                                .sorted()
                                .toArray();

                        double weight = 1.0 / (ids.length - 1);
                        for (int i = 0; i < ids.length; i++) {
                            for (int j = i + 1; j < ids.length; j++) {
                                pairStats.computeIfAbsent(new Pair(ids[i], ids[j]), pair -> new PairStats())
                                        .addGroup(weight, commonGroup);
                            }
                        }
                    }
                }
            }
        }

        return pairStats.entrySet().stream()
                .filter(entry -> entry.getValue().getWeight() >= MIN_WEIGHT)
                .sorted(Map.Entry.comparingByKey(Comparator.comparingInt(Pair::source).thenComparingInt(Pair::target)))
                .map(entry -> new Link(
                        entry.getKey().source(),
                        entry.getKey().target(),
                        entry.getValue().getWeight(),
                        entry.getValue().getCommonGroups().size(),
                        List.copyOf(entry.getValue().getCommonGroups())
                ))
                .toList();
    }

}
