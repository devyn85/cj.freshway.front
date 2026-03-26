/*
 ############################################################################
 # FiledataField	: StAdjustment.tsx
 # Description		: 재고 > 재고현황 > 센터자체감모
 # Author			: sss
 # Since			: 25.07.10
 ############################################################################
*/
import { Form, Tabs } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

//Api
import { apiPostTab1MasterList, apiPostTab2MasterList } from '@/api/st/apiStAdjustment';

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util

import StAdjustmentDetail1 from '@/components/st/adjustment/StAdjustmentDetail1';
import StAdjustmentDetail2 from '@/components/st/adjustment/StAdjustmentDetail2';
import StAdjustmentSearch from '@/components/st/adjustment/StAdjustmentSearch';
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';
import TabPane from 'antd/es/tabs/TabPane';
import { useTranslation } from 'react-i18next';

// lib
const Adjustment = () => {
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
	const [formRef] = Form.useForm();
	const [resizeTarget, setResizeTarget] = useState({ ref: refs.gridRef, searchConditonLiCnt: 3, moreHeight: 0 }); // 최초load시 조정

	// Declare init value(3/4)
	const [searchBox] = useState({
		docdt: null, // 조회기간(변경일자)
		sku: null, // 상품코드
		skuName: null, // 상품명
		modifyType: null, // 구분
		serialyn: null, // 이력유무
		loc: null, // 로케이션
		reasoncode: null, // 사유코드
		blNo: null, // B/L번호
		serialNo: null, // 이력번호
		custkey: null, // 계약업체 코드
		custkeyNm: null, // 계약업체명
		stocktype: null, // 재고유형 (추가)
		storagetype: null, // 보관유형 (추가)
	}); // 검색영역

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 	조회
	 */
	const searchMasterList = async () => {
		// 그리드 데이터 초기화
		if (activeKeyMaster === '1') {
			refs.gridRef.current?.clearGridData();
		} else {
			refs2.gridRef1.current?.clearGridData();
		}

		// 공통 파라미터 (StAdjustmentSearch.tsx 기준)
		const commonParams = {
			fixdccode: commUtil.nvl(form.getFieldValue('fixdccode'), ''), // 물류센터
			sku: commUtil.nvl(form.getFieldValue('sku'), ''), // 상품코드
			skuName: commUtil.nvl(form.getFieldValue('skuName'), ''), // 상품명
			lottable01yn: commUtil.nvl(form.getFieldValue('lottable01yn'), ''), // 소비기한여부
			stocktype: commUtil.nvl(form.getFieldValue('stocktype'), ''), // 재고위치
			stockgrade: commUtil.nvl(form.getFieldValue('stockgrade'), ''), // 재고속성
			fromloc: commUtil.nvl(form.getFieldValue('fromloc'), ''), // 로케이션 FROM
			toloc: commUtil.nvl(form.getFieldValue('toloc'), ''), // 로케이션 TO
			blno: commUtil.nvl(form.getFieldValue('blno'), ''), // B/L번호
			serialno: commUtil.nvl(form.getFieldValue('serialno'), ''), // 이력번호
			contractcompany: commUtil.nvl(form.getFieldValue('contractcompany'), ''), // 계약업체 코드
			contractcompanyNm: commUtil.nvl(form.getFieldValue('contractcompanyNm'), ''), // 계약업체명
		};

		// 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		try {
			if (activeKeyMaster === '1') {
				// 탭1: 변경이력 조회
				const params = {
					...commonParams,
				};
				searchMasterListImp01(params);
			} else if (activeKeyMaster === '2') {
				// 탭2: 상품이력번호변경 조회
				const params = {
					...commonParams,
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
				refs2.gridRef1.current?.resize('100%', '100%');
				refs2.gridRef2.current?.resize('100%', '100%');
			}
		}, 100);
	}, [activeKeyMaster]);
	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StAdjustmentSearch search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>

			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="일반" key="1">
					<StAdjustmentDetail1
						ref={refs}
						form={form}
						data={gridData}
						totalCnt={totalCnt}
						activeKey={activeKeyMaster}
						formRef={formRef}
						search={searchMasterList}
					/>
				</TabPane>
				<TabPane tab="SET" key="2">
					<StAdjustmentDetail2
						ref={refs2}
						form={form}
						data={gridData2}
						totalCnt={totalCnt2}
						activeKey={activeKeyMaster}
						formRef={formRef}
						search={searchMasterList}
					/>
				</TabPane>
			</Tabs>
		</>
	);
};

export default Adjustment;
