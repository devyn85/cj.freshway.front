/*
 ############################################################################
 # FiledataField	: BatchHistoryList.tsx
 # Description		: 배치 > 배치관리 > 배치 이력 > 목록
 # Author			: yewon.kim
 # Since			: 25.07.04
 ############################################################################
*/
// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { getCommonCodebyCd } from '@/store/core/comCodeStore';

// API Call Function
import { apiGetBatchJobDetailHistList } from '@/api/batch/apiBatchHistory';

// types
import BatchJobParamPop from '@/components/batch/batchPopup/BatchJobParamPop';
import BatchJobResultPop from '@/components/batch/batchPopup/BatchJobResultPop';
import CustomModal from '@/components/common/custom/CustomModal';
import { GridBtnPropsType } from '@/types/common';
import { useRef } from 'react';

const BatchHistoryList = forwardRef((props: any, gridRefs: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const [jobDetailTotalCnt, setJobDetailTotalCnt] = useState(0);
	const [params, setParams] = useState(null);
	const paramJobParamPopModal = useRef(null);
	const paramJobResultPopModal = useRef(null);

	// grid Ref
	gridRefs.gridJobRef = useRef();
	gridRefs.gridParamRef = useRef();
	gridRefs.gridStepRef = useRef();
	gridRefs.gridJobDetailRef = useRef();

	// ==========================================================================
	// gridCustomBtn 함수
	// ==========================================================================
	// 작업 구분 코드
	const jobGubunLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('JOB_GUBUN', value)?.cdNm;
	};
	// 작업 결과 코드
	const jobResultLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('JOB_RESULT_CD', value)?.cdNm;
	};

	// 그리드 초기화
	const getJobGridCol = () => {
		return [
			{
				dataField: 'jobGubun',
				headerText: 'JOB 구분',
				labelFunction: jobGubunLabelFunc,
				filter: {
					showIcon: true,
				},
				dataType: 'code',
				width: 80,
			},
			{
				dataField: 'jobName',
				headerText: 'JOB 이름',
				filter: {
					showIcon: true,
				},
				width: 250,
			},
			{
				dataField: 'jobDesc',
				headerText: 'JOB 설명',
				filter: {
					showIcon: true,
				},
				width: '15%',
			},
			{
				dataField: 'jobExecutionId',
				headerText: 'JOB 실행 ID',
				dataType: 'code',
				width: 120,
			},
			{
				dataField: 'jobInstanceId',
				headerText: 'JOB 인스턴스 ID',
				dataType: 'code',
				width: 120,
			},
			{
				dataField: 'startTime',
				headerText: '실행 시작시간',
				dataType: 'date',
				width: 160,
			},
			{
				dataField: 'endTime',
				headerText: '실행 종료시간',
				dataType: 'date',
				width: 160,
			},
			{
				dataField: 'runTime',
				headerText: '작업소요시간(초)',
				dataType: 'numeric',
				width: 120,
			},
			{
				dataField: 'errorStatus',
				headerText: '오류발생상태',
				labelFunction: jobResultLabelFunc,
				styleFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					// 상태에 따른 스타일 적용 - CLASS명 반환
					if (value === 'COMPLETED') {
						return '';
					} else if (value === 'FAILED') {
						return 'fc-red';
					}
				},
				dataType: 'code',
				filter: {
					showIcon: true,
				},
				width: 100,
			},
			{
				dataField: 'resultStatus',
				headerText: 'JOB 수행 결과',
				labelFunction: jobResultLabelFunc,
				styleFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					// 상태에 따른 스타일 적용 - CLASS명 반환
					if (value === 'COMPLETED') {
						return '';
					} else if (value === 'FAILED') {
						return 'fc-red';
					}
				},
				dataType: 'code',
				filter: {
					showIcon: true,
				},
				commRenderer: {
					type: 'search',
					//iconPosition: 'aisleRight',
					onClick: function (event: any) {
						paramJobResultOpenPopup(event.item);
					},
				},
				width: 100,
			},
			{
				dataField: '',
				headerText: 'CALL PARAM',
				commRenderer: {
					type: 'search',
					//iconPosition: 'aisleRight',
					onClick: function (event: any) {
						paramJopParamOpenPopup(event.item);
					},
				},
			},
		];
	};

	// JOB실행상세내역
	const getJobDetailGridCol = () => {
		return [
			{
				dataField: 'jobExecutionId',
				headerText: 'JOB 실행ID',
				dataType: 'code',
				width: 100,
			},
			{
				dataField: 'jobExecutionSeq',
				headerText: 'JOB 실행순번',
				dataType: 'code',
				width: 60,
			},
			{
				dataField: 'jobDiv',
				headerText: 'JOB 구분',
				dataType: 'code',
				width: 120,
			},
			{
				dataField: 'nodeLevel',
				headerText: '노드레벨',
				dataType: 'code',
				width: 60,
			},
			{
				dataField: 'jobStatus',
				headerText: '상태',
				dataType: 'code',
				width: 120,
			},
			{
				dataField: 'command',
				headerText: '수행명령어',
				width: 200,
			},
			{
				dataField: 'lineNo',
				headerText: '라인번호',
				dataType: 'code',
				width: 80,
			},
			{
				dataField: 'resultCode',
				headerText: '결과코드',
				dataType: 'code',
				width: 80,
			},
			{
				dataField: 'resultMsg',
				headerText: '결과내용',
			},
			{
				dataField: 'addTimestamp',
				headerText: '등록시간',
				dataType: 'code',
				width: 200,
			},
		];
	};

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps = () => {
		return {
			//editable: true,
			fillColumnSizeMode: false,
			enableColumnResize: true,
			//showRowCheckColumn: true,
			enableFilter: true,
		};
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 그리드 버튼 함수를 설정한다.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = () => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRefs.gridJobRef, // 타겟 그리드 Ref
		};

		return gridBtn;
	};

	/**
	 * 배치 호출 파람 내역 조회 팝업
	 * @param {object} item JOB 정보
	 * @returns {void}
	 */
	const paramJopParamOpenPopup = (item: any): void => {
		setParams(item);
		paramJobParamPopModal.current?.handlerOpen();
	};

	// job 수동 실행 팝업 닫기
	const paramJobParamClosePopPopup = () => {
		paramJobParamPopModal.current?.handlerClose();
	};

	/**
	 * 배치 수행결과 내역 조회 팝업
	 * @param {object} item JOB 정보
	 * @returns {void}
	 */
	const paramJobResultOpenPopup = (item: any): void => {
		setParams(item);
		paramJobResultPopModal.current?.handlerOpen();
	};

	// job 수동 실행 팝업 닫기
	const paramJobResultClosePopPopup = () => {
		paramJobResultPopModal.current?.handlerClose();
	};

	/**
	 * JOB 실행상세내역
	 * @param {any} params 조회 데이터
	 * @returns {void}
	 */
	const searchJobDetailList = () => {
		gridRefs.gridJobDetailRef.current.clearGridData();
		const selectedRow = gridRefs.gridJobRef.current.getSelectedRows();
		if (selectedRow.length > 0 && !gridRefs.gridJobRef.current.isAddedById(selectedRow[0]._$uid)) {
			const params = {
				jobExecutionId: selectedRow[0].jobExecutionId,
			};
			apiGetBatchJobDetailHistList(params).then(res => {
				gridRefs.gridJobDetailRef.current.setGridData(res.data);
				setJobDetailTotalCnt(res.data.length);
			});
		} else {
			return;
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		const gridJobRefCur = gridRefs.gridJobRef.current;

		// JOB 이력 그리드 행 변경 시
		gridJobRefCur.bind('selectionChange', function () {
			// 배치 JOB 상세내역 조회
			searchJobDetailList();
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridJobRefCur = gridRefs.gridJobRef.current;
		if (gridJobRefCur) {
			gridJobRefCur?.setGridData(props.data);
			gridJobRefCur?.setSelectionByIndex(0, 0);

			// 총건수 초기화
			if (props.data?.length < 1) {
				//setTotalCntDccode(0);
				//setTotalCntAuthority(0);
			}
		}
	}, [props.data]);

	return (
		<>
			<AGrid>
				<GridTopBtn gridTitle={'JOB 이력'} gridBtn={getGridBtn()} totalCnt={props.totalCnt} />
				<AUIGrid ref={gridRefs.gridJobRef} columnLayout={getJobGridCol()} gridProps={getGridProps()} />
			</AGrid>
			<AGrid>
				<GridTopBtn gridTitle={'JOB실행상세내역'} gridBtn={getGridBtn()} totalCnt={jobDetailTotalCnt} />
				<AUIGrid ref={gridRefs.gridJobDetailRef} columnLayout={getJobDetailGridCol()} gridProps={getGridProps()} />
			</AGrid>
			<CustomModal ref={paramJobParamPopModal} width="700px">
				<BatchJobParamPop close={paramJobParamClosePopPopup} param={params} />
			</CustomModal>
			<CustomModal ref={paramJobResultPopModal} width="1000px">
				<BatchJobResultPop close={paramJobResultClosePopPopup} param={params} />
			</CustomModal>
		</>
	);
});

export default BatchHistoryList;
