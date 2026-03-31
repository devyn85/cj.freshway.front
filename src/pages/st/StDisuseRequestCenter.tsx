/*
 ############################################################################
 # FiledataField	: StDisuseRequestCenter.tsx
 # Description		: 재고 > 재고현황 > 재고폐기요청/처리
 # Author			: sss
 # Since			: 25.07.10

  # [주요기능]
	#  - 재고 폐기 등록/요청/처리 등의 기능을 제공한다.
	#  - 5개 탭으로 구성된 폐기 프로세스 관리 화면
	#
	# [탭1: 폐기등록]
	#  - 폐기 대상 재고를 등록하는 기능
	#  - 그리드: 폐기 등록 대상 상품 목록
	#  - 버튼: 저장, 삭제, 엑셀업로드, 일괄적용
	#
	# [탭2: 폐기요청] 
	#  - 등록된 폐기 재고에 대해 전자결재 요청
	#  - 그리드: 폐기 요청 대상 상품 목록
	#  - 버튼: 저장, 삭제, 전자결재요청
	#
	# [탭3: 요청처리결과]
	#  - 폐기 요청의 처리 결과 조회
	#  - 그리드: 요청 처리 결과 목록 (승인/반려 상태)
	#  - 기능: 조회 전용
	#
	# [탭4: 전자결재]
	#  - 전자결재 진행 상황 및 결과 조회
	#  - 그리드: 전자결재 목록 (결재진행상태별)
	#  - 기능: 조회 전용, 결재 상세 확인
	#
	# [탭5: 폐기처리] ⭐ 최종 처리 단계
	#  - 최종 승인된 건에 대한 실제 폐기 처리 실행
	#  - 그리드: 처리 대상 상품 목록 (최종결재완료건만 처리 가능)
	#  - 버튼: 저장(처리), 삭제
	#  - 유효성 검사: approvalstatus === '3' (최종결재완료) 인 건만 처리 가능
	#
	# [공통 조회조건]
	#  - 물류센터, 창고, 요청월, 폐기구분
	#  - 상품코드/명, 저장조건, 피킹존
	#  - 재고위치, 재고속성, 이력번호, B/L번호
	#  - 로케이션 범위, 기준일 범위
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
import {
	apiPostTab1MasterList,
	apiPostTab2MasterList,
	apiPostTab3MasterResultList,
	apiPostTab4MasterApprovalList,
	apiPostTab5MasterProcessList,
} from '@/api/st/apiStDisuseRequestCenter';
import CmUserCdCfgPopup from '@/components/cm/popup/CmUserCdCfgPopup';
import CustomModal from '@/components/common/custom/CustomModal';
import StDisuseRequestCenterDetail1 from '@/components/st/disuseRequestCenter/StDisuseRequestCenterDetail1';
import StDisuseRequestCenterDetail2 from '@/components/st/disuseRequestCenter/StDisuseRequestCenterDetail2';
import StDisuseRequestCenterDetail3 from '@/components/st/disuseRequestCenter/StDisuseRequestCenterDetail3';
import StDisuseRequestCenterDetail4 from '@/components/st/disuseRequestCenter/StDisuseRequestCenterDetail4';
import StDisuseRequestCenterDetail5 from '@/components/st/disuseRequestCenter/StDisuseRequestCenterDetail5';
import StDisuseRequestCenterSearch from '@/components/st/disuseRequestCenter/StDisuseRequestCenterSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';
import TabPane from 'antd/es/tabs/TabPane';
import dayjs from 'dayjs';

// lib
const DisuseRequestProcess = () => {
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
	const [gridData3, setGridData3] = useState([]);
	const [totalCnt3, setTotalCnt3] = useState(0);
	const [gridData4, setGridData4] = useState([]);
	const [totalCnt4, setTotalCnt4] = useState(0);
	const [gridData5, setGridData5] = useState([]);
	const [totalCnt5, setTotalCnt5] = useState(0);

	const today = dateUtil.getToDay('YYYY-MM-DD');
	const storerkey = useSelector((state: any) => state.global.globalVariable.gStorerkey);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [bagicAmt, setBagicAmt] = useState(getCommonCodeList('DISUSE_COST')[0]?.data1 || '');
	const [loopTrParams, setLoopTrParams] = useState({});
	const [formRef] = Form.useForm();

	// Declare react Ref(2/4)
	const refs: any = useRef(null);
	const refs2: any = useRef(null);
	const refs3: any = useRef(null);
	const refs4: any = useRef(null);
	const refs5: any = useRef(null);
	const modalRef = useRef(null);

	// Declare init value(3/4) - 검색 조건 초기값
	const [searchBox] = useState({
		// === 기본 정보 ===
		fixdccode: null, // 물류센터 (Distribution Center) - 필수 선택
		organizenm: null, // 창고명 (Warehouse Name) - 검색용 표시명
		organize: null, // 창고코드 (Warehouse Code) - 실제 조건값

		// === 날짜/구분 ===
		requestMm: null, // 요청월 (Request Month) - YYYY-MM 형식
		disusetype: '1', // 폐기구분 (Disposal Type) - 1:일반폐기, 2:반품폐기

		// === 상품 정보 ===
		skuName: null, // 상품명 (Product Name) - 상품 검색용
		sku: null, // 상품코드 (Product Code) - SKU

		// === 저장/위치 정보 ===
		storagetype: null, // 저장조건 (Storage Type) - 냉장/냉동/상온 등
		zone: null, // 피킹존 (Picking Zone) - 작업 구역
		stocktype: null, // 재고위치 (Stock Location Type) - 일반/예약/불량 등
		stockgrade: null, // 재고속성 (Stock Grade) - A/B/C급 등 품질 등급

		// === 이력/추적 정보 ===
		serialno: null, // 이력번호 (Serial Number) - 제품 추적용
		blno: null, // B/L번호 (Bill of Lading Number) - 수입 화물 추적

		// === 로케이션 범위 ===
		fromloc: null, // 시작로케이션 (From Location) - 범위 조회 시작점
		toloc: null, // 종료로케이션 (To Location) - 범위 조회 종료점

		// === 기준일 범위 ===
		basedtFromTo: [dayjs(), dayjs()], // 기준일 범위 (Date Range) - 조회 기간 설정
	});

	// 기타(4/4)
	const [resizeTarget, setResizeTarget] = useState({ ref: refs.gridRef, searchConditonLiCnt: 3, moreHeight: 0 }); // 최초load시 조정
	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 모든 그리드 데이터 초기화 (기준월 변경 시 사용)
	 */
	const clearAllGridData = () => {
		refs.gridRef.current?.clearGridData();
		refs2.gridRef.current?.clearGridData();
		refs3.gridRef.current?.clearGridData();
		refs4.gridRef.current?.clearGridData();
		refs5.gridRef.current?.clearGridData();

		// 상태도 초기화
		setGridData([]);
		setTotalCnt(0);
		setGridData2([]);
		setTotalCnt2(0);
		setGridData3([]);
		setTotalCnt3(0);
		setGridData4([]);
		setTotalCnt4(0);
		setGridData5([]);
		setTotalCnt5(0);
	};

	/**
	 * 	조회
	 */
	const searchMasterList = async () => {
		// 그리드 데이터 초기화
		if (activeKeyMaster === '1') {
			refs.gridRef.current?.clearGridData();
		} else if (activeKeyMaster === '2') {
			refs2.gridRef.current?.clearGridData();
		} else if (activeKeyMaster === '3') {
			refs3.gridRef.current?.clearGridData();
		} else if (activeKeyMaster === '4') {
			refs4.gridRef.current?.clearGridData();
		}

		// 공통 파라미터
		const commonParams = {
			fixdccode: commUtil.nvl(form.getFieldValue('fixdccode'), ''), // 물류센터
			organize: commUtil.nvl(form.getFieldValue('organize'), ''), // 창고코드
			organizenm: commUtil.nvl(form.getFieldValue('organizenm'), ''), // 창고명
			requestMm: commUtil.isNull(form.getFieldValue('requestMm'))
				? ''
				: form.getFieldValue('requestMm').format('YYYYMM'), // 요청월
			disuseDiv: commUtil.nvl(form.getFieldValue('disuseDiv'), ''), // 폐기구분
			sku: commUtil.nvl(form.getFieldValue('sku'), ''), // 상품코드
			skuName: commUtil.nvl(form.getFieldValue('skuName'), ''), // 상품명
			storagetype: commUtil.nvl(form.getFieldValue('storagetype'), ''), // 저장조건
			zone: commUtil.nvl(form.getFieldValue('zone'), ''), // 피킹존
			stocktype: commUtil.nvl(form.getFieldValue('stocktype'), ''), // 재고위치
			stockgrade: commUtil.nvl(form.getFieldValue('stockgrade'), ''), // 재고속성
			serialno: commUtil.nvl(form.getFieldValue('serialno'), ''), // 이력번호
			blno: commUtil.nvl(form.getFieldValue('blno'), ''), // B/L번호
			fromloc: commUtil.nvl(form.getFieldValue('fromloc'), ''), // 시작로케이션
			toloc: commUtil.nvl(form.getFieldValue('toloc'), ''), // 종료로케이션
			apprstatus: commUtil.nvl(form.getFieldValue('apprstatus'), ''), // 승인상태
			viewPriceYn: commUtil.nvl(form.getFieldValue('viewPriceYn'), ''), // 금액조회
			storerkey: storerkey, // 창고업체키
		};

		// 입력 값 검증
		const isValid = await validateForm(form);
		if (!isValid) {
			return;
		}

		const basedtFromTo = form.getFieldValue('basedtFromTo') || [null, null];

		try {
			if (activeKeyMaster === '1') {
				// 탭1: 변경이력 조회
				const params = {
					...commonParams,
					reqFlag: '1', // 요청구분(1:폐기등록, 2:폐기요청)
				};

				searchMasterListImp01(params);
			} else if (activeKeyMaster === '2') {
				// 탭2: 상품이력번호변경 조회
				const params = {
					...commonParams,
					disusemethodcd: commUtil.nvl(form.getFieldValue('disusemethodcd'), ''), // 처리방안
					reqFlag: '2', // 요청구분(1:폐기등록, 2:폐기요청)
				};

				searchMasterListImp02(params);
			} else if (activeKeyMaster === '3') {
				// 탭3: 요청처리결과 조회
				const params = {
					...commonParams,
				};

				searchMasterListImp03(params);
			} else if (activeKeyMaster === '4') {
				// 탭4: 전자결재 조회
				const params = {
					...commonParams,
					basedtFrom: basedtFromTo[0] ? basedtFromTo[0].format('YYYYMMDD') : '',
					basedtTo: basedtFromTo[1] ? basedtFromTo[1].format('YYYYMMDD') : '',
					sku: commUtil.nvl(form.getFieldValue('sku2'), ''), // 상품코드
					organize: commUtil.nvl(form.getFieldValue('organize2'), ''), // 창고코드
					//approvalType: 'DU02', // DU02:센터내폐기
				};

				searchMasterListImp04(params);
			} else if (activeKeyMaster === '5') {
				// 탭5: 폐기처리 조회
				const dttype = form.getFieldValue('dttype') || 'APPRREQDT';

				let params: any = {
					...commonParams,
					basedtFrom: basedtFromTo[0] ? basedtFromTo[0].format('YYYYMMDD') : '',
				};

				// 조회 날짜구분에 따른 처리
				if (dttype === 'APPRREQDT') {
					// 요청일자
					params = {
						...params,
						fromApprreqdt: basedtFromTo[0] ? basedtFromTo[0].format('YYYYMMDD') : '',
						toApprreqdt: basedtFromTo[1] ? basedtFromTo[1].format('YYYYMMDD') : '',
					};
				} else if (dttype === 'SLIPDT') {
					// 처리일자
					params = {
						...params,
						fromSlipdt: basedtFromTo[0] ? basedtFromTo[0].format('YYYYMMDD') : '',
						toSlipdt: basedtFromTo[1] ? basedtFromTo[1].format('YYYYMMDD') : '',
					};
				}

				searchMasterListImp05(params);
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
		setGridData([]);
		setTotalCnt(0);

		setLoopTrParams(params);

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
		setGridData2([]);
		setTotalCnt2(0);

		// API 호출
		//2026-03-19 1번과 2번 탭 쿼리 동일
		apiPostTab1MasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
			}
		});
	};

	/**
	 * 조회 구현 함수 - 요청처리결과Tab
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp03 = (params: any) => {
		setGridData3([]);
		setTotalCnt3(0);

		apiPostTab3MasterResultList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
			}
		});
	};

	/**
	 * 조회 구현 함수 - 전자결재Tab
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp04 = (params: any) => {
		setGridData4([]);
		setTotalCnt4(0);
		// API 호출
		apiPostTab4MasterApprovalList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData4(res.data);
				setTotalCnt4(res.data.length);
			}
		});
	};

	/**
	 * 조회 구현 함수 - 폐기처리Tab
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp05 = (params: any) => {
		setGridData5([]);
		setTotalCnt5(0);

		// API 호출
		apiPostTab5MasterProcessList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData5(res.data);
				setTotalCnt5(res.data.length);
			}
		});
	};

	/**
	 * 전자결재 실행하지 않은 list 설정
	 * @param key
	 */
	const setNoElectApprovalList = () => {
		const filteredDataList = refs4.gridRef?.current.getGridData().filter((item: any) => item.customRowCheckYn == 'N');
		setGridData4(filteredDataList);
		setTotalCnt4(filteredDataList.length);
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

	const openModal = () => {
		modalRef.current.handlerOpen();
	};

	const closeEvent = () => {
		modalRef.current.handlerClose();
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
				//setResizeTarget({ ref: refs.gridRef, searchConditonLiCnt: 3, moreHeight: -110 });
				refs.gridRef.current.resize('100%', '100%');
			} else if (activeKeyMaster === '2') {
				//setResizeTarget({ ref: refs2.gridRef, searchConditonLiCnt: 3, moreHeight: -100 });
				refs2.gridRef.current.resize('100%', '100%');
			} else if (activeKeyMaster === '3') {
				//setResizeTarget({ ref: refs3.gridRef, searchConditonLiCnt: 3, moreHeight: 0 });
				refs3.gridRef.current.resize('100%', '100%');
			} else if (activeKeyMaster === '4') {
				//setResizeTarget({ ref: refs4.gridRef, searchConditonLiCnt: 1, moreHeight: 0 });
				refs4.gridRef.current.resize('100%', '100%');
			} else if (activeKeyMaster === '5') {
				//setResizeTarget({ ref: refs5.gridRef, searchConditonLiCnt: 1, moreHeight: 0 });
				refs5.gridRef.current.resize('100%', '100%');
			}
		}, 100);
	}, [activeKeyMaster]);

	//useAutoResize(resizeTarget);

	// 공통 props 객체
	const commonProps = {
		form, //	조회조건 form
		formRef, // 일괄적용 formRef
		activeKeyMaster,
		search: searchMasterList,
		clearAllGridData, // 모든 그리드 데이터 초기화 함수
	};

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StDisuseRequestCenterSearch {...commonProps} activeKey={activeKeyMaster} />
			</SearchFormResponsive>

			<Tabs activeKey={activeKeyMaster} onTabClick={tabClick} className="contain-wrap">
				<TabPane tab="폐기등록" key="1">
					<StDisuseRequestCenterDetail1
						ref={refs}
						{...commonProps}
						data={gridData}
						totalCnt={totalCnt}
						bagicAmt={bagicAmt}
						openModal={openModal}
					/>

					<CustomModal ref={modalRef} width="800px">
						<CmUserCdCfgPopup codeType={'CHEILJEDANG_SKU'} close={closeEvent} />
					</CustomModal>
				</TabPane>
				<TabPane tab="폐기요청" key="2">
					<StDisuseRequestCenterDetail2
						ref={refs2}
						{...commonProps}
						refs3={refs3}
						data={gridData2}
						totalCnt={totalCnt2}
						setGridData3={setGridData3}
						setTotalCnt3={setTotalCnt3}
						setActiveKeyMaster={setActiveKeyMaster}
					/>
				</TabPane>
				<TabPane tab="요청처리결과" key="3">
					<StDisuseRequestCenterDetail3 ref={refs3} {...commonProps} data={gridData3} totalCnt={totalCnt3} />
				</TabPane>

				<TabPane tab="전자결재" key="4">
					<StDisuseRequestCenterDetail4
						ref={refs4}
						{...commonProps}
						data={gridData4}
						totalCnt={totalCnt4}
						setActiveKeyMaster={setActiveKeyMaster}
						setNoElectApprovalList={setNoElectApprovalList}
					/>
				</TabPane>

				<TabPane tab="폐기처리" key="5">
					<StDisuseRequestCenterDetail5
						ref={refs5}
						{...commonProps}
						data={gridData5}
						totalCnt={totalCnt5}
						setActiveKeyMaster={setActiveKeyMaster}
					/>
				</TabPane>
			</Tabs>
		</>
	);
};

export default DisuseRequestProcess;
