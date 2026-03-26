/*
 ############################################################################
 # FiledataField	: MsSkuChainUploadExcelPopup.tsx
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
import { apiGetValidateSaveList, apiPostSaveMasterList } from '@/api/ms/apiMsSkuChain';
import { GridBtnPropsType } from '@/types/common';
import fileUtil from '@/util/fileUtils';

// API

interface PropsType {
	close?: any;
	gridData?: Array<object>;
}

const MsSkuChainUploadExcelPopup = (props: PropsType) => {
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
			headerText: '물류센터코드',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		{
			dataField: 'plant',
			headerText: '창고',
			dataType: 'code',
			filter: {
				showIcon: true,
			},
			required: true,
		},
		// {
		// 	dataField: 'custkey',
		// 	headerText: '협력사코드',
		// 	dataType: 'code',
		// 	filter: {
		// 		showIcon: true,
		// 	},
		// 	required: true,
		// },

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
			dataField: 'boxperlayer',
			headerText: '방(BOX)',
			dataType: 'numeric',
			required: true,
		},
		{
			dataField: 'layerperplt',
			headerText: '단(BOX)',
			dataType: 'numeric',
			required: true,
		},
	];

	const gridProps = {
		editable: false,
		showRowCheckColumn: true,
		enableFilter: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
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
		const params = gridRef.current.getGridData().map((item: any) => {
			return {
				...item,
				checkId: item._$uid,
			};
		});
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		//상품 코드 존재하는지 확인
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
			gridRef.current.addColumn(checkColumn, 1);
			const rowsToUpdate = res.data;

			const updateData: any[] = [];
			const updateIndex: any[] = [];
			rowsToUpdate.forEach((row: any, index: any) => {
				const rowIndex = gridRef.current.getRowIndexesByValue('_$uid', row.checkId);
				if (rowIndex !== undefined) {
					let processMsg;
					let processYn;

					if (row.dccodeChk === 'N') {
						processMsg = '물류센터코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.plantChk === 'N') {
						processMsg = '창고코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.skuCheck === 'N') {
						processMsg = '상품코드가 존재하지 않습니다.';
						processYn = 'N';
					} else if (row.duplicateChk === 'N') {
						processMsg = '물류센터코드 창고 상품코드의 중복된 조합이 있습니다.';
						processYn = 'N';
					}
					// plt 변환값 방(BOX)*단(BOX) check
					else if (
						typeof row.boxperlayer !== 'number' ||
						isNaN(row.boxperlayer) ||
						typeof row.layerperplt !== 'number' ||
						isNaN(row.layerperplt)
					) {
						processMsg = '방(BOX)과 단(BOX) 값은 유효한 숫자여야 합니다.';
						processYn = 'N';
					} else if (row.boxperlayer * row.layerperplt === 0) {
						processMsg = '방 단의 곱은 0이 아니어야 합니다.';
						processYn = 'N';
					} else {
						processMsg = '정상';
						processYn = 'Y';
					}
					updateData.push({
						processYn: processYn,
						processMsg: processMsg,
						rowStatus: row.rowStatus,
						customRowCheckYn: row.customRowCheckYn,
						chk: row.chk,
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
		// 변경 데이터 확인
		const params = gridRef.current.getCustomCheckedRowItems().map((item: any) => {
			return {
				...item,
				boxperplt: Number(item.boxperlayer) * Number(item.layerperplt),
				dccode: item.dccode === '전체' || item.dccode === '0000' || item.dccode === null ? '' : item.dccode,
			};
		});
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

		const updateLength = params.filter((item: any) => item.rowStatus === 'U').length;
		const insertLength = params.filter((item: any) => item.rowStatus === 'I').length;

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${insertLength}건
				수정 : ${updateLength}건
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
			attchFileNm: '저장품_PLT_상품적재_수량_관리.xlsx',
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
			<PopupMenuTitle name="PLT변환값 마스터 일괄업로드" showButtons={false} />

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

export default MsSkuChainUploadExcelPopup;
