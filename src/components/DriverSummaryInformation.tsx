import { ReactElement } from 'react';

/**
 *
 * @param driver
 */
export function DVCalculator(driver: any): any {
	return {
		number_of_orders: Array.isArray(driver?.orderList) ? driver.orderList.length : 0,
		work_time: 0,
		distance: 0,
		cargos: 0,
	};
}

/**
 *
 * @param {any} _props
 * @param {any} _props.driverData
 * @param {any} _props.timelineData
 * @param {any} _props.selectedDriver
 * @param {any} _props.setSelectedDriver
 * @param {any} _props.onMouseUp
 */
export default function DriverSummaryInformationComponent(_props: {
	driverData: any[];
	timelineData: any;
	selectedDriver: number;
	setSelectedDriver: (driverId: number) => void;
	onMouseUp: (driverId: number) => void;
}): ReactElement {
	return <div style={{ width: 380, padding: '10px' }} />;
}
