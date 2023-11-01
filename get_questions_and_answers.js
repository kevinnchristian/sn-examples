getKeyAndValuesQuestionAnswer: function () {
    var variableSetArr = [];
    var fieldNameArr = [];

    var ioSetItemGR = new GlideRecord('io_set_item');
    ioSetItemGR.addEncodedQuery('');
    ioSetItemGR.query();

    while (ioSetItemGR.next()) {
        variableSetArr.push(ioSetItemGR.getValue('variable_set'));
    }

    for (var x in variableSetArr) {
        var variableGR = new GlideRecord('item_option_new');
        variableGR.addEncodedQuery('');
        variableGR.query();

        while (variableGR.next()) {
            fieldNameArr.push({
                questionText: variableGR.getValue('question_text'),
                question: variableGR.getValue('sys_id'),
                fieldName: variableGR.getValue('name'),
                type: variableGR.getValue('type')
            });
        }
    }

    var onlyVariableGR = new GlideRecord('item_option_new');
    onlyVariableGR.addEncodedQuery('');
    onlyVariableGR.query();

    while (onlyVariableGR.next()) {
        fieldNameArr.push({
            questionText: onlyVariableGR.getValue('question_text'),
            question: onlyVariableGR.getValue('sys_id'),
            fieldName: onlyVariableGR.getValue('name'),
            type: onlyVariableGR.getValue('type')
        });
    }


    for (var y in fieldNameArr) {
        var questionAnswerGR = new GlideRecord('question_answer');
        questionAnswerGR.addEncodedQuery('');
        questionAnswerGR.query();

        while (questionAnswerGR.next()) {
            if (fieldNameArr[y].type == 9 || fieldNameArr[y].type == 10) { // Date & DateTime

            } else if (fieldNameArr[y].type == 8) { // Reference

            } else if (fieldNameArr[y].type == 7) { // Boolean

            } else if (fieldNameArr[y].type == 5) { // Select Box

            } else if (fieldNameArr[y].type == 1) { // Yes/No

            } else {

            }
        }
    }
}