/**
 * Converter o input de data para o objeto GlideDateTime.
 * 
 * @param {String, Object, Number} - date - Valor de data ou data/hora, server-side.
 * 
 * @param {String, Object, Number} - sysparm_date - Valor de data ou data/hora, client-side.
 * 
 * @returns {Object, String} - Retorna um objeto do tipo GlideDateTime; 
 * caso as condições não sejam atendidas, retorna uma mensagem informativa.
 */
convertToGlideDateTime: function(date) {
  var inputValue = date || this.getParameter("sysparm_date") || "";
  var genericGDT = new GlideDateTime();

  if (!inputValue) {
    return "Valor de data inválido ou vazio.";
  }

  // Se for um GlideDateTime, retornar o próprio inputValue.
  if (inputValue instanceof GlideDateTime) {
    return inputValue;
  }

  // Se for um GlideDate, converter e retornar objeto GlideDateTime
  if (inputValue instanceof GlideDate) {
    genericGDT.setValue(inputValue + " 03:00:00"); // Adiciona hora padrão servidor
    return genericGDT;
  }

  // Se for um número (milissegundos), retornar objeto GlideDateTime
  if (typeof inputValue === "number") {
    genericGDT.setValue(inputValue);
    return genericGDT;
  }

  // Se for um objeto, converter para string
  if (typeof inputValue === "object") {
    inputValue = inputValue.toString();
  }

  // Se for uma string, converter para objeto GlideDateTime
  if (typeof inputValue === "string") {
    var dateServerFormat = /^\d{4}-\d{2}-\d{2}$/;
    var dateHourServerFormat = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    var dateBrazilianFormat = /^\d{2}\/\d{2}\/\d{4}$/;
    var dateHourBrazilianFormat = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/;

    // Verificar o formato utilizando regex
    if (dateServerFormat.test(inputValue)) {
      genericGDT.setValue(inputValue + " 03:00:00"); // Adiciona hora padrão servidor

    } else if (dateHourServerFormat.test(inputValue)) {
      genericGDT.setValue(inputValue);

    } else if (dateBrazilianFormat.test(inputValue)) {
      genericGDT.setDisplayValue(inputValue + " 00:00:00"); // Adiciona hora padrão usuário

    } else if (dateHourBrazilianFormat.test(inputValue)) {
      genericGDT.setDisplayValue(inputValue);

    } else {
      return "O formato da data não é reconhecido.";
    }

    return genericGDT;
  }

  return "Tipo de dado inválido. Informe uma data válida.";
},


/**
 * Verificar se o input de data É ou NÃO feriado.
 * 
 * @param {String, Object, Number} - date - Valor de data ou data/hora, server-side.
 * @param {String} - scheduleId - Sys ID do registro da tabela Schedule[cmn_schedule], server-side.
 * 
 * @param {String, Object, Number} - sysparm_date - Valor de data ou data/hora, client-side.
 * @param {String} - sysparm_schedule_id - Sys ID do registro da tabela Schedule[cmn_schedule], client-side.
 * 
 * @returns {Boolean} - Retorna valor true/false identificando se É ou NÃO feriado.
 */
isHoliday: function(date, scheduleId) {
  var dateParm = date || this.getParameter("sysparm_date") || "";
  var scheduleIdParm = scheduleId || this.getParameter("sysparm_schedule_id") || "";

  var dateGDT = this.convertToGlideDateTime(dateParm); // Converter o input de data
  var recordGS = new GlideSchedule();
  recordGS.load(scheduleIdParm);

  if (recordGS.isValid()) {
    var hasOnSchedule = recordGS.isInSchedule(dateGDT); // Feriado? true ou false

    return hasOnSchedule;

  } else {
    return "Calendário de feriados inválido. Informe um calendário válido.";
  }
},


/**
 * Adicionar dias corridos para o input de data.
 * 
 * @param {String, Object, Number} - date - Valor de data ou data/hora, server-side.
 * @param {Number} - daysToAdd - Número inteiro para adicionar dias ao input de data, server-side.
 * 
 * @param {String, Object, Number} - sysparm_date - Valor de data ou data/hora, client-side.
 * @param {Number} - sysparm_days_to_add - Número inteiro para adicionar dias ao input de data, client-side.
 * 
 * @returns {Object} - Retorna um objeto GlideDateTime com a nova data, após a adição de dias.
 */
addContinuousDays: function(date, daysToAdd) {
  var dateParm = date || this.getParameter("sysparm_date") || "";
  var daysToAddParm = daysToAdd || this.getParameter("sysparm_days_to_add") || "";

  var dateGDT = this.convertToGlideDateTime(dateParm); // Converter o input de data
  dateGDT.addDaysLocalTime(daysToAdd);

  return dateGDT;
},


