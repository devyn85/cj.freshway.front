/*
 ############################################################################
 # FiledataField	: IbConsignMast.tsx
 # Description		: 정산 > 3PL물류대행수수료정산 > 위탁 물류 처리 - 수수료 정산
 # Author		    	: 고혜미
 # Since			    : 25.09.23
 ############################################################################
*/
import { Form, Tabs } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

//Api
import { apiPostTab1MasterList, apiPostTab2MasterList } from '@/api/ib/apiIbConsignMast';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util

import IbConsignMastDetail1 from '@/components/ib/consignMast/IbConsignMastDetail1';
import IbConsignMastDetail2 from '@/components/ib/consignMast/IbConsignMastDetail2';
import IbConsignMastSearch from '@/components/ib/consignMast/IbConsignMastSearch';
import TabPane from 'antd/es/tabs/TabPane';
import { useTranslation } from 'react-i18next';

// lib
const IbConsignMast = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const gDccode = useSelector((state: any) => state.global.globalVariable.gDccode);
	const [gridData, setGridData] = useState([]);
	const [totalCnt1, setTotalCnt1] = useState(0);
	const [date, setDate] = useState('');

	const [gridData2, setGridData2] = useState([]);
	const [totalCnt2, setTotalCnt2] = useState(0);

	const [activeKeyMaster, setActiveKeyMaster] = useState('1');

	// Declare react Ref(2/4)
	const refs: any = useRef(null);
	const refs2: any = useRef(null);
	const [formRef] = Form.useForm();

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		multiDcCode: [gDccode],
		custkey: null, //거래처코드
		custName: null, //거래처명
		month: dayjs(), //정산월
	});

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 조회
	 * @returns {void}
	 */
	const searchMasterList = () => {
		// 변경사항 없을 때는 바로 조회
		searchMasterListRun();
	};

	/**
	 * 	조회
	 */
	const searchMasterListRun = async () => {
		// 그리드 데이터 초기화
		if (activeKeyMaster === '1') {
			refs.gridRef.current?.clearGridData();
		} else {
			refs2.gridRef.current?.clearGridData();
		}

		const searchParam = form.getFieldsValue();

		// 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		if (activeKeyMaster === '1') {
			// 탭1: 품목별정산료 조회
			const params = {
				multiDcCode: searchParam.multiDcCode,
				custkey: searchParam.custkey,
				month: searchParam.month.format('YYYYMM'),
			};

			searchMasterListImp01(params);
		} else if (activeKeyMaster === '2') {
			// 탭2: 기준정보 조회
			const params = {
				...searchParam,
			};
			searchMasterListImp02(params);
		}
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp01 = (params: any) => {
		// API 호출
		apiPostTab1MasterList(params).then(res => {
			setGridData(res.data);
			setTotalCnt1(res.data.length);
		});
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp02 = (params: any) => {
		// API 호출
		apiPostTab2MasterList(params).then(res => {
			setGridData2(res.data);
			setTotalCnt2(res.data.length);
		});
	};

	/**
	 * 탭 클릭
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string, e: any) => {
		setActiveKeyMaster(key);
		window.dispatchEvent(new Event('resize'));
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

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<IbConsignMastSearch form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>

			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="품목별정산료" key="1">
					<IbConsignMastDetail1
						ref={refs}
						form={form}
						data={gridData}
						totalCnt={totalCnt1}
						activeKey={activeKeyMaster}
						formRef={formRef}
						callBackFn={() => {
							// 저장 후 재조회 시, 탭이 1번(품목별정산료)일 때만 재조회
							const params = form.getFieldsValue();
							searchMasterListImp01(params);
						}}
					/>
				</TabPane>
				<TabPane tab="기준정보" key="2">
					<IbConsignMastDetail2
						ref={refs2}
						form={form}
						data={gridData2}
						totalCnt={totalCnt2}
						activeKey={activeKeyMaster}
						callBackFn={() => {
							// 저장 후 재조회 시, 탭이 2번(기준정보)일 때만 재조회
							const params = form.getFieldsValue();
							searchMasterListImp02(params);
						}}
					/>
				</TabPane>
			</Tabs>
		</>
	);
};

export default IbConsignMast;
