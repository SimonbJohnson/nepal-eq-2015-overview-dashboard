nepal_adm3.features.forEach(function(e){
    e.properties['HLCIT_CODE'] = e.properties['HLCIT_CODE'].replace(/ /g,'_');
});

data.forEach(function(e){
    e['#adm3+code'] = e['#adm3+code'].replace(/ /g,'_');
});

data2.forEach(function(e){
    e['#adm3+code'] = e['#adm3+code'].replace(/ /g,'_');
});

data3.forEach(function(e){
    e['#adm3+code'] = e['#adm3+code'].replace(/ /g,'_');
});

var dashmap = new ld.map('#map')
        .geojson(nepal_adm3)
        .center([28.3,83.7])
        .zoom(6)
        .joinAttr('HLCIT_CODE');

var rowChart1 = new ld.rowGraph('#graph1').data(data)
        .place('#adm3+code')
        .type('#affected')
        .values('#x_value')
        .width($('#graph1').width())
        .height(200)
        .barcolor('#9C27B0');

var rowChart2 = new ld.rowGraph('#graph2').data(data2)
        .place('#adm3+code')
        .type('#impact')
        .values('#x_value')
        .width($('#graph2').width())
        .height(100)
        .barcolor('#FF8F00');

var rowChart3 = new ld.rowGraph('#graph3').data(data3)
        .place('#adm3+code')
        .type('#activity')
        .values('#x_value')
        .width($('#graph3').width())
        .height(300)
        .barcolor('#2E7D32');

ld.init();