var ld = {

    _chartRegister :[],
    _mapRegister:[],
    
    init: function(){
        ld._chartRegister.forEach(function(e){
           e.init(); 
        });
        ld._mapRegister.forEach(function(e){
           e.init(); 
        });        
    },
    
    updateAll: function(){
        ld._chartRegister.forEach(function(chart){
           chart.update(); 
        });
        ld._mapRegister.forEach(function(map){
           map.update(); 
        });      
    },

    rowGraph: function(id){

        this._height=300;
        this._width=300;
        this._properties = {};
        this._id = id;
        this._data = [];
        this._place = "";
        this._type = "";
        this._values = "";
        this._barcolor = "steelblue";
        this._fontcolor = "white";
        this._textShift = 20;

        ld._chartRegister.push(this);

        this.height = function(val){
            if(typeof val === 'undefined'){
                return this._height;
            } else {
                this._height=val;
                return this;
            }        
        };

        this.width = function(val){
            if(typeof val === 'undefined'){
                return this._width;
            } else {
                this._width=val;
                return this;
            }        
        };

        this.data = function(val){
            if(typeof val === 'undefined'){
                return this._data;
            } else {
                this._data=val;
                return this;
            }        
        };

        this.place = function(val){
            if(typeof val === 'undefined'){
                return this._place;
            } else {
                this._place=val;
                return this;
            }        
        };

        this.type = function(val){
            if(typeof val === 'undefined'){
                return this._type;
            } else {
                this._type=val;
                return this;
            }        
        }; 

        this.values = function(val){
            if(typeof val === 'undefined'){
                return this._values;
            } else {
                this._values=val;
                return this;
            }        
        };
        
        this.barcolor = function(val){
            if(typeof val === 'undefined'){
                return this._barcolor;
            } else {
                this._barcolor=val;
                return this;
            }        
        };        

        this.init= function(){
            this.cf = this._initCrossfilter(this._data,this._place,this._type,this._values);
            this._render(this._id,this.cf.typeGroup.all());           
        };

        this._initCrossfilter = function(data,place,key,value){
            var cf = crossfilter(data);

            cf.placeDimension = cf.dimension(function(d){ return d[place]; });
            cf.typeDimension = cf.dimension(function(d){ return d[key]; });
            cf.placeGroup = cf.placeDimension.group().reduceSum(function(d) {return d[value];});
            cf.typeGroup = cf.typeDimension.group().reduceSum(function(d) {return d[value];});

            return cf;
        };


        this._render = function(id,data){       
            this._properties.margin = {top: 20, right: 20, bottom: 20, left: 20};
            this._properties.width = this._width - this._properties.margin.left - this._properties.margin.right;
            this._properties.height = this._height - this._properties.margin.top - this._properties.margin.bottom;      

            this._properties.x = d3.scale.linear()           
               .range([0, this._properties.width]).domain([0, d3.max(data,function(d){return d.value;})]);

            this._properties.y = d3.scale.ordinal()
               .rangeBands([0, this._properties.height]).domain(data.map(function(d) {return d.key; }));

            var _chart = d3.select(id)
                .append('svg')
                .attr('class', 'dashchart')
                .attr('width', this._width)
                .attr('height', this._height)
                .append("g")
                .attr("transform", "translate(" + this._properties.margin.left + "," + this._properties.margin.left + ")");        

            var _parent = this;

            _chart.selectAll("rect")
                .data(data)
                .enter().append("rect")
                .attr("x", 0)
                .attr("y", function(d){;
                    return _parent._properties.y(d.key);
                })
                .attr("width", function(d){
                    return _parent._properties.x(d.value);
                })
                .attr("height", _parent._properties.y.rangeBand()-1)
                .attr("class","dashgraph-bar")
                .attr("fill",this._barcolor)
                .on("click",function(d){
                    _chart.selectAll("rect").attr("fill","#ccc");
                    d3.select(this).attr("fill",_parent._barcolor);
                });
        
            _chart.selectAll("text")
                .data(data)
                .enter().append("text")
                .text(function(d) {
                     return d.key +' ('+d.value+')';
                })        
                .attr("x", function(d) {
                    return 5;
                })
                .attr("y", function(d) {
                    return _parent._properties.y(d.key)+_parent._textShift;
                })
                .attr("fill",this._fontcolor);
        };
    },

    map:function (id){

        this._id = id;
        this._geojson = "";
        this._center = [0,0];
        this._zoom = 1;
        this._joinAttr = "";
        //todo - make accessor for
        this._colors = ["#CCCCCC","steelblue"];
        this._filterOn = false;
        
        ld._mapRegister.push(this);

        this.geojson = function(val){
            if(typeof val === 'undefined'){
                return this._geojson;
            } else {
                this._geojson=val;
                return this;
            }        
        };

        this.center = function(val){
            if(typeof val === 'undefined'){
                return this._center;
            } else {
                this._center=val;
                return this;
            }        
        }; 

        this.zoom = function(val){
            if(typeof val === 'undefined'){
                return this._zoom;
            } else {
                this._zoom=val;
                return this;
            }        
        };
        
        this.joinAttr = function(val){
            if(typeof val === 'undefined'){
                return this._joinAttr;
            } else {
                this._joinAttr=val;
                return this;
            }        
        };        

        this._initMap = function(id,geojson, center, zoom, joinAttr){
            
            var _parent = this;

            var base_hotosm = L.tileLayer(
                'http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',{
                attribution: '&copy; OpenStreetMap contributors, <a href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>'}
            );

            var base_osm = L.tileLayer(
                    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
                    attribution: '&copy; OpenStreetMap contributors'}
            );

            var map = L.map('map', {
                center: center,
                zoom: zoom,
                layers: [base_hotosm,base_osm]
            });

            var overlay = L.geoJson(geojson,{
                style: this._style(),
                onEachFeature: onEachFeature
            }).addTo(map);
            
            function onEachFeature(feature, layer) {
                layer.on('click', function (e){
                    _parent.filter(feature.properties[joinAttr]);
                });
            }            
            
            overlay.eachLayer(function (layer) {
                if(typeof layer._path != 'undefined'){
                    layer._path.id = layer.feature.properties[joinAttr];
                } else {
                    layer.eachLayer(function (layer2){
                        layer2._path.id = layer.feature.properties[joinAttr];
                    });
                }
            });            

            return map;
        },
                
        this.filter = function(placeID){
            //this._chartRegister.forEach(function(chart){
            //    chart.cf.placeDimension.filter(placeID);
            //});
            //need to keep track of filters, let user apply cap if necessary
            // dc users selected class for coloring
            ld.updateAll();
        },
        
        this.update = function(){
            var mapData = [];
            var parent = this;
            ld._chartRegister.forEach(function(chart){
                mapData = parent._addCF(mapData,chart.cf.placeGroup.all());
            });
            var i = 0;
            if(this._filterOn===false){
                mapData.forEach(function(d){
                    var color = parent._colors[parent._colorAccessor(d,i)];
                    d3.selectAll('#'+d.key).attr('fill',color).attr('stroke-opacity',0.8).attr('fill-opacity',0.8);
                    i++;
                });
            } else {
                
            }
        },
                
        this._addCF = function (data,newdata){
            if(data.length>0){
                data.forEach(function(d){
                    d.values.push[0];
                });
                var length = data[0].values.length-1;
                newdata.forEach(function(d){
                    var found = false;
                    var i = 0;
                    while(found===false && i<data.length){
                        if(d.key === data[i].key){
                            data[i].values.push(d.value);
                            found =true;
                        }
                        i++;
                    }
                    if(found===false){
                        var values = [];
                        for (i = 0; i < length-1; i++) { 
                            values = values.push(0);
                        }
                        values.push(d.value);
                        data.push[{key:d.key,values:values}];
                    }
                });
            } else {
                newdata.forEach(function(d){
                    data.push({key:d.key,values:[d.value]});
                });
            }
            return data;
        },
        
        //todo - hard coded for now - need to make public and settable;
        
        this._colorAccessor = function (d,i){
            var total=0;
            for(var i in d.values) { total += d.values[i]; }
            if(total>0){
                return 1;
            } else {
                0;
            }
        },
                
        this._style = function(){
            return {
                weight: 1,
                opacity: 0,
                fillOpacity: 0,
                className: 'dashgeom'
            };
        },

        this.init = function(){
            this._initMap(this._id,this._geojson,this._center,this._zoom,this._joinAttr);
            this.update();
        };
    }
};