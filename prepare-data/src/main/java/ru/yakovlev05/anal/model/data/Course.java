package ru.yakovlev05.anal.model.data;

import java.util.List;

/// Предмет (слот выбора), например «Современные языки программирования».
/// Один предмет может иметь несколько реализаций — вариантов на выбор.
public record Course(String course, List<Realization> realizations) {
}
