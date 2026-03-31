/*
 ############################################################################
 # FiledataField	: searchPopupConfigUtil.ts
 # Description		: 공통 검색 팝업 설정 관리
 # Author			: c_bae
 # Since			: 25.09.30
 ############################################################################
*/

import {
	apiGetBoxList,
	apiGetCarPopList,
	apiGetCarrierDropList,
	apiGetCarrierList,
	apiGetCmCarList,
	apiGetCmCustBrandList,
	apiGetCostCenterList,
	apiGetCustPopupList,
	apiGetDcList,
	apiGetOrganizePopupList,
	apiGetPartnerList,
	apiGetSkuList,
	apiGetTcCodeCfgList,
	apiGetTruthcustkeyList,
	apiGetUserPopupList,
} from '@/api/cm/apiCmSearch';
import { apiPostStTplIssueReqPopupData } from '@/api/st/apiStTplIssueReq';
import { apiGetIndividualDispatchPopList } from '@/api/tm/apiTmIndividualDispatch';

export interface SearchPopupConfig {
	key: string;
	title: string;
	apiFunction: (params: any) => Promise<any>;
	dropdownConfig: {
		columns: { key: string; title: string }[];
	};
}

const DEFAULT_DROPDOWN_CONFIG = {
	columns: [
		{ key: 'code', title: '코드' },
		{ key: 'name', title: '명', className: 'txt-l' },
	],
};

/**
 * 검색 팝업 설정 Map
 * @param {string} type 타입
 * @returns {SearchPopupConfig} 검색 팝업 설정
 */
