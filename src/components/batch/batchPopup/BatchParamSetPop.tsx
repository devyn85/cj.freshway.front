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
import { apiGetBatchParamSetList, apiPostSaveBatchParamSetList } from '@/api/batch/apiBatchPop';
import IcoSvg from '@/components/common/IcoSvg';
import icoSvgData from '@/components/common/icoSvgData.json';

interface propsTypes {
	close: () => void;
	param: any;
	onSearch: () => void;
}

const BatchParamSetPop = (props: propsTypes) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 사용자 정보
	const { onSearch, close } = props;
	const { t } = useTranslation();
	const gridRef = useRef<any>();

	// 그리드 컬럼 정의
	const gridCol = [
		{
			dataField: 'paramName',
			headerText: '파라미터 이름',
			dataType: 'code',
			width: '30%',
		},
		{
			dataField: 'paramType',
			headerText: '파라미터 타입',
			renderer: {
				// 편집 모드 진입 시 드랍다운리스트 출력하고자 할 때
				type: 'DropDownListRenderer',
				list: [
					{ value: 'String', text: '문자' },
					{ value: 'Number', text: '숫자' },
					{ value: 'Date', text: '날짜' },
				],
				keyField: 'value',
				valueField: 'text',
			},
			width: '20%',
		},
		{
			dataField: 'paramValue',
			headerText: '파라미터 값',
			width: '30%',
		},
		{
			dataField: 'paramDesc',
			headerText: '파라미터 설명',
			width: '20%',
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
		apiGetBatchParamSetList({ jobName: props.param.jobName }).then(res => {
			gridRef.current?.setGridData(res.data ?? []);
		});
	};

	/**
	 * 배치 인수 변경사항 저장
	 * @returns {void}
	 */
	const saveParamPopList = (): void => {
		// 중복 체크
		/*if (!gridRef.current.checkDuplicateValue(['dccode', 'zone'])) {
			return false;
		}*/

		const params = gridRef.current.getChangedData();
		if (Array.isArray(params) && params.length > 0) {
			params[0].jobName = props.param.jobName;
		}
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
			apiPostSaveBatchParamSetList(params).then(res => {
				if (res.data.statusCode == 0) {
					// 저장이 완료되면 체크된 ROW의 rowStatus 를 'R'로 변경한다.
					gridRef.current.getCheckedRowItems().map((item: any) => {
						gridRef.current.setCellValue(item.rowIndex, 'rowStatus', 'R');
					});
					// 전체 체크 해제
					gridRef.current.setAllCheckedRows(false);
					// AUIGrid 변경이력 Cache 삭제
					gridRef.current.resetUpdatedItems();
					showMessage({
						content: res.data.statusMessage,
						modalType: 'info',
					});

					if (onSearch) onSearch(); // 부모로 전달
					if (close) close(); // 팝업 창 닫기
				}
			});
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
		return {
			tGridRef: gridRef, // 타겟 그리드 Ref
			btnArr: [
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
					callBackFn: saveParamPopList,
				},
			],
		};
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
			<PopupMenuTitle name="인수 설정" func={titleFunc} showButtons={false} />
			<AGrid>
				<GridTopBtn
					gridTitle={props.param.jobDesc + '[' + props.param.jobName + ']'}
					gridBtn={getGridBtn()}
					//totalCnt={124}
				>
					<Button onClick={refreshFn} icon={<IcoSvg data={icoSvgData.icoRefresh} label={t('lbl.REFRESH')} />} />
				</GridTopBtn>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={getGridProps()} />
			</AGrid>
			<ButtonWrap data-props="single">
				<Button size={'middle'} type="primary" onClick={close}>
					{t('lbl.CLOSE')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default BatchParamSetPop;
