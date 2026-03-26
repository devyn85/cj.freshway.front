/*
############################################################################
# Component: TmLocationHistoryPopup (차량 설정 모달)
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
import { Button, SearchFormResponsive } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import Modal from '@/components/common/Modal';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Form, Typography } from 'antd';
import { useCallback, useEffect } from 'react';

// 배차옵션 모달 Props 타입 정의
export type TmDispatchVehicleModalProps = {
	open: boolean; // 모달 열림/닫힘 상태
	onClose: () => void; // 모달 닫기 함수
	title?: string; // 모달 제목 (차량 설정)
	dccode?: string; // 물류센터 코드 (옵션 저장/조회 시 사용)
	deliveryDate?: any; // 배송일
	tmDeliveryType?: string; // 배송유형 코드
};

const TmLocationHistoryPopup = ({
	open,
	onClose,
	title,
	dccode,
	deliveryDate,
	tmDeliveryType,
}: TmDispatchVehicleModalProps) => {
	const [form] = Form.useForm();
	const gridRef: any = useRef(null);

	// 다국어
	const { t } = useTranslation();

	if (!open) return null;

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
	}, [onClose]);

	// 모달 열림 시
	useEffect(() => {
		gridRef.current.clearGridData();
		gridRef.current.clearSortingAll();
	}, [open]);

	// 모달 닫기 시도 시 변경사항 확인
	const handleAttemptClose = useCallback(() => {
		onClose();
	}, [onClose]);

	const gridCol = [
		// 물류센터 (단일 컬럼)
		{
			headerText: '차량정보',
			dataField: 'carno',
			width: 120,
			editable: false,
			renderer: {
				type: 'TemplateRenderer',
			},
			labelFunction: function (rowIndex: any, columnIndex: any, value: any, headerText: any, item: any) {
				// HTML 템플릿 작성
				return `<div style="display: flex; justify-content: flex-start; align-items: center;"><div style="border-style: solid; border-width: thin; border-radius: 0.2em; padding: 2px; margin-right: 5px;">${item.contractTypeData1}</div> ${value}</div> `;
			},
		},
		{
			headerText: '다회전',
			dataField: 'priorityYn',
			dataType: 'code',
			width: 30,
			renderer: {
				// type: "SwitchRenderer",
				// editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
				// isRound: true, // 둥근 스위치 형태로 출력할지 여부(기본값 : false)
				type: 'CheckBoxEditRenderer',
				editable: true,
				checkValue: 'Y',
				unCheckValue: 'N',
			},
		},
		{
			headerText: '운행',
			dataField: 'deliveryYn',
			dataType: 'code',
			width: 30,
			renderer: {
				// type: "SwitchRenderer",
				// editable: true, // 체크박스 편집 활성화 여부(기본값 : false)
				// isRound: true, // 둥근 스위치 형태로 출력할지 여부(기본값 : false)
				type: 'CheckBoxEditRenderer',
				editable: true,
				checkValue: 'Y',
				unCheckValue: 'N',
			},
		},
		// {
		// 	dataField: 'dccode',
		// 	visible: false,
		// },
	];

	const gridProps = {
		showRowNumColumn: false,
		editable: true,
		fillColumnSizeMode: true,
		enableFilter: true,
		selectionMode: 'singleRow',
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
				}
			});
		} catch (e) {
			//console.warn('WM API failed', e);
			// message.error(t('msg.MSG_COM_ERR_014'));
			// setGridData([]);
			// setTotalCnt(0);
		}
	};

	/**
	 * 	조회
	 * @param {string} deliverydt - 배송일자
	 * @param {string} dccode - 센터
	 * @param {string} contracttype - 계약유형(: 지입, : 고정, : 임시, : 실비)
	 * @param {string} tmDeliverytype - 배송유형(: 배송, : 조달, : 수송)
	 * @param {string} carno - 키워드검색(차량번호, 기사)
	 */
	const searchList = async (type: string) => {
		// refs.gridRef?.current?.clearGridData();
		// refs.gridRef1?.current?.clearGridData();
		try {
			await form.validateFields();

			// //console.log(form.getFieldsValue());
			const params = form.getFieldsValue();
			// const dateFormat = 'YYYYMMDD';

			// params.deliverydt = dayjs(params.deliverydt).format(dateFormat);

			// if(commUtil.isEmpty(params.type)) {
			// 	params.type = 'ALL';
			// }

			// params.tmDeliverytype = null; // TODO : 데이터 문제로 임시로 null 처리 삭제 해야됨
			// params.contracttype = null; // TODO : 데이터 문제로 임시로 null 처리 삭제 해야됨

			// //console.log(params, type);
			// // const params = {
			// // 	deliverydt: '',
			// // 	dccode: '',
			// // 	contracttype: '',
			// // 	tmDeliverytype: '',
			// // 	carno: ''
			// // };
			// searchListImp(params);
		} catch (error: any) {
			showAlert(null, error.errorFields[0].errors[0]);
			// 에러 메시지 추출 (antd v4 기준)
			//if (error && error.errorFields && error.errorFields.length > 0) {
			//	showAlert(null, error.errorFields[0].errors[0]);
			//} else {
			//showAlert(null, t('msg.existsEmptyFields'));
			//}
		}
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 * @param {any} params.gridData
	 * @param {any} params.dataList
	 */

	const searchListImp = (params: any) => {
		// //console.log('???????????', getCommonCodeList('TM_DELIVERYTYPE'));
		// 써머리
		// apiTmLocationMonitorPostGetVehicleConditionCountList(params).then((res) => {
		// 	//console.log('axios all: ', res);
		// });
	};

	const titleFunc = {
		searchYn: searchList,
	};

	return (
		<Modal closeModal={handleAttemptClose} width={'480px'}>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="ddddd" func={titleFunc} />
			{/* <Typography.Text strong style={{ fontSize: 16 }}>
				{title}
			</Typography.Text> */}
			<SearchFormResponsive form={form} groupClass={'grid-column-4'}>
				<li style={{ width: '36em' }}>
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
				<li style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
					<Button type="secondary" onClick={onSearchList}>
						조회
					</Button>
				</li>
			</SearchFormResponsive>

			<Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
				<ExclamationCircleFilled /> 다회전, 운행 여부는 해당 배차에만 유효합니다.
			</Typography.Paragraph>

			<div style={{ width: '100%', height: '70%' }}>
				<AGrid>
					<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
				</AGrid>
			</div>
		</Modal>
	);
};

export default TmLocationHistoryPopup;
