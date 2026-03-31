/*
 ############################################################################
 # FiledataField	: MsCostCenterCtgyInfoTab3UploadExcelPopup.tsx
 # Description		:  출고 데이터 결산 마스터 > 전용상품마스터탭  엑셀 업로드 팝업
 # Author			: parkyosep
 # Since			: 26.01.13
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
import { apiPostSaveCostCenterCtgyExcelListTab3, apiValidateExcelListTab3 } from '@/api/ms/apiMsCostCenterCtgyInfo';

interface PropsType {
	close?: any;
}

const MsCostCenterCtgyInfoTab3UploadExcelPopup = (props: PropsType) => {
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
			// 조회년월
			headerText: t('lbl.APPLY_YM'),
			dataField: 'applyYm',
			dataType: 'code',
			required: true,
			editable: false,
		},
		{
			// 상품코드
			headerText: t('lbl.SKU'),
			dataField: 'sku',
			required: true,
			dataType: 'code',
		},
		{
			// 상품명
			headerText: t('lbl.SKUNM'),
			dataField: 'skuname',
			dataType: 'string',
		},
		{
			// 구분(전용/범용)
			headerText: '전용(Y) / 범용(N)',
			dataField: 'dedicYn',
			required: true,
			dataType: 'code',
			labelFunction: (rowIndex: number, columnIndex: number, value: any) => {
				if (value === 'Y') return '전용';
				if (value === 'N') return '범용';
				return value;
			},
		},
	];

	const gridProps = {
		editable: false,
		// showRowCheckColumn: true,
		showCustomRowCheckColumn: true,
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return item.errorYn == 'N';
		},
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	// 엑셀 선택 시 처리: 컬럼 세팅 후 검증 호출
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		gridRef.current.changeColumnLayout(gridCol);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, validateExcelList);
	};

	// 서버 검증 호출 및 Grid 반영
	const validateExcelList = async () => {
		const params = gridRef.current.getGridData();
		if (!params || params.length < 1) {
			showMessage({ content: t('msg.MSG_COM_VAL_020'), modalType: 'info' });
			return;
		}

		gridRef.current.setGridData(params);
		const saveList = { saveList: params };
		apiValidateExcelListTab3(saveList).then((res: any) => {
			const checkColumn = [
				{
					//
					headerText: '에러여부',
					dataField: 'errorYn',
					dataType: 'code',
				},
				{
					//
					headerText: '에러메세지',
					dataField: 'errMsg',
					dataType: 'string',
				},
			];
			gridRef.current.addColumn(checkColumn, 1);
			// API 응답 데이터를 가공합니다.
			const processedData = (res.data.data || []).map((row: any) => {
				// errYn이 'N' (오류 없음)인 경우, customRowCheckYn 필드를 'Y'로 설정
				if (!row.errMsg) {
					return { ...row, customRowCheckYn: 'Y', errorYn: 'N' };
				}
				return { ...row, customRowCheckYn: 'N', errorYn: 'Y' };
			});
			gridRef.current?.setGridData(processedData);
			if (processedData && processedData.length > 0) {
				// 데이터 설정 후 컬럼 크기 자동 조정
				const colSizeList = gridRef.current.getFitColumnSizeList(true);
				gridRef.current.setColumnSizeList(colSizeList);
			}
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
			};
		});
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.noSelect'),
				modalType: 'info',
			});
			return;
		}
		const newCount = params.filter((item: any) => item.existYn === 'N').length;
		const updateCount = params.filter((item: any) => item.existYn === 'Y').length;

		const messageWithRowStatusCount = `${t('msg.confirmSave')}
				신규 : ${newCount}건
				수정 : ${updateCount}건
				삭제 : 0건`;

		const saveList = { saveList: params };
		// 저장하시겠습니까?
		showConfirm(null, messageWithRowStatusCount, () => {
			apiPostSaveCostCenterCtgyExcelListTab3(saveList).then(() => {
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
					onOk: () => {
						close(true);
					},
				});
			});
		});
	};

	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef, // 타겟 그리드 Ref
		btnArr: [
			{ btnType: 'excelForm' },
			{
				btnType: 'excelSelect', // 엑셀선택
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

	/**
	 * 다운로드용 샘플 데이터 추가
	 */
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (!gridRefCur) return;
		gridRefCur.setGridData([]);
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="전용상품 마스터 엑셀 업로드" showButtons={false} />

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

export default MsCostCenterCtgyInfoTab3UploadExcelPopup;
