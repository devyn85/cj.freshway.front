/*
############################################################################
# Screen: TmOrderList (주문목록)
# 목적: 배차 전 주문 검토/검색, 배차 옵션 설정, 자동 배차 트리거
# 
# [주요 기능]
# - WM API를 통한 주문 목록 조회 및 표시
# - 배차 옵션 설정 (최대중량, 특수조건, 최대착지수, 다회전여부, CBM조정, POP개수제한)
# - 자동배차 실행 (좌표 대량 업데이트 후 배차 계산 화면으로 이동)
# - 좌표 보정 기능 (CmMapPopup 연동, 더블클릭으로 좌표 수정)
# - 좌표오류 건수 확인 및 알림
# 
# [검색 조건]
# - 배송일자: YYYY-MM-DD 형식, 기본값=시스템일자+1일
# - 배송유형: 배송(기본값), 반품, 조달 등
# - 거래처명: CmCustSearch 컴포넌트를 통한 다중 선택
# - DC코드: MsCenterDistrictSearchMultiSelectBox를 통한 단일 선택
# 
# [그리드 기능]
# - AUIGrid 기반 주문 목록 표시
# - 좌표오류 컬럼 더블클릭 시 좌표 설정 모달 오픈
# - 관리처/실착지/좌표오류/POP 등 주요 정보 표시
# - 우클릭 메뉴를 통한 좌표수정/거래처정보 기능
# 
# [API 연동]
# - getOrderList: 주문 목록 조회
# - updateBulkCustDlvInfoPoint: 좌표 대량 업데이트
# - updateCustDlvInfoPoint: 좌표 단건 업데이트
# - getDispatchOptions/setDispatchOptions: 배차 옵션 조회/저장
############################################################################
*/

