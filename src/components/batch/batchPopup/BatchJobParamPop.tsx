// lib
import { Button } from 'antd';
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
import { apiGetBatchParamHistList } from '@/api/batch/apiBatchHistory';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';

interface propsTypes {
	close: () => void;
	param: any;
}

const BatchJobParamPop = (props: propsTypes) => {
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
            dataField: 'paramName',
            headerText: '파라미터 이름',
            width: 120,
        },
        {
            dataField: 'paramType',
            headerText: '파라미터 타입',
            width: 100,
        },
        {
            dataField: 'paramValue',
            headerText: '파라미터 값',
        },
    ];

	/**
	 * 그리드 속성을 설정한다.
	 * @returns {object} 그리드 속성 설정 객체
	 */
	const getGridProps = (): object => {
		return {
			editable: false,
			fillColumnSizeMode: false,
			enableColumnResize: true,
			showRowCheckColumn: false,
			showStateColumn: true,
			enableFilter: true,
			isLegacyRemove: true,
            height:200,
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
        const params = {
            jobExecutionId: props.param.jobExecutionId,
        };
        apiGetBatchParamHistList(params).then(res => {
            gridRef.current?.setGridData(res.data ?? []);
        });


        if (!gridRef.current) return [];

        return gridRef.current.getGridData
            ? gridRef.current.getGridData()
            : [];
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
			<PopupMenuTitle name="CALL PARAM" func={titleFunc} showButtons={false} />
			<AGrid>
				<GridTopBtn
					gridTitle={props.param.jobDesc + '[' + props.param.jobName + ']'}
				>
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

export default BatchJobParamPop;