/**
 * Subtrair dias corridos para o input de data.
 * 
 * @param {String, Object, Number} - date - Valor de data ou data/hora, server-side.
 * @param {Number} - daysToSubtract - Número inteiro para subtrair dias do input de data, server-side.
 * 
 * @param {String, Object, Number} - sysparm_date - Valor de data ou data/hora, client-side.
 * @param {Number} - sysparm_days_to_subtract - Número inteiro para subtrair dias do input de data, client-side.
 * 
 * @returns {Object} - Retorna um objeto GlideDateTime com a nova data, após a subtração de dias.
 */
subtractContinuousDays: function(date, daysToSubtract) {
  var dateParm = date || this.getParameter("sysparm_date") || "";
  var daysToSubtractParm = daysToSubtract || this.getParameter("sysparm_days_to_subtract") || "";

  var dateGDT = this.convertToGlideDateTime(dateParm); // Converter o input de data
  dateGDT.addDaysLocalTime(-daysToSubtractParm);

  return dateGDT;
},


/**
 * Adicionar dias úteis para o input de data.
 * 
 * @param {String, Object, Number} - date - Valor de data ou data/hora, server-side.
 * @param {Number} - daysToAdd - Número inteiro para adicionar dias ao input de data, server-side.
 * @param {String} - scheduleId - Sys ID do registro da tabela Schedule[cmn_schedule], server-side.
 * 
 * @param {String, Object, Number} - sysparm_date - Valor de data ou data/hora, client-side.
 * @param {Number} - sysparm_days_to_add - Número inteiro para adicionar dias ao input de data, client-side.
 * @param {String} - sysparm_schedule_id - Sys ID do registro da tabela Schedule[cmn_schedule], client-side.
 * 
 * @returns {Object} - Retorna um objeto GlideDateTime com a nova data (dia útil), após a adição de dias.
 */
addBusinessDays: function(date, daysToAdd, scheduleId) {
  var dateParm = date || this.getParameter("sysparm_date") || "";
  var daysToAddParm = daysToAdd || this.getParameter("sysparm_days_to_add") || "";
  var scheduleIdParm = scheduleId || this.getParameter("sysparm_schedule_id") || "";

  var endDateCounted = this.convertToGlideDateTime(dateParm); // Converter o input de data
  var daysAdded = 0;

  while (daysAdded < daysToAddParm) {
    endDateCounted.addDaysLocalTime(1);

    var isWeekendArray = [6, 7]; // 6 (Sábado) - 7 (Domingo)
    var isWeekend = isWeekendArray.includes(endDateCounted.getDayOfWeekLocalTime());
    var isHoliday = this.isHoliday(endDateCounted, scheduleIdParm);

    // Se não for fim de semana e feriado, entender e somar como dia útil
    if (!isWeekend && !isHoliday) {
      daysAdded++;
    }
  }

  return endDateCounted;
},


/**
 * Subtrair dias úteis para o input de data.
 * 
 * @param {String, Object, Number} - date - Valor de data ou data/hora, server-side.
 * @param {Number} - daysToSubtract - Número inteiro para subtrair dias do input de data, server-side.
 * @param {String} - scheduleId - Sys ID do registro da tabela Schedule[cmn_schedule], server-side.
 * 
 * @param {String, Object, Number} - sysparm_date - Valor de data ou data/hora, client-side.
 * @param {Number} - sysparm_days_to_subtract - Número inteiro para subtrair dias do input de data, client-side.
 * @param {String} - sysparm_schedule_id - Sys ID do registro da tabela Schedule[cmn_schedule], client-side.
 * 
 * @returns {Object} - Retorna um objeto GlideDateTime com a nova data (dia útil), após a subtração de dias.
 */
subtractBusinessDays: function(date, daysToSubtract, scheduleId) {
  var dateParm = date || this.getParameter("sysparm_date") || "";
  var daysToSubtractParm = daysToSubtract || this.getParameter("sysparm_days_to_subtract") || "";
  var scheduleIdParm = scheduleId || this.getParameter("sysparm_schedule_id") || "";

  var endDateCounted = this.convertToGlideDateTime(dateParm); // Converter o input de data
  var daysSubtracted = 0;

  while (daysSubtracted < daysToSubtractParm) {
    endDateCounted.addDaysLocalTime(-1);

    var isWeekendArray = [6, 7]; // 6 (Sábado) - 7 (Domingo)
    var isWeekend = isWeekendArray.includes(endDateCounted.getDayOfWeekLocalTime());
    var isHoliday = this.isHoliday(endDateCounted, scheduleIdParm);

    // Se não for fim de semana e feriado, entender e somar como dia útil
    if (!isWeekend && !isHoliday) {
      daysSubtracted++;
    }
  }

  return endDateCounted;
},


