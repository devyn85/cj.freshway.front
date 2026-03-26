/*
 ############################################################################
 # FiledataField	: TimeZone.tsx
 # Description		: 타임존
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// lib
import { Button, Form, Row } from 'antd';
// utils
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dateUtils from '@/util/dateUtil';
// component
import DetailTimeZone from '@/components/comfunc/func/timezone/DetailTimeZone';
import MenuTitle from '@/components/common/custom/MenuTitle';
import { InputText, SearchForm, SelectBox } from '@/components/common/custom/form';
// API Call Function
import { apiGetTimezoneList } from '@/api/common/apiComfunc';
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

const TimeZone = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// const { menu } = useLocation().state;
	// 다국어
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const gridRef = useRef(null);
	const [gridData, setGridData] = useState([]);

	//검색영역 초기 세팅
	const [searchBox] = useState({
		timezoneCd: 'Asia/Seoul',
	});

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회 이벤트
	 * @returns {void}
	 */
	const onClickSearchButton = () => {
		// select 초기값
		form.setFieldValue('timezoneCd', 'Asia/Seoul');

		apiGetTimezoneList().then(res => {
			setGridData(res.data);
		});
	};

	//	메뉴 타이틀 버튼 정의
	const titleFunc = {
		searchYn: onClickSearchButton,
	};
	/**
	 * 타임존 변경
	 * @param {string} value 변경된 값
	 * @returns {void}
	 */
	const onChangeEvent = (value: string) => {
		setGridData(gridData => {
			const temp = gridData.map(
				item =>
					(item = {
						...item,
						logDtm2: dateUtils.changeTimeZone(item.logDtm, 'Asia/Seoul', value),
					}),
			);
			return [...temp];
		});
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		onClickSearchButton();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox}>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-1">
						<li className={'grid-column-1'}>
							<SelectBox
								name="timezoneCd"
								span={8}
								required
								label={t('sysmgt.commoncode.group.comGrpCd')}
								placeholder="선택해주세요"
								options={getCommonCodeList('TPL_TIMEZONE')}
								fieldNames={{ label: 'cdNm', value: 'comCd' }}
								onChange={onChangeEvent}
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			{/* 그리드 영역 */}
			<DetailTimeZone ref={gridRef} data={gridData} />
		</>
	);
};

export default TimeZone;
