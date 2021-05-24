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
					console.log(res.data)

					for (let index = 0; index < res.data.data.length; index++) {
						// flatData.push(res.data.data[index].createdDate);

						let data = res.data.data[index].createdDate;
						let am = res.data.data[index].totalAmount;
						let yy = dayjs(data).get('year');
						year.push(yy);
						total.push(am);
					}

					let objCharts = {
						...orderReducer.charts,
						name: 'NULL',
						categoriesList: year,
						attributeData: total
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

	React.useEffect(() => {
		loadData();
	}, [])

	React.useEffect(() => {
		setchartOption({
			chart: {
				id: "basic-bar",
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
			xaxis: {
				categories: [...orderReducer.charts.categoriesList],
			}
		});
		setchartSeries([
			{
				name: 'Demo',
				data: [...orderReducer.charts.attributeData],
			}
		]);
	}, [orderReducer.charts])
	return (
		<Grid spacing={3} container direction="row" alignItems="flex-start" style={{ padding: 10 }}>
			<Grid item xs={4} md={4} lg={4}>
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
			<Grid item xs={4} md={4} lg={4}>
				<Paper elevation={3}>
					BAR
					<Chart
						options={chartOption}
						series={chartSeries}
						type="bar"
						width="100%"
					/>
				</Paper>
			</Grid>
		</Grid>
	)
}

export default Charts