/**
 * Obter novo formato para o input de data.
 * 
 * @param {String, Object, Number} - date - Valor de data ou data/hora, server-side.
 * @param {String} - dateFormat - Novo formato desejado para o input de data.
 * (ex: "yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy"), server-side.
 * 
 * @param {String, Object, Number} - sysparm_date - Valor de data ou data/hora, client-side.
 * @param {String} - sysparm_date_format - Novo formato desejado para o input de data.
 * (ex: "yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy"), client-side.
 * 
 * @returns {String} - Retorna somente a data com o novo formato.
 */
chooseDateFormat: function(date, dateFormat) {
  var dateParm = date || this.getParameter("sysparm_date") || "";
  var dateFormatParm = dateFormat || this.getParameter("sysparm_date_format") || "";

  var dateGDT = this.convertToGlideDateTime(dateParm); // Converter o input de data
  var onlyDate = dateGDT.getValue().split(" ")[0]; // Obter somente a data

  var dateGD = new GlideDate();
  dateGD.setValue(onlyDate);
  var newFormatDate = dateGD.getByFormat(dateFormatParm);

  return newFormatDate;
},


/**
 * Comparar dois inputs de datas.
 * 
 * @param {String, Object, Number} - date1 - Valor de data ou data/hora, server-side.
 * @param {String, Object, Number} - date2 - Valor de data ou data/hora, server-side.
 * 
 * @param {String, Object, Number} - sysparm_date1 - Valor de data ou data/hora, client-side.
 * @param {String, Object, Number} - sysparm_date2 - Valor de data ou data/hora, client-side.
 * 
 * @returns {Number} - Retorna quando a data ocorreu [Antes(-1), Igual(0) ou Depois(1)].
 */
compareDates: function(date1, date2) {
  var date1Parm = date1 || this.getParameter("sysparm_date1") || "";
  var date2Parm = date2 || this.getParameter("sysparm_date2") || "";

  // Converter os inputs de datas
  var dateGDT1 = this.convertToGlideDateTime(date1Parm); // Data fixa (ponto fixo)
  var dateGDT2 = this.convertToGlideDateTime(date2Parm); // Data para comparação

  // Comparar as datas
  var resultCompare = dateGDT2.compareTo(dateGDT1);

  return resultCompare;
},


/**
 * Obter diferença entre dois inputs de datas (em horas).
 * 
 * @param {String, Object, Number} - date1 - Valor de data ou data/hora, server-side.
 * @param {String, Object, Number} - date2 - Valor de data ou data/hora, server-side.
 * 
 * @param {String, Object, Number} - sysparm_date1 - Valor de data ou data/hora, client-side.
 * @param {String, Object, Number} - sysparm_date2 - Valor de data ou data/hora, client-side.
 * 
 * @returns {Number} - Retorna em horas a diferença entre datas desejadas.
 */
diffInHours: function(date1, date2) {
  var date1Parm = date1 || this.getParameter("sysparm_date1") || "";
  var date2Parm = date2 || this.getParameter("sysparm_date2") || "";

  var dateInMillis1 = date1Parm.getNumericValue(); // Timestamp em milissegundos
  var dateInMillis2 = date2Parm.getNumericValue();

  var diffInMillis = Math.abs(dateInMillis1 - dateInMillis2); // Diferença em milissegundos
  var diffHours = diffInMillis / (1000 * 60 * 60); // Converter para horas

  return diffHours;
},


/**
 * Obter informações sobre um input de data utilizada como referência.
 * 
 * @param {String, Object, Number} - date - Valor de data ou data/hora, server-side.
 * @param {String} - scheduleId - Sys ID do registro da tabela Schedule[cmn_schedule], server-side.
 * 
 * @param {String, Object, Number} - sysparm_date - Valor de data ou data/hora, client-side.
 * @param {String} - sysparm_schedule_id - Sys ID do registro da tabela Schedule[cmn_schedule], client-side.
 * 
 * @returns {Object} - Retorna várias informações encapsulada sobre a data passada como referência.
 */
