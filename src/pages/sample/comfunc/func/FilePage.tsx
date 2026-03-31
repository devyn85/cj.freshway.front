/*
 ############################################################################
 # FiledataField	: FilePage.tsx
 # Description		: 파일업로드
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/

import { Form } from 'antd';

// API Call Function
import { apiGetFileList } from '@/api/common/apiComfunc';
import { DateRange } from '@/components/common/custom/form';
// Utils
import dataTransform from '@/util/dataTransform';
import dateUtils from '@/util/dateUtil';
import dayjs from 'dayjs';

import { SearchForm } from '@/components/common/custom/form';

import MenuTitle from '@/components/common/custom/MenuTitle';

import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import DetailFilepage from '@/components/comfunc/func/filePage/DetailFilepage';
import { t } from 'i18next';

const FilePage = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// const { menu } = useLocation().state;
	const gridRef = useRef(null);

	const [form] = Form.useForm();
	const [resData, setResData] = useState([]);

	const today = dateUtils.getToDay('YYYY-MM-DD');
	const [searchBox] = useState({
		fromDt: dayjs(dateUtils.subtractYear(today, 1, 'YYYY-MM-DD')),
		thruDt: dayjs(today),
	});

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */
	/*
    ### 조회 ###
    */
	const onClickSearchButton = () => {
		// TO-Do 필수값 체크
		// if (!searchBoxRef?.current?.checkRequired()) return;
		const params = dataTransform.convertSearchData(form.getFieldsValue());
		// const params: any = searchBoxRef?.current?.getSearchBoxParam();
		// TO-DO 날짜 공통 만들기
		if (!dateUtils.isSameOrBefore(params.fromDt, params.thruDt)) {
			//	messageBox.showAlert('', '게시 종료일이 게시 시작일보다 빠를 수 없습니다', false);
			return;
		}

		apiGetFileList(params).then(res => {
			setResData(res.data);
		});
	};

	// 메뉴 타이틀에 연결할 함수
	const titleFunc = {
		searchYn: onClickSearchButton,
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		// onClickSearchButton();
	}, []);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} authority="searchYn" />

			{/* 조회 컴포넌트 */}
			<SearchForm form={form} initialValues={searchBox}>
				<UiFilterArea>
					<UiFilterGroup className="grid-column-1">
						<li>
							<DateRange
								label={t('comfunc.bbs.search.daterange')}
								span={24}
								format="YYYY-MM-DD"
								fromName="fromDt"
								toName="thruDt"
							/>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>

			{/* 그리드 영역 */}

			<DetailFilepage ref={gridRef} data={resData} search={onClickSearchButton}></DetailFilepage>
		</>
	);
};

export default FilePage;
