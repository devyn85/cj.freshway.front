/*
 ############################################################################
 # FiledataField	: WdInplanOutOrg.tsx
 # Description		: 정산 > 외부창고정산 > 운송비 세부내역 조회
 # Author			: ParkJinWoo
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
import { apiPostMasterList, apiPostMasterList1 } from '@/api/wd/apiWdInplanOutOrg';
// import{}
import WdInplanOutOrgDetail1 from '@/components/wd/inplanOutOrg/WdInplanOutOrgDetail1';
import WdInplanOutOrgDetail2 from '@/components/wd/inplanOutOrg/WdInplanOutOrgDetail2';
import WdInplanOutOrgSearch from '@/components/wd/inplanOutOrg/WdInplanOutOrgSearch';
import { showAlert } from '@/util/MessageUtil';
const { TabPane } = Tabs;

// lib
const WdInplanOutOrg = () => {
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
		fixdccode: '2170',
		contractType: null,
		storagetype: null,
		carcapacity: null,
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
		// const commonParams = {
		// 	sku: commUtil.nvl(form.getFieldValue('sku'), ''),
		// };

		// const values = form.getFieldsValue();

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
					// ...commonParams,
					fixdccode: values.fixdccode,
					fromDate: values.date[0].format('YYYYMMDD'),
					toDate: values.date[1].format('YYYYMMDD'),
					custKey: values.custKey ?? '', // 관리처코드
					organize: values.organize ?? '', // 창고코드(ORGANIZE)
					slipNo: values.slipNo ?? '', // 오더번호(SLIPNO)
					sku: values.sku ?? '', // 상품코드
					convSerialNo: values.convSerialNo ?? '', // BL번호(CONVSERIALNO)
					serialNo: values.serialNo ?? '', // 이력번호(SERIALNO)
					contractCustKey: values.contractCustKey ?? '', // 계약업체코드(CONTRACTCUSTKEY)
					contractType: values.contractType ?? '', // 계약유형(CONTRACTTYPE)
				};

				searchMasterListImp01(params);
			} else if (activeKeyMaster === '2') {
				// 탭2: 이동결과 조회
				// 탭1: 이동대상
				const values = form.getFieldsValue();
				const params = {
					// ...commonParams,
					fixdccode: values.fixdccode,
					fromDate: values.date[0].format('YYYYMMDD'),
					toDate: values.date[1].format('YYYYMMDD'),
					custKey: values.custKey ?? '', // 관리처코드
					organize: values.organize ?? '', // 창고코드(ORGANIZE)
					slipNo: values.slipNo ?? '', // 오더번호(SLIPNO)
					sku: values.sku ?? '', // 상품코드
					convSerialNo: values.convSerialNo ?? '', // BL번호(CONVSERIALNO)
					serialNo: values.serialNo ?? '', // 이력번호(SERIALNO)
					contractCustKey: values.contractCustKey ?? '', // 계약업체코드(CONTRACTCUSTKEY)
					contractType: values.contractType ?? '', // 계약유형(CONTRACTTYPE)
					carcapacity: values.carcapacity ?? '',
					storagetype: values.storagetype ?? '',
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
		apiPostMasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data);
				setTotalCnt(res.data.length);
			}
		});
	};

	/*
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp02 = (params: any) => {
		// API 호출
		apiPostMasterList1(params).then(res => {
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
				<WdInplanOutOrgSearch search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>

			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="SO" key="1">
					<WdInplanOutOrgDetail1
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
				<TabPane tab="STO" key="2">
					<WdInplanOutOrgDetail2
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

export default WdInplanOutOrg;