import CustomModal from '@/components/common/custom/CustomModal';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { SearchFormResponsive } from '@/components/common/custom/form';
import MsCenterDlvDistrictSearchPopup from '@/components/ms/popup/MsCenterDlvDistrictSearchPopup';
import TmOrderListGrid from '@/components/tm/order/TmOrderListGrid';
import TmOrderListSearch from '@/components/tm/order/TmOrderListSearch';
import { useCloseTab } from '@/hooks/useCloseTab';
import { useMoveMenu } from '@/hooks/useMoveMenu';
import { useAppDispatch, useAppSelector } from '@/store/core/coreHook';
import { getFindTab } from '@/store/core/tabStore';
import { Modal as AntdModal, Button, Form, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

// API 및 타입 정의
import {
	apiGetOrderManualGeoValidation,
	apiPostOrderManualExcelDownload,
	getOrderList,
	updateBulkCustDlvInfoPoint,
	updateCustDlvInfoPoint,
	type TmOrderListReqDto,
	type TmOrderListResDto,
} from '@/api/wm/apiWmDocument';
import CmMapPopup from '@/components/cm/popup/CmMapPopup';
import TmClaimModal from '@/components/tm/TmClaimModal';
import TmDispatchOptionsModal from '@/components/tm/TmDispatchOptionsModal';
import TmDispatchVehicleModal from '@/components/tm/TmDispatchVehicleModal';
import TmManualDispatchUploadExcelPopup from '@/components/tm/order/TmManualDispatchUploadExcelPopup';
import {
	clearPendingAdjustParams,
	clearTmDispatchResult,
	PendingDispatchCriteria,
	setPendingDispatchCriteria,
} from '@/store/tm/tmDispatchStore';
import { showAlert, showMessage } from '@/util/MessageUtil';
import FileSaver from 'file-saver';

// 타입 정의
type OrderRow = Record<string, any>;

const TmOrderList = () => {
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const { moveMenu } = useMoveMenu();
	const { closeTab } = useCloseTab();
	const dispatch = useAppDispatch();
	const location = useLocation();

	// 모달 참조
	const refCenterDlvSearch: any = (useRef as any)(null);
	const refGeoModal: any = (useRef as any)(null);
	const refClaimModal: any = (useRef as any)(null);
	const refCarModal: any = (useRef as any)(null);
	const refBaeModal: any = (useRef as any)(null);
	const refManualDispatchModal: any = (useRef as any)(null);
	const refGrid: any = (useRef as any)(null);

	// 좌표오류 팝업 관련
	const [searchLatLng, setSearchLatLng] = useState([0, 0]);
	const [addressInfo, setAddressInfo] = useState({ fullAddress1: '', fullAddress2: '', fullAddress3: '' });
	const [searchAddr, setSearchAddr] = useState('');
	const [latLng, setLatLng] = useState(['0', '0']);
	const [radius, setRadius] = useState('');
	const [stytime, setStytime] = useState('');

	// 전역 스토어에서 배송일자 조회
	// 사용처: 검색 폼의 기본값 설정, 자동배차 시 배송일자 전달
	// 저장 이유: 다른 화면(TmPlan 등)에서 설정한 배송일자를 유지하여 사용자 편의성 향상
	const storedDeliveryDate = useAppSelector(state => state.tmDispatch.deliveryDate);
	const initialDeliveryDate = useMemo(() => {
		if (storedDeliveryDate && /^\d{8}$/.test(storedDeliveryDate)) {
			return dayjs(storedDeliveryDate, 'YYYYMMDD');
		}
		return dayjs().add(1, 'day');
	}, [storedDeliveryDate]);

	// 그리드 데이터 상태
	// 사용처: TmOrderListGrid 컴포넌트에 전달하여 주문 목록 표시
	// 저장 이유: API 응답 데이터를 가공하여 그리드에 맞는 형태로 변환하여 저장
	const [gridData, setGridData] = useState<any[]>([]);
	const [totalCnt, setTotalCnt] = useState<number>(0);

	// 좌표 설정 모달 상태
	// 사용처: CmMapPopup 컴포넌트에서 주소 검색 및 좌표 설정
	// 저장 이유: 선택된 행의 주소 정보를 모달에 전달하고, 좌표 저장 후 해당 행만 업데이트
	const [mapSearchText, setMapSearchText] = useState<string>('');
	const [selectedRow, setSelectedRow] = useState<OrderRow | null>(null);

	// 배차옵션 설정 모달
	// 사용처: TmDispatchOptionsModal 컴포넌트에서 배차 조건 설정
	// 저장 이유: 배송/조달 유형에 따라 모달 제목을 동적으로 변경하여 사용자에게 명확한 정보 제공
	const [optOpen, setOptOpen] = useState(false);
	const optionTitle = useMemo(() => {
		const raw = form.getFieldValue('tmDeliverytype');
		let types: string[] = [];
		if (Array.isArray(raw)) types = raw;
		else if (raw) types = [raw];
		else types = ['배송'];
		const isProcurement = types.some(v => String(v).includes('조달'));
		return isProcurement ? t('lbl.DISPATCH_OPTIONS_PROCURE') : t('lbl.DISPATCH_OPTIONS_DELIVERY');
	}, [form, t]);

	// 차량 설정 모달
	// 사용처: TmDispatchCarsModal 컴포넌트에서 차량 조건 설정
	const [carOpen, setCarOpen] = useState(false);

	// 주문 목록 조회
	// 사용처: 검색 버튼 클릭 시 호출, 메뉴 타이틀의 검색 기능으로도 호출
	// API: getOrderList (WM API) - /api/tm/orderList/v1.0/getOrderList
	// 저장 이유: 검색 조건에 맞는 주문 목록을 조회하여 그리드에 표시하고, 좌표오류 건수를 알림
	const onSearch = useCallback(
		async (options?: { errorMessage?: string; alert?: boolean }) => {
			const values = form.getFieldsValue();
			try {
				// API 요청 파라미터 구성
				const apiRes = await getOrderList({
					deliveryDate: values.deliveryDate,
					deliveryType: values.deliveryType,
					custName: values.customer || undefined,
					gDccode: values.gDccode,
				});

				// 응답 데이터 변환
				const items: TmOrderListResDto[] = apiRes?.data || [];
				const total = items.length;

				// 날짜 형식 변환 함수 (YYYYMMDD -> YYYY-MM-DD)
				const yyyymmddToDash = (s?: string) => {
					const v = String(s || '');
					return v.length === 8 ? `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)}` : '';
				};

				// 그리드용 데이터 매핑 (API 응답을 그리드 컬럼에 맞게 변환)
				const mapped = items.map((item, idx) => {
					const pop = (item?.popno || '').toString();
					const claimYn = (item?.claimYn || '').toString().trim().toUpperCase() === 'Y' ? 'Y' : 'N';
					return {
						...item,
						rowNo: idx + 1,
						dcname: item?.dcname || '',
						deliverydate: yyyymmddToDash(item?.deliverydate),
						tmDeliverytype: item?.tmDeliverytype || '',
						ordertypeNm: item?.ordertypeNm || '',
						dlvgroupId: item?.dlvgroupId || '',
						dlvgroupNm: item?.dlvgroupNm || '',
						dlvdistrictId: item?.dlvdistrictId || '',
						dlvdistrictNm: item?.dlvdistrictNm || '',
						popno: pop,
						hjdongCd: item?.hjdongCd || '',
						claimYn,
						toCustkey: item?.toCustkey || '',
						toCustname: item?.toCustname || '',
						toCustAddress: item?.toCustAddress || '',
						toTruthcustkey: item?.toTruthcustkey || '',
						toTruthcustname: item?.toTruthcustname || '',
						toTruthcustAddress: item?.toTruthcustAddress || '',
						coordinateYn: (item?.coordinateYn || '').toString().toUpperCase(),
						orderQty: Number(item?.orderQty || 0),
						orderWeight: Number(item?.orderWeight || 0),
						orderCube: Number(item?.orderCube || 0),
						fixedVehicleInfo: '',
					};
				});

				// 센터 좌표 오류 메세지지
				const firstRow = mapped[0];
				const hasMissingCenterCoord =
					!options?.alert && firstRow && (firstRow.dcLatitude == null || firstRow.dcLongitude == null);
				if (hasMissingCenterCoord) {
					AntdModal.info({
						content: (
							<>
								물류센터 좌표가 없습니다
								<br />
								물류센터 설정을 확인해주세요.
							</>
						),
						okText: '확인',
					});
				}

				// 고정차량 오류 메세지, 좌표업데이트 실패 오류 메세지, 좌표오류 건수 메세지
				const carnoRows = mapped.filter((row: any) => String(row?.carnoYn).toUpperCase() === 'N');
				const errorCount = mapped.filter((row: any) => String(row?.coordinateYn).toUpperCase() === 'Y').length;
				const errorOtdCount = mapped.filter((row: any) => String(row?.otdTimeYn).toUpperCase() === 'Y').length;
				if (!hasMissingCenterCoord && !options?.alert && carnoRows.length > 0) {
					const firstCustName =
						carnoRows.find(row => (row?.toTruthcustname || '').toString().trim() !== '')?.toTruthcustname || '';
					const others = carnoRows.length - 1;
					const suffix = others > 0 ? `${firstCustName} 외 ${others}건` : `${firstCustName}`;
					AntdModal.info({
						content: (
							<>
								거래처별 고정 차량번호 설정을
								<br />
								확인해주세요.
								<br />
								{suffix}
							</>
						),
						okText: '확인',
					});
				} else if (!hasMissingCenterCoord && !options?.alert && errorCount > 0) {
					const mergedMessage = options?.errorMessage ? (
						<>
							좌표 업데이트에 실패했습니다.
							<br />
							수동 업데이트를 진행해주세요.
							<br />
							전체 : {errorCount}건<br />
							실착지 : {options?.errorMessage}건
						</>
					) : undefined;
					AntdModal.info({
						content: mergedMessage || `좌표오류 ${errorCount}건이 있습니다.`,
						okText: '확인',
					});
				} else if (!hasMissingCenterCoord && !options?.alert && errorOtdCount > 0) {
					AntdModal.info({
						content: (
							<>
								거래처별 OTD TIME 설정을
								<br />
								확인해주세요.
								<br />
								{errorOtdCount}건
							</>
						),
						okText: '확인',
					});
				}

				setGridData(mapped);
				setTotalCnt(total);
			} catch (e) {
				//console.warn('WM API failed', e);
				showAlert('알림', t('msg.MSG_COM_ERR_014'));
				setGridData([]);
				setTotalCnt(0);
			}
		},
		[form, t],
	);

	useEffect(() => {
		const search = (location.state as any)?.state?.search;
		const alert = (location.state as any)?.state?.requeryFromPlan;
		if (!search) return;

		const nextValues = {
			...search,
			deliveryDate: search.deliveryDate ? dayjs(search.deliveryDate, 'YYYYMMDD') : search.deliveryDate,
		};

		form.setFieldsValue(nextValues);
		onSearch({ alert });
	}, [(location.state as any)?.state?.key, form, onSearch]);

	// 자동배차 실행
	// 사용처: 자동배차 버튼 클릭 시 호출
	// API: updateBulkCustDlvInfoPoint (좌표 대량 업데이트) -> setPendingDispatchCriteria (Redux 저장) -> TmPlan 화면 이동
	// 저장 이유: 배차 전 좌표를 최신화하고, 배차 조건을 Redux에 저장하여 TmPlan 화면에서 사용
	const handleAutoDispatch = useCallback(async () => {
		const values = form.getFieldsValue();
		if (!values?.deliveryDate) {
			showAlert('알림', t('msg.MSG_COM_VAL_054', [t('lbl.DELIVERYDATE_WD')]));
			return;
		}

		try {
			// 이미 배차 계획 탭이 열려있다면 닫고 이동
			const existingTab = getFindTab('/tm/TmPlan');
			if (existingTab?.menuUUID) {
				closeTab(existingTab.menuUUID);
			}

			// 배송 유형 검증 (현재는 배송만 지원)
			const deliveryTypeRaw = values?.deliveryType;
			let selectedTypes: string[] = [];
			if (Array.isArray(deliveryTypeRaw)) selectedTypes = deliveryTypeRaw;
			else if (deliveryTypeRaw) selectedTypes = [deliveryTypeRaw];
			const includeDelivery = selectedTypes.length === 0 || selectedTypes.includes('WD');

			// 1) 좌표 대량 업데이트 수행
			// 사용처: 배차 전 모든 주문의 좌표를 최신화
			// 저장 이유: 배차 엔진이 정확한 좌표를 기반으로 최적 경로를 계산할 수 있도록 함
			const deliveryDate = dayjs(values.deliveryDate).format('YYYYMMDD');
			const bulkReq: TmOrderListReqDto = {
				deliveryDate,
				deliveryType: values.deliveryType,
				gDccode: Array.isArray(values.gDccode) ? values.gDccode.filter(Boolean).join(',') : values.gDccode,
			};

			const bulkRes = await updateBulkCustDlvInfoPoint(bulkReq);
			if (bulkRes?.statusCode === 500) {
				await onSearch({ errorMessage: bulkRes?.statusMessage });
				return;
			}

			// 2) 고객 코드/명 추출 (복수 선택 시 첫 번째만 사용)
			// 사용처: 배차 조건에 고객 필터링 정보 포함
			// 저장 이유: 특정 고객만 배차하고 싶을 때 사용
			const custCode: string | undefined = values?.customer
				? String(values.customer)
						.split(',')
						.map((s: string) => s.trim())
						.filter(Boolean)[0]
				: undefined;
			let custName: string | undefined;
			if (values?.customerName) {
				const firstToken = String(values.customerName).split(',')[0] ?? '';
				custName = firstToken.replace(/^\s*\[[^\]]*\]\s*/, '');
			}

			// 3) 배차 조건을 Redux에 저장하고 배차 계산 화면으로 이동
			// 사용처: TmPlan 화면에서 배차 조건을 조회하여 사용
			// 저장 이유: 화면 간 데이터 전달을 위해 Redux 스토어에 저장

			// 배송유형이 '배송(1)'이면 planOptionType: 1, 나머지(조달 등)는 2
			const planOptionType = values.deliveryType === '1' ? 1 : 2;

			const criteria: PendingDispatchCriteria = {
				deliveryDate,
				deliveryType: 'WD',
				dccode: Array.isArray(values.gDccode) ? values.gDccode.filter(Boolean).join(',') : values.gDccode ?? null,
				custCode: custCode ?? null,
				custName: custName ?? null,
				planOptionType,
			};

			dispatch(clearPendingAdjustParams());
			dispatch(clearTmDispatchResult());
			dispatch(setPendingDispatchCriteria(criteria));

			const searchState = {
				deliveryDate: values?.deliveryDate ? dayjs(values.deliveryDate).format('YYYYMMDD') : undefined,
				deliveryType: values?.deliveryType,
				customer: values?.customer,
				customerName: values?.customerName,
				gDccode: values?.gDccode,
			};

			moveMenu('/tm/TmPlan', {
				state: { key: Date.now(), search: searchState },
			});
		} catch (error) {
			showAlert('알림', '자동배차에 실패했습니다.');
		}
	}, [form, t, moveMenu, dispatch, closeTab]);

	// 클레임 모달 열기
	const handleClickClaim = useCallback((row: OrderRow, rowIndex?: number) => {
		setSelectedRow(row || null);

		refClaimModal?.current?.handlerOpen?.();
	}, []);

	// 좌표 설정 모달 열기
	// 사용처: 그리드의 좌표오류 컬럼 더블클릭 시 호출, 우클릭 메뉴의 좌표수정 선택 시 호출
	// 저장 이유: 선택된 행의 주소를 모달에 전달하고, 좌표 저장 후 해당 행만 업데이트하기 위해 인덱스 저장
	const handleClickEditGeo = useCallback((row: OrderRow, rowIndex?: number) => {
		// truthcustkeyExistsYn이 "N"이면 실착지 데이터가 없어 좌표 수정 불가
		if (row?.truthcustkeyExistsYn === 'N') {
			showAlert('알림', '실착지 정보가 없습니다.');
			return;
		}

		setSelectedRow(row || null);
		setMapSearchText(row?.toTruthcustAddress || row?.toCustAddress || '');
		// 선택된 인덱스를 저장하여 저장 후 정확한 행만 갱신
		// localStorage 키: 'WMS_TM_LAST_ROW_INDEX'
		(localStorage as any).WMS_TM_LAST_ROW_INDEX = String(rowIndex ?? '');
		setLatLng([row.toLatitude?.toString() || 0, row.toLongitude?.toString() || 0]);
		setSearchAddr(commUtil.isNotEmpty(row.toTruthcustAddress) ? row.toTruthcustAddress : row.toCustAddress);
		setRadius(row.toRadius);
		setStytime(row.toStytime);
		refGeoModal?.current?.handlerOpen?.();
	}, []);

	// 거래처 정보 모달 열기 (현재 비활성)
	// 사용처: 우클릭 메뉴의 거래처정보 선택 시 호출 (현재 미구현)
	// 저장 이유: 향후 거래처 상세 정보 모달 구현 시 사용
	const handleClickCustInfo = useCallback((row: OrderRow) => {
		setSelectedRow(row || null);
		// 팝업은 현재 비활성 처리
	}, []);

	// 그리드 표시용 데이터
	// 사용처: TmOrderListGrid 컴포넌트에 전달하여 그리드에 표시
	// 저장 이유: API 응답 데이터를 그리드에 맞는 형태로 변환하여 저장
	const gridViewData = useMemo(() => {
		return gridData.map(row => ({
			...row,
			fixedVehicleInfo: '', // 차량정보 컬럼은 빈 문자열로 설정
		}));
	}, [gridData]);

	// 센터 좌표 미존재 && 반품 외 데이터 미존재 && 고정차량 셋팅안된 데이터 존재
	const hasDeliveryType = useMemo(() => {
		const firstRow = gridViewData[0];
		const hasCenterCoord = firstRow ? firstRow.dcLatitude == null || firstRow.dcLongitude == null : false;
		const hasType = gridViewData.some(row => String(row?.tmDeliverytype || '').trim() !== '2');
		const hasCarNoError = gridViewData.some(row => String(row?.carnoYn || '').toUpperCase() === 'N');
		return hasType && !hasCarNoError && !hasCenterCoord;
	}, [gridViewData]);

	// OTD시간오류존재
	const hasOtdTimeError = gridViewData.some(row => String(row?.otdTimeYn || '').toUpperCase() === 'Y');

	// 센터 좌표 미존재 && 반품 외 데이터 미존재 && 고정차량 셋팅안된 데이터 존재 && 좌표오류 존재
	const getHasExcelType = useCallback(() => {
		const firstRow = gridViewData[0];
		const hasCenterCoord = firstRow ? firstRow.dcLatitude == null || firstRow.dcLongitude == null : false;
		const hasType = gridViewData.some(row => String(row?.tmDeliverytype || '').trim() !== '2');
		const hasCarNoError = gridViewData.some(row => String(row?.carnoYn || '').toUpperCase() === 'N');
		const hasCoordinateError = gridViewData.some(row => String(row?.coordinateYn || '').toUpperCase() === 'Y');
		return hasType && !hasCarNoError && !hasCoordinateError && !hasCenterCoord;
	}, [gridViewData]);

	const hasExcelType = useMemo(() => getHasExcelType(), [getHasExcelType]);

	// 메뉴 타이틀 함수 (검색 기능 포함)
	// 사용처: MenuTitle 컴포넌트에 전달하여 상단 검색 버튼 기능 제공
	// 저장 이유: 메뉴 타이틀에서 직접 검색을 실행할 수 있도록 함
	const titleFunc = useMemo(() => ({ searchYn: onSearch }), [onSearch]);

	// 검색 : 배송유형 state
	const [searchSelectDeliveryType] = useState([
		{ label: '배송', value: '1' },
		{ label: '조달(일배)', value: '3' },
		{ label: '조달(저장)', value: '4' },
		{ label: '조달저장-임시', value: '5' },
		// { label: '반품', value: '2' },
	]);

	// 수동배차 엑셀 다운로드
	// 사용처: 수동배차 엑셀 다운로드 버튼 클릭 시 호출
	// 저장 이유: 좌표 검증 후 엑셀 파일 다운로드 실행
	const handleManualExcelDownload = useCallback(async () => {
		try {
			await form.validateFields();

			const values = form.getFieldsValue();
			values.deliveryDate = values.deliveryDate.format('YYYYMMDD');
			values.deliveryTypeCode = values.deliveryType;
			apiGetOrderManualGeoValidation(values).then(validationRes => {
				// 응답 본문에서 statusCode 확인 (HTTP 200이어도 응답 본문에 에러가 있을 수 있음)
				if (validationRes?.statusCode !== 0 && validationRes?.statusCode !== undefined) {
					showMessage({
						content: validationRes?.statusMessage || '좌표 검증에 실패했습니다.',
						modalType: 'error',
						title: '알림',
					});
					return;
				}

				// failCount가 있으면 경고 메시지 표시
				if (validationRes?.data?.failCount && validationRes.data.failCount > 0) {
					showMessage({
						content: `거래처 좌표 업데이트 오류가 발생했습니다. 주소 확인 후 수동 업데이트 해주세요.`,
						modalType: 'warning',
						title: '알림',
					});
					return;
				}

				// 검증 성공 시 엑셀 다운로드 실행
				apiPostOrderManualExcelDownload(values).then(res => {
					FileSaver.saveAs(
						res.data,
						`수동배차_${values?.deliveryDate}_${
							searchSelectDeliveryType.find(row => row.value === values.deliveryType)?.label
						}.xlsx`,
					);
				});
			});
		} catch (error: any) {
			showMessage({
				content: error.errorFields[0].errors[0],
				modalType: 'error',
				title: '알림',
			});
		}
	}, [form, searchSelectDeliveryType]);

	return (
		<>
			<MenuTitle func={titleFunc} slotLocation="left">
				{/* 차량 설정 버튼 */}
				<Button
					onClick={() => {
						setCarOpen(true);
						refCarModal?.current?.handlerOpen?.();
					}}
				>
					{t('lbl.VEHICLE_SETTINGS')}
				</Button>
				{/* 배차옵션 설정 버튼 영역 */}
				<Button
					onClick={() => {
						setOptOpen(true);
						refBaeModal?.current?.handlerOpen?.();
					}}
				>
					{t('lbl.DISPATCH_OPTIONS')}
				</Button>
			</MenuTitle>
			<SearchFormResponsive form={form} initialValues={{ deliveryDate: initialDeliveryDate }}>
				<TmOrderListSearch form={form} searchSelectDeliveryType={searchSelectDeliveryType} />
			</SearchFormResponsive>

			<TmOrderListGrid
				data={gridViewData}
				totalCnt={totalCnt}
				onClickEditGeo={handleClickEditGeo}
				onClickCustInfo={handleClickCustInfo}
				onClickClaim={handleClickClaim}
				onGridReady={(grid: any) => {
					refGrid.current = grid;
				}}
				toolbarRight={
					<>
						{/* 수동배차 업로드 */}
						<Button
							variant="solid"
							disabled={gridViewData.length === 0 || !hasExcelType}
							onClick={() => {
								refManualDispatchModal?.current?.handlerOpen?.();
							}}
						>
							{t('엑셀 업로드')}
						</Button>
						{/* 수동배차 다운로드 */}
						<Button
							variant="solid"
							disabled={gridViewData.length === 0 || !hasDeliveryType}
							onClick={handleManualExcelDownload}
						>
							{t('엑셀 다운로드')}
						</Button>
						{/* 자동 배차 */}
						<Tooltip title="클릭 시 배차조정 화면으로 이동합니다">
							<Button
								type="primary"
								onClick={handleAutoDispatch}
								disabled={gridData.length === 0 || !hasDeliveryType || hasOtdTimeError}
							>
								{t('lbl.AUTO_DISPATCH')}
							</Button>
						</Tooltip>
					</>
				}
			/>

			{/* 센터 배송 권역 검색 팝업 (임시) */}
			<CustomModal ref={refCenterDlvSearch} width="1280px">
				<MsCenterDlvDistrictSearchPopup close={() => refCenterDlvSearch?.current?.handlerClose?.()} />
			</CustomModal>

			{/* 차량 설정 모달 */}
			<CustomModal ref={refCarModal} width="1280px">
				<TmDispatchVehicleModal
					open={carOpen}
					onClose={() => {
						setCarOpen(false);
						refCarModal?.current?.handlerClose?.();
					}}
					title={t('lbl.VEHICLE_SETTINGS')}
					dccode={
						Array.isArray(form.getFieldValue('gDccode'))
							? (form.getFieldValue('gDccode') || []).filter(Boolean).join(',')
							: form.getFieldValue('gDccode') || undefined
					}
					deliveryDate={form.getFieldValue('deliveryDate') || ''}
					tmDeliveryType={form.getFieldValue('deliveryType') || ''}
				/>
			</CustomModal>

			{/* 배차옵션 설정 모달 */}
			<CustomModal ref={refBaeModal} width="480px">
				<TmDispatchOptionsModal
					open={optOpen}
					onClose={() => {
						setOptOpen(false);
						refBaeModal?.current?.handlerClose?.();
					}}
					title={optionTitle}
					dccode={
						Array.isArray(form.getFieldValue('gDccode'))
							? (form.getFieldValue('gDccode') || []).filter(Boolean).join(',')
							: form.getFieldValue('gDccode') || undefined
					}
				/>
			</CustomModal>

			{/* 배송 클레임 내역 모달 */}
			<CustomModal ref={refClaimModal} width="1000px">
				{selectedRow && <TmClaimModal row={selectedRow} />}
			</CustomModal>

			{/* 수동배차 업로드 팝업 */}
			<CustomModal ref={refManualDispatchModal} width="1080px">
				<TmManualDispatchUploadExcelPopup
					dccode={form.getFieldValue('gDccode') || ''}
					deliveryDate={form.getFieldValue('deliveryDate') || ''}
					close={() => refManualDispatchModal?.current?.handlerClose?.()}
				/>
			</CustomModal>

			{/* 좌표오류 컬럼 - 좌표 설정 모달 */}
			{/* 사용처: 그리드에서 좌표오류가 있는 행을 더블클릭하거나 우클릭 메뉴에서 좌표수정 선택 시 열림 */}
			{/* API: updateCustDlvInfoPoint - /api/tm/orderList/v1.0/updateCustDlvInfoPoint */}
			{/* 저장 이유: 주문의 배송지 좌표를 수정하여 배차 시 정확한 경로 계산이 가능하도록 함 */}
			<CustomModal ref={refGeoModal} width="1280px">
				<CmMapPopup
					setSearchLatLng={setSearchLatLng}
					setAddressInfo={setAddressInfo}
					searchText={searchAddr}
					close={() => refGeoModal?.current?.handlerClose?.()}
					lat={latLng[0]}
					lon={latLng[1]}
					showRadius={true}
					radius={radius}
					stytime={stytime}
					callBackFn={async (result: any) => {
						if (!selectedRow || !result) return;
						try {
							const address = result.address || {};
							const lat = result.lat ?? 0;
							const lon = result.lon ?? 0;
							const radius = result.radius ?? null;
							const stytime = result.stytime ?? null;
							const req = {
								storerkey: selectedRow?.toStorerKey || selectedRow?.storerkey || '',
								custType: selectedRow?.toCusttype || '',
								// dlvcustkey에 실착지 코드(toTruthcustkey)를 전달
								dlvcustkey: selectedRow?.toTruthcustkey || '',
								longitude: String(lon),
								latitude: String(lat),
								address: address.fullAddress2 || '',
								stytime: stytime,
								radius: radius,
							};

							if (!req.storerkey || !req.dlvcustkey) {
								showAlert('알림', '필수 식별자(storerkey/dlvcustkey)가 없어 저장할 수 없습니다.');
								return;
							}

							await updateCustDlvInfoPoint(req);

							// 그리드 업데이트 (낙관적 업데이트)
							// 동일 실착지코드(toTruthcustkey)를 가진 모든 행에 좌표오류 N, 실착지 주소 반영
							const grid = refGrid.current;
							if (grid) {
								const allRows = grid.getGridData?.() || [];
								const truthcustkey = selectedRow?.toTruthcustkey || '';
								const updatedIndexes: number[] = [];

								// 동일 실착지코드를 가진 모든 행 찾아서 업데이트
								allRows.forEach((row: any, idx: number) => {
									if (row?.toTruthcustkey === truthcustkey) {
										grid.setCellValue(idx, 'toLatitude', String(lat));
										grid.setCellValue(idx, 'toLongitude', String(lon));
										grid.setCellValue(idx, 'toTruthcustAddress', address.fullAddress2);
										grid.setCellValue(idx, 'coordinateYn', 'N');

										grid.updateRow(
											{
												...row,
												toLatitude: String(lat),
												toLongitude: String(lon),
												toTruthcustAddress: address.fullAddress2,
												coordinateYn: 'N',
											},
											idx,
										);
										updatedIndexes.push(idx);
									}
								});

								// 그리드 새로고침
								if (updatedIndexes.length > 0) {
									if (typeof grid.refreshRows === 'function') {
										grid.refreshRows(updatedIndexes);
									} else if (typeof grid.refresh === 'function') {
										grid.refresh();
									}
								}
							}

							// 재 조회 하지않고 버튼 활성, 비활성 판단
							setGridData(prev =>
								prev.map(row =>
									row?.toTruthcustkey === (selectedRow?.toTruthcustkey || '')
										? {
												...row,
												toLatitude: String(lat),
												toLongitude: String(lon),
												toTruthcustAddress: address.fullAddress2,
												coordinateYn: 'N',
										  }
										: row,
								),
							);
							getHasExcelType();
							showAlert('알림', `좌표가 저장되었습니다. (${lat}, ${lon})`);
							refGeoModal?.current?.handlerClose?.();
						} catch (err) {
							showAlert('알림', '좌표 저장에 실패했습니다.');
						}
					}}
				></CmMapPopup>
			</CustomModal>
		</>
	);
};

export default TmOrderList;
