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

var relations = {'ldgraph_2':['graph1','ldgraph_1']};

ld.relations(relations);

var dashmap = new ld.map('#map')
        .geojson(nepal_adm3)
        .center([28.3,83.7])
        .zoom(6)
        .joinAttr('HLCIT_CODE');

var rowChart1 = new ld.rowGraph('#graph1').data(data)
        .name('graph1')
        .place('#adm3+code')
        .type('#affected')
        .values('#x_value')
        .width($('#graph1').width())
        .height(180)
        .barcolor('#9C27B0')
        .elasticY(true);

var rowChart2 = new ld.rowGraph('#graph2').data(data2)
        .place('#adm3+code')
        .type('#impact')
        .values('#x_value')
        .width($('#graph2').width())
        .height(130)
        .barcolor('#FF8F00')
        .elasticY(true);

var rowChart3 = new ld.rowGraph('#graph3').data(data3)
        .place('#adm3+code')
        .type('#activity')
        .values('#x_value')
        .width($('#graph3').width())
        .height(350)
        .barcolor('#2E7D32')
        .elasticY(true);

ld.init();