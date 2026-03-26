
// Types
export interface VehicleDataDto {
	carno: string,
	priority: string,
	drivername: string,
	contracttype: string,
	temperature1NomlRate: number | null,
	temperature2NomlRate: number | null,
	temperature1OutRate: number | null,
	temperature2OutRate: number | null,
	temperature1Avg: number | null,
	temperature2Avg: number | null,
	temperature1MinMax: string,
	temperature2MinMax: string,
	timeRange: string,
}

export interface TemperatureRecordDataDto {
	carno: string,
	custname: string,
	deliverydt: string | null,
	recordTime: string,
	refrig: string,
	refrigStatus: string,
	freeze: string,
	freezeStatus: string | null,
}

export interface VehicleData {
	carno: string,
	priority: string,
	drivername: string,
	contracttype: string,
	temperature1NomlRate: number | '',
	temperature2NomlRate: number | '',
	temperature1OutRate: number | '',
	temperature2OutRate: number | '',
	temperature1Avg: number | '',
	temperature2Avg: number | '',
	temperature1MinMax: string,
	temperature2MinMax: string,
	timeRange: string,
}

export interface VehicleChartData {
	carno: string;
	drivername: string;
	refrig: number;
	freeze: number;
	time: string;
	cust: string;
}

export interface TemperatureRecordData {
	carno: string;
	custname: string;
	recordTime: string;
	refrig: number;
	freeze: number;
	refrigStatus: 'NOML' | 'OUT' | 'NA';
	freezeStatus: 'NOML' | 'OUT' | 'NA';
}
