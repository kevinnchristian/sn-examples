var impUser = new GlideImpersonate();
impUser.impersonate("system");

var gr1 = new GlideRecord('');
gr1.addEncodedQuery("");
gr1.setLimit();
gr1.query();

while (gr1.next()) {
    gr1.update();
}