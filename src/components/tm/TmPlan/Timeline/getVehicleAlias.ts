import { TmVehiclesDto } from '@/api/tm/apiTmDispatch';

let temporaryVehicleCount = 1;
let vehicleAliasMap = new Map<string, string>();

export const getVehicleAlias = (vehicle?: TmVehiclesDto) => {
	if (!vehicle) return '';
	if (vehicle.carno.includes('TEMPORARY')) {
		if (vehicleAliasMap.has(vehicle.uniqueId)) {
			return vehicleAliasMap.get(vehicle.uniqueId);
		}
		const alias = `실비차 ${temporaryVehicleCount++}`;
		vehicleAliasMap.set(vehicle.uniqueId, alias);
		return alias;
	}
	return vehicle.carno;
};

/**
 * 실비차 카운터와 별칭 맵 초기화
 * 배차계획을 새로 시작할 때 호출
 */
export const resetVehicleAlias = () => {
	temporaryVehicleCount = 1;
	vehicleAliasMap.clear();
};
