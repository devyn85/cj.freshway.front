/*
 ############################################################################
 # FiledataField	: TmTransportControlRoutingPopup.tsx
 # Description		: 정산 > 운송비정산 > 수송배차조정 (노선 목록 조회 팝업)
 # Author					: JiHoPark
 # Since					: 2025.11.06.
 ############################################################################
*/

// Lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';

// Component
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import CmGMultiDccodeSelectBox from '@/components/cm/user/CmGMultiDccodeSelectBox';
import { SearchForm } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';
import { Button, Form } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Util
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import commUtil from '@/util/commUtil';
import dayjs from 'dayjs';

// Store

// API
import { apiGetTransportRoutingList } from '@/api/tm/apiTmTransportControl';

// Hooks

// lib

// type

// asset

interface TmTransportControlRoutingPopupProps {
	params?: any;
	onCallbackHandler?: any;
	onCloseHandler?: any;
}

const TmTransportControlRoutingPopup = (props: TmTransportControlRoutingPopupProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	const [searchForm] = Form.useForm();

	// grid Ref
	const ref = useRef(null);

	// grid data
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		fromDcCode: '', // 출발물류센터
		deliverydt: '', // 조회일자
	});

	const { params, onCallbackHandler, onCloseHandler } = props;

	//그리드 컬럼
	const gridCol = [
		{ headerText: t('lbl.LN'), /*노선*/ dataField: 'routeNm', dataType: 'string', editable: false },
		{ headerText: t('lbl.FROMDCCODE'), /*출발센터*/ dataField: 'fromDccodename', dataType: 'string', editable: false },
		{ headerText: t('lbl.TODCCODE'), /*도착센터*/ dataField: 'toDccodename', dataType: 'string', editable: false },
		{
			headerText: t('lbl.LNNUM'),
			/*노선번호*/ dataField: 'serialkey',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.FROMDCCODE'),
			/*출발센터*/ dataField: 'fromDccode',
			dataType: 'code',
			editable: false,
			visible: false,
		},
		{
			headerText: t('lbl.TODCCODE'),
			/*도착센터*/ dataField: 'toDccode',
			dataType: 'code',
			editable: false,
			visible: false,
		},
	];

	// 그리드 속성을 설정
	const gridProps = {
		editable: false,
		// autoGridHeight: true, // 자동 높이 조절
		//Row Status 영역 여부
		showStateColumn: true, // row 편집 여부
		enableColumnResize: true, // 열 사이즈 조정 여부
		showRowCheckColumn: false,
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/**
	 * 그리드 이벤트 설정
	 */
	const initEvent = () => {
		/**
		 * 그리드 더블클릭
		 * @param {any} event 이벤트
		 */
		ref?.current.bind('cellDoubleClick', (event: any) => {
			onCallbackHandler(event.item);
		});
	};

	/**
	 * 확인버튼 click event
	 */
	const onConfirmHandler = () => {
		const param = ref.current.getSelectedRows();
		onCallbackHandler(param);
	};

	/**
	 * 노선 목록 조회 event
	 */
	const searchTransportRoutingList = () => {
		const searchParam = searchForm.getFieldsValue();

		// 목록 초기화
		ref.current.clearGridData();

		const params = {
			...searchParam,
			deliverydt: searchParam.deliverydt.format('YYYYMMDD'),
		};

		apiGetTransportRoutingList(params).then(res => {
			setGridData(res.data);
			setTotalCnt(res.data.length);
		});
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: searchTransportRoutingList, // 조회
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	/**
	 * 화면 초기화
	 */
	useEffect(() => {
		initEvent();

		if (commUtil.isEmpty(params?.deliverydt)) {
			showMessage({
				content: t('msg.MSG_COM_ERR_008'), // 저장 대상 자료가 존재하지 않습니다.
				modalType: 'info',
			});

			onCloseHandler();
			return;
		}

		searchForm.setFieldValue('fromDcCode', params.fromDcCode);
		searchForm.setFieldValue('deliverydt', dayjs(params.deliverydt));

		// 조회
		searchTransportRoutingList();
	}, []);

	/**
	 * Grid data 변경
	 */
	useEffect(() => {
		const gridRef = ref.current;
		if (gridRef) {
			const dataList = gridData;
			gridRef?.setGridData(dataList);
			gridRef?.setSelectionByIndex(0, 0);

			if (dataList.length > 0) {
				// 현재 출력된 칼럼들의 값을 모두 조사하여 최적의 칼럼 사이즈를 찾아 배열로 반환.
				// 만약 칼럼 사이즈들의 총합이 그리드 크기보다 작다면, 나머지 값들을 나눠 가져 그리드 크기에 맞추기
				const colSizeList = gridRef.getFitColumnSizeList(true);

				// 구해진 칼럼 사이즈를 적용 시킴.
				gridRef.setColumnSizeList(colSizeList);
			}
		}
	}, [gridData]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={t('lbl.LN_LIST_SEARCH')} func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={searchForm} initialValues={searchBox}>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<CmGMultiDccodeSelectBox
								name={'fromDcCode'}
								allLabel={t('lbl.ALL')}
								label={t('lbl.FROMDCCODE')} //출발센터
							/>
						</li>
						<li>
							<DatePicker
								label={t('lbl.DATE')} // 일자
								name="deliverydt"
								allowClear
								showNow={true}
								format="YYYY-MM-DD"
								disabled={true}
								required
								rules={[{ required: true, validateTrigger: 'none' }]}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCnt)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid columnLayout={gridCol} gridProps={gridProps} ref={ref} />
			</AGrid>
			<ButtonWrap data-props="single">
				<Button onClick={onCloseHandler}>{t('lbl.BTN_CANCEL')}</Button>
				<Button type="primary" onClick={onConfirmHandler}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default TmTransportControlRoutingPopup;