getDateInfo: function(date, scheduleId) {
  var dateParm = date || this.getParameter("sysparm_date") || "";
  var scheduleIdParm = scheduleId || this.getParameter("sysparm_schedule_id") || "";

  var dateGDT = this.convertToGlideDateTime(dateParm); // Converter o input de data
  var cloneDateGDT = new GlideDateTime(dateGDT); // Clonar para evitar mudanças no original
  var nameDaysOfWeekArray = ["", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
  var shortNameMonthArray = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  var fullNameMonthArray = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  var isWeekendArray = [6, 7]; // 6 (Sábado) - 7 (Domingo)

  // Objeto utilizado para reunir todas informações sobre a data de referência
  var dateInfo = {
    onlyDate: "",
    onlyHour: "",
    year: 0,
    day: 0,
    dayOfWeek: 0,
    nameDayOfWeek: "",
    month: 0,
    shortNameMonth: "",
    fullNameMonth: "",
    firstDayOfMonth: {},
    lastDayOfMonth: {},
    firstBusinessDay: {},
    lastBusinessDay: {},
    numberOfDaysInMonth: 0,
    allDaysOfMonth: [],
    numberBusinessDaysInMonth: 0,
    allBusinessDaysMonth: [],
    numberNoBusinessDaysInMonth: 0,
    allNoBusinessDaysMonth: []
  };

  // Obter separadamente a data, hora e ano
  dateInfo.onlyDate = cloneDateGDT.getDisplayValue().split(" ")[0];
  dateInfo.onlyHour = cloneDateGDT.getDisplayValue().split(" ")[1] || "00:00:00";
  dateInfo.year = cloneDateGDT.getYearLocalTime();

  // Obter o dia, número e nome do dia da semana
  dateInfo.day = cloneDateGDT.getDayOfMonthLocalTime();
  dateInfo.dayOfWeek = cloneDateGDT.getDayOfWeekLocalTime(); // 1 (Segunda) - 7 (Domingo)
  dateInfo.nameDayOfWeek = nameDaysOfWeekArray[dateInfo.dayOfWeek];

  // Obter número do mês, nome curto e nome comleto
  dateInfo.month = cloneDateGDT.getMonthLocalTime();
  dateInfo.shortNameMonth = shortNameMonthArray[dateInfo.month - 1];
  dateInfo.fullNameMonth = fullNameMonthArray[dateInfo.month - 1];

  // Obter o primeiro e o último dia do mês
  dateInfo.firstDayOfMonth = new GlideDateTime(dateInfo.year + "-" + dateInfo.month + "-01 03:00:00");
  var getLastDayOfMonth = new GlideDateTime(dateInfo.firstDayOfMonth);
  getLastDayOfMonth.addMonthsLocalTime(1);
  getLastDayOfMonth.addDaysLocalTime(-1);
  dateInfo.lastDayOfMonth = getLastDayOfMonth;

  // Obter quantidade de dias no mês, todos dias úteis e não úteis
  var cloneFirstDay = new GlideDateTime(dateInfo.firstDayOfMonth);
  dateInfo.numberOfDaysInMonth = cloneFirstDay.getDaysInMonthLocalTime();

  for (var x = 1; x <= dateInfo.numberOfDaysInMonth; x++) {
    var getDateCloneFirstDay = cloneFirstDay.getDisplayValue().split(" ")[0];
    var isHolidayCloneFirstDay = this.isHoliday(cloneFirstDay, scheduleIdParm);
    var isWeekendCloneFirstDay = isWeekendArray.includes(cloneFirstDay.getDayOfWeekLocalTime());

    if (isHolidayCloneFirstDay || isWeekendCloneFirstDay) {
      dateInfo.allNoBusinessDaysMonth.push(getDateCloneFirstDay);

    } else {
      dateInfo.allBusinessDaysMonth.push(getDateCloneFirstDay);
    }

    dateInfo.allDaysOfMonth.push(getDateCloneFirstDay);
    cloneFirstDay.addDaysLocalTime(1);
  }

  // Obter os número total de dias úteis e não úteis
  dateInfo.numberBusinessDaysInMonth = dateInfo.allBusinessDaysMonth.length;
  dateInfo.numberNoBusinessDaysInMonth = dateInfo.allNoBusinessDaysMonth.length;

  // Obter o primeiro e último dia útil
  dateInfo.firstBusinessDay = new GlideDateTime(dateInfo.firstDayOfMonth);
  dateInfo.lastBusinessDay = new GlideDateTime(dateInfo.lastDayOfMonth);
  var isHolidayFirstDayBusiness = this.isHoliday(dateInfo.firstDayOfMonth, scheduleIdParm);
  var isWeekendFirstDayBusiness = isWeekendArray.includes(dateInfo.firstDayOfMonth.getDayOfWeekLocalTime());
  var isHolidayLastDayBusiness = this.isHoliday(dateInfo.lastDayOfMonth, scheduleIdParm);
  var isWeekendLastDayBusiness = isWeekendArray.includes(dateInfo.lastDayOfMonth.getDayOfWeekLocalTime());

  if (isHolidayFirstDayBusiness || isWeekendFirstDayBusiness) {
    dateInfo.firstBusinessDay = this.addBusinessDays(dateInfo.firstBusinessDay, 1, scheduleIdParm);
  }

  if (isHolidayLastDayBusiness || isWeekendLastDayBusiness) {
    dateInfo.lastBusinessDay = this.subtractBusinessDays(dateInfo.lastBusinessDay, 1, scheduleIdParm);
  }


  return dateInfo;
},