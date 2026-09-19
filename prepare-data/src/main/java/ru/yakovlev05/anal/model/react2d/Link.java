package ru.yakovlev05.anal.model.react2d;

import java.util.List;

public record Link(int source, int target, double weight, int commonGroupsCount, List<CommonGroup> commonGroups) {
}
