/*
 ############################################################################
 # FiledataField	: TmtrasportRoutingExcelUpload.tsx
 # Description		:  수송경로관리 엑셀 업로드
 # Author			: ParkYosep
 # Since			: 25.10.20
 ############################################################################
*/
// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button } from 'antd';

// component
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// utils
import { showAlert } from '@/util/MessageUtil';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Type
import { GridBtnPropsType } from '@/types/common';

// API
import { apiPostExcelUploadTmTrasportRouting } from '@/api/tm/apiTmTrasportRouting';
import GridTopBtn from '@/components/common/GridTopBtn'; // prettier-ignore
import { getCommonCodebyCd } from '@/store/core/comCodeStore';
import fileUtil from '@/util/fileUtils';
interface PropsType {
	close?: any;
	save?: any;
	gridCol?: any;
	gridProps?: any;
	form?: any;
	currentMasterRow?: any; // 부모로부터 받을 선택된 마스터 행 정보
	// callBack?: any;
}

const TmtrasportRoutingExcelUpload = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { close } = props;
	const excelUploadFileRef = useRef(null);
	const { t } = useTranslation();

	const gridRef1 = useRef(null);

	const getContractTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		if (commUtil.isEmpty(value)) return '공통';
		return getCommonCodebyCd('CONTRACTTYPE', value)?.cdNm || value;
	};
	const getStorageTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('TM_CARRIER_STORAGE', value)?.cdNm || value;
	};

	const getCarCapCityTypeCommonCode = (rowIndex: any, columnIndex: any, value: any) => {
		if (commUtil.isEmpty(value)) return '공통';
		return getCommonCodebyCd('CARCAPACITY', value)?.cdNm || value;
	};
	// 그리드 칼럼 정의
	const extendedGridCol = [
		{
			dataField: 'courierNm',
			headerText: '운송사',
			width: 160,
			editable: false,
			required: true,
			dataType: 'code',
			// },
		},
		{
			dataField: 'routeYn',
			headerText: '경유여부',
			dataType: 'code',
			editable: false,
			width: 70,
			renderer: {
				type: 'CheckBoxEditRenderer',
				editable: false,
				checkValue: 'Y',
				unCheckValue: 'N',
			},
		},
		{
			dataField: 'contractType',
			width: 80,
			editable: false,
			headerText: t('lbl.CONTRACTTYPE'),
			labelFunction: getContractTypeCommonCode,
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		}, // 계약유형
		{
			dataField: 'storageType',
			headerText: t('lbl.STORAGETYPE'),
			width: 120,
			editable: false,
			labelFunction: getStorageTypeCommonCode,
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		}, // 저장조건
		{
			dataField: 'ton',
			width: 80,
			editable: false,
			headerText: t('lbl.QTY_TON'),
			labelFunction: getCarCapCityTypeCommonCode,
			dataType: 'code',
			filter: {
				showIcon: true,
			},
		}, // 톤수
		{
			dataField: 'price',
			headerText: t('lbl.FACTORYPRICE'),
			dataType: 'numeric',
			editable: false,
			required: true,
			width: 90,
			editRenderer: {
				type: 'InputEditRenderer',
				onlyNumeric: true, // 숫자만 입력
				allowPoint: false, // 소수점 금지
				allowNegative: false, // 음수 금지
				autoThousandSeparator: true, // 천단위 콤마
			},
		}, // 단가
		{ dataField: 'rmk', headerText: t('lbl.REMARK'), dataType: 'code', width: 150, editable: false }, // 비고
		{
			dataField: 'fromDate',
			headerText: t('lbl.FROMDATE'),
			required: true,
			editable: false,
			dataType: 'date',
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			width: 115,
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
			},
		},
		{
			dataField: 'toDate',
			headerText: t('lbl.TODATE'),
			required: true,
			dataType: 'date',
			editable: false,
			formatString: 'yyyy-mm-dd',
			dateInputFormat: 'yyyymmdd', // 실제 데이터는 yyyymmdd
			width: 115,
			editRenderer: {
				type: 'CalendarRenderer',
				onlyCalendar: false, // true: 텍스트 입력 비활성화, false: 입력 가능
				showExtraDays: false,
			},
		},
		{
			dataField: 'errMsg',
			width: 200,
			headerText: '에러메시지',
			dataType: 'string',
			editable: false,
		},
		{
			width: 70,
			dataField: 'errYn',
			headerText: '에러코드',
			dataType: 'code',
			editable: false,
		},
	];

	// 엑셀 업로드 동작 1. 파일선택
	/**
	 * 엑셀 업로드 파일 변경 이벤트
	 * @param {object} e 이벤트
	 * @returns {void}
	 */
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// excelImport(e, 0, gridBtn.tGridRef, 1);
		fileUtil.excelImport(e, 0, gridBtn.tGridRef, 1, onDataCheckClick);
	};
	// 엑셀 업로드 동작 2. 엑셀 정보 import
	const onDataCheckClick = () => {
		const validatedList = gridRef1.current.getGridData();

		if (!validatedList || validatedList.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_020'), () => {
				return;
			});
		} else if (validatedList.length > 0 && !gridRef1.current.validateRequiredGridData()) {
			return;
		}

		const convertedData = validatedList.map((row: any) => {
			const newRow = { ...row, routeSerialKey: props.currentMasterRow.routeSerialKey, rowStatus: 'I' };

			return newRow;
		});

		const params = {
			saveList: convertedData,
		};
		gridRef1.current.clearGridData();
		apiPostExcelUploadTmTrasportRouting(params).then((res: any) => {
			// API 응답 데이터를 가공합니다.
			const processedData = (res.data || []).map((row: any) => {
				// errYn이 'N' (오류 없음)인 경우, customRowCheckYn 필드를 'Y'로 설정
				if (row.errYn === 'N') {
					return { ...row, customRowCheckYn: 'Y' };
				}
				return row;
			});
			gridRef1.current?.setGridData(processedData);
		});
	};

	/**
	 * 엑셀 업로드 버튼 클릭
	 */
	const onClickUploadExcel = () => {
		excelUploadFileRef.current.click();
	};
	/**
	 * 엑셀 양식 다운로드
	 * 로케이션 일괄업로드만 공통 기능을 사용하지 않고 버튼으로 추가(별도양식)
	 */
	const onExcelDownload = () => {
		const params = {
			dirType: 'excelTemplate',
			attchFileNm: '수송경로관리 양식.xlsx',
		};

		fileUtil.downloadFile(params);
	};
	const uploadSave = () => {
		// const codeDtl = gridRef1.current.getGridData({ validationYn: false });
		const codeDtl = gridRef1.current.getCheckedRowItems();
		// const saveList1 = codeDtl.filter(item => item.errYn === 'N');
		const saveList1 = codeDtl.map(row => row.item).filter(item => item.errYn === 'N');
		if (saveList1.length == 0) {
			showAlert('', '데이터가 없습니다.');
			return;
		}

		showConfirm(
			null,
			`신규 : ${saveList1.length}건
			 수정 : ${0}건
			 삭제 : ${0}건`,
			() => {
				// 부모 컴포넌트의 저장 함수를 호출하고, 성공 시 팝업을 닫습니다.
				props.save?.(saveList1).then((success: boolean) => {
					if (success) props.close?.();
				});
			},
			() => {
				return;
			},
		);
	};
	// 그리드 버튼 설정
	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef1, // 타겟 그리드 Ref
		btnArr: [
			// {
			// 	btnType: 'excelForm', // 엑셀다운로드
			// },
			{
				btnType: 'excelSelect', // 엑셀선택
				isActionEvent: false,
				callBackFn: () => {
					onClickUploadExcel();
				},
			},
			{
				btnType: 'save',
				callBackFn: () => {
					uploadSave();
				},
			},
		],
	};

	const gridProps = {
		editable: true,
		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		// rowIdField: '_$uid',
		// isLegacyRemove: true,
	};
	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name="수송경로관리 엑셀 업로드" showButtons={false} />

			<AGrid>
				<GridTopBtn gridBtn={gridBtn} gridTitle={' '}>
					<Button onClick={onExcelDownload}>양식다운로드</Button>
				</GridTopBtn>
				<AUIGrid ref={gridRef1} columnLayout={extendedGridCol} gridProps={gridProps} />
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

export default TmtrasportRoutingExcelUpload;
