/*
 ############################################################################
 # FiledataField	: CmSearchPopup.tsx
 # Description		: 운송사 팝업
 # Author			: ParkYoSep
 # Since			: 25.12.16
 ############################################################################
*/
// css
import AGrid from '@/assets/styled/AGrid/AGrid';
import ButtonWrap from '@/assets/styled/ButtonWrap/ButtonWrap';
import TotalCount from '@/assets/styled/Container/TotalCount';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// lib
import AUIGrid from '@/lib/AUIGrid/AUIGridReactCanal';
import { Button, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

// component
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
import PopupMenuTitle from '@/components/common/custom/PopupMenuTitle';

// Hooks
import { useThrottle } from '@/hooks/useThrottle';

// API Call Function
import { useScrollPagingAUIGrid } from '@/hooks/useScrollPagingAUIGrid';
import { getCommonCodebyCd, getCommonCodeList } from '@/store/core/comCodeStore';
import { getSearchPopupApiFunction, getSearchPopupTitle } from '@/util/searchPopupConfigUtil';

interface PropsType {
	label?: string;
	type?: string;
	callBack?: any;
	close?: any;
	codeName?: string;
	customDccode?: string; // 추가: customDccode 필드(검색조건의 물류센터 적용)
	carrierType?: string;
}

const CmSearchCarrierPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { callBack, carrierType } = props;
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const gridRef = useRef(null);

	const throttle = useThrottle();

	// scroll Paging
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSizeScr] = useState(constants.PAGE_INFO.PAGE_SIZE);
	const [totalCount, setTotalCount] = useState(0);

	const [searchBox] = useState({
		codeName: '',
		carrierType: carrierType || null,
	});

	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);

	const gridId = uuidv4() + '_gridWrap';

	const gridCol = [
		{
			headerText: '운송사',
			dataField: 'code',
			dataType: 'code',
		},
		{
			headerText: '운송사명',
			dataField: 'name',
		},
		{
			headerText: '운송사유형',
			dataField: 'carrierType',
			dataType: 'code',
			labelFunction: (rowIndex: any, columnIndex: any, value: any) => {
				return getCommonCodebyCd('CARRIERTYPE', value)?.cdNm;
			},
		},
	];

	const gridProps = {
		editable: false,
		showRowCheckColumn: false,
	};

	const title = getSearchPopupTitle(props.type);

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 검색 버튼 클릭
	 */
	const onClickSearchButton = useCallback(() => {
		setCurrentPage(1);
		gridRef.current.clearGridData();
		searchScroll(true, form.getFieldValue('codeName'));
	}, []);

	/**
	 * 새로고침 버튼 클릭
	 */
	const onClickRefreshButton = () => {
		form.setFieldsValue({ codeName: '' });
		gridRef.current.clearGridData();
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = useMemo(
		() => ({
			searchYn: onClickSearchButton,
			refresh: onClickRefreshButton,
		}),
		[onClickSearchButton, onClickRefreshButton],
	);

	/**
	 * 행 선택
	 */
	const selectRowData = () => {
		const selectedRow = gridRef.current.getSelectedRows();
		callBack(selectedRow);
	};

	/**
	 * 확인
	 */
	const checkRowData = () => {
		const checkedRow = gridRef.current.getSelectedRows();
		if (checkedRow.length === 0) {
			props.close();
			return;
		}
		callBack(checkedRow);
	};

	/**
	 * API 조회 - 그리드 스크롤
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const searchScroll = throttle((isPopup: boolean, value: string) => {
		const tt = currentPage - 1;
		const params = {
			name: value,
			// dccode: gDccode,
			startRow: 0 + tt * pageSizeScr,
			listCount: pageSizeScr,
			skipCount: currentPage !== 1,

			carrierType: form.getFieldValue('carrierType') || carrierType || '', // 추가: carrierType 파라미터 설정
		};

		const apiFunction = getSearchPopupApiFunction(props.type);

		if (!apiFunction) {
			return;
		}

		const paramsByType = { ...params };

		apiFunction(paramsByType).then((res: any) => {
			settingSelectData(res.data);
		});
	}, 500);

	/**
	 * response 데이터 grid에 설정
	 * @param {Array} data grid에 설정할 데이터
	 */
	const settingSelectData = (data: any) => {
		if (data.list?.length > 0) {
			if (currentPage === 1) {
				setTotalCount(data.totalCount);
			}
			const gridData = data.list;

			gridRef.current.appendData(gridData);

			// 조회된 결과에 맞게 칼럼 넓이를 구한다.
			const colSizeList = gridRef.current.getFitColumnSizeList(true);
			// 구해진 칼럼 사이즈를 적용 시킴.
			gridRef.current.setColumnSizeList(colSizeList);
		}
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 * =====================================================================
	 */

	/**
	 * 그리드 더블클릭시 해당 로우 부모페이지에 표시
	 */
	useEffect(() => {
		gridRef.current.bind('cellDoubleClick', function () {
			selectRowData();
		});
	}, []);

	useScrollPagingAUIGrid({
		gridRef,
		callbackWhenScrollToEnd: () => {
			setCurrentPage((currentPage: any) => currentPage + 1);
		},
		totalCount,
	});

	/**
	 * 발주직송그룹에서진입
	 */
	useEffect(() => {
		if (props.codeName) {
			form.setFieldValue('codeName', props.codeName);
			searchScroll(true, props.codeName);
		}
	}, [props.codeName]);

	/**
	 * 사용자팝업
	 */
	useEffect(() => {
		gridRef.current.showColumnByDataField('code');
		gridRef.current.showColumnByDataField('name');

		gridRef.current.showColumnByDataField('carrierType');
	}, [props.type]);

	/**
	 * 스크롤하여 페이지 이동되면 데이터 조회
	 */
	useEffect(() => {
		if (currentPage > 1) {
			const param = form.getFieldValue('codeName');
			searchScroll(true, param);
		}
	}, [currentPage]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<PopupMenuTitle name={props.label || title} func={titleFunc} />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox} isAlwaysVisible>
				{/*2행*/}
				<UiFilterArea>
					<UiFilterGroup className="grid-column-2">
						<li>
							<InputText
								name={'codeName'}
								label={t('lbl.CARRIERCODENAME')}
								placeholder={t('msg.placeholder2', ['운송사코드 또는 이름'])}
								onPressEnter={onClickSearchButton}
							/>
						</li>
						<li>
							<SelectBox
								name="carrierType"
								// 2차 운송사(SUBC) 또는 운송사(LOCAL) 선택 시 고정
								disabled={carrierType === 'SUBC' || carrierType === 'LOCAL'}
								placeholder={t('msg.placeholder2', ['운송사유형'])}
								options={getCommonCodeList('CARRIERTYPE', '전체')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								label={t('lbl.CARRIERTYPE')}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			<TotalCount>
				<span>총 {commUtil.changeNumberFormatter(totalCount)}건</span>
			</TotalCount>

			{/* 그리드 영역 */}
			<AGrid>
				<AUIGrid ref={gridRef} columnLayout={gridCol} gridProps={gridProps} name={gridId} />
			</AGrid>

			<ButtonWrap data-props="single">
				<Button size={'middle'} onClick={props.close}>
					{t('lbl.BTN_CANCEL')}
				</Button>
				<Button size={'middle'} type="primary" onClick={checkRowData}>
					{t('lbl.BTN_CONFIRM')}
				</Button>
			</ButtonWrap>
		</>
	);
};

export default CmSearchCarrierPopup;
