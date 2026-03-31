/*
 ############################################################################
 # FiledataField	: MsCustBrandDetail.tsx
 # Description		: 기준정보 > 상품기준정보 > 본점별브랜드마스터
 # Author			: YeoSeungCheol
 # Since			: 25.07.11
 ############################################################################
*/

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Util

// Type
import { GridBtnPropsType } from '@/types/common';

// Component
import GridTopBtn from '@/components/common/GridTopBtn';
import CustomModal from '@/components/common/custom/CustomModal';
import MsCustBrandUploadExcelPopup from '@/components/ms/custBrand/MsCustBrandUploadExcelPopup';
import { Button } from 'antd';

// API
import { apiPostSaveMasterList } from '@/api/ms/apiMsCustBrand';

const MsCustBrandDetail = forwardRef((props: any, gridRef: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// 엑셀 업로드 모달 ref
	const refModalExcel = useRef(null);

	// 그리드 초기화
	const gridCol = [
		{
			dataField: 'custKey',
			headerText: t('lbl.BRAND_CUSTKEY'), //  본점코드
			dataType: 'code',
			editable: false,
		},
		{
			dataField: 'custName',
			headerText: t('lbl.BRAND_CUSTNAME'), // 본점
			dataType: 'string',
			editable: false,
		},
		{
			dataField: 'brandName',
			headerText: t('lbl.BRANDNAME'), // 브랜드
			dataType: 'string',
			// editable: true,
		},
		{
			dataField: 'reference02',
			headerText: t('lbl.FC_BRANDNAME'), // FC브랜드
			dataType: 'string',
			// editable: true,
		},
		{
			dataField: 'addWho',
			headerText: t('lbl.ADDWHO'), // 등록자
			dataType: 'manager',
			managerDataField: 'addId',
			editable: false,
		},
		{
			dataField: 'addDate',
			headerText: t('lbl.ADDDATE'), // 등록일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
		{
			dataField: 'editWho',
			headerText: t('lbl.EDITWHO'), // 수정자
			dataType: 'manager',
			managerDataField: 'editId',
			editable: false,
		},
		{
			dataField: 'editDate',
			headerText: t('lbl.EDITDATE'), // 수정일시
			dataType: 'date',
			formatString: 'yyyy-mm-dd hh:MM:ss',
			editable: false,
		},
	];

	// 그리드 속성
	const gridProps = {
		editable: true,
		showRowCheckColumn: true,
		fillColumnSizeMode: true,
		showRowNumColumn: true,

		showCustomRowCheckColumn: true, // 커스텀 엑스트라 체크박스 사용여부
		customRowCheckColumnDataField: '', // 커스텀 엑스트라 체크박스 DataField
		customRowCheckColumnCheckValue: '1', // 커스텀 엑스트라 체크박스 체크 상태값
		customRowCheckColumnUnCheckValue: '0', // 커스텀 엑스트라 체크박스 체크 안한 상태값
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		if (!gridRef?.current) return;

		/**
		 * 그리드 바인딩 완료
		 */
		gridRef.current.bind('ready', (event: any) => {
			// 그리드가 준비되면 첫 번째 행을 선택한다.
			gridRef?.current.setSelectionByIndex(0);
		});

		/**
		 * 그리드 셀 편집 종료
		 */
		gridRef.current.bind('cellEditEnd', (event: any) => {
			// 편집이 완료된 후, 해당 행을 선택 상태로 변경한다.
			gridRef.current.setCellValue(event.rowIndex, 'rowStatus', 'U');
		});
	};

	/**
	 * 엑셀 업로드 팝업 열기
	 */
	const openUploadPopup = () => {
		refModalExcel.current?.handlerOpen();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEvent = () => {
		refModalExcel.current?.handlerClose();
	};

	/**
	 * 본점별브랜드 목록 저장
	 */
	const saveMasterList = () => {
		const updatedItems = gridRef.current.getChangedData({ validationYn: false });

		if (!updatedItems || updatedItems.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}
		if (!gridRef.current.validateRequiredGridData()) return;

		/**
		 * 저장 실행
		 */
		gridRef.current.showConfirmSave(() => {
			apiPostSaveMasterList(updatedItems).then((res: any) => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'),
						modalType: 'info',
					});
					gridRef.current.resetUpdatedItems();
					gridRef.current.setAllCheckedRows(false);

					props.callBackFn();
				}
			});
		});
	};

	const gridBtn: GridBtnPropsType = {
		tGridRef: gridRef,
		btnArr: [
			// {
			// 	btnType: 'excelDownload',
			// },
			{
				btnType: 'save',
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		initEvent();
	}, []); // 의존성 배열 추가

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		if (gridRefCur) {
			gridRefCur?.setGridData(props.data);
		}
	}, [props.data]);

	return (
		<AGrid className="contain-wrap">
			<GridTopBtn gridTitle={t('lbl.LIST')} gridBtn={gridBtn} totalCnt={props.totalCnt}>
				<Button onClick={openUploadPopup}>{t('lbl.EXCELUPLOAD')}</Button>
			</GridTopBtn>
			<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} />
			<CustomModal ref={refModalExcel} width="1000px">
				<MsCustBrandUploadExcelPopup close={closeEvent} />
			</CustomModal>
		</AGrid>
	);
});

export default MsCustBrandDetail;
