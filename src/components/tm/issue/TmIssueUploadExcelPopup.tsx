/*
 ############################################################################
 # FiledataField	: TmIssueUploadExcelPopup.tsx
 # Description		: 배송이슈 엑셀 업로드 팝업
 # Author			: YeoSeungCheol
 # Since			: 25.10.28
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';

// utils
import fileUtil from '@/util/fileUtils';
import { showConfirm, showMessage } from '@/util/MessageUtil';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// Store

// API Call Function
import { apiGetValidateExcelList, apiSaveMasterList } from '@/api/tm/apiTmIssue';

interface PropsType {
	dcCode: string;
	storerKey: string;
	close?: any;
}

const TmIssueUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { dcCode, storerKey, close } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);

	const gridCol = [
		{
			// 출고일자
			headerText: t('lbl.DOCDT_WD'),
			dataField: 'deliveryDt',
			required: true,
			// dataType: 'date',
			// formatString: 'yyyy-mm-dd',
		},
		{
			// 관리처코드
			headerText: t('lbl.TO_CUSTKEY_WD'),
			dataField: 'custKey',
			required: true,
			dataType: 'code',
		},

		{
			// 배송이슈코드
			headerText: t('lbl.TMISSUECODE'),
			dataField: 'issueCode',
			required: true,
			dataType: 'code',
			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return getCommonCodebyCd('TMISSUE_CODE', value)?.cdNm;
			// },
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('TMISSUE_CODE', '선택'),
			// 	keyField: 'comCd',
			// 	valueField: 'cdNm',
			// },
		},
		{
			// 상품코드
			headerText: t('lbl.SKU'),
			dataField: 'sku',
			dataType: 'code',
		},
		{
			// 상태
			headerText: t('lbl.STATUS_1'),
			dataField: 'storageType',
			dataType: 'code',
			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return getCommonCodebyCd('STORAGETYPE', value)?.cdNm;
			// },
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('STORAGETYPE', '선택'),
			// 	keyField: 'comCd',
			// 	valueField: 'cdNm',
			// },
		},
		{
			// 주문수량
			headerText: t('lbl.ORDERQTY'),
			dataField: 'orderQty',
			dataType: 'code',
		},
		{
			// 출고수량
			headerText: t('lbl.QTY_WD'),
			dataField: 'workQty',
			required: true,
			dataType: 'code',
		},
		{
			// 확인수량
			headerText: t('lbl.CHK_QTY'),
			dataField: 'confirmQty',
			dataType: 'code',
		},
		{
			// 단위
			headerText: t('lbl.UOM'),
			dataField: 'uom',
			dataType: 'code',
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('UOM', '선택'),
			// 	keyField: 'comCd',
			// 	valueField: 'cdNm',
			// },
			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return getCommonCodebyCd('UOM', value)?.cdNm;
			// },
		},
		{
			// 기사명
			headerText: t('lbl.DRIVERNAME'),
			dataField: 'driverName',
			dataType: 'default',
		},
		{
			// 전화번호
			headerText: t('lbl.PHONE'),
			dataField: 'phone',
			dataType: 'code',
		},
		{
			// 도착시간
			headerText: t('lbl.INCOMINGDATETIME'),
			dataField: 'deliveryTime',
			dataType: 'code',
			// editRenderer: {
			// 	type: 'MaskEditRenderer',
			// 	mask: '99:99',
			// 	placeholder: 'HH:MM',
			// },
		},
		{
			// 배송장소
			headerText: t('lbl.DELIVERYPLACE'),
			dataField: 'deliveryPlace',
			dataType: 'code',
			// editRenderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('TMISSUE_PLACE', '선택'),
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// },
			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return getCommonCodebyCd('TMISSUE_PLACE', value)?.cdNm;
			// },
		},
		{
			// 사유코드
			headerText: t('lbl.REASONCODE'),
			dataField: 'reasonCode',
			dataType: 'code',
			// renderer: {
			// 	type: 'DropDownListRenderer',
			// 	list: getCommonCodeList('TMISSUE_REASON_CODE', ''), // 결품 사유 코드
			// 	keyField: 'comCd', // key 에 해당되는 필드명
			// 	valueField: 'cdNm',
			// 	disabledFunction: function (rowIndex: number, columnIndex: number, value: any, item: any, dataField: string) {
			// 		// return true 이면 비활성화(disabled) 처리
			// 		if (Number(item.status) < 90) {
			// 			if (item.issueCode === '06' || item.issueCode === '07') {
			// 				return false;
			// 			}
			// 			return true;
			// 		}
			// 		return true;
			// 	},
			// },
			// labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
			// 	return getCommonCodebyCd('TMISSUE_STATUS', value)?.cdNm;
			// },
			// styleFunction: (
			// 	rowIndex: number,
			// 	columnIndex: number,
			// 	value: any,
			// 	headerText: string,
			// 	item: any,
			// 	dataField: string,
			// ) => {
			// 	if (Number(item.status || 0) < 90) {
			// 		if (item.issueCode === '06' || item.issueCode === '07') {
			// 			return 'isEdit';
			// 		}
			// 	}
			// 	return gridRef.current.removeEditClass(columnIndex);
			// },
		},
		{
			// 물류센터코드
			headerText: t('lbl.DCCODE'),
			dataField: 'dcCode',
			required: true,
			// visible: false,
		},
		// {
		// 	// 고객사코드(회사코드:FW00)
		// 	headerText: t('lbl.STORERCODE'),
		// 	dataField: 'storerKey',
		// 	visible: false,
		// },
	];

	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 엑셀 데이터 세팅 후 필수값 체크를 위한 delay
	 * 지정된 지연 시간 후 그리드 유효성 검사를 수행하고 결과를 Promise로 반환
	 * @returns {Promise<boolean>} 유효성 검사 결과 (true/false)
	 */
	const validateGridDataWithDelay = () => {
		return new Promise(resolve => {
			// AUIGrid가 데이터 처리를 완료할 지연 시간 설정
			setTimeout(() => {
				// 유효성 검사 로직 호출
				const isValid = gridRef.current.validateRequiredGridData();
				// 검사 결과를 Promise의 resolve를 통해 반환
				resolve(isValid);
			}, 50);
		});
	};

	/**
	 * 파일 선택후 후처리.
	 * @param {React.ChangeEvent<HTMLInputElement>} e
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	/**
	 * 엑셀 파일의 validation 을 처리 한다.
	 * @returns
	 */
	const validateExcelList = async () => {
		const params = gridRef.current.getGridData().map((item: any) => {
			return {
				...item,
				dcCode: dcCode,
				storerKey: storerKey,
			};
		});

		// if (!params || params.length < 1) {
		// 	showMessage({
		// 		content: t('msg.MSG_COM_VAL_020'),
		// 		modalType: 'info',
		// 	});
		// 	return;
		// }

		// // 필수값 체크
		// const isValid = await validateGridDataWithDelay();
		// if (!isValid) {
		// 	return;
		// }

		apiGetValidateExcelList(params).then(res => {
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
			const extraColumn = [
				{
					// 관리처명
					headerText: t('lbl.TO_CUSTNAME_WD'),
					dataField: 'custName',
					dataType: 'default',
				},
			];
			const extraColumn2 = [
				{
					// 상품명칭
					headerText: t('lbl.SKUNAME'),
					dataField: 'skuName',
					dataType: 'default',
				},
			];
			gridRef.current.addColumn(checkColumn, 0);
			gridRef.current.addColumn(extraColumn, 4);
			gridRef.current.addColumn(extraColumn2, 7);

			const rowsToUpdate = res.data;

			const updateData: any[] = [];
			const updateIndex: any[] = [];
			rowsToUpdate.forEach((row: any, index: any) => {
				let processMsg = '정상';
				let processYn = 'Y';

				if (row.databaseYn === 'Y') {
					processMsg = '이미 등록된 이슈가 있습니다.';
					processYn = 'N';
				} else if (row.deliveryDtYn === 'N') {
					processMsg = '출고일자를 확인해주세요. (YYYYMMDD 형식)';
					processYn = 'N';
				} else if (row.custKeyYn === 'N') {
					processMsg = '관리처 확인 필요.';
					processYn = 'N';
				} else if (row.issueCodeYn === 'N') {
					processMsg = '이슈 코드 확인 필요.';
					processYn = 'N';
				} else if (row.skuYn === 'N') {
					processMsg = '품목 코드 확인 필요.';
					processYn = 'N';
				} else if (row.storageTypeYn === 'N') {
					processMsg = '저장유형 코드 확인 필요.';
					processYn = 'N';
				} else if (row.workQtyYn === 'N') {
					processMsg = '출고수량 확인 필요.';
					processYn = 'N';
				} else if (row.uomYn === 'N') {
					processMsg = '단위 확인 필요.';
					processYn = 'N';
				} else if (row.driverNameYn === 'N') {
					processMsg = '기사명 확인 필요.';
					processYn = 'N';
				} else if (row.deliveryTimeYn === 'N') {
					processMsg = '도착시간 확인 필요.';
					processYn = 'N';
				} else if (row.deliveryPlaceYn === 'N') {
					processMsg = '배송장소 확인 필요.';
					processYn = 'N';
				} else if (row.reasonCodeYn === 'N') {
					processMsg = '이슈사유코드 확인 필요.';
					processYn = 'N';
				} else if (row.dcCodeYn === 'N') {
					processMsg = '물류센터코드 확인 필요.';
					processYn = 'N';
				}

				if (row.custName) {
					row.custName = row.custName;
				}
				if (row.skuName) {
					row.skuName = row.skuName;
				}
				if (!row.sku) {
					row.skuName = '';
				}

				if (processYn === 'N') {
					processMsg = processMsg + ` [출고일:${row.deliveryDt}, 관리처코드:${row.custKey}, 이슈코드:${row.issueCode}]`;
				}

				row.processYn = processYn;
				row.processMsg = processMsg;
				row.rowStatus = 'I';
				updateData.push(row);
				// updateData.push({
				// 	processYn: processYn,
				// 	processMsg: processMsg,
				// 	rowStatus: 'I',
				// });

				updateIndex.push(index);
			});

			gridRef.current.updateRows(updateData, updateIndex);

			// 조회된 결과에 맞게 칼럼 넓이를 구하고 적용 시킴.
			const colSizeList = gridRef.current?.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current?.setColumnSizeList(colSizeList);
			// 오류케이스 체크 해제
			const uncheckedItems = gridRef.current.getGridData().filter((item: any) => {
				return item.processYn === 'N';
			});
			const uncheckedIds = uncheckedItems.map((item: any) => item._$uid);

			gridRef.current.addUncheckedRowsByIdsBefore(uncheckedIds);
		});
	};

	/**
	 * 저장
	 * @returns {void}
	 */
	const saveExcelList = () => {
		// 변경 데이터 확인 - 그리드에서 체크박스로 체크된 모든 행을 가져온다.
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		// if (!updatedItems || updatedItems.length < 1) {
		// 	showMessage({
		// 		content: t('msg.MSG_COM_VAL_020'),
		// 		modalType: 'info',
		// 	});
		// 	return;
		// }
		// if (!gridRef.current.validateRequiredGridData()) return;

		// 엑셀 업로드 데이터는 모두 신규 데이터이므로 rowStatus를 'I'로 설정
		const saveData = updatedItems
			.filter((item: any) => item.processYn !== 'N')
			.map((item: any) => ({
				...item,
				rowStatus: 'I',
			}));

		if (saveData.length < 1) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'info',
			});
			return;
		}

		const newCount = saveData.length;

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${newCount}건
				수정 : 0건
				삭제 : 0건`;

		// 저장 실행
		showConfirm(null, messageWithRowStatusCount, () => {
			apiSaveMasterList(saveData).then(res => {
				if (res.statusCode === 0) {
					// 전체 체크 해제
					gridRef.current.setAllCheckedRows(false);
					// AUIGrid 변경이력 Cache 삭제
					gridRef.current.resetUpdatedItems();
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							// 팝업 닫기
							close();
						},
					});
				}
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				// btnType: 'excelUpload', // 엑셀업로드
				btnType: 'excelSelect', // 엑셀 선택
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},
			// {
			// 	btnType: 'plus', // 유효성검증
			// },
			{
				btnType: 'save',
				callBackFn: saveExcelList,
			},
		],
	};
	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: 'CRM_요청관리.xlsx',
		};

		fileUtil.downloadFile(params);
	};
	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	// /**
	//  * 다운로드용 샘플 데이터 추가
	//  */
	// useEffect(() => {
	// 	gridRef.current.setGridData([
	// 		{
	// 			deliveryDt: '', // 출고일자
	// 			custKey: '', // 관리처코드
	// 			custName: '', // 관리처명
	// 			issueCode: '', // 배송이슈코드
	// 			sku: '', // 상품코드
	// 			skuName: '', // 상품명칭
	// 			storageType: '', // 상태
	// 			orderQty: 0, // 주문수량
	// 			workQty: 0, // 출고수량
	// 			confirmQty: 0, // 확인수량
	// 			uom: '', // 단위
	// 			driverName: '', // 기사명
	// 			phone: '', // 전화번호
	// 			deliveryTime: '', // 도착시간
	// 			deliveryPlace: '', // 배송장소
	// 			reasonCode: '', // 사유코드
	// 			reasonMsg: '', // 기타
	// 		},
	// 	]);
	// }, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="배송이슈 엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					{/* "양식 다운로드"를 gridBtn으로 넘기지 않고 버튼으로 추가 */}
					<Button onClick={onExcelDownload}>양식다운로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
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
};

export default TmIssueUploadExcelPopup;
