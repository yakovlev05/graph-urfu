package ru.yakovlev05.anal;

import ru.yakovlev05.anal.model.data.StudentsByDiscipline;
import ru.yakovlev05.anal.model.react2d.GraphData;
import ru.yakovlev05.anal.transformers.CleanExtraStudentsTransformer;
import ru.yakovlev05.anal.transformers.React2dGraphDataTransformer;
import ru.yakovlev05.anal.transformers.RemoveVeryBigCoursesTransformer;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.SerializationFeature;
import tools.jackson.databind.json.JsonMapper;

import java.nio.file.Path;

public class Main {

    private static final String RAW_DATA_PATH = "../raw_modeus_data/students_by_discipline.json";
    private static final String OUTPUT_PATH = "./graph_data.json";

    private static final ObjectMapper MAPPER = JsonMapper.builder()
            .enable(SerializationFeature.INDENT_OUTPUT)
            .build();

    public static void main() {
        StudentsByDiscipline raw_data = MAPPER.readValue(Path.of(RAW_DATA_PATH), StudentsByDiscipline.class);
        CleanExtraStudentsTransformer.process(raw_data);
        RemoveVeryBigCoursesTransformer.process(raw_data);

        GraphData graphData = React2dGraphDataTransformer.process(raw_data);

        MAPPER.writeValue(Path.of(OUTPUT_PATH), graphData);
    }
}
