layui.use(['layer', 'form',], () => {
  let form = layui.form
  let type = 1;
  var plot, units, company, tanks = null;
  var allplot, allunits, allcompany, alltanks = null;
  var plotper, unitsper, companyper, tanksper = null;
  let alldata = getList('sys/dict/getDictItems/js_count');
  alldata.forEach(item => {
    if (item.text === "企业") {
      allcompany = item.value
    } else if (item.text === "灌区") {
      alltanks = item.value
    } else if (item.text === "小区") {
      allplot = item.value
    } else {
      allunits = item.value
    }
  });
  form.on('select(allprovince)', function (obj) {
    type = obj.value;
    let data = getList('industrialEnterprise/industrialEnterprise/staticNum', { type: type });
    data.forEach(item => {
      if (item.name === "企业") {
        company = item.num ? item.num : 0;
      } else if (item.name === "灌区") {
        tanks = item.num ? item.num : 0;
      } else if (item.name === "小区") {
        plot = item.num ? item.num : 0;
      } else {
        units = item.num ? item.num : 0;
      }
    });
    plotper = (plot / allplot).toFixed(4) * 100;
    unitsper = (units / allunits).toFixed(4) * 100;
    companyper = (company / allcompany).toFixed(4) * 100;
    tanksper = (tanks / alltanks).toFixed(4) * 100;
    document.querySelector('.plot').innerHTML = `
      <div class="box">
        <div id="plot" class="publicheight"></div>
        <div class="label">${plotper}<small> %</small></div>
        </div>
        <div class="item">
          <span style="color: #F49448;">
            小区${plot}个
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
          单位${units}个
        </span>
      </div>`;
    document.querySelector('.company').innerHTML = `
      <div class="box">
        <div id="company" class="publicheight"></div>
        <div class="label">${companyper}<small> %</small></div>
      </div>
      <div class="item">
        <span style="color: #F465A5;">
          企业${company}个
        </span>
      </div>`;
    document.querySelector('.tanks').innerHTML = `
      <div class="box">
        <div id="tanks" class="publicheight"></div>
        <div class="label">${tanksper}<small> %</small></div>
      </div>
      <div class="item">
        <span style="color: #5474FF;">
          灌区${tanks}个
        </span>
      </div>`;
    getTanks(tanks, alltanks)
    getCompany(company, allcompany)
    getPlot(plot, allplot)
    getUnits(units, allunits)
  });
  form.on('select(allunits)', function (obj) { type = obj.value; getUnit(type) });
  form.on('select(allcompany)', function (obj) { type = obj.value; getCompanyList(type) });
  form.on('select(alltanks)', function (obj) { type = obj.value; getTank(type) });
  let data = getList('industrialEnterprise/industrialEnterprise/staticNum', { type: type });
  data.forEach(item => {
    if (item.name === "企业") {
      company = item.num ? item.num : 0
    } else if (item.name === "灌区") {
      tanks = item.num ? item.num : 0
    } else if (item.name === "小区") {
      plot = item.num ? item.num : 0
    } else {
      units = item.num ? item.num : 0
    }
  });
  plotper = (plot / allplot).toFixed(4) * 100;
  unitsper = (units / allunits).toFixed(4) * 100;
  companyper = (company / allcompany).toFixed(4) * 100;
  tanksper = (tanks / alltanks).toFixed(4) * 100;
  document.querySelector('.plot').innerHTML = `
      <div class="box">
        <div id="plot" class="publicheight"></div>
        <div class="label">${plotper}<small> %</small></div>
        </div>
        <div class="item">
          <span style="color: #F49448;">
            小区${plot}个
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
          单位${units}个
        </span>
      </div>`;
  document.querySelector('.company').innerHTML = `
      <div class="box">
        <div id="company" class="publicheight"></div>
        <div class="label">${companyper}<small> %</small></div>
      </div>
      <div class="item">
        <span style="color: #F465A5;">
          企业${company}个
        </span>
      </div>`;
  document.querySelector('.tanks').innerHTML = `
      <div class="box">
        <div id="tanks" class="publicheight"></div>
        <div class="label">${tanksper}<small> %</small></div>
      </div>
      <div class="item">
        <span style="color: #5474FF;">
          灌区${tanks}个
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
                if (params.data < 20) {
                  return "#AEBAFF"
                } else if (params.data >= 20 && params.data < 40) {
                  return "#46B0AE"
                } else if (params.data >= 40 && params.data < 60) {
                  return "#F5B8A5"
                } else if (params.data >= 60 && params.data <= 80) {
                  return "#D785AB"
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
        data: ["小型", "中型", "大型"],
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
          name: "小型",
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
          name: "中型",
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
          name: "大型",
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
          name: 0,
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
    let data = getList('irrigationArea/irrigationArea/staticData', { type: type });
    let small = 0;
    let center = null;
    let strong = null;
    data.forEach(item => {
      if (item.gqgmlx == "小型") {
        small = item.num ? item.num : 0;
      } else if (item.gqgmlx == "中型") {
        center = item.num ? item.num : 0;
      } else if (item.gqgmlx == "大型") {
        strong = item.num ? item.num : 0;
      }
    });
    let myTank = echarts.init(document.getElementById('tank'));
    let option = {
      legend: {
        data: ["小型", "中型", "大型"],
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
          data: ["小型", "中型", "大型"],
          axisTick: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: true
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
          name: "小型",
          type: "bar",
          data: [small, '-', '-'],
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
          name: "中型",
          type: "bar",
          data: ['-', center, '-'],
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
          name: "大型",
          data: ['-', '-', strong],
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
        x: 18,
        y: 30,
        x2: 5,
        y2: 20,
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