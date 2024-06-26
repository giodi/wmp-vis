(()=>{

// Objekt mit den Grundoptionen der Visualisierungen.
const commonChartOptions = {
	setFontSizes: _ => {

		// Einstellung der Schriftgrösse je nach Viewport.
		let fS = 16;

		switch(true){
			case window.innerWidth > 2992:
				fS = 25;
				break;
			case window.innerWidth > 2000:
				fS = 19.2;
				break;
			case window.innerWidth > 1400 && window.innerHeight > 1000 && window.innerWidth / window.innerHeight >= 1.5:
				fS = 16;
				break;
			case window.innerWidth > 1400 && window.innerHeight < 1000:
				fS = 12
				break;
		}

		commonChartOptions.trendAxis.yAxis.axisLabel.fontSize = fS;
		commonChartOptions.trendAxis.xAxis.nameTextStyle.fontSize = fS;
		commonChartOptions.trendAxis.yAxis.nameTextStyle.fontSize = fS;
		commonChartOptions.trendAxis.xAxis.axisLabel.fontSize = fS;
		commonChartOptions.basis.series.label.fontSize = fS;
		commonChartOptions.basis.tooltip.textStyle.fontSize = fS;
		commonChartOptions.responsiveOptions.districtMap.visualMap.textStyle.fontSize = fS;
		dashboard.options.bar.yAxis.axisLabel.fontSize = fS;

	},
	responsiveOptions: {
		districtMap: {
			visualMap: {
		      	textStyle: {
		      		fontSize: 16,
		      	},
		    },
		},
		bar: {
			yAxis: {
				axisLabel: {
					fontSize: 16,
				}
			}
		}
	},
	basis: {
		animation: false,
		grid: {
			left: 0,
			right: 5,
			top: 10,
			bottom: 0,
			containLabel: true,
		},
		tooltip: {
			show: true,
			trigger: 'item',
			backgroundColor: "#575757",
			borderColor: "#575757",
			formatter: '{a}<br>{b}<br>{c}',
			textStyle: {
				color: '#fff',
				fontSize: 16,
			},
			axisPointer: {
				type: 'line',
				snap: true
			}
		},
		series: {
			type: 'bar',
			label: {
				fontSize: 16,
			}
		},
	},
	trendAxis: {
		xAxis: {
			name: 'Jahr',
			nameLocation: 'end',
			nameGap: 0,
			nameRotate: 0,
			nameTextStyle: {
				align: 'right',
				verticalAlign: 'bottom',
				padding: [0, 0, 10, 0],
				fontSize: 16,
			},
			type: 'category',
			data: [{% for year in data.years %}{{ year.year }},{% endfor %}],
		  	onZero: false,
		  	axisTick: {
		  		alignWithLabel: true,
		  	},
		  	axisLine: {
		  		onZero: false,
		    	show: true,
		      	lineStyle: {
		      		color: '#575757'
		    	},
		    },
		    axisLabel: {
		    	fontSize: 16,
		    	fontFamily: 'Inter, sans-serif',
		    },
		},
		yAxis: {
		  	nameLocation: 'end',
		  	nameGap: 0,
		  	nameRotate: 0,
		  	nameTextStyle: {
				align: 'left',
		 		verticalAlign: 'top',
				padding: [0, 0, 0, 10],
				fontSize: 16
			},
			type: 'value',
			scale: true,
			axisTick: {
			   	show: true,
			   	alignWithLabel: true,
			},
			splitLine: {
			    show: false
			},
			axisLine: {
		    	show: true,
		      	lineStyle: {
		      		color: '#575757'
		    	},
		    },
		    axisLabel: {
		    	fontSize: 16,
		    	fontFamily: 'Inter, sans-serif',
		    	formatter: (val) => {return val.toLocaleString('de-CH')},
		    },
		},
	}
}



// Objekt mit Daten und Funktionen für die Bedienelemente und Visualisierungen.
const dashboard = {
	data: {
		trendDistrict: [{{ trendDistrict.seriesPercent | dump | safe }}, {{ trendDistrict.series | dump | safe }}],
		trendDistrictMinMax: {{ trendDistrict.minMax | dump | safe }},
		trendRoom: [{{ trendRoom.seriesPercent | dump | safe }}, {{ trendRoom.series | dump | safe }}],
		trendRoomMinMax: {{ trendRoom.minMax | dump | safe }},
		roomPriceData: {{ roomPrice.series | dump | safe }},
		pricePerRoom: {{ pricePerRoom.series | dump | safe }},
		map: {{ mapData | dump | safe }},
		mapText: (txt) => {
			document.getElementById('desc').innerHTML = `Der Stadtteil «${txt[0]}» hat mit CHF&nbsp;${txt[1]} die tiefsten, der Stadtteil «${txt[2]}» mit CHF&nbsp;${txt[3]} die höchsten Miet&shy;preise. Das entspricht einem Unterschied von ${txt[4]} Prozent.`
		}
	},
	filters: {
		toggle: _ => {return document.getElementById('toggle').checked ? 1 : 0},
		vismapPos: _ => {return window.innerWidth < 760 ? {visualMap: {top: 'bottom', left: 'center'}, series: [{type: 'map', map: 'stadtteile', left: 'center', top: 'top'}]} : {visualMap: {top: 'center', left: 'left'}, series: [{type: 'map', map: 'stadtteile', left: 'right', top: 'center'}]}},
		year: document.getElementById('details_years'),
		roomPriceDistrict: document.getElementById('roompricdistricts'),
		trendDistrictRooms: document.getElementById('district-trend-rooms'),
		trendRoomDistricts: document.getElementById('rooms-trend-district'),
		mapRoom: document.getElementById('map-rooms')
	},
	options: {
		bar: {
			...commonChartOptions.basis,
			grid: {
				right: 60,
				top: 10,
				left: 0,
				bottom: 0,
			},
			tooltip: {
				show: false,
			},
			emphasis: {
				disabled: true,
			},
			selectedMode: false,
			color: {{ pricePerRoom.colors | dump | safe }},
			legendHoverLink: false,
			xAxis: {
				zlevel: 99,
				show: false,
		    	type: 'value',
			    axisTick: {
			      show: false
			    },
			    splitLine: {
			      show: false
			    },
			    axisLine: {
		      		show: false,
		    	},
		  	},
		  	yAxis: {
		  		zlevel: 1,
		    	type: 'category',
		    	data: {{ roomPrice.filters.rooms | dump | safe }},
		    	splitLine: {
		      		show: false
		    	},
		    	axisLine: {
		      		show: false
		    	},
		    	axisTick: {
		      		show: false
		    	},
		    	axisLabel: {
		    		fontSize: 16,
		    		inside: true,
		    		color: '#fff',
		    		fontWeight: '700',
		    	},
		  	},
		},
		roomTrend: {
			...commonChartOptions.basis,
			...commonChartOptions.trendAxis,
			color: {{ trendRoom.colors | dump | safe }},
		},
		districtTrend: {
			...commonChartOptions.basis,
			...commonChartOptions.trendAxis,
			color: {{ trendDistrict.colors | dump | safe }},
		}
	},
	checkboxFilters: (area) => {
		let active = area.querySelectorAll('input[type=checkbox]');
		let i = active.length;
		const selection = {};
		
		while(i--){
			selection[active[i].value] = active[i].checked;
		}

		return selection;
	},
	trendTooltip: (params, filter) => {
		// Tooltip Inhalt für Trendcharts
		if(filter == '%'){
			let val = params.value > 0 ? '+'+params.value : params.value;
			return `${params.seriesName}<br />${params.name}<br />${val} %`
		}else{
			return `${params.seriesName}<br>${params.name}<br>CHF ${params.value}`
		}
	},
	trendRooms: _ => {
		const trendRooms = document.getElementById('trend-rooms');
		const chart = trendRooms.getElementsByClassName('dia')[0];
		const filters = [dashboard.filters.toggle(), dashboard.filters.trendRoomDistricts]
		const cboxes = trendRooms.getElementsByTagName('input');
		const trendRoomsEChart = echarts.init(chart, null, {renderer: 'svg'});
		const label = ['%','CHF'];
		
		trendRoomsEChart.setOption(dashboard.options.roomTrend);
		trendRoomsEChart.setOption({
			color: {{ trendRoom.colors | dump | safe }},
			yAxis: {
				name: label[filters[0]],
				min: dashboard.data.trendRoomMinMax[filters[0]][filters[1].value].min,
				max: dashboard.data.trendRoomMinMax[filters[0]][filters[1].value].max,
				axisLabel: {
					formatter: (value) => {return filters[0] ? value : value > 0 ? '+'+value : value < 0 ? value : '100'}
				}
			},
			tooltip: {
				formatter: (params) => {
					return dashboard.trendTooltip(params, label[filters[0]])
				}
			},
			series: dashboard.data.trendRoom[filters[0]][filters[1].value],
			legend: {show: false, selected: dashboard.checkboxFilters(trendRooms)},
		});

		document.getElementById('toggle').addEventListener('change', (e) => {
			filters[0] = dashboard.filters.toggle();
			trendRoomsEChart.setOption({
				series: dashboard.data.trendRoom[filters[0]][filters[1].value],
				legend: {show: false, selected: dashboard.checkboxFilters(trendRooms)},
				tooltip: {
					formatter: (params) => {
						return dashboard.trendTooltip(params, label[filters[0]])
					}
				},
				yAxis: {
					name: label[filters[0]],
					min: dashboard.data.trendRoomMinMax[filters[0]][filters[1].value].min,
					max: dashboard.data.trendRoomMinMax[filters[0]][filters[1].value].max,
					axisLabel: {
						formatter: (value) => {return filters[0] ? value : value > 0 ? '+'+value : value < 0 ? value : '100'}
					}
				},
			});
		})

		filters[1].addEventListener('change', (e) => {
			trendRoomsEChart.setOption({
				yAxis: {
					min: dashboard.data.trendRoomMinMax[filters[0]][filters[1].value].min,
					max: dashboard.data.trendRoomMinMax[filters[0]][filters[1].value].max,
				},
				series: dashboard.data.trendRoom[filters[0]][filters[1].value],
				legend: {show: false, selected: dashboard.checkboxFilters(trendRooms)},
			});
		})

		for(cbox of cboxes){
			cbox.addEventListener('click', (e) => {
				if(!trendRooms.querySelector('input[type=checkbox]:checked')){
					e.target.checked = true;
					return;
				}
				trendRoomsEChart.setOption({legend: {show: false, selected: dashboard.checkboxFilters(trendRooms)}});
			})
		}

		return trendRoomsEChart;
	},
	trendDistrict: _ => {
		const trendDistrict = document.getElementById('trend-district');
		const chart = trendDistrict.getElementsByClassName('dia')[0];
		const cboxes = trendDistrict.querySelectorAll('input[type=checkbox]'); 
		const trendDistrictEChart = echarts.init(chart, null, {renderer: 'svg'});
		const filters = [dashboard.filters.toggle(), dashboard.filters.trendDistrictRooms]
		const label = ['%','CHF'];

		trendDistrictEChart.setOption(dashboard.options.districtTrend);
		trendDistrictEChart.setOption({
			series: dashboard.data.trendDistrict[filters[0]][filters[1].value],
			color: {{ trendDistrict.colors | dump | safe }},
			legend: {show: false, selected: dashboard.checkboxFilters(trendDistrict)},
			tooltip: {
				formatter: (params) => {
					return dashboard.trendTooltip(params, label[filters[0]])
				}
			},
			yAxis: {
				name: label[filters[0]],
				min: dashboard.data.trendDistrictMinMax[filters[0]][filters[1].value].min,
				max: dashboard.data.trendDistrictMinMax[filters[0]][filters[1].value].max,
				axisLabel: {
					formatter: (value) => {return filters[0] ? value : value > 0 ? '+'+value : value < 0 ? value : '100'}
				}
			},
		});

		document.getElementById('toggle').addEventListener('change', (e) => {
			filters[0] = dashboard.filters.toggle();
			trendDistrictEChart.setOption({
				series: dashboard.data.trendDistrict[filters[0]][filters[1].value],
				legend: {show: false, selected: dashboard.checkboxFilters(trendDistrict)},
				tooltip: {
					formatter: (params) => {
						return dashboard.trendTooltip(params, label[filters[0]])
					}
				},
				yAxis: {
					name: label[filters[0]],
					min: dashboard.data.trendDistrictMinMax[filters[0]][filters[1].value].min,
					max: dashboard.data.trendDistrictMinMax[filters[0]][filters[1].value].max,
						axisLabel: {
						formatter: (value) => {return filters[0] ? value : value > 0 ? '+'+value : value < 0 ? value : '100'}
					}
				},
			});
		})

		filters[1].addEventListener('change', (e) => {
			trendDistrictEChart.setOption({
				yAxis: {
					min: dashboard.data.trendDistrictMinMax[filters[0]][filters[1].value].min,
					max: dashboard.data.trendDistrictMinMax[filters[0]][filters[1].value].max,
				},
				series: dashboard.data.trendDistrict[filters[0]][filters[1].value],
				legend: {show: false, selected: dashboard.checkboxFilters(trendDistrict)},
			});
		});

		for(cbox of cboxes){
			cbox.addEventListener('click', (e) => {
				if(!trendDistrict.querySelector('input[type=checkbox]:checked')){
					e.target.checked = true;
					return;
				}
				trendDistrictEChart.setOption({legend: {show: false, selected: dashboard.checkboxFilters(trendDistrict)}});
			})
		}

		return trendDistrictEChart;
	},
	roomPrice: _ => {

		const chart = document.getElementById('roompriceroom');
		const chart2 = document.getElementById('roompriceperroom');		
		const roomPriceChart = echarts.init(chart, null, {renderer: 'svg'});
		const roomPriceChart2 = echarts.init(chart2, null, {renderer: 'svg'});
		const filters = [dashboard.filters.year, dashboard.filters.roomPriceDistrict];
		
		roomPriceChart.setOption(dashboard.options.bar);
		roomPriceChart.setOption({
			color: {{ pricePerRoom.colors | dump | safe }},
			colorBy: 'data',
			series: dashboard.data.roomPriceData[filters[0].value][filters[1].value],			
		});
		
		roomPriceChart2.setOption(dashboard.options.bar);
		roomPriceChart2.setOption({
			colorBy: 'data',
			series: dashboard.data.pricePerRoom[filters[0].value][filters[1].value],				
		});

		filters[0].addEventListener('change', (e) => {

			roomPriceChart.setOption({
				series: dashboard.data.roomPriceData[filters[0].value][filters[1].value]
			});

			roomPriceChart2.setOption({
				series: dashboard.data.pricePerRoom[filters[0].value][filters[1].value]
			});

		})

		filters[1].addEventListener('change', (e) => {

			roomPriceChart.setOption({
				series: dashboard.data.roomPriceData[filters[0].value][filters[1].value]
			});

			roomPriceChart2.setOption({
				series: dashboard.data.pricePerRoom[filters[0].value][filters[1].value]
			});

		})

		return [roomPriceChart, roomPriceChart2];
	},
	districtMap: _ => {

		echarts.registerMap('stadtteile', { svg: '{% include "karte.svg" %}' });
		const map = document.getElementById('map');
		const chart = map.getElementsByClassName('dia')[0];
		const mapEChart = echarts.init(chart, null, {renderer: 'svg'});
		const filters = [dashboard.filters.year, dashboard.filters.mapRoom]

		mapEChart.setOption({
			...commonChartOptions.responsiveOptions.districtMap.visualMap,
            tooltip: {
				show: true,
				backgroundColor: "#575757",
				borderColor: "#575757",
				formatter: '{b}<br>{a}<br>CHF {c}',
				textStyle: {
					color: '#fff',
				},
			},
			visualMap: {
				id: 'vismap',
		    	orient: 'horizontal',
		      	realtime: true,
		      	calculable: false,
		      	textStyle: {
		      		color: '#575757',
		      	},
		      	indicatorStyle: {
		      		borderType: 'solid',
		      		borderColor: '#575757'
		      	}
		    },
		    series: [{
		        type: 'map',
	            map: 'stadtteile',
	            roam: false,
	            left: 'right',
	            top: 'top',
	            emphasis: {
	            	disabled: true
	            },
	            selectedMode: false,
		    }]
		});

		mapEChart.setOption(dashboard.filters.vismapPos())
		dashboard.data.mapText(dashboard.data.map[filters[0].value][filters[1].value][1]);
		mapEChart.setOption(dashboard.data.map[filters[0].value][filters[1].value][0]);



		window.addEventListener('resize', _ => {
			mapEChart.setOption(dashboard.filters.vismapPos());
		})

		filters[0].addEventListener('change', (e) => {
			dashboard.data.mapText(dashboard.data.map[filters[0].value][filters[1].value][1]);
			mapEChart.setOption(dashboard.data.map[filters[0].value][filters[1].value][0]);
		});

		filters[1].addEventListener('change', (e) => {
			dashboard.data.mapText(dashboard.data.map[filters[0].value][filters[1].value][1]);
			mapEChart.setOption(dashboard.data.map[filters[0].value][filters[1].value][0]);
		});

		return mapEChart;
	},
	init: _ => {

		commonChartOptions.setFontSizes();
		let trendDistrictChart = dashboard.trendDistrict();
		let trendRoomChart = dashboard.trendRooms();
		let roomPriceChart = dashboard.roomPrice();
		let districtMap = dashboard.districtMap();

		window.addEventListener('resize', _ => {
			
			commonChartOptions.setFontSizes();

			setTimeout(() => {
				trendDistrictChart.resize();
				trendRoomChart.resize();
				roomPriceChart[0].resize();
				roomPriceChart[1].resize();
				districtMap.resize();
			}, '1000')
			


		});
	}
}

dashboard.init();

})();

