// lib
import {Button, Col, Row} from 'antd';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import GridTopBtn from '@/components/common/GridTopBtn';
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Type
import { GridBtnPropsType } from '@/types/common';

// api
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';
import {apiGetBatchStepHistList} from "@/api/batch/apiBatchHistory";

interface propsTypes {
	close: () => void;
	param: any;
}


const BatchParamHistPop = (props: propsTypes) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 사용자 정보
	const { close } = props;
	const { t } = useTranslation();
	const gridRef = useRef<any>();

    // 그리드 컬럼 정의
    const getParamGridCol = [
        {
            dataField: 'stepExecutionId',
            headerText: 'Step 실행 ID',
            dataType: 'code',
            width: 100,
        },
        {
            dataField: 'stepName',
            headerText: 'Step 이름',
            dataType: 'code',
            width: 80,
        },
        {
            dataField: 'resultStatus',
            headerText: 'Step 작업결과',
            dataType: 'code',
            width: 100,
        },
        {
            dataField: 'resultMessage',
            headerText: 'Step 결과메시지',
            width: 290,
        },
        {
            dataField: 'startTime',
            headerText: '실행 시작시간',
            dataType: 'date',
            width: 150,
        },
        {
            dataField: 'endTime',
            headerText: '실행 종료시간',
            dataType: 'date',
            width: 150,
        },
    ];

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps = (): object => {
		return {
			editable: true,
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: true,
			showStateColumn: true,
			enableFilter: true,
			isLegacyRemove: true,
            height:150,
		};
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 초기화
	 * /src/layout/Tab/MainTabs.tsx >>> onClickRefreshTab function 그대로 가져옴
	 * @returns {void}
	 */
	const refreshFn = (): void => {
		fetchGridData();
	};

	// 데이터 조회
	const fetchGridData = () => {
        apiGetBatchStepHistList({ jobName: props.param.jobName, jobExecutionId: props.param.jobExecutionId }).then(res => {
			gridRef.current?.setGridData(res.data ?? []);
		});
	};


	// 타이틀 func
	const titleFunc = {
		refresh: fetchGridData,
		searchYn: fetchGridData,
	};


	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		fetchGridData();
	}, [props.param.jobName]);

	return (
		<>
			<PopupMenuTitle name="JOB RESULT MESSAGE" func={titleFunc} showButtons={false} />
			<AGrid>
				<GridTopBtn gridTitle={props.param.jobDesc + '[' + props.param.jobName + ']'} ></GridTopBtn>
                    <div style={{
                        border: '1px solid #d9d9d9',
                        height: '180px',
                        overflowY: 'auto',
                        padding: '8px',
                        whiteSpace: 'pre-wrap'
                    }}>{props.param.resultMessage}</div>
			</AGrid>
            <AGrid>
                <GridTopBtn gridTitle={'JOB STEP 이력'} >
                    <Button onClick={refreshFn} icon={<IcoSvg data={icoSvgData.icoRefresh} label={t('lbl.REFRESH')} />} />
                </GridTopBtn>
                <AUIGrid ref={gridRef} columnLayout={getParamGridCol} gridProps={getGridProps()} />
            </AGrid>
			<ButtonWrap data-props="single">
				<Button size={'middle'} type="primary" onClick={close}>
					{t('lbl.CLOSE')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default BatchParamHistPop;
