/*
 ############################################################################
 # FiledataField	: MsCustUsageCarUploadExcelPopup.tsx
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
import fileUtil from '@/util/fileUtils';

// utils

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { apiGetValidateSaveList, apiPostSaveMasterList } from '@/api/ms/apiMsCustUsageCar';
import { GridBtnPropsType } from '@/types/common';

// API

interface PropsType {
	close?: any;
	search?: any;
}

const MsCustUsageCarUploadExcelPopup = (props: PropsType) => {
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
			dataField: 'custkey',
			headerText: '고객코드',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			headerText: '차량전용',
			required: true,
			children: [
				{
					dataField: 'custcartype10',
					headerText: '전용',
					commRenderer: {
						type: 'checkBox',
						checkValue: 'Y',
						unCheckValue: 'N',
						editable: true,
					},
				},
				{
					dataField: 'custcartype99',
					headerText: '제외',
					commRenderer: {
						type: 'checkBox',
						checkValue: 'Y',
						unCheckValue: 'N',
						editable: true,
					},
				},
			],
		},

		{
			dataField: 'carno',
			headerText: '차량번호',
			required: true,
		},
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

	// 엑셀 선택
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// 그리드 데이터 초기화
		gridRef.current.clearGridData();
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
			const rowsToUpdate = res.data.data;
			const updateData: any[] = [];
			const updateIndex: any[] = [];

			rowsToUpdate.forEach((row: any, index: any) => {
				// 상태값 변경을 위한 rowIndex 추출
				// const rowKeys = Object.keys(row);
				// const checkKeys = ['dccode', 'custkey', 'custcartype', 'carno'];
				// 3. GridData를 순회하며 일치하는 레코드를 찾습니다.
				// const foundIndex = params.findIndex((gridRow: any) => {
				// 	// 모든 키에 대해 비교를 수행합니다.
				// 	return rowKeys.every(key => {
				// 		// 제외 키 목록에 포함되어 있으면 비교하지 않습니다.
				// 		if (!checkKeys.includes(key)) {
				// 			return true; // 제외할 필드는 항상 true로 간주하여 비교를 통과시킵니다.
				// 		}

				// 		// --- 값 정규화(Normalize) 로직 추가 ---
				// 		// null, undefined를 ''(빈 문자열)로 통일 처리
				// 		const normalize = (value: any) => {
				// 			return value ?? '';
				// 		};

				// 		const normalizedRowValue = normalize(row[key]);
				// 		const normalizedGridValue = normalize(gridRow[key]);

				// 		// 현재 row의 값과 gridRow의 값이 동일한지 비교합니다.
				// 		// (두 값이 모두 null이거나 undefined인 경우도 true로 처리)
				// 		return normalizedRowValue == normalizedGridValue;
				// 	});
				// });

				// const rowIndex = gridRef.current.getRowIndexesByValue('_$uid', [params[foundIndex]._$uid]);
				// //console.log('rowIndex: ', rowIndex);
				const rowIndex = row.rn - 1;
				if (rowIndex !== undefined) {
					let processMsg;
					let processYn;
					if (row.duplicateChk === 'N') {
						processMsg = '물류센터 고객코드 차량번호의 중복된 조합이 있습니다.';
						processYn = 'N';
					} else if (row.dccodeChk === 'N') {
						processMsg = '물류센터코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.custkeyChk === 'N') {
						processMsg = '고객코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.carcusttypeChk === 'N') {
						processMsg = '거래처차량유형이 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.carnoChk === 'N') {
						processMsg = '차량번호가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.custcartypeChk === 'N') {
						processMsg = '거래처 차량 유형은 반드시 하나의 값만 입력해야 합니다.';
						processYn = 'N';
					} else {
						processMsg = '정상';
						processYn = 'Y';
					}
					updateData.push({
						processYn: processYn,
						processMsg: processMsg,
						rowStatus: row.updateChk === 'Y' ? 'U' : 'I',
						custcartype10: row.custcartype10,
						custcartype99: row.custcartype99,
						custcartype: row.custcartype10 === 'Y' ? '10' : row.custcartype99 === 'Y' ? '99' : '',
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

	const saveExcelList = () => {
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

		const insertLength = params.filter((item: any) => item.rowStatus === 'I');
		const updateLength = params.filter((item: any) => item.rowStatus === 'U');

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${insertLength.length}건
				수정 : ${updateLength.length}건
				삭제 : 0건`;

		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveMasterList(params).then((res: any) => {
				if (res.data.statusCode > -1) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
						onOk: () => {
							search();
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
			// {
			// 	btnType: 'plus',
			// },
			// {
			// 	btnType: 'excelForm',
			// 	callBackFn: () => {
			// 		const params = {
			// 			dirType: 'excelTemplate',
			// 			attchFileNm: '지정고객+전담차량+관리.xlsx',
			// 		};

			// 		fileUtil.downloadFile(params);
			// 	},
			// },
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
					saveExcelList();
				},
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
			attchFileNm: '지정고객_전담차량_관리.xlsx',
		};

		fileUtil.downloadFile(params);
	};
	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="지정고객 전담차량 관리 일괄업로드" showButtons={false} />

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

export default MsCustUsageCarUploadExcelPopup;
