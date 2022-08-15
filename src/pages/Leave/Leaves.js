import React from "react";
import { Button, Form, Table } from "antd";
import Select from "components/Elements/Select";
import { STATUS_TYPES } from "constants/Leaves";
import { CSVLink } from "react-csv";

const FormItem = Form.Item;

function Leaves({
	columns,
	data,
	user,
	users,
	status,
	selectedRows,
	handleStatusChange,
	handleUserChange,
	handleResetFilter,
	pagination,
	rowSelection,
	isLoading,
	isExportDisabled
}) {
	console.log(data, selectedRows);
	return (
		<div>
			<div className="components-table-demo-control-bar">
				<div className="gx-d-flex gx-justify-content-between gx-flex-row">
					<Form layout="inline">
						<FormItem>
							<Select
								placeholder="Select Status"
								onChange={handleStatusChange}
								value={status}
								options={STATUS_TYPES}
							/>
						</FormItem>
						<FormItem>
							<Select
								placeholder="Select User"
								value={user}
								options={users}
								onChange={handleUserChange}
							/>
						</FormItem>

						<FormItem>
							<Button
								className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
								onClick={handleResetFilter}
							>
								Reset
							</Button>
						</FormItem>
					</Form>
					<div>
						<Button className="gx-btn gx-btn-primary gx-text-white gx-mt-auto">
							Add Leave
						</Button>
						<CSVLink
							filename={"Leaves"}
							data={
								data?.length > 0
									? [
											["Dates", "Type", "Reason", "Status"],

											...data
												?.filter(leave => selectedRows.includes(leave?._id))
												?.map(leave => [
													leave?.dates,
													leave?.type,
													leave?.reason,
													leave?.status
												])
									  ]
									: []
							}
						>
							<Button
								className="gx-btn gx-btn-primary gx-text-white gx-mt-auto"
								disabled={isExportDisabled}
							>
								Export
							</Button>
						</CSVLink>
					</div>
				</div>
			</div>
			<Table
				className="gx-table-responsive"
				columns={columns}
				dataSource={data}
				// onChange={handleTableChange}
				rowSelection={rowSelection}
				pagination={pagination}
				loading={isLoading}
			/>
		</div>
	);
}

export default Leaves;
