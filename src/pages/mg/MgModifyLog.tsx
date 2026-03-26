/*
 ############################################################################
 # FiledataField	: MgModifyLog.tsx
 # Description		: 재고 > 재고현황 > 재고변경사유현황
 # Author			: sss
 # Since			: 25.07.10
 ############################################################################
*/
import { Form, Tabs } from 'antd';
import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import { apiPostTab1MasterList, apiPostTab2MasterList } from '@/api/mg/apiMgModifyLog';
import MgModifyLogDetail1 from '@/components/mg/modifyLog/MgModifyLogDetail1';
import MgModifyLogDetail2 from '@/components/mg/modifyLog/MgModifyLogDetail2';
import MgModifyLogSearch from '@/components/mg/modifyLog/MgModifyLogSearch';
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';
import TabPane from 'antd/es/tabs/TabPane';

// lib
const SkuLabelSTO = () => {
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
		docdt: null, // 조회기간(변경일자)
		sku: null, // 상품코드
		skuName: null, // 상품명
		modifytype: null, // 구분
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
	 * @param {string} dt1 - 시작 납품일자
	 * @param {string} dt2 - 종료 납품일자
	 * @param {string} invoiceprinttype - 인쇄유형 (WD: 일반, CD: 세금계산서, SD: 매출전표)
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
			fixdccode: commUtil.nvl(form.getFieldValue('fixdccode'), ''),
			dt1: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[0].format('YYYYMMDD'),
			dt2: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[1].format('YYYYMMDD'),
			sku: commUtil.nvl(form.getFieldValue('sku'), ''),
		};

		// 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		// 날짜 유효성 검사
		if (commUtil.isNull(commonParams.dt1) || commUtil.isNull(commonParams.dt2)) {
			showAlert('', t('msg.selectPlease1', [t('lbl.MODIFYDATE')])); // {변경일자}을/를 선택해주세요
			return;
		}

		try {
			if (activeKeyMaster === '1') {
				// 탭1: 변경이력 조회
				const params = {
					...commonParams,
					modifytype: form.getFieldValue('reasoncode')
						? form.getFieldValue('reasoncode').substring(11, 13) // CODELIST에서 MODIFYTYPE 추출
						: commUtil.nvl(form.getFieldValue('modifytype'), ''),
					reasoncode: commUtil.nvl(form.getFieldValue('reasoncode'), ''),
					serialyn: commUtil.nvl(form.getFieldValue('serialyn'), ''),
					loc: commUtil.nvl(form.getFieldValue('loc'), ''),
				};

				searchMasterListImp01(params);
			} else if (activeKeyMaster === '2') {
				// 탭2: 상품이력번호변경 조회
				const params = {
					...commonParams,
					serialno: commUtil.nvl(form.getFieldValue('serialno'), ''),
					blno: commUtil.nvl(form.getFieldValue('blno'), ''),
					contractcompany: commUtil.nvl(form.getFieldValue('custkey'), ''),
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
		if (key === '1') {
			setActiveKeyMaster('1');

			if (refs.gridRef.current) {
				refs.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			setActiveKeyMaster('2');

			if (refs2.gridRef.current) {
				refs2.gridRef.current?.resize('100%', '100%');
			}
		}
		return;
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
				refs.gridRef.current.resize('100%', '100%');
			} else if (activeKeyMaster === '2') {
				refs2.gridRef.current.resize('100%', '100%');
			}
		}, 100);
	}, [activeKeyMaster]);

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<MgModifyLogSearch search={searchMasterList} form={form} activeKey={activeKeyMaster} />
			</SearchFormResponsive>

			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="변경이력" key="1">
					<MgModifyLogDetail1 ref={refs} form={form} data={gridData} totalCnt={totalCnt} activeKey={activeKeyMaster} />
				</TabPane>
				<TabPane tab="상품이력번호변경" key="2">
					<MgModifyLogDetail2
						ref={refs2}
						form={form}
						data={gridData2}
						totalCnt={totalCnt2}
						activeKey={activeKeyMaster}
					/>
				</TabPane>
			</Tabs>
		</>
	);
};

export default SkuLabelSTO;
