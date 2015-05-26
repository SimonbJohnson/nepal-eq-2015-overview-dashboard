nepal_adm3.features.forEach(function(e){
    e.properties['HLCIT_CODE'] = e.properties['HLCIT_CODE'].replace(/ /g,'_');
});

var dashmap = new ld.map('#map')
        .geojson(nepal_adm3)
        .center([28.3,83.7])
        .zoom(6)
        .joinAttr('HLCIT_CODE');

var rowChart1 = new ld.rowGraph('#graph1').data(data)
        .place('column1')
        .type('column2')
        .values('column3')
        .width($('#graph1').width());

var rowChart2 = new ld.rowGraph('#graph2').data(data)
        .place('column1')
        .type('column2')
        .values('column3')
        .width($('#graph2').width());

ld.init();