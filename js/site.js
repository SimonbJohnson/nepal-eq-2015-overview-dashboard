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

data4.forEach(function(e){
    e['#adm3+code'] = e['#adm3+code'].replace(/ /g,'_');
});

data5.forEach(function(e){
    e['#adm3+code'] = e['#adm3+code'].replace(/ /g,'_');
});

var relations = {'distributions':[{graph:'affected_people',operation:'/'},{graph:'affected_households',operation:'/'},{graph:'affected_families',operation:'/'},{graph:'volunteers',operation:'/'}],
                'volunteers':[{graph:'affected_people',operation:'/'},{graph:'affected_households',operation:'/'},{graph:'affected_families',operation:'/'},{graph:'distributions',operation:'/'}],
                'affected_people':[{graph:'distributions',operation:'-'},{graph:'volunteers',operation:'/'}],
                'affected_households':[{graph:'distributions',operation:'-'},{graph:'volunteers',operation:'/'}],
                'affected_families':[{graph:'distributions',operation:'-'},{graph:'volunteers',operation:'/'}]};

ld.relations(relations);

var dashmap = new ld.map('#map')
        .geojson(nepal_adm3)
        .center([28.3,83.7])
        .zoom(6)
        .joinAttr('HLCIT_CODE')
        .infoAttr('DISTRICT');

var rowChart1 = new ld.rowGraph('#graph1').data(data)
        .name('affected_people')
        .place('#adm3+code')
        .type('#affected')
        .values('#x_value')
        .width($('#graph1').width())
        .height(130)
        .barcolor('#D32F2F')
        .elasticY(true);

var rowChart2 = new ld.rowGraph('#graph2').data(data2)
        .name('affected_households')
        .place('#adm3+code')
        .type('#impact')
        .values('#x_value')
        .width($('#graph2').width())
        .height(100)
        .barcolor('#D32F2F')
        .elasticY(true);

var rowChart3 = new ld.rowGraph('#graph3').data(data3)
        .name('distributions')
        .place('#adm3+code')
        .type('#activity')
        .values('#x_value')
        .width($('#graph3').width())
        .height(260)
        .barcolor('#2E7D32')
        .elasticY(true);

var rowChart4 = new ld.rowGraph('#graph4').data(data4)
        .name('affected_families')
        .place('#adm3+code')
        .type('#affected')
        .values('#x_value')
        .width($('#graph4').width())
        .height(100)
        .barcolor('#D32F2F')
        .elasticY(true);

var rowChart5 = new ld.rowGraph('#graph5').data(data5)
        .name('volunteers')
        .place('#adm3+code')
        .type('#capacity')
        .values('#x_value')
        .width($('#graph5').width())
        .height(300)
        .barcolor('#4527A0')
        .elasticY(true);                   

ld.titleDiv('#maptitle');
ld.legendDiv('#legend');
ld.init();