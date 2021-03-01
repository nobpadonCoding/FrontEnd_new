/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React from 'react'
import { useFormik } from "formik";
import { Grid } from "@material-ui/core/";
import FormikDropdown from "../../../../_FormikUseFormik/components/FormikDropdown";

function ProductStockSearch(props) {
	const [dataFilter, setDataFilter] = React.useState({
		page: 1,
		recordsPerPage: 10,
		orderingField: "",
		ascendingOrder: true,
		searchValues: {
			StoreType: ""
		}
	});
	const [storeType, setStoreType] = React.useState([
		{
			id: 1,
			name: "Add"
		},
		{
			id: 2,
			name: "Remove"
		}
	])
	const formik = useFormik({
		enableReinitialize: true,
		validate: (values) => {
			const errors = {};

			return errors;
		},
		initialValues: {
			storeTypeId: 0,
		},
		onSubmit: (values, { setSubmitting }) => {
			// console.log("add stock", values);
			props.submit(values);
			setSubmitting(false);
		},
	});

	React.useEffect(() => {

	}, [formik.values.storeTypeId]);

	return (

		<Grid container spacing={3}>
			<Grid item xs={12} lg={6}>
				<FormikDropdown
					formik={formik}
					name="storeTypeId"
					label="Store Type"
					data={storeType}
					firstItemText="Select StoreType"
					valueFieldName="id"
					displayFieldName="name"
					selectedCallback={(e) => {
						formik.handleSubmit();
					}}
				/>
			</Grid>
		</Grid>
	)
}

export default ProductStockSearch
