/*
############################################################################
# Component: TmDispatchVehicleModal (차량 설정 모달)
# 목적: TmOrderList 화면에서 배차 조건을 설정하는 모달 컴포넌트
# 
# [주요 기능]
# - 차량 설정(조회, 상태 저장)
# 
# [Props]
# - open: 모달 열림/닫힘 상태
# - onClose: 모달 닫기 함수
# - title: 모달 제목
# - dccode: 물류센터 코드 (옵션 저장/조회 시 사용)
# - deliveryDate : 조회 일자
# - tmDeliveryType : 배송 타입
# 
# [API 연동]
# - apiGetPlanCarGridList: 조회
# - setDispatchOptions: 저장
############################################################################
*/

import { apiGetPlanCarGridList, apiPostSavePlanCarGridList } from '@/api/wm/apiWmDocument';
import AGrid from '@/assets/styled/AGrid/AGrid';
import CmCarSearch from '@/components/cm/popup/CmCarSearch';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { Button, Datepicker, SearchFormResponsive } from '@/components/common/custom/form';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Form, Typography } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showAlert, showConfirm } from '@/util/MessageUtil';

// 배차옵션 모달 Props 타입 정의
export type TmDispatchVehicleModalProps = {
	open: boolean; // 모달 열림/닫힘 상태
	onClose: () => void; // 모달 닫기 함수
	title?: string; // 모달 제목 (차량 설정)
	dccode: string; // 물류센터 코드 (옵션 저장/조회 시 사용)
	deliveryDate: any; // 배송일
	tmDeliveryType: string; // 배송유형 코드
	assignedVehicles?: string[]; // 배차된 차량 carno 목록 (운행 변경 제한용)
	multiRoundVehicles?: string[]; // 다회차 차량 carno 목록 (2회전 옵션 변경 제한용)
};

