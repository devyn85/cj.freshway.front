/*
 ############################################################################
 # FiledataField	: WdQuickRequestDetail1.tsx
 # Description		: 출고 > 출고작업 > 퀵접수(VSR)및처리(Detail)
 # Author			: sss
 # Since			: 25.12.10
 ############################################################################
*/

//CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

//API
//Component
import GridTopBtn from '@/components/common/GridTopBtn';
import { GridBtnPropsType } from '@/types/common';
//Lib
import { apiPostSaveMasterList01 } from '@/api/wd/apiWdQuickRequest';
import CmLoopTranPopup from '@/components/cm/popup/CmLoopTranPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// Utils
import CmUserCdCfgPopup from '@/components/cm/popup/CmUserCdCfgPopup';
import GridAutoHeight from '@/components/common/GridAutoHeight';
import commUtil from '@/util/commUtil';
import { showAlert, showConfirm } from '@/util/MessageUtil';
// Redux

// API Call Function

const WdQuickRequestDetail1 = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const { form, activeKey, formRef, search } = props; // Antd Form
	const [loopTrParams, setLoopTrParams] = useState({});
	const isHiddenColVisible = false;

	// Declare react Ref(2/4)
	ref.gridRef = useRef();
	ref.gridRef1 = useRef(null);
	const refLoopModal = useRef(null);
	const refModal = useRef(null);

	// Declare init value(3/4)

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */
	/**
	 * 편집 가능한 상태인지 확인하는 함수
	 * @param {any} item - 그리드 행 아이템
	 * @returns {boolean} - 편집 가능 여부
	 */
	const isDisabled = (item: any): boolean => {
		if (commUtil.nvl(item?.status, '01') == '01') {
			// 퀵진행상태가 요청이 비활성화
			return false;
		}
		return true;
	};

	const safeDateValue = (value: any) => {
		if (!value) return '';
		const dateObj = new Date(value);
		return Number.isNaN(dateObj.getTime()) ? '' : value;
	};

	/**
	 * 저장
	 */
	const saveMasterList = async () => {
		const gridRef = ref.gridRef.current;
		const checkedRows = ref.gridRef.current.getCheckedRowItemsAll();
		// 선택된 행이 없으면 경고 메시지 표시
		if (checkedRows.length < 1) {
			showAlert(null, t('msg.noSelect')); // 선택된 행이 없습니다.
			return;
		}

		// 체크된 행의 VSR번호 목록 생성 (중복 제거)
		const vocnoList = Array.from(
			new Set(
				checkedRows
					.map((row: any) => {
						const voc = (row?.item ?? row)?.vocno;
						return typeof voc === 'string' ? voc.trim() : voc;
					})
					.filter((vocno: any) => vocno !== undefined && vocno !== null && `${vocno}`.trim() !== ''),
			),
		).map(vocno => ({ vocno, rowStatus: 'I' }));

		// 저장하시겠습니까?
		showConfirm(null, t('msg.confirmSave'), () => {
			const params = {
				saveList01: vocnoList, // 체크 행의 VSR번호 목록
				//
				fixeddccode: formRef.getFieldValue('fixdccode') ?? '',
			};

			apiPostSaveMasterList01(params).then(res => {
				if (res.statusCode === 0) {
					showAlert(null, t('msg.save1')); // 저장되었습니다
					props.search();
				}
			});
		});
	};

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================

	// 그리드 컬럼
	const gridCol = [
		{
			dataField: 'statusnm',
			headerText: t('lbl.STATUS_DP'), // 진행상태
			width: 80,
			dataType: 'code',
			editable: false,
			styleFunction: commUtil.styleBackGround01,
		}, // 진행상태
		{
			dataField: 'writedate',
			headerText: t('VOC의뢰일'),
			width: 100,
			dataType: 'date',
			editable: false,
		}, // VOC의뢰일-클레임작성일자
		{
			dataField: 'rcptDate',
			headerText: t('센터접수일자'),
			width: 100,
			dataType: 'code',
			editable: false,
		}, // 센터접수일자
		{
			dataField: 'rcptNo',
			headerText: t('센터접수번호'),
			width: 120,
			dataType: 'code',
			editable: false,
			cellMerge: true,
			mergeRef: 'rcptNo',
			mergePolicy: 'restrict',
		}, // 센터접수번호
		{ dataField: 'vocno', headerText: t('VOC번호'), width: 120, dataType: 'code', editable: false }, // VOC번호
		{ dataField: 'vsrtypenm', headerText: t('VSR유형명'), width: 120, dataType: 'code', editable: false }, // VSR유형명
		{ dataField: 'vsrno', headerText: t('VSR번호'), width: 120, dataType: 'code', editable: false }, // VSR번호
		{
			dataField: 'sku',
			headerText: t('lbl.SKU'), // 상품코드
			width: 80,
			editable: false,
			filter: { showIcon: true },
			dataType: 'code',
			disableMoving: true,
			commRenderer: {
				type: 'popup',
				onClick: function (e: any) {
					ref.gridRef.current.openPopup(e.item, 'sku');
				},
			},
		},
		{
			dataField: 'skuname',
			headerText: t('lbl.SKUNAME'), // 상품명
			width: 120,
			editable: false,
			filter: { showIcon: true },
			disableMoving: true,
		},
		{ dataField: 'orderqty', headerText: t('주문량'), editable: false, dataType: 'numeric' }, // 주문량
		{ dataField: 'orderuom', headerText: t('주문단위'), editable: false, dataType: 'code' }, //  주문단위
		{ dataField: 'vocQty', headerText: t('VOC량'), editable: false, dataType: 'numeric' }, // VOC량
		{ dataField: 'vocUomnm', headerText: t('VOC단위명'), editable: false, dataType: 'code', visible: false }, // VOC단위명
		{ dataField: 'custkey', headerText: t('협력사코드'), width: 100, dataType: 'code', editable: false }, // 협력사코드
		{ dataField: 'custkeynm', headerText: t('협력사명'), width: 150, dataType: 'name', editable: false }, // 협력사명

		{ dataField: 'reqDepartment', headerText: t('요청부서코드'), width: 120, dataType: 'code', editable: false }, // 요청부서코드
		{ dataField: 'reqDepartmentnm', headerText: t('요청부서명'), width: 150, dataType: 'name', editable: false }, // 요청부서명
		{ dataField: 'custkeymng', headerText: t('관리처코드'), width: 100, dataType: 'code', editable: false }, // 관리처코드
		{ dataField: 'custkeynmmng', headerText: t('관리처명'), width: 150, dataType: 'name', editable: false }, // 관리처명
		{ dataField: 'reqId', headerText: t('요청자'), width: 80, dataType: 'code', editable: false }, // 요청자
		{ dataField: 'reqIdnm', headerText: t('요청자명'), width: 100, dataType: 'code', editable: false }, // 요청자명
		{ dataField: 'adddate', headerText: t('의뢰일시'), width: 150, dataType: 'code', editable: false }, // 의뢰일시
		{ dataField: 'title', headerText: t('크레임제목'), width: 200, dataType: 'name', editable: false }, // 제목-클레임제목
		{ dataField: 'memo', headerText: t('크레임내역'), width: 200, dataType: 'name', editable: false }, // 전달사항-클레임세부내역
		{ dataField: 'rmk', headerText: t('VSR전달사항'), width: 200, dataType: 'name', editable: false }, // 비고
		{ dataField: 'address', headerText: t('고객주소'), width: 200, dataType: 'name', editable: false }, // 고객주소
		{ dataField: 'phone', headerText: t('고객전화번호'), width: 120, dataType: 'code', editable: false }, // 고객전화번호
		{ dataField: 'quickDocno', headerText: t('퀵주문번호'), width: 120, dataType: 'code', editable: false }, // 퀵주문번호
		/*START.hidden 컬럼*/
		{ dataField: 'status', editable: false, visible: isHiddenColVisible }, // 상태(00:등록,30:요청,50:결재중,90:완료)
		{ dataField: 'dccode', editable: false, visible: isHiddenColVisible }, // 물류센터
		{
			dataField: 'vsrtype',
			headerText: t('VSR유형'),
			width: 120,
			dataType: 'code',
			editable: false,
			visible: isHiddenColVisible,
		}, // VSR유형
		/*END.hidden 컬럼*/
	];

	// 그리드 Props
	const gridProps = {
		editable: true,
		showStateColumn: true,
		showRowCheckColumn: true,
		independentAllCheckBox: false,
		// 헤더 전체체크 숨김
		//showRowAllCheckBox: false,
		fillColumnSizeMode: false,
		showFooter: true,
		fixedColumnCount: 2,
		enableCellMerge: true, // 셀 병합 실행
		// 행 체크 칼럼(엑스트라 체크박스)의 병합은 rcptNo 필드와 동일하게 병합 설정
		rowCheckMergeField: 'rcptNo',
		rowStyleFunction: function (rowIndex: any, item: any) {
			if (isDisabled(item)) {
				return 'aui-grid-row-disabled'; // 행 전체 비활성화 스타일
			}
			return '';
		},
		rowCheckDisabledFunction: (rowIndex: number, isChecked: boolean, item: any) => {
			return !isDisabled(item); // status > '00'이면 체크박스 비활성화
		},
	};

	// FooterLayout Props
	const footerLayout = [{ dataField: 'qty', positionField: 'qty', operation: 'SUM', formatString: '#,##0' }];

	// 그리드 버튼
	const gridBtn: GridBtnPropsType = {
		tGridRef: ref.gridRef, // 타겟 그리드 Ref
		btnArr: [
			{
				btnType: 'save', // 사용자 정의버튼1
				btnLabel: t('퀵센터접수'), // 퀵센터접수
				authType: 'save', // 권한
				callBackFn: saveMasterList,
			},
		],
	};

	/**
	 *  팝업
	 */
	const btnCode01PopupCallback = async () => {
		refModal.current.handlerOpen();
	};

	// 기준관리 팝업 닫기
	const handleClosePopPopup = () => {
		refModal.current?.handlerClose();
	};

	/**
	 * 팝업 닫기
	 */
	const closeEventLoop = () => {
		refLoopModal.current.handlerClose();
		props.search();
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	// grid data 변경 감지
	useEffect(() => {
		const gridRef = ref.gridRef.current;
		if (gridRef) {
			gridRef?.setGridData(props.data);
			gridRef?.setSelectionByIndex(0, 0);

			if (props.data.length > 0) {
				const colSizeList = gridRef.getFitColumnSizeList(true);
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [props.data]);

	useEffect(() => {
		//
	}, []);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid style={{ padding: '10px 0', marginBottom: 0 }}>
				<GridTopBtn gridBtn={gridBtn} gridTitle={t('lbl.LIST')} totalCnt={props.totalCnt}>
					<Form form={formRef} layout="inline">
						<Button size={'small'} onClick={() => btnCode01PopupCallback()} style={{ marginRight: 2 }}>
							{t('퀵사용자관리')} {/* 퀵사용자관리 */}
						</Button>
					</Form>
				</GridTopBtn>
			</AGrid>
			{/* 상품 LIST 그리드 */}
			<GridAutoHeight>
				<AUIGrid ref={ref.gridRef} columnLayout={gridCol} gridProps={gridProps} footerLayout={footerLayout} />
			</GridAutoHeight>
			{/* 기준관리 팝업 */}
			<CustomModal ref={refModal} width="1200px">
				<CmUserCdCfgPopup codeType={'QUICK_ORDERER'} close={handleClosePopPopup} />
			</CustomModal>
			{/* LoopTran팝업 */}
			<CustomModal ref={refLoopModal} width="1000px">
				<CmLoopTranPopup popupParams={loopTrParams} close={closeEventLoop} />
			</CustomModal>
		</>
	);
});
export default WdQuickRequestDetail1;
