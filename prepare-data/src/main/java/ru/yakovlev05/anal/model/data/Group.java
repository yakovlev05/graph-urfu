package ru.yakovlev05.anal.model.data;

import java.util.List;

/// Учебная группа: тип занятия, название, преподаватели и состав студентов.
/// Студенты и преподаватели задаются полным ФИО, а не идентификатором,
/// поэтому однофамильцы с совпадающим ФИО сливаются в одну запись.
/// Списки `teachers` и `students` могут быть пустыми.
public record Group(String lessonType, String group, List<String> teachers, List<String> students) {
}
