// lib
import { Button } from 'antd';
import React, { useEffect, useRef } from 'react';
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
import IcoSvg from "@/components/common/IcoSvg";
import icoSvgData from "@/components/common/icoSvgData.json";
import {apiGetBatchParamSetList, apiPostSaveBatchParamSetList} from "@/api/batch/apiBatchPop";
import {apiPostCallBatchApiParamSetList} from "@/api/batch/apiBatchRestApi";

export interface BatchParam {
	paramName: string;
	paramValue: string;
	paramType: string;
	paramDesc: string;
}

interface propsTypes {
	close: () => void;
	param: any;
}


const BatchParamSetPop = (props: propsTypes) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 사용자 정보
	const { close, param } = props;
	const { t } = useTranslation();
	const gridRef = useRef<any>();
	const [gridData, setGridData] = useState(null);

	// 그리드 컬럼 정의
	const gridCol = [
		{
			dataField: 'paramName',
			headerText: '파라미터 이름',
			dataType: 'code',
			editable: false,
			width: '30%',
		},
		{
			dataField: 'paramType',
			headerText: '파라미터 타입',
			dataType: 'code',
			editable: false,
			width: '15%',
		},
		{
			dataField: 'paramValue',
			headerText: '파라미터 값',
			width: '30%',
		},
		{
			dataField: 'paramDesc',
			headerText: '파라미터 설명',
			editable: false,
			width: '25%',
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
			enableFilter: true,
			autoGridHeight: true,
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
		apiGetBatchParamSetList({ jobName: props.param.jobName}).then(res => {
			gridRef.current?.setGridData(res.data ?? []);
			setGridData(res.data ?? []);

			setTimeout(() => {
				gridRef.current.refreshView; // 또는 resetGridSize()
			}, 50);
		});
	};



	// 타이틀 func
	const titleFunc = {
		refresh: fetchGridData,
		searchYn: fetchGridData,
	};


	/**
	 * 그리드 버튼 함수를 설정한다.
	 * @returns {GridBtnPropsType} 그리드 버튼 설정 객체
	 */
	const getGridBtn = (): GridBtnPropsType => {
		const gridBtn: GridBtnPropsType = {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [],
		};

		return gridBtn;
	};



	const callJob = () => {
		const allRows = gridRef.current.getGridData();
		const paramList = allRows.map((row: BatchParam) => ({
			paramName: row.paramName,
			paramValue: row.paramValue,
			paramType: row.paramType,
			paramDesc: row.paramDesc,
		}));

		const payLoad = {
			jobName: props.param.jobName,
			paramList
		}

		apiPostCallBatchApiParamSetList(payLoad).then((res) => {
            const data = res.data.data;
            const isOk = data.returnCode === 'OK';

            let modalType;
            if (isOk) {
                modalType = 'info';
            } else {
                modalType = 'error';
            }

            showMessage({
                content: data.returnMsg,
                modalType: modalType,
            });
		});

		close();
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		fetchGridData();
	}, [param]);

	// grid data 변경 감지
	useEffect(() => {
		const gridRefCur = gridRef.current;
		gridRefCur.setGridData(gridData);
		if (gridRefCur) {
			if(gridData != null) {
				//gridRefCur.resizeGrid; // 또는 resetGridSize()
				// 렌더링 이후 호출되도록 딜레이 처리
				//setTimeout(() => {
					gridRefCur.resizeGrid; // 또는 resetGridSize()
				//}, 50);
			}

		}
	}, [gridData]);


	return (
		<>
			<PopupMenuTitle name="인수 설정" func={titleFunc} showButtons={false} />
			<AGrid>
				<GridTopBtn gridTitle={props.param.jobDesc + '[' + props.param.jobName + ']'} gridBtn={getGridBtn()}>
					<Button onClick={refreshFn} icon={<IcoSvg data={icoSvgData.icoRefresh} label={t('lbl.REFRESH')} />} />
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={getGridProps()} />
			</AGrid>
			<div className="title-area-h3 ta-c">{t('msg.MSG_COM_CFM_021')}</div>
			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={close}>
					{t('lbl.BTN_CANCEL')}
				</Button>
				<Button size={'middle'} type="primary" onClick={callJob}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default BatchParamSetPop;