export const SEARCH_POPUP_CONFIG = new Map<string, SearchPopupConfig>([
	[
		'sku',
		{
			key: 'sku',
			title: '상품 조회',
			apiFunction: apiGetSkuList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
	[
		'sku_2',
		{
			key: 'sku',
			title: '상품 조회',
			apiFunction: apiGetSkuList,
			dropdownConfig: {
				columns: [
					{ key: 'code', title: '코드' },
					{ key: 'name', title: '코드명', className: 'txt-l' },
					{ key: 'uom', title: '단위' },
				],
			},
		},
	],
	[
		'kitSku',
		{
			key: 'kitSku',
			title: 'KIT상품 조회',
			apiFunction: apiGetSkuList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
	[
		'cust',
		{
			key: 'cust',
			title: '고객 조회',
			apiFunction: apiGetCustPopupList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
	[
		'custGroup',
		{
			key: 'custGroup',
			title: '고객(본점) 조회',
			apiFunction: apiGetCmCustBrandList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
	[
		'organize',
		{
			key: 'organize',
			title: '창고 조회',
			apiFunction: apiGetOrganizePopupList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
	[
		'allOrganize',
		{
			key: 'allOrganize',
			title: '창고 조회',
			apiFunction: apiGetOrganizePopupList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
	[
		'directDlv',
		{
			key: 'directDlv',
			title: '창고 조회',
			apiFunction: apiGetOrganizePopupList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	], // 창고 조회(발주직송 세팅된 창고만 조회)
	[
		'costCenter',
		{
			key: 'costCenter',
			title: '귀속부서 조회',
			apiFunction: apiGetCostCenterList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
	[
		'box',
		{
			key: 'box',
			title: '택배박스 조회',
			apiFunction: apiGetBoxList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
	[
		'partner',
		{
			key: 'partner',
			title: '협력사 조회',
			apiFunction: apiGetPartnerList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
	[
		'carPOP',
		{
			key: 'carPOP',
			title: '차량/POP 조회',
			apiFunction: apiGetCarPopList,
			dropdownConfig: {
				columns: [
					{ key: 'name', title: 'POP번호' },
					{ key: 'code', title: '차량번호' },
					{ key: 'driverName', title: '운전자' },
				],
			},
		},
	],
	[
		'carPOP2',
		{
			key: 'carPOP',
			title: '차량/POP 조회',
			apiFunction: apiGetCarPopList,
			dropdownConfig: {
				columns: [
					{ key: 'name', title: 'POP번호' },
					{ key: 'code', title: '차량번호' },
					{ key: 'driverName', title: '운전자' },
				],
			},
		},
	],
	[
		'carPOP3',
		{
			key: 'carPOP',
			title: '차량/POP 조회',
			apiFunction: apiGetCarPopList,
			dropdownConfig: {
				columns: [
					{ key: 'name', title: 'POP번호' },
					{ key: 'code', title: '차량번호' },
					{ key: 'driverName', title: '운전자' },
				],
			},
		},
	],
	[
		'individualDispatchPOP',
		{
			key: 'individualDispatchPOP',
			title: '차량/POP 조회',
			apiFunction: apiGetIndividualDispatchPopList,
			dropdownConfig: {
				columns: [
					{ key: 'name', title: 'POP번호' },
					{ key: 'code', title: '차량번호' },
					{ key: 'driverName', title: '운전자' },
				],
			},
		},
	],
	[
		'car',
		{
			key: 'car',
			title: '차량 조회',
			apiFunction: apiGetCmCarList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
	[
		'car2',
		{
			key: 'car2',
			title: '차량 조회',
			apiFunction: apiGetCmCarList,
			dropdownConfig: {
				columns: [
					{ key: 'code', title: '차량번호' },
					{ key: 'name', title: '운전자' },
					{ key: 'contracttypeNm', title: '계약유형' },
				],
			},
		},
	],
	[
		'carrier',
		{
			key: 'carrier',
			title: '운송사 조회',
			apiFunction: apiGetCarrierList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
	[
		'carrierDrop',
		{
			key: 'carrier',
			title: '운송사 조회',
			apiFunction: apiGetCarrierDropList,
			dropdownConfig: {
				columns: [
					{ key: 'name', title: '운송사명' },
					{ key: 'code', title: '코드' },
					{ key: 'carrierType', title: '운송사유형' },
				],
			},
		},
	],
	[
		'dc',
		{
			key: 'dc',
			title: '센터 조회',
			apiFunction: apiGetDcList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
	[
		'user',
		{
			key: 'user',
			title: '사용자 조회',
			apiFunction: apiGetUserPopupList,
			// dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
			dropdownConfig: {
				columns: [
					{ key: 'userId', title: '사용자ID' },
					{ key: 'userNm', title: '사용자명' },
					{ key: 'mailId', title: '이메일ID' },
				],
			},
		},
	],
	[
		'tc',
		{
			key: 'tc',
			title: '출발지TC센터 조회',
			apiFunction: apiGetTcCodeCfgList,
			dropdownConfig: {
				columns: [
					{ key: 'tcCode', title: 'TC코드' },
					{ key: 'tcName', title: 'TC명' },
				],
			},
		},
	],
	[
		'ioSku',
		{
			key: 'ioSku',
			title: '위탁입출고 상품검색',
			apiFunction: apiPostStTplIssueReqPopupData,
			dropdownConfig: {
				columns: [
					{ key: 'sku', title: '상품코드' },
					{ key: 'skuName', title: '상품명' },
					{ key: 'uom', title: '단위' },
					{ key: 'qty', title: '현재고' },
					{ key: 'deliveryDate', title: '입고일' },
					{ key: 'convSerialNo', title: 'BL번호' },
					{ key: 'serialNo', title: '이력번호' },
				],
			},
		},
	],
	[
		'truthcustkey',
		{
			key: 'truthcustkey',
			title: '온라인 고객 실착지 주소 추천목록',
			apiFunction: apiGetTruthcustkeyList,
			dropdownConfig: DEFAULT_DROPDOWN_CONFIG,
		},
	],
]);

/**
 * 검색 팝업 설정 조회 함수
 * @param {string} type 타입
 * @returns {SearchPopupConfig | undefined} 검색 팝업 설정
 */
export const getSearchPopupConfig = (type: string): SearchPopupConfig | undefined => {
	return SEARCH_POPUP_CONFIG.get(type);
};

/**
 * 팝업 타입별 API 함수 조회
 * @param {string} type 타입
 * @returns {Function} API 함수
 */
export const getSearchPopupApiFunction = (type: string) => {
	const config = SEARCH_POPUP_CONFIG.get(type);
	return config?.apiFunction;
};

/**
 * 팝업 타입별 제목 조회
 * @param {string} type 타입
 * @returns {string} 제목
 */
export const getSearchPopupTitle = (type: string): string => {
	const config = SEARCH_POPUP_CONFIG.get(type);
	return config?.title || '조회';
};

export const getSearchPopupDropdownConfig = (type: string): SearchPopupConfig['dropdownConfig'] => {
	const config = SEARCH_POPUP_CONFIG.get(type);
	return config?.dropdownConfig || DEFAULT_DROPDOWN_CONFIG;
};
