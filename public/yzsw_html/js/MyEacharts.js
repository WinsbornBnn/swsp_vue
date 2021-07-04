layui.use(['layer', 'form',], () => {
  let form = layui.form
  let type = 1;
  var plot = 0, units = 0, company = 0, tanks = 0;
  var allplot = 0, allunits = 0, allcompany = 0, alltanks = 0;
  var plotper, unitsper, companyper, tanksper = null;
  // 数据字典的值
  // let alldata = getList('sys/dict/getDictItems/js_count');
  // alldata.forEach(item => {
  //   if (item.text === "企业") {
  //     allcompany = item.value
  //   } else if (item.text === "灌区") {
  //     alltanks = item.value
  //   } else if (item.text === "小区") {
  //     allplot = item.value
  //   } else {
  //     allunits = item.value
  //   }
  // });
  // 第一个省市级切换
  form.on('select(qx)', function (obj) {
    type = obj.value;
    
    let data = getList('data/statisticsData/queryByDq', {qx:type,nd:0});
    if(data != null){
      plot = Number(data.jsqyysl);
      allplot = Number(data.qyysl);
      units = Number(data.jsxx);
      allunits = Number(data.xx);
      company = Number(data.jsdw);
      allcompany = Number(data.dw);
      tanks = Number(data.jsxq);
      alltanks = Number(data.xq);
    }else{
      plot = 0;
      allplot = 0;
      units = 0;
      allunits = 0;
      company = 0;
      allcompany = 0;
      tanks = 0;
      alltanks = 0;
      plotper = 0;
      unitsper = 0;
      companyper = 0;
      tanksper = 0;
    }
    
    // 计算百分比
    if(allplot != 0){
      plotper = (plot / allplot).toFixed(4) * 100;
      plotper = Math.floor(plotper * 100) / 100; 
    }
    if(allunits != 0){
      unitsper = (units / allunits).toFixed(4) * 100;
      console.log(unitsper);
      unitsper = Math.floor(unitsper * 100) / 100; 
    }
    if(allcompany != 0){
      companyper = (company / allcompany).toFixed(4) * 100;
      companyper = Math.floor(companyper * 100) / 100; 
    }
    if(alltanks != 0){
      tanksper = (tanks / alltanks).toFixed(4) * 100;
      console.log(tanksper);
      tanksper = Math.floor(tanksper * 100) / 100; 
    }
    
    // 渲染页面
    document.querySelector('.plot').innerHTML = `
      <div class="box">
        <div id="plot" class="publicheight"></div>
        <div class="label">${plotper}<small> %</small></div>
        </div>
        <div class="item">
          <span style="color: #F49448;">
            工业企业
          </span>
      </div>
        `;
    document.querySelector('.units').innerHTML = `
      <div class="box">
        <div id="units" class="publicheight"></div>
        <div class="label">${unitsper}<small> %</small></div>
      </div>
      <div class="item">
        <span style="color: #0FB5A7;">
          学校
        </span>
      </div>`;
    document.querySelector('.company').innerHTML = `
      <div class="box">
        <div id="company" class="publicheight"></div>
        <div class="label">${companyper}<small> %</small></div>
      </div>
      <div class="item">
        <span style="color: #F465A5;">
          单位
        </span>
      </div>`;
    document.querySelector('.tanks').innerHTML = `
      <div class="box">
        <div id="tanks" class="publicheight"></div>
        <div class="label">${tanksper}<small> %</small></div>
      </div>
      <div class="item">
        <span style="color: #5474FF;">
         小区
        </span>
      </div>`;
    getTanks(tanks, alltanks)
    getCompany(company, allcompany)
    getPlot(plot, allplot)
    getUnits(units, allunits)
  });
  
  
  // 其余三个省市级切换
  form.on('select(allunits)', function (obj) { type = obj.value; getUnit(type) });
  form.on('select(allcompany)', function (obj) { type = obj.value; getCompanyList(type) });
  form.on('select(alltanks)', function (obj) { type = obj.value; getTank(type) });
  
  // 所有省级的统计数量
  // let data = getList('industrialEnterprise/industrialEnterprise/staticNum', { type: type });
  // data.forEach(item => {
  //   if (item.name === "企业") {
  //     company = item.num ? item.num : 0
  //   } else if (item.name === "灌区") {
  //     tanks = item.num ? item.num : 0
  //   } else if (item.name === "小区") {
  //     plot = item.num ? item.num : 0
  //   } else {
  //     units = item.num ? item.num : 0
  //   }
  // });
  
  
  // let nd = getList('data/statisticsData/getNf', {});
  // nd.forEach(item => {
  //   var options="<option value='"+item.nd+"'>"+item.nd+"</option>";
  //    $("#nd").append(options);
  // });
  var nd_last = 0;
  // if(nd.length > 0){
  //   nd_last = nd[0].nd;
  // }
  console.log(nd_last);
  let data = getList('data/statisticsData/queryByDq', {qx:"市区",nd:nd_last});
  if(data != null){
    plot = Number(data.jsqyysl);
    allplot = Number(data.qyysl);
    units = Number(data.jsxx);
    allunits = Number(data.xx);
    company = Number(data.jsdw);
    allcompany = Number(data.dw);
    tanks = Number(data.jsxq);
    alltanks = Number(data.xq);
  }
  
  // 计算百分比
  if(allplot != 0){
    plotper = (plot / allplot).toFixed(4) * 100;
    plotper = Math.floor(plotper * 100) / 100; 
  }
  if(allunits != 0){
    unitsper = (units / allunits).toFixed(4) * 100;
    console.log(unitsper);
    unitsper = Math.floor(unitsper * 100) / 100; 
  }
  if(allcompany != 0){
    companyper = (company / allcompany).toFixed(4) * 100;
    companyper = Math.floor(companyper * 100) / 100; 
  }
  if(alltanks != 0){
    tanksper = (tanks / alltanks).toFixed(4) * 100;
    console.log(tanksper);
    tanksper = Math.floor(tanksper * 100) / 100; 
  }
  // 渲染页面
  document.querySelector('.plot').innerHTML = `
      <div class="box">
        <div id="plot" class="publicheight"></div>
        <div class="label">${plotper}<small> %</small></div>
        </div>
        <div class="item">
          <span style="color: #F49448;">
            工业企业
          </span>
      </div>
        `;
  document.querySelector('.units').innerHTML = `
      <div class="box">
        <div id="units" class="publicheight"></div>
        <div class="label">${unitsper}<small> %</small></div>
      </div>
      <div class="item">
        <span style="color: #0FB5A7;">
          学校
        </span>
      </div>`;
  document.querySelector('.company').innerHTML = `
      <div class="box">
        <div id="company" class="publicheight"></div>
        <div class="label">${companyper}<small> %</small></div>
      </div>
      <div class="item">
        <span style="color: #F465A5;">
          单位
        </span>
      </div>`;
  document.querySelector('.tanks').innerHTML = `
      <div class="box">
        <div id="tanks" class="publicheight"></div>
        <div class="label">${tanksper}<small> %</small></div>
      </div>
      <div class="item">
        <span style="color: #5474FF;">
          小区
        </span>
      </div>`;
  // 获取小区统计数据
  const getPlot = (plot, allplot) => {
    // 基于准备好的dom，初始化echarts实例
    let myPlot = echarts.init(document.getElementById('plot'));
    // 指定图表的配置项和数据
    let option = {
      series: [
        {
          type: 'pie',
          radius: ['80%', '70%'],
          // 鼠标经过不需要放大偏移图形
          hoverOffset: 0,
          labelLine: {
            normal: {
              show: false
            }
          },
          // 饼形图的起始角度为 0
          startAngle: 0,
          data: [
            {
              value: allplot - plot,
              itemStyle: {
                color: "#555F92",
              }
            },
            {
              value: plot,
              itemStyle: {
                color: "#F49448",
              }
            }
          ]
        }
      ]
    };
    // 3. 配置项和数据给我们的实例化对象
    myPlot.setOption(option);
    // 4. 当我们浏览器缩放的时候，图表也等比例缩放
    window.addEventListener("resize", () => {
      // 让我们的图表调用 resize这个方法
      myPlot.resize();
    });
  }
  getPlot(plot, allplot);
  // 获取单位统计数据
  const getUnits = (units, allunits) => {
    let myUnits = echarts.init(document.getElementById('units'));
    let option = {
      series: [
        {
          type: 'pie',
          radius: ['80%', '70%'],
          hoverOffset: 0,
          labelLine: {
            normal: {
              show: false
            }
          },
          startAngle: 0,
          data: [
            {
              value: allunits - units,
              itemStyle: {
                color: "#555F92",
              }
            },
            {
              value: units, itemStyle: {
                color: "#0FB5A7",
              }
            }
          ]
        }
      ]
    };
    myUnits.setOption(option);
    window.addEventListener("resize", () => {
      myUnits.resize();
    });
  }
  getUnits(units, allunits);
  // 获取企业统计数据
  const getCompany = () => {
    let myCompany = echarts.init(document.getElementById('company'));
    let option = {
      series: [
        {
          type: 'pie',
          radius: ['80%', '70%'],
          hoverOffset: 0,
          labelLine: {
            normal: {
              show: false
            }
          },
          startAngle: 0,
          data: [
            {
              value: allcompany - company,
              itemStyle: {
                color: "#555F92",
              }
            },
            {
              value: company, itemStyle: {
                color: "#F465A5",
              }
            }
          ]
        }
      ]
    };
    myCompany.setOption(option);
    window.addEventListener("resize", () => {
      myCompany.resize();
    });
  }
  getCompany(company, allcompany);
  // 获取灌区统计数据
  const getTanks = (tanks, alltanks) => {
    let myTanks = echarts.init(document.getElementById('tanks'));
    let option = {
      series: [
        {
          type: 'pie',
          radius: ['80%', '70%'],
          hoverOffset: 0,
          labelLine: {
            normal: {
              show: false
            }
          },
          startAngle: 0,
          data: [
            {
              value: alltanks - tanks,
              itemStyle: {
                color: "#555F92",
              }
            },
            {
              value: tanks,
              itemStyle: {
                color: "#5474FF",
              }
            }
          ]
        }
      ]
    };
    myTanks.setOption(option);
    window.addEventListener("resize", () => {
      myTanks.resize();
    });
  }
  getTanks(tanks, alltanks);
  
  
  // 获取单位分类
  const getUnit = (type) => {
    let data = getList('serviceUnit/serviceUnit/staticData', { type: type });
    let name = [];
    let number = [];
    data.forEach(item => {
      let newname = item.dwlx;
      name.push(newname);
      let newdata = item.num ? item.num : 0;
      number.push(newdata);
    });

    let myUnit = echarts.init(document.getElementById('unit'));
    let option = {
      calculable: true,
      xAxis: [
        {
          type: "value",
          boundaryGap: [0, 0.01],
          axisLine: {
            lineStyle: {
              width: 0
            },
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "#202646",
              width: 2,
              type: "solid"
            }
          }
        }
      ],
      yAxis: [
        {
          type: "category",
          data: name,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#8187A9"
            }
          }
        }
      ],
      series: [
        {
          name: 0,
          type: "bar",
          data: number,
          barWidth: 8,
          itemStyle: {
            normal: {
              barBorderRadius: 5,
              label: {
                show: true,
                position: 'right',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                }
              },
              color: (params) => {
                console.log("--------------------------------------------------------->");
                console.log(params);
                if (params.name  ==  "其他") {
                  return "#AEBAFF"
                } else if (params.name  ==  "医院") {
                  return "#46B0AE"
                } else if (params.name  ==  "宾馆") {
                  return "#F5B8A5"
                } else if (params.name  ==  "事业单位") {
                  return "#D785AB"
                } else if (params.name  ==  "机关") {
                  return "#d86c1f"
                }
              }
            }
          }
        }
      ],
      grid: {
        borderWidth: 0,
        x: 70,
        y: 4,
        x2: 18,
        y2: 18
      }
    }
    myUnit.setOption(option);
    window.addEventListener("resize", (e) => {
      myUnit.resize();
    });
  }
  getUnit(type);
  // 获取企业分类
  const getCompanyList = (type) => {
    let data = getList('industrialEnterprise/industrialEnterprise/staticData', { type: type });
    let small = null;
    let center = null;
    let strong = null;
    let ather = null;
    data.forEach(item => {
      if (item.zdys == "一般用水户") {
        ather = item.num ? item.num : 0;
      } else if (item.zdys == "重点监控户") {
        center = item.num ? item.num : 0;
      } else if (item.zdys == "规模以上企业") {
        strong = item.num ? item.num : 0;
      } else {
        small = item.num ? item.num : 0;
      }
    });
    let myCompanyList = echarts.init(document.getElementById('companylist'));
    let option = {
      legend: {
        data: ["高耗水", "重点监控", "规模以上","一般用水"],
        selectedMode: false,
        borderRadius: 5,
        itemHeight: 3,
        itemWidth: 15,
        textStyle: {
          color: "#A7AEDA",
          fontSize: 12
        },
        padding: 0
      },
      toolbox: {
        show: false,
        feature: {
          mark: {
            show: false
          },
          dataView: {
            show: false,
            readOnly: true
          },
          magicType: {
            show: false,
            type: ["line", "bar"]
          },
          restore: {
            show: false
          },
          saveAsImage: {
            show: false
          },
          dataZoom: {
            show: false
          }
        }
      },
      xAxis: [
        {
          type: "category",
          data: ["高耗水行业企业", "重点用水监控企业", "规模以上企业", "一般用水企业"],
          axisLine: {
            show: false
          },
          axisTick: {
            show: false,
            interval: 0
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            rotate: 45
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          axisLine: {
            show: false
          },
          max: 140,
          min: 0,
          splitNumber: 7,
          splitLine: {
            show: true
          },
          splitLine: {
            lineStyle: {
              color: "#202646",
              width: 2,
              type: "solid"
            }
          }
        }
      ],
      series: [
        {
          name: "高耗水",
          type: "bar",
          data: [small, '-', '-', '-'],
          itemStyle: {
            normal: {
              borderRadius: 5,
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                }
              },
              color: "#5362BC"
            }
          },
          barWidth: 10
        },
        {
          name: "重点监控",
          type: "bar",
          data: ['-', center, '-', '-'],
          barWidth: 10,
          itemStyle: {
            normal: {
              borderRadius: 5,
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                }
              },
              color: "#9D7C48"
            }
          }
        },
        {
          type: "bar",
          name: "规模以上",
          data: ['-', '-', strong, '-'],
          barWidth: 10,
          itemStyle: {
            normal: {
              borderRadius: 5,
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                }
              },
              color: "#9C3E3D"
            }
          }
        },
        {
          type: "bar",
          name: '一般用水',
          data: ['-', '-', '-', ather],
          barWidth: 10,
          itemStyle: {
            normal: {
              borderRadius: 5,
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                }
              },
              color: "#559187"
            }
          }
        }
      ],
      grid: {
        x: 35,
        y: 35,
        x2: 5,
        y2: 78,
        borderWidth: 0
      }
    }
    myCompanyList.setOption(option);
    window.addEventListener("resize", () => {
      myCompanyList.resize();
    });
  }
  getCompanyList(type);
  // 获取灌区分类
  const getTank = (type) => {
    let data = getList('serviceUnit/serviceUnit/staticZtData', { type: type });
    
    let gy = 0;
    let xx = 0;
    let dw = 0;
    let xq = 0;
    let gq = 0;
    let jd = 0;
    data.forEach(item => {
      if (item.dwlx == "工业企业") {
        gy = item.num ? item.num : 0;
      } else if (item.dwlx == "学校") {
        xx = item.num ? item.num : 0;
      } else if (item.dwlx == "单位") {
        dw = item.num ? item.num : 0;
      } else if (item.dwlx == "小区") {
        xq = item.num ? item.num : 0;
      } else if (item.dwlx == "灌区") {
        gq = item.num ? item.num : 0;
      } else if (item.dwlx == "节水教育基地") {
        jd = item.num ? item.num : 0;
      }
    });
    let myTank = echarts.init(document.getElementById('tank'));
    let option = {
      legend: {
        data: ["工业企业", "学校", "单位", "小区", "灌区", "节水教育基地"],
        selectedMode: false,
        borderRadius: 5,
        itemHeight: 3,
        itemWidth: 15,
        textStyle: {
          color: "#A7AEDA",
          fontSize: 12
        },
        padding: 0
      },
      calculable: false,
      xAxis: [
        {
          type: "category",
          data: ["工业企业", "学校", "单位", "小区", "灌区", "节水教育基地"],
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true,
            rotate: 45
          },
          axisLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: "value",
          position: "left",
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: "#202646",
              width: 2,
              type: "solid"
            }
          },
          splitNumber: 7
        }
      ],
      series: [
        {
          name: "工业企业",
          type: "bar",
          data: [gy, '-','-','-','-','-'],
          barWidth: 10,
          itemStyle: {
            normal: {
              borderRadius: 5,
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                }
              },
              color: "#6C86FF"
            }
          }
        },
        {
          name: "学校",
          type: "bar",
          data: ['-', xx,'-','-','-','-'],
          barWidth: 10,
          itemStyle: {
            normal: {
              borderRadius: 5,
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                }
              },
              color: "#D9AB55"
            }
          }
        },
        {
          type: "bar",
          name: "单位",
          data: ['-','-' ,dw,'-','-','-'],
          itemStyle: {
            normal: {
              borderRadius: 5,
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                }
              },
              color: "#DA5045"
            },
          },
          barWidth: 10
        },
        {
          type: "bar",
          name: "小区",
          data: ['-', '-','-',xq,'-','-'],
          itemStyle: {
            normal: {
              borderRadius: 5,
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                }
              },
              color: "#DA5045"
            },
          },
          barWidth: 10
        },
        {
          type: "bar",
          name: "灌区",
          data: ['-', '-','-','-',gq,'-'],
          itemStyle: {
            normal: {
              borderRadius: 5,
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                }
              },
              color: "#DA5045"
            },
          },
          barWidth: 10
        },
        {
          type: "bar",
          name: "节水教育基地",
          data: ['-', '-','-','-','-',jd],
          itemStyle: {
            normal: {
              borderRadius: 5,
              label: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#fff',
                  fontSize: 12
                }
              },
              color: "#DA5045"
            },
          },
          barWidth: 10
        }
      ],
      grid: {
        x: 35,
        y: 35,
        x2: 5,
        y2: 60,
        borderWidth: 0
      }
    }
    myTank.setOption(option);
    window.addEventListener("resize", () => {
      myTank.resize();
    });
  }
  getTank(type);
});