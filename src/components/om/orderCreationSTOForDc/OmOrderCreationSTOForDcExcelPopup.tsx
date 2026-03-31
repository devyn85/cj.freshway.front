/*
 ############################################################################
 # FiledataField	: OmOrderCreationSTOForDcExcelPopup.tsx
 # Description		:  저장품센터간이체 엑셀 업로드 팝업
 # Author			: JeongHyeongCheol
 # Since			: 26.02.03
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { apiGetValidateExcelList, apiPostSaveMasterList } from '@/api/om/apiOmOrderCreationSTOForDc';
import { GridBtnPropsType } from '@/types/common';
import fileUtil from '@/util/fileUtils';
import dayjs from 'dayjs';

// API

interface PropsType {
	close?: any;
	searchForm?: any;
	onSaveSuccess?: any;
	onLoadSuccess?: any;
}

const OmOrderCreationSTOForDcExcelPopup = forwardRef((props: PropsType, ref: any) => {
	//const OmOrderCreationSTOForDcExcelPopup = (props: PropsType, gridRef: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, searchForm, onSaveSuccess } = props;

	// 다국어
	const { t } = useTranslation();

	//const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);

	// search form 데이터 확인
	const { fromDccode, toDccode, deliverydate } = searchForm.getFieldsValue();

	const gridCol = [
		{
			headerText: t('lbl.SKUINFO'), // 상품정보
			children: [
				{
					headerText: t('lbl.SKU'), // 상품코드
					dataField: 'sku',
					dataType: 'code',
				},
				{
					headerText: t('lbl.SKUNAME'), // 상품명칭
					dataField: 'skuName',
					dataType: 'default',
				},
			],
		},
		{
			headerText: t('lbl.STOCKGRADE') + '코드', // 재고속성
			dataField: 'stockgrade',
			dataType: 'code',
		},
		{
			headerText: t('lbl.STOCKGRADE'), // 재고속성
			dataField: 'stockgradeNm',
			dataType: 'code',
		},
		{
			headerText: t('lbl.ORDERUNIT'), // 주문단위
			dataField: 'uom',
			dataType: 'code',
		},
		{
			headerText: t('lbl.FROM_DCCODE'), // 공급센터
			children: [
				{
					headerText: t('lbl.POSBQTY'), // 이동가능량
					dataField: 'openqty',
					dataType: 'numeric',
				},
				{
					headerText: t('lbl.INPLANQTY_DP'), // 입고예정량
					dataField: 'dpQty',
					dataType: 'numeric',
				},
			],
		},
		{
			headerText: t('lbl.TO_DCCODE'), // 공급받는센터
			children: [
				{
					headerText: t('lbl.POSBQTY'), // 이동가능량
					dataField: 'toOpenqty',
					dataType: 'numeric',
					editable: false,
				},
			],
		},
		{
			headerText: t('lbl.REQ_QTY'), // 요청량
			dataField: 'req',
			dataType: 'numeric',
		},
	];
	// 그리드 속성
	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		enableFilter: true,
		showCustomRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 *
	 */

	/**
	 *
	 * @param e
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		ref.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, ref, 1, validateExcelList);
	};

	/**
	 *
	 * @returns
	 */
	const validateExcelList = async () => {
		const params = ref.current.getGridData().map((item: any) => {
			return {
				...item,
				checkId: item._$uid,
				dccode: toDccode,
			};
		});
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// 유효성 검사 리스트 정의
		const validationList = [
			{ value: fromDccode, msg: '공급센터를 선택해주세요' },
			{ value: toDccode, msg: '공급받는센터를 선택해주세요' },
			{ value: deliverydate, msg: '이체일자를 선택해주세요' },
		];

		// 값이 없는 첫 번째 항목 찾기
		const target = validationList.find(item => !item.value);

		if (target) {
			showMessage({
				content: target.msg,
				modalType: 'info',
			});
			return;
		}

		// reqdto 맞춤
		const apiCallData = { saveList: params };

		apiGetValidateExcelList(apiCallData).then(res => {
			const checkColumn = [
				{
					dataField: 'processYn',
					headerText: '체크결과',
				},
				{
					dataField: 'processMsg',
					headerText: '체크메시지',
				},
			];
			ref.current.addColumn(checkColumn, 1);
			const rowsToUpdate = res.data;

			const updateData: any[] = [];
			const updateIndex: any[] = [];
			rowsToUpdate.forEach((row: any, index: any) => {
				const rowIndex = ref.current.getRowIndexesByValue('_$uid', row.checkId);
				if (rowIndex !== undefined) {
					let processMsg;
					let processYn = 'Y';

					if (row.skuYn === 'N') {
						processMsg = '해당 상품코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.stockgradeYn === 'N') {
						processMsg = '재고속성코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.duplicateYn === 'N') {
						processMsg = '중복된 상품코드입니다.';
						processYn = 'N';
					}

					updateData.push({
						processYn: processYn,
						processMsg: processMsg,
					});
					updateIndex.push(rowIndex);
				}
			});
			ref.current.updateRows(updateData, updateIndex);
			// 오류케이스 체크 해제
			const uncheckedItems = ref.current.getGridData().filter((item: any) => {
				return item.processYn === 'N';
			});
			const uncheckedIds = uncheckedItems.map((item: any) => item._$uid);

			ref.current.addUncheckedRowsByIdsBefore(uncheckedIds);
		});
	};

	/**
	 *
	 * @returns
	 */
	const saveExcelList = async () => {
		// 변경 데이터 확인
		const excelParams = ref.current.getCustomCheckedRowItems();

		// 유효성 검사 통과 못한 데이터 확인
		const isProcessYN = excelParams.some((item: any) => item.processYn !== 'Y');

		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		const targetList: any[] = [];
		for (const row of excelParams) {
			const qty = Number(row.req ?? 0);
			if (!row.sku || !row.uom || !row.stockgrade || qty <= 0) {
				continue;
			}
			targetList.push({
				fromStorerkey: null,
				fromDccode,
				fromOrganize: fromDccode,
				fromArea: '1000',
				fromSku: row.sku,
				fromUom: row.uom,
				fromStockgrade: row.stockgrade,
				fromStockid: null,
				toOrderqty: qty,
				toDccode,
				toStorerkey: null,
				toOrganize: toDccode,
				toArea: '1000',
				toSku: row.sku,
				toUom: row.uom,
				toStockgrade: row.stockgrade,
				toStockid: null,
			});
		}

		if (!targetList.length) {
			showAlert(null, t('msg.noModifiedData'));
			return;
		}

		const body = {
			avc_DCCODE: fromDccode,
			avc_COMMAND: 'CONFIRM',
			DC_A: fromDccode,
			DC_B: toDccode,
			fromDccode,
			toDccode,
			DELIVERYDATE: dayjs(deliverydate).format('YYYYMMDD'),
			saveList: targetList,
		};

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${excelParams.length}건
				수정 : 0건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveMasterList(body).then(res => {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						if (res?.statusCode === 0) {
							// 저장 성공 시 부모에게 결과 데이터와 함께 알려서 Tab2로 이동
							onSaveSuccess?.(res.data);
							close();
						}
					},
				});
			});
		});
	};

	/**
	 * 사용자가 체크하고, 정합성에 맞는 데이터만 전송한다
	 * @returns
	 */
	const sendExcelList = async () => {
		// 변경 데이터 확인
		const excelParams = ref.current.getCustomCheckedRowItems();

		// 유효성 검사 통과 못한 데이터 확인
		const isProcessYN = excelParams.some((item: any) => item.processYn !== 'Y');

		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		const targetList: any[] = [];
		for (const row of excelParams) {
			const qty = Number(row.req ?? 0);
			if (!row.sku || !row.uom || !row.stockgrade || qty <= 0) {
				continue;
			}
			targetList.push(row);
		}

		if (targetList === null || targetList.length === 0) {
			showAlert(null, t('msg.MSG_COM_ERR_008'));
			return;
		}

		ref.current.clearGridData();
		ref.current.setGridData(targetList);

		props.onLoadSuccess?.(targetList);
		close();
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'excelSelect',
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},

			{
				btnType: 'save',
				//callBackFn: saveExcelList,
				callBackFn: sendExcelList,
			},
		],
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="물류센터간 일반 STO(수신용) 일괄업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '} />
				<AUIGrid ref={ref} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>{t('lbl.BTN_CANCEL')}</Button>
			</ButtonWrap>
			{/* 엑셀 파일 업로드 INPUT 영역 */}
			<input
				ref={excelUploadFileRef}
				id="excelUploadInput"
				type="file"
				onChange={onFileChange}
				onClick={(e: any) => {
					e.target.value = null;
				}}
				style={{ display: 'none' }}
			/>
		</>
	);
});

export default OmOrderCreationSTOForDcExcelPopup;
