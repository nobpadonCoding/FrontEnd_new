/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import * as productgroupAxios from "../../ProductGroup/_redux/productgroupAxios";
import * as productgroupRedux from "../../ProductGroup/_redux/productgroupRedux";
import { useSelector, useDispatch } from "react-redux";
import { Button, Dialog, DialogContent, DialogTitle, DialogActions, DialogContentText} from "@material-ui/core";
import SaveIcon from '@material-ui/icons/Save';
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import * as swal from "../../../../Common/components/SweetAlert";

function ProductAdd(props) {
	debugger
	const dispatch = useDispatch();
	const productGroupReducer = useSelector(({ productGroup }) => productGroup);
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		debugger
		// console.log('useEffect openModal add: ', productGroupReducer.openModalProductGroup);
		if (productGroupReducer.openModalProductGroup.modalOpen === true && productGroupReducer.openModalProductGroup.productGroupId === 0) {
			handleOpen();
		}
	}, [productGroupReducer.openModalProductGroup]);

	const handleOpen = () => {
		debugger
		setOpen(true);
	};

	const handleSave = ({ resetForm, setSubmitting }, values) => {
		setSubmitting(false);
		let objPayload = {
			...productGroupReducer.addProductGroup,
			//Id: values.Id,
			productGroupName: values.productGroupName,
		}
		// console.log(objPayload);
		dispatch(productgroupRedux.actions.updateProductGroup(objPayload));
		productgroupAxios.addProductGroup(objPayload)
			.then((res) => {
				if (res.data.isSuccess) {

					handleClose({ resetForm });
					swal.swalSuccess("Success", `Add ${res.data.data.name} success.`)
					props.submit(true);
					dispatch(productgroupRedux.actions.resetProductGroup());
				} else {
					handleClose({ resetForm });
					swal.swalError("Error", res.data.message);
				}
			})
			.catch((err) => {
				//network error
				handleClose({ resetForm });
				swal.swalError("Error", err.message);

			});
	}

	const handleClose = ({ resetForm }) => {
		resetForm();
		setOpen(false);
		dispatch(productgroupRedux.actions.resetOpenModalProductGroup());
		// console.log("handleClose: ", productGroupReducer.openModalProductGroup)
	};
	return (
		<div>
			<Formik
				enableReinitialize
				//Form fields and default values
				initialValues={{
					productGroupName: productGroupReducer.productGroupToAdd.productGroupName
				}}
				//Validation section
				validate={(values) => {
					const errors = {};

					if (!values.productGroupName) {
                        errors.productGroupName = "Required";
                    }

					return errors;
				}}
				//Form Submission
				// ต้องผ่าน Validate ก่อน ถึงจะถูกเรียก
				onSubmit={(values, { setSubmitting, resetForm }) => {
					handleSave({ setSubmitting, resetForm }, values);
				}}
			>
				{({ submitForm, isSubmitting, values, errors, setFieldValue, resetForm }) => (
					<Form>
						<Dialog fullWidth={true} maxWidth='xs' open={open} aria-labelledby="form-dialog-title">
							<DialogTitle id="form-dialog-title">Add ProductGroup</DialogTitle>
							<DialogContent>
								<DialogContentText>
									<Field
										fullWidth
										component={TextField}
										type="text"
										label="productGroupName"
										name="productGroupName"
										errors={errors}
									/>
								</DialogContentText>

							</DialogContent>
							<DialogActions>
								<Button variant="contained" onClick={() => { handleClose({ resetForm }) }} color="secondary">
									Cancel
                                </Button>
								<Button variant="contained"
									onClick={submitForm}
									disabled={isSubmitting}
									color="primary"
									startIcon={<SaveIcon color="action" />}>
									Save
                                </Button>
							</DialogActions>
						</Dialog>
					</Form>
				)}
			</Formik>
		</div>
	)
}

export default ProductAdd
