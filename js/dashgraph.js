var ld = {

    _chartRegister :[],
    _mapRegister:[],
    _chartFiltered:-1,
    
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

    colorScale: function(color,scale){
        color = d3.rgb(color);
        color.r = color.r+Math.floor((255-color.r)*(4-scale)/5)
        color.b = color.b+Math.floor((255-color.b)*(4-scale)/5)
        color.g = color.g+Math.floor((255-color.g)*(4-scale)/5)
        return color.toString();
        //return d3.rgb(color).brighter(4-scale).toString();
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
        this._barcolor = "#0091EA";
        this._mapcolors = [];
        this._fontcolor = "white";
        this._textShift = 20;
        this._filterOn = false;
        this._filters = [];
        this._ref = ld._chartRegister.length;    

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

        this.mapcolors = function(val){
            if(typeof val === 'undefined'){
                return this._mapcolors;
            } else {
                this._mapcolors=val;
                return this;
            }        
        };                  

        this.init= function(){
            this.cf = this._initCrossfilter(this._data,this._place,this._type,this._values);
            this._render(this._id,this.cf.typeGroup.all());
            if(this._mapcolors.length==0){
                this._mapcolors=this._genMapColors();
            }           
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
            
            _chart.append("g").selectAll("rect")
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
                .attr("fill","#dddddd")
                .on("click",function(d){
                    _parent._filter(d.key);
                });

            _chart.append("g").selectAll("rect")
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
                .attr("class","dashgraph-bar clickable bar"+this._ref)
                .attr("id",function(d){
                    return "dgbar"+_parent._ref+d.key;
                })
                .attr("fill",this._barcolor)
                .on("click",function(d){
                    _parent._filter(d.key);
                });

            var g = _chart.append("g") 
           
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
                .attr("fill",this._fontcolor)
                .attr("class","clickable textlabel")
                .on("click",function(d){
                    _parent._filter(d.key);
                });

            
            var texts = _chart.selectAll(".textlabel");

            texts[0].forEach(function(t){
                g.append("rect").attr("x",t.getBBox().x).attr("y",t.getBBox().y).attr("width",t.getBBox().width).attr("height",t.getBBox().height).attr("fill",ld.colorScale(_parent._barcolor,2));
            })
            
        };

        this._filter = function(filter){
                ld._chartFiltered = this._ref;

                //will need to adjust later on to accept chart relationship map
                //when you come back to this need to adjust addcf function on maps next to add right charts

                ld._chartRegister.forEach(function(chart){
                    if(chart._ref!=ld._chartFiltered){
                        chart.cf.typeDimension.filterAll();
                        chart._filters=[];
                    }
                });

                var index = this._filters.indexOf(filter);
                if(index===-1){
                    this._filters.push(filter);
                    this._filterOn = true;
                } else {
                    this._filters.splice(index,1);
                }
                if(this._filters.length===0){
                    this._filterOn = false;
                    ld._chartFiltered=-1;
                }

                var _parent = this;
                if(this._filterOn){
                    _parent.cf.typeDimension.filter(function(d){
                        return _parent._filters.indexOf(d) > -1;
                    });             
                } else {
                    _parent.cf.typeDimension.filterAll();
                }
                ld.updateAll();            
        }

        this.update = function(){
            //this._id,this.cf.typeGroup.all()
            var _parent = this;

            if(this._filterOn){
                d3.selectAll('.bar'+this._ref).attr('fill','#dddddd');
                this._filters.forEach(function(f){
                    d3.select('#dgbar'+_parent._ref+f).attr('fill',_parent._barcolor);
                });
            } else {
                if(ld._chartFiltered == -1){
                    d3.selectAll('.bar'+this._ref).attr('fill',this._barcolor);
                } else {
                    d3.selectAll('.bar'+this._ref).attr('fill','#dddddd');
                }
            }
            var _parent = this;
            d3.select(this._id).selectAll('.dashgraph-bar').data(this.cf.typeGroup.all())
            .transition().attr('width', function(d,i){
                    return _parent._properties.x(d.value);
                });
            d3.select(this._id).selectAll('text').data(this.cf.typeGroup.all())
                .text(function(d) {
                     return d.key +' ('+d.value+')';
                })   
        }

        this._genMapColors = function(){
            return ['#cccccc',ld.colorScale(this._barcolor,1),ld.colorScale(this._barcolor,2),ld.colorScale(this._barcolor,3),ld.colorScale(this._barcolor,4)];
        }
    },

    map:function (id){

        this._id = id;
        this._geojson = "";
        this._center = [0,0];
        this._zoom = 1;
        this._joinAttr = "";
        this._colors = ['#CCCCCC','#80D8FF','#40C4FF','#00B0FF','#0091EA'];
        this._filterOn = false;
        this._filters = [];

        this._haveValues = [];
        
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

        this.colorAccessor = function(val){
            if(typeof val === 'undefined'){
                return this._colorAccessor;
            } else {
                this._colorAccessor=val;
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
                    _parent._filterOn = true;
                    _parent._filter(feature.properties[joinAttr]);
                });
            }            
            
            overlay.eachLayer(function (layer) {
                if(typeof layer._path != 'undefined'){
                    layer._path.id = 'dgmap'+layer.feature.properties[joinAttr];
                } else {
                    layer.eachLayer(function (layer2){
                        layer2._path.id = 'dgmap'+layer.feature.properties[joinAttr];
                    });
                }
            });

            //add class to geoms that has no data attached so they cannot be filtered

            var mapData = [];
            var parent = this;
            ld._chartRegister.forEach(function(chart){
                mapData = parent._addCF(mapData,chart.cf.placeGroup.all());
            });
            mapData.forEach(function(d){
                parent._haveValues.push(d.key);
                d3.selectAll('#dgmap'+d.key).classed('hasValue',true);
            });

            return map;
        };
                
        this._filter = function(placeID){
            if(this._haveValues.indexOf(placeID)>-1){
                var index = this._filters.indexOf(placeID);
                if(index===-1){
                    this._filters.push(placeID);
                } else {
                    this._filters.splice(index,1);
                }
                if(this._filters.length===0){
                    this._filterOn = false;
                }
                var parent = this;
                if(this._filterOn){
                    ld._chartRegister.forEach(function(chart){
                            chart.cf.placeDimension.filter(function(d){
                              return parent._filters.indexOf(d) > -1;
                            });             
                    });
                } else {
                    ld._chartRegister.forEach(function(chart){
                        chart.cf.placeDimension.filterAll();
                    });
                }
                ld.updateAll();
            }
        };
        
        this.update = function(){

            var mapData = [];
            var parent = this;
            if(ld._chartFiltered ==-1){
                ld._chartRegister.forEach(function(chart){
                    mapData = parent._addCF(mapData,chart.cf.placeGroup.all());
                });
            } else {
                mapData = ld._chartRegister[ld._chartFiltered].cf.placeGroup.all();
            }
            var i = 0;
            var max = d3.max(mapData,function(d){
                return d.value;
            });            
            if(this._filterOn===false){
                mapData.forEach(function(d){
                    if(ld._chartFiltered==-1){
                        var color = parent._colors[parent._colorAccessor(d,max,i)];
                    } else {
                        var color = ld._chartRegister[ld._chartFiltered]._mapcolors[parent._colorAccessor(d,max,i)];
                    }
                    d3.selectAll('#dgmap'+d.key).attr('fill',color).attr('stroke-opacity',0.8).attr('fill-opacity',0.8);
                    i++;
                });
            } else {
                mapData.forEach(function(d){
                    if(ld._chartFiltered==-1){
                        var color = parent._colors[parent._colorAccessor(d,max,i)];
                    } else {
                        var color = ld._chartRegister[ld._chartFiltered]._mapcolors[parent._colorAccessor(d,max,i)];
                    }
                    if(parent._filters.indexOf(d.key) > -1){
                        d3.selectAll('#dgmap'+d.key).attr('fill',color).attr('stroke-opacity',0.8).attr('fill-opacity',0.8);
                    } else {
                        d3.selectAll('#dgmap'+d.key).attr('fill','grey').attr('stroke-opacity',0.8).attr('fill-opacity',0.8);
                    }
                    i++;
                });
            }
        };
                        

        this._addCF = function (data,newdata){
            newdata.forEach(function(d){
                var found = false;
                var i = 0;
                while(found===false && i<data.length){
                    if(d.key === data[i].key){
                        data[i].value+=d.value;
                        found =true;
                    }
                    i++;
                }
                if(found===false){
                    data.push({key:d.key,value:d.value});
                }                                
            });
            return data;
        };

        this._oldaddCF = function (data,newdata){
            if(data.length>0){
                data.forEach(function(d){
                    d.values.push(0);
                });
                var length = data[0].values.length-1;
                newdata.forEach(function(d){
                    var found = false;
                    var i = 0;
                    while(found===false && i<data.length){
                        if(d.key === data[i].key){
                            data[i].values[length]=d.value;
                            found =true;
                        }
                        i++;
                    }
                    if(found===false){
                        var valueslist = [];
                        for (i = 0; i <= length-1; i++) { 
                            valueslist.push(0);
                        }
                        valueslist.push(d.value);
                        data.push({key:d.key,values:valueslist});
                    }
                });
            } else {
                newdata.forEach(function(d){
                    data.push({key:d.key,values:[d.value]});
                });
            }
            return data;
        };
        
        this._colorAccessor = function (d,max,i){
            if(d.value>0){
                value = Math.log(d.value);
                return Math.floor(value*4/Math.log(max+1))+1;
            } else {
                return 0;
            }
        };
                
        this._style = function(){
            return {
                weight: 1,
                opacity: 0,
                fillOpacity: 0,
                className: 'dashgeom'
            };
        };

        this.init = function(){
            this._initMap(this._id,this._geojson,this._center,this._zoom,this._joinAttr);
            this.update();
        };
    }
};