const TmDispatchVehicleModal = ({
	open,
	onClose,
	title,
	dccode,
	deliveryDate,
	tmDeliveryType,
	assignedVehicles = [],
	multiRoundVehicles = [],
}: TmDispatchVehicleModalProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	const gridRef: any = useRef(null);
	const [rowCount, setRowCount] = useState(0);
	const isAlertShowing = useRef(false); // 알림 중복 방지 플래그

	// 다국어
	const { t } = useTranslation();

	const carcapacityLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('CARCAPACITY', value)?.cdNm;
	};

	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = () => {
		onSearchList();
	};

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({ searchKeywordCode: '', multiSelect: '' });
		gridRef.current.clearGridData();
		setRowCount(0);
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = {
		searchYn: onClickSearchButton,
		refresh: onClickRefreshButton,
	};

	// 저장 처리
	const handleSave = useCallback(() => {
		try {
			// 저장
			apiPostSavePlanCarGridList(gridRef.current.getChangedData()).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, t('msg.confirmSaved'), () => {
						onClose();
					});
				}
			});
		} catch (e) {}
	}, [onClose, t]);

	// 모달 열림 시
	useEffect(() => {
		if (!open) return;
		gridRef.current?.clearGridData();
		gridRef.current?.clearSortingAll();
		form.setFieldValue('labelDeliveryDate', deliveryDate || '');
		setRowCount(0);
	}, [open, deliveryDate, form]);

	// 차량 설정 변경 시 배차/다회차 차량 검증
	useEffect(() => {
		if (!open) return;
		const gridRefCurrent = gridRef.current;
		if (!gridRefCurrent) return;

		gridRefCurrent.bind('cellEditEnd', (event: any) => {
			const { rowIndex, dataField, value, item } = event;
			const carno = item?.carno;

			// 운행 설정(deliveryYn)을 끄려는 경우: 배차된 차량인지 체크
			if (dataField === 'deliveryYn' && value === 'N') {
				if (assignedVehicles.includes(carno)) {
					gridRefCurrent.setCellValue(rowIndex, dataField, 'Y');
					if (!isAlertShowing.current) {
						isAlertShowing.current = true;
						showAlert('알림', '이미 배차된 차량입니다. 배차를 삭제한 후 다시 시도해 주세요.', () => {
							isAlertShowing.current = false;
						});
					}
					return;
				}
			}

			// 2회전 설정(priorityYn)을 끄려는 경우: 다회차 차량인지 체크
			if (dataField === 'priorityYn' && value === 'N') {
				if (multiRoundVehicles.includes(carno)) {
					gridRefCurrent.setCellValue(rowIndex, dataField, 'Y');
					if (!isAlertShowing.current) {
						isAlertShowing.current = true;
						showAlert('알림', '2회차 이상 배치된 차량입니다. 배차를 삭제한 후 다시 시도해 주세요.', () => {
							isAlertShowing.current = false;
						});
					}
					return;
				}
			}
		});

		return () => {
			gridRefCurrent?.unbind('cellEditEnd');
		};
	}, [open, assignedVehicles, multiRoundVehicles]);

	// 모달 닫기 시도 시 변경사항 확인
	const handleAttemptClose = useCallback(() => {
		if (gridRef.current.getChangedData().length === 0) {
			// 변경사항이 없으면 바로 닫기
			onClose();
			return;
		} else {
			// 변경사항이 있습니다. 계속 진행하시겠습니까?
			showConfirm(null, t('msg.MSG_COM_CFM_009'), () => {
				onClose();
			});
		}
	}, [onClose, t]);

	const gridCol = [
		// 물류센터 (단일 컬럼)
		{
			headerText: t('lbl.CARNO') || '차량번호',
			dataField: 'carno',
			dataType: 'code',
			width: 80,
			editable: false,
		},
		{
			headerText: t('lbl.CONTRACTTYPE') || '계약유형',
			dataField: 'contractTypeData1',
			dataType: 'code',
			width: 40,
			editable: false,
		},
		{
			headerText: t('lbl.TON_GRADE') || '톤급',
			dataField: 'carCapacity',
			dataType: 'code',
			width: 40,
			editable: false,
			labelFunction: carcapacityLabelFunc,
		},
		{
			headerText: '회전 여부',
			dataField: 'priorityYn',
			dataType: 'code',
			width: 30,
			renderer: {
				type: 'CheckBoxEditRenderer',
				editable: true,
				checkValue: 'Y',
				unCheckValue: 'N',
			},
		},
		{
			headerText: '운행 여부',
			dataField: 'deliveryYn',
			dataType: 'code',
			width: 30,
			renderer: {
				type: 'CheckBoxEditRenderer',
				editable: true,
				checkValue: 'Y',
				unCheckValue: 'N',
			},
		},
	];

	const gridProps = {
		showRowNumColumn: true,
		editable: true,
		fillColumnSizeMode: true,
		enableFilter: true,
	} as any;

	const onSearchList = () => {
		form.setFieldValue('dccode', dccode || '');
		form.setFieldValue('tmDeliveryType', tmDeliveryType || '');
		form.setFieldValue('deliveryDate', deliveryDate?.format('YYYYMMDD') || '');

		const values = form.getFieldsValue();

		try {
			apiGetPlanCarGridList(values).then(res => {
				if (res.statusCode === 0) {
					gridRef.current.setGridData(res.data);
					setRowCount(res.data?.length || 0);
					return;
				}
				setRowCount(0);
			});
		} catch (e) {
			//console.warn('WM API failed', e);
			setRowCount(0);
		}
	};

	if (!open) return null;

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={title} func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchFormResponsive form={form} groupClass={'grid-column-2'}>
				<li>
					<Datepicker label={'배송일자'} form={form} name={'labelDeliveryDate'} disabled readOnly />
				</li>
				<li>
					{/* 차량번호/기사 */}
					<CmCarSearch
						form={form}
						code="searchKeyword"
						name="searchKeywordCode"
						label="차량번호/기사"
						selectionMode="multipleRows"
					/>
					<Form.Item name="dccode" hidden></Form.Item>
					<Form.Item name="tmDeliveryType" hidden></Form.Item>
					<Form.Item name="deliveryDate" hidden></Form.Item>
				</li>
			</SearchFormResponsive>

			<Typography.Paragraph
				type="secondary"
				style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
			>
				<span>{rowCount > 0 ? `목록 | ${rowCount}대` : ''}</span>
				<span>
					<ExclamationCircleFilled /> 다회전, 운행 여부는 해당 배차에만 유효합니다.
				</span>
			</Typography.Paragraph>

			<div style={{ width: '100%', height: '70%' }}>
				<AGrid>
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
			</div>

			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, marginTop: 16 }}>
				<Button onClick={handleAttemptClose}>닫기</Button>
				<Button type="primary" onClick={handleSave} disabled={rowCount === 0}>
					저장
				</Button>
			</div>
		</>
	);
};

export default TmDispatchVehicleModal;
