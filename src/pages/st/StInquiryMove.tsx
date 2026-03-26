/*
 ############################################################################
 # FiledataField	: StInquiryMove.tsx
 # Description		: 재고 > 재고현황 > 조사지시현황
 # Author			: sss
 # Since			: 25.07.10
 ############################################################################
*/
import Splitter from '@/components/common/Splitter';
import TabsArray from '@/components/common/TabsArray';
import { Form } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

//Api

import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import { apiPostMasterList, apiPostTab1DetailList } from '@/api/st/apiStInquiryMove';
import StInquiryMoveDetail from '@/components/st/stInquiryMove/StInquiryMoveDetail';
import StInquiryMoveDetail1 from '@/components/st/stInquiryMove/StInquiryMoveDetail1';
import StInquiryMoveDetail2 from '@/components/st/stInquiryMove/StInquiryMoveDetail2';
import StInquiryMoveSearch from '@/components/st/stInquiryMove/StInquiryMoveSearch';
import commUtil from '@/util/commUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const StInquiryMove = () => {
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

	const [gridData1, setGridData1] = useState([]);
	const [totalCnt1, setTotalCnt1] = useState(0);

	const [gridData2, setGridData2] = useState([]);
	const [totalCnt2, setTotalCnt2] = useState(0);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');
	const [disabledTabs, setDisabledTabs] = useState<string[]>([]); // 비활성화될 탭 목록

	// Form.useWatch로 lottype 값 실시간 감시
	const lottype = Form.useWatch('lottype', form);

	// Declare react Ref(2/4)
	const refs: any = useRef(null);
	const refs1: any = useRef(null);
	const refs2: any = useRef(null);

	// Declare init value(3/4)
	const [searchBox] = useState({
		docdt: null, // 조사일자
		fixdccode: null, // 물류센터
		organizenm: null, // 창고명
		organize: null, // 창고코드
		lottype: '0', // 실사구분 (기본값: 소비기한)
		skuName: null, // 상품명
		sku: null, // 상품코드
		storagetype: null, // 저장조건
		lottable01yn: null, // 소비기한임박여부
		stocktype: null, // 재고위치
		stockgrade: null, // 재고속성
		zone: null, // 피킹존
		fromloc: null, // 로케이션From
		toloc: null, // 로케이션To
		serialno: null, // 이력번호
		contractcompanyNm: null, // 계약업체명
		contractcompany: null, // 계약업체코드
		blno: null, // B/L번호
	}); // 검색영역

	// 기타(4/4)

	/**
	 * =====================================================================
	 *  02. 함수
	 * =====================================================================
	 */

	/**
	 * 	마스터 리스트 조회
	 */
	const searchMasterList = () => {
		refs?.gridRef?.current?.clearGridData();
		refs1?.gridRef?.current?.clearGridData();
		refs2?.gridRef?.current?.clearGridData();
		setTotalCnt(0);
		setTotalCnt1(0);
		setTotalCnt2(0);

		const commonParams = form.getFieldsValue();
		const params = {
			...commonParams,
			dt1: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[0].format('YYYYMMDD'),
			dt2: commUtil.isNull(form.getFieldValue('docdt')) ? '' : form.getFieldValue('docdt')[1].format('YYYYMMDD'),
		};
		searchMasterListImp(params);
	};

	/**
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp = (params: any) => {
		// API 호출
		apiPostMasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData(res.data);
				setTotalCnt(res.data.length);

				// 조회 후 탭 활성화
				const currentLottype = form.getFieldValue('lottype'); // 실사구분(0:소비기한, 1:재고실사)
				if (currentLottype === '0') {
					setActiveKeyMaster('1');
					setDisabledTabs(['2']);
				} else {
					setActiveKeyMaster('2');
					setDisabledTabs(['1']);
				}
			}
		});
	};

	/**
	 * 	조회
	 * @param {any} selectedRowData - 마스터 그리드에서 선택된 행 데이터
	 */
	const searchDetailList = async (selectedRowData: any) => {
		const lottype = form.getFieldValue('lottype'); // 실사구분(0:소비기한, 1:재고실사)

		refs1.gridRef.current?.clearGridData();
		//refs2.gridRef.current?.clearGridData();

		const formValues = form.getFieldsValue();

		// 마스터 그리드에서 선택된 행의 데이터와 검색 조건을 결합
		const params = {
			...formValues,
			dccode: selectedRowData.dccode,
			storerkey: selectedRowData.storerkey,
			inquirydt: selectedRowData.inquirydt,
			inquiryName: selectedRowData.inquiryName,
			priority: selectedRowData.lastpriority,
			//
			//
			whAwharearea: formValues.wharea || '',
			fromZone: formValues.fromZone || '',
			toZone: formValues.toZone || '',
			fromLoc: formValues.fromLoc || '',
			toLoc: formValues.toLoc || '',
			sku: formValues.sku || '',
			lottype: formValues.lottype, // 실사구분(0:소비기한, 1:재고실사)
		};

		// 선택된 lottype에 따라 다른 디테일 리스트 조회 함수 호출

		try {
			if (lottype === '0') {
				// 탭1: 소비기한LIST 조회
				searchDetailListImp01(params);
			} else {
				// 탭2: 실사처리LIST 조회
				searchDetailListImp02(params);
			}
		} catch (error) {
			showAlert('', t('msg.searchError')); // 조회 중 오류가 발생했습니다.
		}
	};

	/**
	 * 소비기한LIST 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchDetailListImp01 = (params: any) => {
		// API 호출
		apiPostTab1DetailList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData1(res.data);
				setTotalCnt1(res.data.length);
			}
		});
	};

	/**
	 * 실사처리LIST 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchDetailListImp02 = (params: any) => {
		// API 호출
		apiPostTab1DetailList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData2(res.data);
				setTotalCnt2(res.data.length);
			}
		});
	};

	/**
	 * 탭 클릭
	 * @param {string} key - 탭 키
	 */
	const tabClick = (key: string) => {
		// 비활성화된 탭이면 클릭 무시
		if (disabledTabs.includes(key)) {
			return;
		}

		setActiveKeyMaster(key);
	};

	/**
	 * 탭 비활성화 여부 확인
	 * @param {string} key - 탭 키
	 * @returns {boolean} 비활성화 여부
	 */
	const isTabDisabled = (key: string) => {
		return disabledTabs.includes(key);
	};

	/**
	 * 그리드 데이터 초기화
	 * @description 실사구분 변경 시 모든 그리드의 데이터를 초기화합니다
	 */
	const handleClearGrid = () => {
		// 마스터 그리드 초기화
		refs?.gridRef?.current?.clearGridData();
		setGridData([]);
		setTotalCnt(0);

		// 상세 그리드들 초기화
		refs1?.gridRef?.current?.clearGridData();
		setGridData1([]);
		setTotalCnt1(0);

		refs2?.gridRef?.current?.clearGridData();
		setGridData2([]);
		setTotalCnt2(0);
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
				refs1.gridRef.current?.resize('100%', '100%');
			} else if (activeKeyMaster === '2') {
				refs2.gridRef.current?.resize('100%', '100%');
			}
		}, 100);
	}, [activeKeyMaster]);

	// lottype 변경 시 탭 활성화 상태 업데이트
	useEffect(() => {
		if (lottype === '0') {
			setActiveKeyMaster('1');
			setDisabledTabs(['2']);
		} else if (lottype === '1') {
			setActiveKeyMaster('2');
			setDisabledTabs(['1']);
		}
	}, [lottype]);

	useEffect(() => {
		// 그리드 행 선택 변경 이벤트 바인딩(마스터)
		refs.gridRef.current.bind('selectionChange', function () {
			// 상세정보 조회
			const selectedRowData = refs.gridRef.current.getSelectedRows()[0];

			if (selectedRowData) {
				searchDetailList(selectedRowData);
			}
		});
	}, []);

	// * 그리드 공통 리사이즈 처리
	const resizeAllGrids = useCallback(() => {
		refs?.gridRef.current?.resize?.('100%', '100%');
		refs1?.gridRef.current?.resize?.('100%', '100%');
		refs2?.gridRef.current?.resize?.('100%', '100%');
	}, []);

	// *  탭 목록
	const tabItemList = [
		{
			key: '1',
			label: '소비기한LIST',
			disabled: isTabDisabled('1'),
			children: (
				<StInquiryMoveDetail1
					ref={refs1}
					data={gridData1}
					totalCnt={totalCnt1}
					form={form}
					activeKeyMaster={activeKeyMaster}
					searchMasterList={searchMasterList}
				/>
			),
		},
		{
			key: '2',
			label: '실사처리LIST',
			disabled: isTabDisabled('2'),
			children: (
				<StInquiryMoveDetail2
					ref={refs2}
					data={gridData2}
					totalCnt={totalCnt2}
					form={form}
					activeKeyMaster={activeKeyMaster}
					searchMasterList={searchMasterList}
				/>
			),
		},
	];

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive form={form} initialValues={searchBox}>
				<StInquiryMoveSearch
					search={searchMasterList}
					form={form}
					activeKey={activeKeyMaster}
					clearGridData={handleClearGrid}
				/>
			</SearchFormResponsive>
			<Splitter
				direction="vertical"
				onResizing={resizeAllGrids}
				onResizeEnd={resizeAllGrids}
				items={[
					<StInquiryMoveDetail
						key="StInquiryMoveDetail-grid-top"
						ref={refs}
						form={form}
						data={gridData}
						totalCnt={totalCnt}
					/>,
					<TabsArray
						key="stInquiryMove-tabs-bottom"
						activeKey={activeKeyMaster}
						onChange={tabClick}
						items={tabItemList}
					/>,
				]}
			/>
		</>
	);
};

export default StInquiryMove;
