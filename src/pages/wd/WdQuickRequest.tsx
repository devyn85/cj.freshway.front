/*
 ############################################################################
 # FiledataField	: WdQuickRequest.tsx
 # Description		: 출고 > 출고작업 > 퀵접수(VSR)및처리
 # Author			: sss
 # Since			: 25.12.10
 ############################################################################
*/
import { Form, Modal } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

//Api

//Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

//Util
import { apiPostTab1MasterList, apiPostTab2MasterList, apiPostTab3MasterList } from '@/api/wd/apiWdQuickRequest';
import TabsArray from '@/components/common/TabsArray';
import WdQuickRequestDetail1 from '@/components/wd/quickRequest/WdQuickRequestDetail1';
import WdQuickRequestDetail2 from '@/components/wd/quickRequest/WdQuickRequestDetail2';
import WdQuickRequestDetail3 from '@/components/wd/quickRequest/WdQuickRequestDetail3';
import WdQuickRequestSearch from '@/components/wd/quickRequest/WdQuickRequestSearch';
import commUtil from '@/util/commUtil';
import dateUtil from '@/util/dateUtil';
import { showAlert } from '@/util/MessageUtil';

// lib
const QuickRequest = () => {
	/**
	 * =====================================================================
	 *  01. 변수 선언부
	 * =====================================================================
	 */
	// Declare variable(1/4)
	const { t } = useTranslation();
	const [form] = Form.useForm();
	const [formMaster] = Form.useForm();
	const [gridData, setGridData] = useState([]);
	const [totalCnt, setTotalCnt] = useState(0);

	const [gridData2, setGridData2] = useState([]);
	const [totalCnt2, setTotalCnt2] = useState(0);

	const [gridData3, setGridData3] = useState([]);
	const [totalCnt3, setTotalCnt3] = useState(0);

	const today = dateUtil.getToDay('YYYY-MM-DD');
	const storerkey = useSelector((state: any) => state.global.globalVariable.gStorerkey);
	const [activeKeyMaster, setActiveKeyMaster] = useState('1');

	const [formRef] = Form.useForm();
	const [formRef2] = Form.useForm();

	// Declare react Ref(2/4)
	const refs: any = useRef(null);
	const refs1: any = useRef(null);
	const refs2: any = useRef(null);

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
		} else if (activeKeyMaster === '2') {
			refs1.gridRef.current?.clearGridData();
			refs1.gridRef1.current?.clearGridData();
		} else if (activeKeyMaster === '3') {
			refs2.gridRef.current?.clearGridData();
			refs2.gridRef1.current?.clearGridData();

			try {
				// 추가 그리드 클리어 - 안보이는 탭은 오류 발생 방지
				refs2.gridRef2.current?.clearGridData();
			} catch (e) {}
		}

		// 공통 파라미터
		const docdt = form.getFieldValue('docdt');
		const commonParams = {
			...form.getFieldsValue(),
			dt1: docdt?.[0]?.format('YYYYMMDD') ?? '',
			dt2: docdt?.[1]?.format('YYYYMMDD') ?? '',
		};

		//console.log(('commonParams===>', commonParams);

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
				// 탭1: 조회
				const params = {
					...commonParams,
					loc: commUtil.nvl(form.getFieldValue('loc'), ''),
				};

				searchMasterListImp01(params);
			} else if (activeKeyMaster === '2') {
				// 탭2: 조회
				const params = {
					...commonParams,
					loc: commUtil.nvl(form.getFieldValue('loc'), ''),
				};

				searchMasterListImp02(params);
			} else if (activeKeyMaster === '3') {
				// 탭3: 조회
				const params = {
					...commonParams,
					vsrtypeFlag: '2', // VSR유형구분(1:VOC,2:수기퀵주문접수)
					loc: commUtil.nvl(form.getFieldValue('loc'), ''),
				};

				searchMasterListImp03(params);
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
	 * 조회 구현 함수 - 퀵주문접수(VOC)
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
	 * 조회 구현 함수
	 * @param {object} params - 파라미터
	 */
	const searchMasterListImp03 = (params: any) => {
		// API 호출
		apiPostTab3MasterList(params).then(res => {
			if (res.data != null && res.data.length > 0) {
				setGridData3(res.data);
				setTotalCnt3(res.data.length);
			}
		});
	};

	/**
	 * 탭 클릭 - 저장 유무 체크
	 * @param key
	 * @param e
	 */
	const tabClick = (key: string) => {
		// 현재 탭의 저장 여부 확인
		let isModified = false;

		if (activeKeyMaster === '1') {
			isModified = false; // 탭1은 편집 불가하므로 항상 false
		} else if (activeKeyMaster === '2') {
			isModified = refs1.current?.isChangedData?.() || false;
		} else if (activeKeyMaster === '3') {
			isModified = refs2.current?.isChangedData?.() || false;
		}

		// 저장되지 않은 변경사항이 있으면 확인 메시지
		if (isModified) {
			Modal.confirm({
				content: '저장되지 않은 변경사항이 있습니다. 이동하시겠습니까?',
				okText: '예',
				cancelText: '아니오',
				onOk() {
					setActiveKeyMaster(key);

					// 그리드 100% 리사이즈
					fnResize(key);
				},
				onCancel() {
					// 취소 시 탭 이동 안 함
				},
			});
		} else {
			setActiveKeyMaster(key);

			// 그리드 100% 리사이즈
			fnResize(key);
		}
	};

	// 그리드 100% 리사이즈
	const fnResize = (key: string) => {
		if (key === '1') {
			if (refs.gridRef.current) {
				refs.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '2') {
			if (refs1.gridRef.current) {
				refs1.gridRef.current?.resize('100%', '100%');
			}
		} else if (key === '3') {
			if (refs2.gridRef.current) {
				refs2.gridRef.current?.resize('100%', '100%');
			}
		}
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
				refs1.gridRef.current?.resize('100%', '100%');
			} else if (activeKeyMaster === '3') {
				refs2.gridRef.current?.resize('100%', '100%');
			}
		}, 100);

		//activeKeyMaster.current = activeKeyMaster;
	}, [activeKeyMaster]);

	// 공통 props 객체
	const commonProps = {
		form, //	조회조건 form
		formRef, // 일괄적용1 formRef
		formRef2, // 일괄적용2 formRef2
		activeKey: activeKeyMaster,
		search: searchMasterList,
	};

	// * 탭 목록
	const tabItems = [
		{
			key: '1',
			label: '퀵접수(ＶＳＲ접수현황목록',
			children: (
				<WdQuickRequestDetail1
					ref={refs}
					{...commonProps}
					data={gridData}
					totalCnt={totalCnt}
					setTotalCnt={setTotalCnt}
				/>
			),
		},
		{
			key: '2',
			label: '퀵주문접수(VOC)',
			children: (
				<WdQuickRequestDetail2
					ref={refs1}
					{...commonProps}
					form={form}
					data={gridData2}
					totalCnt={totalCnt2}
					setTotalCnt={setTotalCnt2}
				/>
			),
		},
		{
			key: '3',
			label: '퀵주문접수',
			children: (
				<WdQuickRequestDetail3
					ref={refs2}
					{...commonProps}
					data={gridData3}
					totalCnt={totalCnt3}
					setTotalCnt={setTotalCnt3}
				/>
			),
		},
	];

	return (
		<>
			<MenuTitle func={titleFunc} authority="searchYn" />
			<SearchFormResponsive {...commonProps} initialValues={searchBox}>
				<WdQuickRequestSearch {...commonProps} />
			</SearchFormResponsive>

			<TabsArray activeKey={activeKeyMaster} onChange={tabClick} items={tabItems} />
		</>
	);
};

export default QuickRequest;
