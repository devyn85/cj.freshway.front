/*
 ############################################################################
 # FiledataField	: StLocMove.tsx
 # Description		: 재고 > 재고현황 > 재고일괄이동
 # Author			: sss
 # Since			: 25.07.10
 ############################################################################
*/
import { Form, Tabs } from 'antd';
import { useRef, useState } from 'react';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import { apiPostTab1MasterList, apiPostTab2MasterList } from '@/api/st/apiStLocMove';
import StLocMoveDetail1 from '@/components/st/locMove/StLocMoveDetail1';
import StLocMoveDetail2 from '@/components/st/locMove/StLocMoveDetail2';
import StLocMoveSearch from '@/components/st/locMove/StLocMoveSearch';
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';
const { TabPane } = Tabs;

// lib
const LocMove = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [formRef] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	const [gridData2, setGridData2] = useState([]);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');

	// Declare react Ref(2/4)
	const refs: any = useRef(null);
	const refs2: any = useRef(null);
	//const [resizeTarget, setResizeTarget] = useState({ ref: refs.gridRef, searchConditonLiCnt: 3, moreHeight: 0 }); // 최초load시 조정

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
		stocktype: null, // 재고유형
		storagetype: null, // 보관유형
		//fixdccode: null, // 물류센터
		organize: null, // 조직
		stockgrade: null, // 재고속성
		lottable01yn: null, // 소비기한여부
		fromloc: null, // 출발로케이션
		toloc: null, // 도착로케이션
		zone: null, // 존
		contractcompany: null, // 계약업체
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
		// 공통 파라미터
		const commonParams = {
			sku: commUtil.nvl(form.getFieldValue('sku'), ''),
		};

		// 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		// 그리드 데이터 초기화
		setTotalCnt(0);
		if (activeKeyMaster === '1') {
			refs.gridRef.current?.clearGridData();
		} else {
			refs2.gridRef.current?.clearGridData();
		}

		try {
			if (activeKeyMaster === '1') {
				const values = form.getFieldsValue();

				// 탭1: 이동대상
				const params = {
					...commonParams,
					fixdccode: values.fixdccode ?? '', // 물류센터
					organize: values.organize ?? '', // 조직
					stocktype: values.stocktype ?? '', // 재고위치
					stockgrade: values.stockgrade ?? '', // 재고속성
					lottable01yn: values.lottable01yn ?? '', // 소비기한여부
					serialno: values.serialno ?? '', // 이력번호
					storagetype: values.storagetype ?? '', // 저장조건
					fromloc: values.fromloc ?? '', // 출발로케이션
					toloc: values.toloc ?? '', // 도착로케이션
					zone: values.zone ?? '', // 존
					blno: values.blno ?? '', // BL번호
					contractcompany: values.contractcompany ?? '', // 계약업체
				};

				searchMasterListImp01(params);
			} else if (activeKeyMaster === '2') {
				// 탭2: 이동결과 조회
				const params = {
					...commonParams,
					processtype: 'ST_BATCHMOVE',
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
			if (activeKeyMaster === '1') {
				//setResizeTarget({ ref: refs.gridRef, searchConditonLiCnt: 3, moreHeight: 0 });
				refs.gridRef.current.resize('100%', '100%');
			} else if (activeKeyMaster === '2') {
				//setResizeTarget({ ref: refs2.gridRef, searchConditonLiCnt: 0, moreHeight: 0 });
				refs2.gridRef.current.resize('100%', '100%');
			}
		}, 100);
	}, [activeKeyMaster]);

	// 그리드 자동 리사이즈
	//useAutoResize(resizeTarget);

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StLocMoveSearch search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>

			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="이동대상" key="1">
					<StLocMoveDetail1
						ref={refs}
						form={form}
						formRef={formRef}
						data={gridData}
						totalCnt={totalCnt}
						setTotalCnt={setTotalCnt}
						setActiveKeyMaster={setActiveKeyMaster}
						setGridData2={setGridData2}
					/>
				</TabPane>
				<TabPane tab="이동결과" key="2">
					<StLocMoveDetail2
						ref={refs2}
						form={form}
						data={gridData2}
						totalCnt={totalCnt2}
						setActiveKeyMaster={setActiveKeyMaster}
					/>
				</TabPane>
			</Tabs>
		</>
	);
};

export default LocMove;
