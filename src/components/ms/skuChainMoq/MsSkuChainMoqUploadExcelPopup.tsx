/*
 ############################################################################
 # FiledataField	: MsSkuChainMoqUploadExcelPopup.tsx
 # Description		:  엑셀 업로드 팝업
 # Author			: JeongHyeongCheol
 # Since			: 25.07.22
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
import { apiGetValidateSaveList, apiPostSaveMasterList } from '@/api/ms/apiMsSkuChainMoq';
import { GridBtnPropsType } from '@/types/common';
import fileUtil from '@/util/fileUtils';

// API

interface PropsType {
	close?: any;
	gridData?: Array<object>;
	search?: any;
}

const MsSkuChainMoqUploadExcelPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close, search } = props;

	// 다국어
	const { t } = useTranslation();

	const gridRef = useRef(null);
	const excelUploadFileRef = useRef(null);

	const gridCol = [
		{
			dataField: 'dccode',
			headerText: '물류센터',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'sku',
			headerText: '상품코드',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'moqSku',
			headerText: '상품MOQ(BOX)',
			dataType: 'numeric',
			required: true,
		},
		{
			dataField: 'moqSkuPlt',
			headerText: '상품MOQ(PLT)',
			dataType: 'numeric',
			required: true,
		},
		{
			dataField: 'moqVenderBox',
			headerText: '협력사MOQ(BOX)',
			dataType: 'numeric',
			required: true,
		},
		{
			dataField: 'moqVenderPlt',
			headerText: '협력사MOQ(PLT)',
			dataType: 'numeric',
			required: true,
		},
	];

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
	 */

	// 유효성 검사
	const validateItem = (item: any): string | null => {
		// moq 숫자 체크
		const isNotNum =
			isNaN(item.moqSku) || isNaN(item.moqSkuPlt) || isNaN(item.moqVenderBox) || isNaN(item.moqVenderPlt);
		// PK validation
		if (isNotNum) {
			return 'MOQ 컬럼은 숫자만 입력가능합니다.';
		}

		// 0을 null로 처리하여 유효성 검사에 사용
		const moqSku = item.moqSku === 0 ? null : item.moqSku;
		const moqSkuPlt = item.moqSkuPlt === 0 ? null : item.moqSkuPlt;
		const moqVenderBox = item.moqVenderBox === 0 ? null : item.moqVenderBox;
		const moqVenderPlt = item.moqVenderPlt === 0 ? null : item.moqVenderPlt;

		// 1. 필수 데이터 검사
		const isAnyDataPresent = moqSku || moqSkuPlt || moqVenderBox || moqVenderPlt;
		if (!isAnyDataPresent) {
			// sku를 포함하여 어떤 데이터에 에러가 났는지 명확히 표시
			return `MOQ 4개 컬럼 중 하나는 반드시 입력해야 합니다.`;
		}

		// 2. 상호 배타적 검사 1
		if (moqSku && moqSkuPlt) {
			return `'상품MOQ(BOX)'와 '상품MOQ(PLT)'는 동시에 입력할 수 없습니다.`;
		}

		// 3. 상호 배타적 검사 2
		if (moqVenderBox && moqVenderPlt) {
			return `'협력사MOQ(BOX)'와 '협력사MOQ(PLT)'는 동시에 입력할 수 없습니다.`;
		}
	};

	// 엑셀 선택
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// 그리드 컬럼초기화
		gridRef.current.changeColumnLayout(gridCol);
		// 파일선택
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	const validateExcelList = async () => {
		const params = gridRef.current.getGridData();
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// 유효성체크
		apiGetValidateSaveList(params).then(res => {
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
			// 그리드 컬럼추가
			gridRef.current.addColumn(checkColumn, 1);
			const rowsToUpdate = res.data;
			const updateData: any[] = [];
			const updateIndex: any[] = [];

			rowsToUpdate.forEach((row: any, index: any) => {
				// 상태값 변경을 위한 rowIndex 추출
				const rowKeys = Object.keys(row);
				const checkKeys = ['sku', 'dccode', 'moqSku', 'moqSkuPlt', 'moqVenderBox', 'moqVenderPlt'];
				// 3. GridData를 순회하며 일치하는 레코드를 찾습니다.
				const foundIndex = params.findIndex((gridRow: any) => {
					// 모든 키에 대해 비교를 수행합니다.
					return rowKeys.every(key => {
						// 제외 키 목록에 포함되어 있으면 비교하지 않습니다.
						if (!checkKeys.includes(key)) {
							return true; // 제외할 필드는 항상 true로 간주하여 비교를 통과시킵니다.
						}

						// --- 값 정규화(Normalize) 로직 추가 ---
						// null, undefined를 ''(빈 문자열)로 통일 처리
						const normalize = (value: any) => {
							return value === null || value === undefined ? '' : value;
						};

						const normalizedRowValue = normalize(row[key]);
						const normalizedGridValue = normalize(gridRow[key]);

						// 현재 row의 값과 gridRow의 값이 동일한지 비교합니다.
						// (두 값이 모두 null이거나 undefined인 경우도 true로 처리)
						return normalizedRowValue == normalizedGridValue;
					});
				});

				const rowIndex = gridRef.current.getRowIndexesByValue('_$uid', [params[foundIndex]._$uid]);

				if (rowIndex !== undefined) {
					// moq 유효성체크를 위해 value get
					const rowValue = gridRef.current.getItemByRowIndex(rowIndex);
					// moq validation
					let checkMoq = null;
					checkMoq = validateItem(rowValue);

					let processMsg;
					let processYn;
					if (row.duplicateChk === 'N') {
						processMsg = '물류센터와 상품코드의 중복된 조합이 있습니다.';
						processYn = 'N';
					} else if (checkMoq) {
						processMsg = checkMoq;
						processYn = 'N';
					} else if (row.skuChk === 'N') {
						processMsg = '상품코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.dccodeChk === 'N') {
						processMsg = '물류센터코드가 존재하지 않습니다.';
						processYn = 'N';
					} else {
						processMsg = '정상';
						processYn = 'Y';
					}
					updateData.push({
						processYn: processYn,
						processMsg: processMsg,
						rowStatus: 'U',
					});
					updateIndex.push(rowIndex);
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

	const saveExcelList = (type: any) => {
		const params = gridRef.current.getCustomCheckedRowItems();
		// 변경 데이터 확인
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'info',
			});
			return false;
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

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : 0건
				수정 : ${params.length}건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveMasterList(params).then((res: any) => {
				if (res.data.statusCode > -1) {
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
				btnType: 'excelForm',
			},
			{
				btnType: 'excelSelect',
				isActionEvent: false, // 콜백 Function 호출 전 처리 사용 유무
				callBackFn: () => {
					excelUploadFileRef.current.click();
				},
			},
			{
				btnType: 'save',
				callBackFn: () => {
					saveExcelList('save');
				},
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
			<PopupMenuTitle name="MOQ/LT 마스터 일괄업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '} />
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button onClick={close}>취소</Button>
			</ButtonWrap>

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

export default MsSkuChainMoqUploadExcelPopup;
