package ru.yakovlev05.anal.transformers;

import ru.yakovlev05.anal.model.data.Group;
import ru.yakovlev05.anal.model.data.StudentsByDiscipline;
import ru.yakovlev05.anal.model.helpers.Pair;
import ru.yakovlev05.anal.model.react2d.GraphData;
import ru.yakovlev05.anal.model.react2d.Link;
import ru.yakovlev05.anal.model.react2d.Node;

import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
                buildNodes(studentToId),
                buildLinks(groups, studentToId)
        );
    }

    private static List<Node> buildNodes(Map<String, Integer> studentToId) {
        return studentToId.values().stream()
                .map(Node::new)
                .toList();
    }

    private static List<Link> buildLinks(List<Group> groups, Map<String, Integer> studentToId) {
        Map<Pair, Double> pairWeights = new HashMap<>();

        for (Group group : groups) {
            int[] ids = group.students().stream()
                    .mapToInt(studentToId::get)
                    .distinct()
                    .sorted()
                    .toArray();

            double weight = 1.0 / (ids.length - 1);
            for (int i = 0; i < ids.length; i++) {
                for (int j = i + 1; j < ids.length; j++) {
                    pairWeights.merge(new Pair(ids[i], ids[j]), weight, Double::sum);
                }
            }
        }

        return pairWeights.entrySet().stream()
                .filter(entry -> entry.getValue() >= MIN_WEIGHT)
                .map(Map.Entry::getKey)
                .sorted(Comparator.comparingInt(Pair::source).thenComparingInt(Pair::target))
                .map(pair -> new Link(pair.source(), pair.target()))
                .toList();
    }

}
