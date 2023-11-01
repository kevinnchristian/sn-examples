genericGlideRecord: function(tableName, hasFilter, query, hasOrder, fieldOrder, directionOrder) {
    var count = 0;
    var arrayObjects = [];
    var table = this.getParameter('sysparm_tableName') || tableName;
    var flagHasFilter = this.getParameter('sysparm_hasFilter') || hasFilter;
    var queryString = this.getParameter('sysparm_query') || query;
    var flagHasOrder = this.getParameter('sysparm_hasOrder') || hasOrder;
    var setDirectionOrder = this.getParameter('sysparm_directionOrder') || directionOrder;
    var setFieldOrder = this.getParameter('sysparm_fieldOrder') || fieldOrder;

    var genericGR = new GlideRecord(table);
    if (flagHasFilter == 'true') {
        genericGR.addEncodedQuery(queryString);

        if (flagHasOrder == 'true' && setDirectionOrder == 'desc')
            genericGR.orderByDesc(setFieldOrder);
        else
            genericGR.orderBy(setFieldOrder);

        genericGR.query();

    } else {
        if (flagHasOrder == 'true' && setDirectionOrder == 'desc')
            genericGR.orderByDesc(setFieldOrder);
        else
            genericGR.orderBy(setFieldOrder);

        genericGR.query();
    }

    while (genericGR.next()) {
        var items = {};

        for (var x in genericGR) {
            items[x] = String(genericGR[x]);
        }

        arrayObjects.push(items);
        count++;
    }

    return JSON.stringify(arrayObjects);
}