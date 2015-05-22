

var dashmap = new ld.map('#map').geojson(nepal_adm3).center([28.3,83.7]).zoom(6);
dashmap.init();
var dashgraphs=[];
dashgraphs.push(new ld.rowGraph('#graph1').data(data).place('column1').type('column2').values('column3').width($('#graph1').width()));
dashgraphs.push(new ld.rowGraph('#graph2').data(data).place('column1').type('column2').values('column3').width($('#graph2').width()));
dashgraphs[0].init();
dashgraphs[1].init();
