/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-restricted-imports */
import React from 'react'
import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Chart from "react-apexcharts";
import * as orderAxios from "../../Order/_redux/orderAxios";
import * as orderRedux from "../../Order/_redux/orderRedux";
import { useSelector, useDispatch } from "react-redux";

var flatten = require("flat");
require("dayjs/locale/th");
var dayjs = require("dayjs");
dayjs.locale("th");

function Charts() {

	const orderReducer = useSelector(({ order }) => order);
	const dispatch = useDispatch()
	const [chartSeries, setchartSeries] = React.useState([]);
	const [chartOption, setchartOption] = React.useState({});
	const [isLoading, setIsLoading] = React.useState(true);

	const loadData = () => {
		setIsLoading(true);
		orderAxios
			.getOrderAll()
			.then((res) => {
				if (res.data.isSuccess) {
					debugger
					let year = [];
					let total = []
					let discount = []
					let totalAmt = []
					console.log(res.data)

					for (let index = 0; index < res.data.data.length; index++) {
						// flatData.push(res.data.data[index].createdDate);

						let data = res.data.data[index].createdDate;
						let am = res.data.data[index].totalAmount;
						let dis = res.data.data[index].discount;
						let totalAmt1 = res.data.data[index].total;
						let yy = dayjs(data).get('year');
						year.push(yy);
						total.push(am);
						discount.push(dis);
						totalAmt.push(totalAmt1);
					}

					let objCharts = {
						...orderReducer.charts,
						name: 'NULL',
						categoriesList: year,
						attributeData: total,
						discount: discount,
						totalAmount: totalAmt
					};
					dispatch(orderRedux.actions.setCharts(objCharts));
				} else {
					alert(res.data.message);
				}
			})
			.catch((err) => {
				alert(err.message);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};
	//test
	React.useEffect(() => {
		loadData();
	}, [])

	React.useEffect(() => {
		setchartOption({
			chart: {
				height: 350,
				type: 'line',
				stacked: false,
				dataLabels: {
					enabled: false
				},
				stroke: {
					width: [1, 1, 4]
				},
				toolbar: {
					show: true,
					tools: {
						download: false,
						selection: false,
						zoom: false,
						zoomin: false,
						zoomout: false,
						pan: false,
						reset: true,
						customIcons: []
					},
					autoSelected: 'zoom'
				},
			},
			tooltip: {
				fixed: {
					enabled: true,
					position: 'topRight', // topRight, topLeft, bottomRight, bottomLeft
					offsetY: 0,
					offsetX: 60
				},
			},
			legend: {
				horizontalAlign: 'left',
				offsetX: 30
			},
			xaxis: {
				categories: [...orderReducer.charts.categoriesList],
			},
			yaxis: [{
				axisBorder: {
					show: true,
					color: '#008FFB'
				},
				tooltip: {
					enabled: true
				},
				labels: {
					formatter: function (val, index) {
						return val.toFixed(2);
					}
				}
			}],
		});
		setchartSeries([
			// {
			// 	name: 'Demo',
			// 	data: [...orderReducer.charts.attributeData],
			// },
			{
				name: 'Total',
				type: 'line',
				data: [...orderReducer.charts.attributeData],
			}, {
				name: 'discount',
				type: 'column',
				data: [...orderReducer.charts.discount],
			}, {
				name: 'totalAmount',
				type: 'line',
				data: [...orderReducer.charts.totalAmount],
			}
		]);
	}, [orderReducer.charts])
	return (
		<Grid spacing={3} container direction="row" alignItems="flex-start" style={{ padding: 10 }}>
			<Grid item xs={6} md={6} lg={6}>
				<Paper elevation={3}>
					Line
					<Chart
						options={chartOption}
						series={chartSeries}
						type="line"
						width="100%"
					/>
				</Paper>
			</Grid>
		</Grid>
	)
}

export default Charts
