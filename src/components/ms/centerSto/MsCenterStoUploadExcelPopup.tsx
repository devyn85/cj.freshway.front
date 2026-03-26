/*
 ############################################################################
 # FiledataField	: MsCenterStoUploadExcelPopup.tsx
 # Description		:  상품 엑셀 업로드 팝업
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
import { apiPostSaveClosetypeSkuExcelList, apiValidateClosetypeSkuExcelList } from '@/api/ms/apiMsCenterSto';
import { GridBtnPropsType } from '@/types/common';
import fileUtil from '@/util/fileUtils';

// API

interface PropsType {
	close?: any;
	gridData?: Array<object>;
}

const MsCenterStoUploadExcelPopup = (props: PropsType) => {
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
			dataField: 'dccode',
			headerText: '센터',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'dcClosetype',
			headerText: '마감유형',
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
		// {
		// 	dataField: 'skuName',
		// 	headerText: '상품명',
		// 	filter: {
		// 		showIcon: true,
		// 	},
		// },
		{
			dataField: 'applyYn',
			headerText: '적용여부',
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

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	const validateExcelList = async () => {
		// 1. 현재 그리드 내 데이터 중복 검사
		const params = gridRef.current.getGridData();

		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		apiValidateClosetypeSkuExcelList(params).then((res: any) => {
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
			gridRef.current.addColumn(checkColumn, 1);
			const rowsToUpdate = res.data.data;

			const updateData: any[] = [];
			const updateIndex: any[] = [];
			const validValues = ['Y', 'N', '', null, undefined];

			rowsToUpdate.forEach((row: any, index: any) => {
				// 2. 현재 row 객체의 키 목록을 가져옵니다.
				const rowKeys = Object.keys(row);
				const excludeKeys = ['dcClosetypeChk', 'dccodeChk', 'skuChk', 'updateYn', 'duplicateChk', 'applyYn'];
				// 3. GridData를 순회하며 일치하는 레코드를 찾습니다.
				const foundIndex = params.findIndex((gridRow: any) => {
					// 모든 키에 대해 비교를 수행합니다.
					return rowKeys.every(key => {
						// 제외 키 목록에 포함되어 있으면 비교하지 않습니다.
						if (excludeKeys.includes(key)) {
							return true; // 제외할 필드는 항상 true로 간주하여 비교를 통과시킵니다.
						}

						// 현재 row의 값과 gridRow의 값이 동일한지 비교합니다.
						// (두 값이 모두 null이거나 undefined인 경우도 true로 처리)
						return row[key] == gridRow[key];
					});
				});
				const rowIndex = gridRef.current.getRowIndexesByValue('_$uid', [params[foundIndex]._$uid]);
				if (rowIndex !== undefined) {
					let processMsg;
					let processYn;
					if (row.dccodeChk === 'N') {
						processMsg = '센터코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.dcClosetypeChk === 'N') {
						processMsg = '마감유형코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.skuChk === 'N') {
						processMsg = '상품코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.duplicateChk === 'N') {
						processMsg = '중복된 데이터가 존재합니다.';
						processYn = 'N';
					} else if (!validValues.includes(row.applyYn)) {
						processMsg = '적용여부는 Y,N 만 입력 가능합니다.';
						processYn = 'N';
					} else {
						processMsg = '정상';
						processYn = 'Y';
					}
					let rowStatus = 'I';
					if (row.updateYn === 'Y') {
						rowStatus = 'U';
					}
					updateData.push({
						processYn: processYn,
						processMsg: processMsg,
						rowStatus: rowStatus,
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
			// 오류케이스 체크 해제
			gridRef.current.addUncheckedRowsByIdsBefore(uncheckedIds);
		});
	};

	const saveExcelList = () => {
		// 변경 데이터 확인
		const params = gridRef.current.getCustomCheckedRowItems();

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

		const updateLength = params.filter((item: any) => item.rowStatus === 'U').length;
		const insertLength = params.filter((item: any) => item.rowStatus === 'I').length;

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${insertLength}건
				수정 : ${updateLength}건
				삭제 : 0건`;
		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveClosetypeSkuExcelList(params).then(() => {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						close();
					},
				});
			});
		});
	};

	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '센터이체마스터_상품제외_엑셀업로드.xlsx',
		};

		fileUtil.downloadFile(params);
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
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
				callBackFn: saveExcelList,
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
			<PopupMenuTitle name="상품제외 일괄업로드" showButtons={false} />

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

export default MsCenterStoUploadExcelPopup;
