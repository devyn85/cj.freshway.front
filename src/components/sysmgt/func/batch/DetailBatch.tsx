// Lib
import AGrid from '@/assets/styled/AGrid/AGrid';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import TextArea from 'antd/es/input/TextArea';
// Utils
import commUtil from '@/util/commUtil';
// Store

// Component
import PageGridBtn from '@/components/common/PageGridBtn';

// API Call Function
import { apiGetStepList, apiGetStepMsg } from '@/api/common/apiSysmgt';

const DetailBatch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { stepMessage, setStepMessage } = props;

	ref.ref1 = useRef();
	ref.ref2 = useRef();

	/*
    ### 그리드 변수 ###
    */
	const gridCol = [
		{
			dataField: 'jobExecutionId',
			headerText: t('sysmgt.batch.job.jobExecutionId'),
		},
		{
			dataField: 'jobInstanceId',
			headerText: t('sysmgt.batch.job.jobInstanceId'),
			visible: false,
		},
		{
			dataField: 'jobName',
			headerText: t('sysmgt.batch.job.jobName'),
		},
		{
			dataField: 'startTime',
			headerText: t('sysmgt.batch.job.startTime'),
		},
		{
			dataField: 'endTime',
			headerText: t('sysmgt.batch.job.endTime'),
		},
		{
			dataField: 'status',
			headerText: t('sysmgt.batch.job.status'),
		},
	];

	const gridProps = {
		editable: false,
		showStateColumn: true,
	};

	const gridBtn = {};

	const gridCol2 = [
		{
			dataField: 'stepExecutionId',
			headerText: t('sysmgt.batch.step.stepExecutionId'),
		},
		{
			dataField: 'stepName',
			headerText: t('sysmgt.batch.step.stepName'),
		},
		{
			dataField: 'startTime',
			headerText: t('sysmgt.batch.step.startTime'),
		},
		{
			dataField: 'endTime',
			headerText: t('sysmgt.batch.step.endTime'),
		},
		{
			dataField: 'readCount',
			headerText: t('sysmgt.batch.step.readCount'),
		},
		{
			dataField: 'writeCount',
			headerText: t('sysmgt.batch.step.writeCount'),
		},
		{
			dataField: 'status',
			headerText: t('sysmgt.batch.step.status'),
		},
		{
			dataField: 'getLog',
			headerText: t('sysmgt.batch.step.getLog'),
		},
	];

	const gridProps2 = {
		editable: false,
		showStateColumn: true,
	};

	const gridBtn2 = {};

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	const searchDtl = (jobExecutionId: string) => {
		ref.ref2.current.clearGridData();
		if (commUtil.isNull(jobExecutionId)) {
			const selectedRow = ref.ref1.current.getSelectedRows();
			if (selectedRow.length > 0 && !ref.ref1.current.isAddedById(selectedRow[0]._$uid)) {
				jobExecutionId = selectedRow[0].jobExecutionId; // 현재 행
			} else {
				return;
			}
		}
		const params = { jobExecutionId: jobExecutionId };

		apiGetStepList(params).then(res => {
			const gridData = res.data;
			ref.ref2.current.setGridData(gridData);
			ref.ref2.current.setSelectionByIndex(0, 0);
		});
	};
	//msg grid
	const searchStepMsg = (jobId: string, stepId: string) => {
		setStepMessage(null);
		if (commUtil.isNull(jobId)) {
			const selectedRow = ref.ref1.current.getSelectedRows();
			if (selectedRow.length > 0 && !ref.ref1.current.isAddedById(selectedRow[0]._$uid)) {
				jobId = selectedRow[0].jobExecutionId; // 현재 행
			} else {
				return;
			}
		}

		if (commUtil.isNull(stepId)) {
			const selectedRow = ref.ref2.current.getSelectedRows();
			if (selectedRow.length > 0 && !ref.ref2.current.isAddedById(selectedRow[0]._$uid)) {
				stepId = selectedRow[0].stepExecutionId; // 현재 행
			} else {
				return;
			}
		}

		const params = {
			jobExecutionId: jobId,
			stepExecutionId: stepId,
		};

		apiGetStepMsg(params).then(res => {
			setStepMessage(res.data.getLog);
		});
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// 행 변경 시
		ref.ref1.current.bind('selectionChange', function () {
			// 상세코드 조회
			searchDtl(null);
		});
		// 행 변경 시
		ref.ref2.current.bind('selectionChange', function () {
			// 상세코드 조회
			searchStepMsg(null, null);
		});
	}, []);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur1 = ref.ref1.current;
		if (gridRefCur1) {
			gridRefCur1?.setGridData(props.data);
			gridRefCur1?.setSelectionByIndex(0, 0);
		}
	}, [props.data]);

	return (
		<>
			{/* 그리드 영역 */}
			<AGrid>
				<PageGridBtn gridBtn={gridBtn} gridTitle={'Job'} />
				<AUIGrid ref={ref.ref1} columnLayout={gridCol} gridProps={gridProps} />
			</AGrid>
			<AGrid>
				<PageGridBtn gridBtn={gridBtn2} gridTitle={'Step'} />
				<AUIGrid ref={ref.ref2} columnLayout={gridCol2} gridProps={gridProps2} />
			</AGrid>
			<div>
				{/* Step 결과 메세지 */}
				<h3>{t('sysmgt.batch.step.getLog')}</h3>
				<TextArea placeholder="STEP이 성공하였습니다." rows={4} value={stepMessage} />
			</div>
		</>
	);
});

export default DetailBatch;
