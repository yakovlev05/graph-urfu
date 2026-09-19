package ru.yakovlev05.anal.model.data;

import java.util.List;

/// Реализация предмета — конкретная дисциплина, например «Теория принятия решений».
/// У реализации несколько групп: лекция, практика, лабораторная и т.п.
public record Realization(String realization, List<Group> groups) {
}
