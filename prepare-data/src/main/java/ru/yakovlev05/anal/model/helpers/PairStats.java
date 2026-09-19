package ru.yakovlev05.anal.model.helpers;

import ru.yakovlev05.anal.model.react2d.CommonGroup;

import java.util.LinkedHashSet;
import java.util.Set;

/// Накопленные данные по паре студентов: суммарный вес и общие реализации.
/// Вес копится по каждой группе (лекция и практика одной реализации дают вклад дважды),
/// а общие реализации хранятся без повторов.
public class PairStats {
    private double weight;
    private final Set<CommonGroup> commonGroups = new LinkedHashSet<>();

    public void addGroup(double groupWeight, CommonGroup commonGroup) {
        weight += groupWeight;
        commonGroups.add(commonGroup);
    }

    public double getWeight() {
        return weight;
    }

    public Set<CommonGroup> getCommonGroups() {
        return commonGroups;
    }
}
