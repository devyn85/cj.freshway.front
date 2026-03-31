/*
 ############################################################################
 # FiledataField	: MsSkuDcSetSTOUploadExcelPopup.tsx
 # Description		:  센터상품속성(광역일배) 엑셀 업로드 팝업
 # Author			: jangjaehyun
 # Since			: 25.07.01
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
import fileUtil from '@/util/fileUtils';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API Call Function
import { apiGetValidateExcelList, apiPostSaveExcelList } from '@/api/ms/apiMsSkuDcSetSTO';

// Store

interface PropsType {
	close?: any;
}

const MsSkuDcSetSTOUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);

	const gridCol = [
		{
			dataField: 'dcCode',
			headerText: '경유센터',
			dataType: 'code',
			required: true,
			width: 100,
		},
		{
			dataField: 'toDcCode',
			headerText: '실주문센터',
			dataType: 'code',
			required: true,
			width: 100,
		},
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'),
			dataType: 'code',
			required: true,
			width: 100,
		},
		{
			dataField: 'smsYn',
			headerText: '소터여부',
			dataType: 'code',
			width: 100,
		},
		{
			dataField: 'delYn',
			headerText: t('lbl.DEL_YN'),
			dataType: 'code',
			width: 100,
		},
	];

	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		rowCheckDisabledFunction: (rowIndex: any, isChecked: any, item: any) => {
			if (item.processYn === 'N') {
				return false;
			}
			return true;
		},
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

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	const validateExcelList = async () => {
		const params = gridRef.current.getGridData().map((item: any) => {
			return {
				...item,
			};
		});
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		// 필수값 체크
		const isValid = await validateGridDataWithDelay();
		if (!isValid) {
			return;
		}
		apiGetValidateExcelList(params).then(res => {
			const checkColumn1 = [
				{
					dataField: 'processYn',
					headerText: '체크결과',
					editRenderer: {
						type: 'InputEditRenderer',
						textAlign: 'center',
					},
				},
				{
					dataField: 'processMsg',
					headerText: '체크메시지',
					width: 300,
				},
			];
			// const checkColumn2 = [

			// ];
			gridRef.current.addColumn(checkColumn1, 1);
			// gridRef.current.addColumn(checkColumn2, 7);
			const rowsToUpdate = res.data;
			const updateData: any[] = [];
			const updateIndex: any[] = [];

			const gridRows = gridRef.current.getGridData();

			rowsToUpdate.forEach((row: any, index: any) => {
				const idx = gridRows.findIndex(
					(g: any) => g.dcCode === row.dcCode && g.toDcCode === row.toDcCode && g.sku === row.sku,
				);
				if (idx >= 0) {
					const rowIndex = gridRef.current.getRowIndexesByValue('_$uid', [params[idx]._$uid]);
					if (rowIndex !== undefined) {
						updateData.push({
							processYn: row.processYn,
							processMsg: row.processMsg,
							rowStatus: 'U',
						});
						updateIndex.push(rowIndex);
					}
				}
			});
			gridRef.current.updateRows(updateData, updateIndex);
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
		const params = gridRef.current.getCustomCheckedRowItems().map((item: any) => {
			return {
				...item,
				delYn: item.delYn === 'Y' ? 'N' : 'Y',
			};
		});
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'info',
			});
			return;
		}

		// 유효성 검사 통과 못한 데이터 확인
		const isProcessYN = params.some((item: any) => item.processYn !== 'Y');

		// 'N'인 항목이 있다면 메시지를 띄우고 함수를 종료
		if (isProcessYN) {
			showMessage({
				content: '유효성 검증이 완료되지 않은 데이터가 포함되어 있습니다.\n확인 후 다시 시도해주세요.',
				modalType: 'info',
			});
			return;
		}

		// const messageWithRowStatusCount = `${t('msg.confirmSave')}
		// 		신규 : 0건
		// 		수정 : ${params.length}건
		// 		삭제 : 0건`;

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
		신규 및 수정 : ${params.length}건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveExcelList(params).then(res => {
				if (res.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
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
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},
			{
				btnType: 'excelDownload', // 엑셀다운로드
				btnLabel: '양식다운로드',
			},
			{
				btnType: 'save',
				callBackFn: saveExcelList,
			},
		],
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	/**
	 * 다운로드용 샘플 데이터 추가
	 */
	useEffect(() => {
		gridRef.current.setGridData([
			{
				dcCode: '',
				toDcCode: '',
				sku: '',
				smsYn: 'N',
				delYn: 'Y',
			},
		]);
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="상품정보 엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '} />
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

export default MsSkuDcSetSTOUploadExcelPopup;
