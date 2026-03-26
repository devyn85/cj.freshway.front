/*
 ############################################################################
 # FiledataField	: StInquiryResult.tsx
 # Description		: 재고 > 재고현황 > 조사지시현황
 # Author			: sss
 # Since			: 25.07.10
 ############################################################################
*/
import { Form, Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import { apiPostTab1MasterList, apiPostTab2MasterList } from '@/api/st/apiStInquiryResult';
import StInquiryResultDetail1 from '@/components/st/stInquiryResult/StInquiryResultDetail1';
import StInquiryResultDetail2 from '@/components/st/stInquiryResult/StInquiryResultDetail2';
import StInquiryResultSearch from '@/components/st/stInquiryResult/StInquiryResultSearch';
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';
import TabPane from 'antd/es/tabs/TabPane';
import styled from 'styled-components';

// lib
const StInquiryResult = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	const [gridData2, setGridData2] = useState([]);
	const [totalCnt2, setTotalCnt2] = useState(0);

	const today = dateUtil.getToDay('YYYY-MM-DD');
	const storerkey = useSelector((state: any) => state.global.globalVariable.gStorerkey);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');

	// Declare react Ref(2/4)
	const refs: any = useRef(null);
	const refs2: any = useRef(null);

	// Declare init value(3/4)
	const [searchBox] = useState({
		docdt: null, // 조회기간(조사일자)
		fixdccode: null, // 물류센터
		lottype: '0', // 실사구분 - 기본값: 재고실사
		inquiryno: null, // 조사번호
		status: '', // 진행상태 - 기본값: 전체
		inquiryAlias: null, // 재고조사별칭
		sku: null, // 상품코드
		skuName: null, // 상품명
		wharea: '', // 창고구분 - 기본값: 전체
		fromZone: null, // 피킹존 시작
		toZone: null, // 피킹존 끝
		fromLoc: null, // 로케이션 시작
		toLoc: null, // 로케이션 끝
		amt: null, // 금액
		compareAmt1: '2', // 금액 비교
		compareAmt2: '4', // 금액 비교
	}); // 검색영역

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 폼 유효성 검증
	 * @param form
	 */
	const validateForm = async (form: any) => {
		try {
			await form.validateFields();
			return true;
		} catch (error) {
			return false;
		}
	};

	/**
	 * 	조회
	 */
	const searchMasterList = async () => {
		// 그리드 데이터 초기화
		if (activeKeyMaster === '1') {
			refs.gridRef.current?.clearGridData();
		} else {
			refs2.gridRef.current?.clearGridData();
		}
		// 공통 파라미터
		const commonParams = {
			...form.getFieldsValue(),
			dt1: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[0].format('YYYYMMDD'),
			dt2: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[1].format('YYYYMMDD'),
		};

		// 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		// 날짜 유효성 검사
		// if (commUtil.isNull(commonParams.dt1) || commUtil.isNull(commonParams.dt2)) {
		// 	showAlert('', t('msg.selectPlease1', [t('lbl.MODIFYDATE')])); // {변경일자}을/를 선택해주세요
		// 	return;
		// }

		try {
			if (activeKeyMaster === '1') {
				// 탭1: Location별
				const params = {
					...commonParams,
					reqFlag: '1', // 요청구분(1:Location, 2:상품별)
				};

				searchMasterListImp01(params);
			} else if (activeKeyMaster === '2') {
				// 탭2: 상품별
				const params = {
					...commonParams,
					reqFlag: '2', // 요청구분(1:Location, 2:상품별)
				};

				searchMasterListImp02(params);
			}
		} catch (error) {
			showAlert('', t('msg.searchError')); // 조회 중 오류가 발생했습니다.
		}
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp01 = (params: any) => {
		// API 호출
		apiPostTab1MasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			}
		});
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp02 = (params: any) => {
		// API 호출
		apiPostTab2MasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
			}
		});
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		setActiveKeyMaster(key);
	};

	const titleFunc = {
		searchYn: searchMasterList,
	};
	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */
	useEffect(() => {
		setTimeout(() => {
			// 그리드 자동 리사이즈(1/2)
			if (activeKeyMaster === '1') {
				refs.gridRef.current?.resize('100%', '100%');
			} else if (activeKeyMaster === '2') {
				refs2.gridRef.current?.resize('100%', '100%');
			}
		}, 100);
	}, [activeKeyMaster]);

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsiveWrap>
				<SearchFormResponsive form={form} initialValues={searchBox}>
					<StInquiryResultSearch search={searchMasterList} form={form} activeKey={activeKeyMaster} />
				</SearchFormResponsive>
			</SearchFormResponsiveWrap>

			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="Location별" key="1">
					<StInquiryResultDetail1
						ref={refs}
						form={form}
						data={gridData}
						totalCnt={totalCnt}
						activeKeyMaster={activeKeyMaster}
						search={searchMasterList}
					/>
				</TabPane>
				<TabPane tab="상품별" key="2">
					<StInquiryResultDetail2
						ref={refs2}
						form={form}
						data={gridData2}
						totalCnt={totalCnt2}
						activeKeyMaster={activeKeyMaster}
						search={searchMasterList}
					/>
				</TabPane>
			</Tabs>
		</>
	);
};

export default StInquiryResult;

const SearchFormResponsiveWrap = styled.div`
	li {
		.ant-row.ant-form-item-row {
			.ant-form-item-label {
				padding-left: 4px;
			}
		}
		.ant-row.ant-form-item-row {
			.ant-form-item-control {
				padding: 2px 4px;
			}
		}
	}
`;
