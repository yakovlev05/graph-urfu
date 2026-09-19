package ru.yakovlev05.anal.model.data;

import java.util.List;

/// Семестр: номер и список предметов (слотов выбора) в нём.
public record Semester(int semester, List<Course> courses) {
}
