/*
 ############################################################################
 # FiledataField	: BatchMngList.tsx
 # Description		: 배치 > 배치관리 > 배치 등록/수정 > 목록
 # Author			: yewon.kim
 # Since			: 25.07.04
 ############################################################################
*/
// React
import { Button, Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

// CSS
import AGrid from '@/assets/styled/AGrid/AGrid';

// Components
import GridTopBtn from '@/components/common/GridTopBtn';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// store
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';

// util
import { showMessage } from '@/util/MessageUtil';
import commUtil from '@/util/commUtil';

// API Call Function
import { apiPostSaveBatchMngList } from '@/api/batch/apiBatchMng';

// types
import { apiPostCallBatchApiParamSetList, apiPostCallRescheduleJob } from '@/api/batch/apiBatchRestApi';
import BatchCallJobPop from '@/components/batch/batchPopup/BatchCallJobPop';
import BatchParamSetPop from '@/components/batch/batchPopup/BatchParamSetPop';
import quartzToNaturalLanguage from '@/components/batch/batchPopup/BatchScheduleFunction';
import BatchScheduleSetPop, { selectItems } from '@/components/batch/batchPopup/BatchScheduleSetPop';
import CustomModal from '@/components/common/custom/CustomModal';
import { SelectBox } from '@/components/common/custom/form';
import { GridBtnPropsType } from '@/types/common';
import { showConfirm } from '@/util/MessageUtil';

interface propsTypes {
	gridRef: React.RefObject<any>;
	gridData: any[];
	totalCnt: number;
	onSearch: () => void;
}

const BatchMngList = (props: propsTypes) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { gridRef, gridData, totalCnt, onSearch } = props;
	const { t } = useTranslation();

	const [titleForm] = Form.useForm();

	// 작업 결과 코드
	const jobResultLabelFunc = (rowIndex: any, columnIndex: any, value: any) => {
		return getCommonCodebyCd('JOB_RESULT_CD', value)?.cdNm;
	};

	const paramPopModal = useRef(null);
	const callJobPopModal = useRef(null);
	const schedulePopModal = useRef(null);
	const [params, setParams] = useState(null);

	// 그리드 초기화
	const getGridCol = () => {
		return [
			{
				dataField: 'jobGubun',
				headerText: 'JOB 구분',
				commRenderer: {
					type: 'dropDown',
					list: getCommonCodeList('JOB_GUBUN', '선택', ''),
				},
				required: true,
				width: 80,
			},
			{
				dataField: 'jobName',
				headerText: 'JOB 이름',
				required: true,
				width: 200,
			},
			{
				dataField: 'jobDesc',
				headerText: 'JOB 설명',
				width: '15%',
			},
			/*
            {
                dataField: 'jobRmk',
                headerText: 'ASIS 설명',
                width: 250,
                editable: false,
            },
            */
			/*
			{
				dataField: 'jobInterval',
				headerText: '작업주기',
				commRenderer: {
					type: 'dropDown',
					list: getCommonCodeList('JOB_INTERVAL_CD', '선택', ''),
				},
				width: 80,
			},
             */
			/*
			{
				dataField: 'timeoutValue',
				headerText: '타임아웃 설정(초)',
				dataType: 'code',
				width: 100,
			},
			*/
			{
				dataField: 'useYn',
				headerText: t('lbl.USE_YN'),
				commRenderer: {
					type: 'dropDown',
					list: getCommonCodeList('YN', '선택', ''),
				},
				width: 60,
			},
			{
				dataField: 'jobSchedule',
				headerText: '작업스케쥴',
				dataType: 'default',
				commRenderer: {
					type: 'search',
					//iconPosition: 'aisleRight',
					onClick: function (event: any) {
						scheduleSetOpenPopup(event.item, event.rowIndex);
					},
				},
				editable: false,
				width: 150,
			},
			{
				dataField: 'jobScheduleDesc',
				headerText: '자연어로 표시',
				labelFunction: (
					rowIndex: any,
					columnIndex: any,
					value: any,
					headerText: any,
					item: { jobSchedule: string },
				) => {
					// item.jobSchedule이 없으면 빈 문자열 반환
					if (!item.jobSchedule) {
						return '';
					}
					return quartzToNaturalLanguage(item.jobSchedule);
				},
				editable: false,
				width: 250,
				style: 'left',
			},
			{
				dataField: 'paramDesc',
				headerText: '인수설정',
				commRenderer: {
					type: 'search',
					//iconPosition: 'aisleRight',
					onClick: function (event: any) {
						paramSetOpenPopup(event.item);
					},
				},
				editable: false,
				width: 80,
				style: 'left',
			},
			{
				dataField: 'manualExec',
				headerText: '수동 실행',
				editable: false,
				commRenderer: {
					type: 'icon',
					icon: '/img/icon/PlayCircle.svg',
					onClick: function (event: any) {
						callJob(event.item);
					},
				},
				width: 60,
			},
			{
				dataField: 'jobResult',
				headerText: t('lbl.JOBRESULT'),
				labelFunction: jobResultLabelFunc,
				styleFunction: function (rowIndex: any, columnIndex: any, value: any, item: any) {
					// 상태에 따른 스타일 적용 - CLASS명 반환
					if (value === 'STARTED') {
						return 'fc-blue';
					} else if (value === 'FAILED') {
						return 'fc-red';
					}
				},
				editable: false,
				dataType: 'code',
			},
			{
				dataField: 'lastRunStartTime',
				headerText: '마지막 실행 시작시간',
				width: 160,
				dataType: 'code',
				editable: false,
			},
			{
				dataField: 'lastRunEndTime',
				headerText: '마지막 실행 종료시간',
				width: 160,
				dataType: 'code',
				editable: false,
			},
			/*
			{
				dataField: 'jobClassName',
				headerText: t('lbl.SOURCECOURSE'),
				width: 300,
				style: 'left',
			},
             */
			/*
			{
				dataField: 'addwho',
				headerText: t('lbl.ADDWHO'),
				dataType: 'code',
				editable: false,
				width: 120,
			},
			{
				dataField: 'adddate',
				headerText: t('lbl.ADDDATE'),
				dataType: 'date',
				formatString: 'yyyy-mm-dd hh:MM:ss',
				editable: false,
				width: 150,
			},
			{
				dataField: 'editwho',
				headerText: t('lbl.EDITWHO'),
				dataType: 'code',
				editable: false,
				width: 120,
			},
			{
				dataField: 'editdate',
				headerText: t('lbl.EDITDATE'),
				dataType: 'date',
				formatString: 'yyyy-mm-dd hh:MM:ss',
				editable: false,
				width: 150,
			},
			*/
		];
	};

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps = (): object => {
		return {
			editable: true,
			showStateColumn: true,
			enableColumnResize: true,
			showRowCheckColumn: true,
			enableFilter: true,
			isLegacyRemove: true,
			fillColumnSizeMode: false,
		};
	};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 인수 설정 팝업
	 * @param {object} item JOB 정보
	 * @returns {void}
	 */
	const paramSetOpenPopup = (item: any): void => {
		setParams(item);
		paramPopModal.current?.handlerOpen();
	};

	// 인수 설정 팝업 닫기
	const paramSetClosePopPopup = () => {
		paramPopModal.current?.handlerClose();
	};

	/**
	 * 인수 설정/스케쥴 설정 팝업
	 * @param {object} item JOB 정보
	 * @param row
	 * @returns {void}
	 */
	const scheduleSetOpenPopup = (item: any, row: number): void => {
		setParams(item);
		setParams({ ...item, rowIndex: row });
		schedulePopModal.current?.handlerOpen();
	};

	// 인수 설정 팝업 닫기
	const scheduleSetClosePopPopup = () => {
		schedulePopModal.current?.handlerClose();
	};

	// 인수 설정 팝업 닫기 이후 콜백 함수
	const handleScheduleSelected = (selectedValue: selectItems) => {
		const rowIndex = selectedValue.rowIndex;

		if (rowIndex !== undefined) {
			// 수정 감지 + 자동 수정 상태 반영
			gridRef.current.setCellValue(rowIndex, 'jobSchedule', selectedValue.cronExpression);
			gridRef.current.setCellValue(rowIndex, 'jobScheduleDesc', selectedValue.cronText);
		}
	};

	/**
	 * job 수동 실행 팝업
	 * @param {object} item JOB 정보
	 * @returns {void}
	 */
	const callJobOpenPopup = (item: any): void => {
		setParams(item);
		callJobPopModal.current?.handlerOpen();
	};

	// job 수동 실행 팝업 닫기
	const callJobClosePopPopup = () => {
		callJobPopModal.current?.handlerClose();
	};

	/**
	 * 존 정보 변경사항 저장
	 * @returns {void}
	 */
	const saveMngList = (): void => {
		// 중복 체크
		/*if (!gridRef.current.checkDuplicateValue(['dccode', 'zone'])) {
			return false;
		}*/

		const params = gridRef.current.getChangedData();
		// validation
		if (params.length > 0 && !gridRef.current.validateRequiredGridData()) {
			return;
		}
		// 변경 데이터 확인
		if (!params || params.length < 1) {
			showMessage({
				content: t('msg.MSG_COM_VAL_020'),
				modalType: 'info',
			});
			return;
		}

		// 저장하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_CFM_003'), () => {
			apiPostSaveBatchMngList(params).then(() => {
				// 저장이 완료되면 체크된 ROW의 rowStatus 를 'R'로 변경한다.
				gridRef.current.getCheckedRowItems().map((item: any) => {
					gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
				});
				// 전체 체크 해제
				gridRef.current.setAllCheckedRows(false);
				// AUIGrid 변경이력 Cache 삭제
				gridRef.current.resetUpdatedItems();
				showMessage({
					content: t('msg.MSG_COM_SUC_003'),
					modalType: 'info',
				});
			});
		});
	};

	/**
	 * 쿼츠 스케쥴링 restart
	 * @returns {void}
	 */
	const callRescheduleJob = (): void => {
		//const params = gridRef.current.getChangedData();
		const params = {
			jobName: 'rescheduleJob',
		};

		// 스케쥴링 재시작 진행 하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_VAL_062'), () => {
			apiPostCallRescheduleJob(params).then(res => {
				if (res != undefined) {
					let modalType;
					if (res.data.data.returnCode != 'OK' || res.data.data.errorCode < 0) {
						modalType = 'error';
					} else {
						modalType = 'info';
					}

					let returnMsg;
					if (res.data.data.errorCode < 0) {
						returnMsg = res.data.data.errorMsg;
					} else {
						returnMsg = res.data.data.returnMsg;
					}

					if (res.status == 200) {
						showMessage({
							content: returnMsg,
							modalType: modalType,
						});
					}
				}
			});
		});
	};

	/**
	 * 그리드 버튼: 사용여부(Y/N) 상태 일괄변경
	 * @returns {void}
	 */
	const clickAllChangeUseYn = (): void => {
		const _changeUseYn = titleForm.getFieldValue('changeUseYn') || '';

		if (commUtil.isNull(_changeUseYn)) {
			showAlert('', '배치사용여부(Y/N)을 선택하세요.');
			return;
		}

		const checkedItems = gridRef.current.getCheckedRowItems();

		if (checkedItems.length < 1) {
			showAlert(null, t('msg.MSG_COM_VAL_010'));
			return;
		}

		showConfirm(null, '변경하시겠습니까?', () => {
			checkedItems.map((item: any) => gridRef.current.setCellValue(item.rowIndex, 'useYn', _changeUseYn));
		});
	};

	/**
	 * 그리드 버튼 함수를 설정한다.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = (): GridBtnPropsType => {
		return {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
				{
					btnType: 'elecApproval', // 전자결재
					btnLabel: '스케쥴링 리스타트',
					callBackFn: callRescheduleJob,
				},
				{
					btnType: 'plus', // 행추가
					initValues: {
						menuYn: 0,
						useYn: 0,
					},
				},
				{
					btnType: 'delete', // 행삭제
				},
				{
					btnType: 'save', // 저장
					callBackFn: saveMngList,
				},
			],
		};
	};

	/**
	 * 배치 job 호출
	 * @param {object} item JOB 호출
	 * @returns {void}
	 */
	const callJob = (item: any) => {
		if (!commUtil.isEmpty(item.paramDesc)) {
			callJobOpenPopup(item);
		} else {
			showConfirm(null, t('msg.MSG_COM_CFM_021'), () => {
				apiPostCallBatchApiParamSetList(item).then(res => {
					let modalType;
					if (res.data.data.returnCode == 'OK') {
						modalType = 'info';
					} else {
						modalType = 'error';
					}

					showMessage({
						content: res.data.data.returnMsg,
						modalType: modalType,
					});

					if (onSearch) onSearch(); // 재조회
				});
			});
		}
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		gridRef.current.setGridData(gridData);
	}, [gridData]);

	return (
		<>
			<AGrid className="contain-wrap">
				<GridTopBtn gridTitle={t('lbl.BATCHLIST')} gridBtn={getGridBtn()} totalCnt={props.totalCnt}>
					<Form layout="inline" form={titleForm} style={{ padding: '10px' }}>
						<SelectBox
							name="changeUseYn"
							//placeholder="선택해주세요"
							options={getCommonCodeList('YN', '', '')}
							fieldNames={{ label: 'cdNm', value: 'comCd' }}
							label={'배치사용여부'}
							className="bg-white"
							style={{ width: 110 }}
						/>
						<Button size={'small'} onClick={clickAllChangeUseYn}>
							일괄변경
						</Button>
					</Form>
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={getGridCol()} gridProps={getGridProps()} />
			</AGrid>
			<CustomModal ref={paramPopModal} width="600px">
				<BatchParamSetPop close={paramSetClosePopPopup} param={params} onSearch={onSearch} />
			</CustomModal>
			<CustomModal ref={schedulePopModal} width="500px">
				<BatchScheduleSetPop close={scheduleSetClosePopPopup} param={params} onSelect={handleScheduleSelected} />
			</CustomModal>
			<CustomModal ref={callJobPopModal} width="500px">
				<BatchCallJobPop close={callJobClosePopPopup} param={params} />
			</CustomModal>
		</>
	);
};

export default BatchMngList;
