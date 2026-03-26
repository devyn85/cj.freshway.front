/*
 ############################################################################
 # FiledataField	: CmSkuSpecSearch.tsx
 # Description		: 상품 분류 조회 팝업
 # Author			: KimSunHo	
 # Since			: 25.05.
 ############################################################################
*/
// lib
import { useThrottle } from '@/hooks/useThrottle';
import { Form } from 'antd';
// utils

// component
import CmSkuSpecPopup from '@/components/cm/popup/CmSkuSpecPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';
//store
import { useAppSelector } from '@/store/core/coreHook';

// API Call Function
import { getSkuSpecList } from '@/api/sys/apiSysPilot20';
import { usePopupSearchValue } from '@/hooks/cm/usePopupSearchValue';

interface SearchSkuSpecProps {
	form: any;
	selectionMode?: string;
	name: string;
	code: string;
	returnValueFormat?: string;
	value?: string;
	label?: string;
}

const CmSkuSpecSearch = (props: SearchSkuSpecProps) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { form, selectionMode, name, code, returnValueFormat, value, label } = props;
	const [popupForm] = Form.useForm();

	const throttle = useThrottle();

	const refModal = useRef(null);
	const gridRef = useRef(null);

	const [popupList, setPopupList] = useState([]);

	// scroll Paging
	const [currentPageScr, setCurrentPageScr] = useState(1);
	const [pageSizeScr] = useState(100);

	const { t } = useTranslation();

	// 사용자 정보
	const user = useAppSelector(state => state.user.userInfo);

	// 기본 카테고리
	const [defCategory] = useState('SKUGROUP');

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const handleOpenPopup = () => {
		setPopupList([]);
		// setTotalCount(0);
		refModal.current?.handlerOpen();
	};

	/**
	 * API 조회
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const getSearchApi = (isPopup: boolean, value: string) => {
		if (value === '') {
			// 검색어가 없을 경우 팝업 호출
			handleOpenPopup();
			return;
		}

		// const tt = currentPageScr - 1;
		const params = {
			storerkey: user.defStorerkey,
			speccategory: 'SKUGROUP',
			name: value,
			// multiSelect: '',
			// startRow: 0 + tt * pageSizeScr,
			// listCount: pageSizeScr,
		};

		getSkuSpecList(params).then(res => {
			if (!isPopup) {
				if (res.data.length === 1) {
					settingSelectData(res.data[0]);
				} else {
					refModal.current?.handlerOpen();
				}
			}
			gridRef.current?.clearGridData();

			// 팝업 발생 후 데이터 적용
			setPopupList(res.data);
		});
	};

	/**
	 * API 조회 - 그리드 스크롤
	 * @param {boolean} isPopup 팝업여부
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const search = throttle((isPopup: boolean, value1: string, value2: string) => {
		// const tt = currentPageScr - 1;
		const params = {
			storerkey: user.defStorerkey,
			speccategory: defCategory,
			name: value1,
			// multiSelect: value2,
			// startRow: 0 + tt * pageSizeScr,
			// listCount: pageSizeScr,
		};

		getSkuSpecList(params).then(res => {
			setPopupList(res.data);
		});
	}, 500);

	/**
	 * API 조회 - INPUT 하단 그리드
	 * @param {string} value 검색할 이름
	 * @returns {void}
	 */
	const searchEnter = (value: string) => {
		if (value === '') {
			return;
		}

		const params = {
			storerkey: user.defStorerkey,
			speccategory: defCategory,
			name: value,
		};

		getSkuSpecList(params).then(res => {
			if (res.data.length === 1) {
				settingSelectData(res.data);
			} else {
				// 검색어가 없을 경우 팝업 호출
				refModal.current?.handlerOpen();
			}
		});
	};

	/**
	 * 버튼 클릭 검색
	 * @param {object} param 조회 param
	 * @param {any} event 이벤트
	 * @param {any} source 객체
	 * @returns {void}
	 */
	const onClickSearchButton = (param: string, event: any, source: any) => {
		if (source.source === 'clear') {
			return;
		}

		setPopupList([]);

		if (event.key === 'Enter') {
			searchEnter(param);
		} else {
			handleOpenPopup();
		}
	};

	/**
	 * 조회 결과 저장
	 * @param {object} val 선택된 객체
	 * @returns {void}
	 */
	const settingSelectData = (val: any) => {
		let searchName = `[${val[0].speccode}]${val[0].specdescr}`;
		let searchCode = val[0].speccode;

		for (let i = 1; i < val.length; i++) {
			searchName += `,[${val[i].speccode}]${val[i].specdescr}`;
			searchCode += ',' + val[i].speccode;
		}

		if (returnValueFormat === 'code') {
			form.setFieldsValue({ [name]: searchCode, [code]: searchCode });
		} else if (val.length > 1) {
			form.setFieldsValue({ [name]: `${val.length}건 선택`, [code]: searchCode });
		} else {
			form.setFieldsValue({ [name]: searchName, [code]: searchCode });
		}

		// 팝업에서 선택된 값 표시
		// //console.log('settingSelectData >> ', searchCode);
	};

	usePopupSearchValue({ form, name, code, value });

	/**
	 * 팝업 취소 버튼
	 */
	const closeEvent = () => {
		// 의미없는 값 삭제
		if (commUtil.isEmpty(form.getFieldValue(code))) {
			form.setFieldsValue({ [name]: '' });
		}
		setCurrentPageScr(1);
		form.resetFields();
		refModal.current?.handlerClose();
	};

	/**
	 * 팝업 확인
	 * @param {object} params Request Params
	 */
	const confirmEvent = (params: any) => {
		setCurrentPageScr(1);
		refModal.current?.handlerClose();
		settingSelectData(params);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	/**
	 * 스크롤하여 페이지 이동되면 데이터 조회
	 */
	useEffect(() => {
		if (currentPageScr > 1) {
			const param = popupForm.getFieldValue(name);
			search(true, param);
		}
	}, [currentPageScr]);

	return (
		<>
			{/* 팝업 */}
			<InputSearch
				label={label ?? '상품분류'}
				placeholder={t('msg.placeholder1', ['상품분류코드 또는 이름'])}
				name={name}
				code={code}
				hidden={true}
				onSearch={onClickSearchButton}
				allowClear
			/>
			<CustomModal ref={refModal} width="1280px">
				<CmSkuSpecPopup
					callBack={confirmEvent}
					close={closeEvent}
					searchName={form.getFieldValue(name)}
					gridData={popupList}
					search={search}
					selectionMode={selectionMode ? selectionMode : 'singleRow'} //multipleRows
					setCurrentPage={setCurrentPageScr}
					gridRef={gridRef}
					form={popupForm}
					name={name}
				></CmSkuSpecPopup>
			</CustomModal>
		</>
	);
};

export default CmSkuSpecSearch;

/**
 *
 * @param arg0
 */
function setTotalCount(arg0: number) {
	throw new Error('Function not implemented.');
}
