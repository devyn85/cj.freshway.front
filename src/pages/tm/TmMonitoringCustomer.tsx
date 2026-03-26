/*
 ############################################################################
 # FiledataField	: TmMonitoringCustomer.tsx
 # Description		: 배송 > 배차현황 > 배송고객모니터링
 # Author					: JiHoPark
 # Since					: 2025.11.24.
 ############################################################################
*/

// Lib
import { Form } from 'antd';

// Component
import { SearchFormResponsive } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import TmMonitoringCustomerDetail from '@/components/tm/monitoringCustomer/TmMonitoringCustomerDetail';
import TmMonitoringCustomerSearch from '@/components/tm/monitoringCustomer/TmMonitoringCustomerSearch';

// Util
import dayjs from 'dayjs';

// Store

// API
import { apiGetMasterList, apiSaveMasterList, apiSendEmail } from '@/api/tm/apiTmMonitoringCustomer';

// Hooks

// type

// asset

const TmMonitoringCustomer = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	// 다국어
	const { t } = useTranslation();

	// antd Form 사용
	const [searchForm] = Form.useForm();

	// grid data
	const [gridData, setGridData1] = useState([]);
	const [totalCnt, setTotalCnt1] = useState(0);

	// grid Ref
	const gridRefs: any = useRef(null);

	// 검색영역 초기 세팅
	const [searchBox] = useState({
		dccode: '', // 물류센터
		deliverydt: dayjs(), // 기준일자
		groupCd: '', // 모니터링그룹
		custkey: '', // 관리처
		diffAddDate: '', // 등록일차이
	});

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 조회 event
	 */
	const searchMasterList = async () => {
		if (gridRefs.current.getChangedData({ validationYn: false })?.length > 0) {
			// 그리드 수정여부 체크
			const isConfirm = await showConfirmAsync(null, t('msg.MSG_COM_CFM_009'));
			if (!isConfirm) return;
		}

		// 목록 초기화
		gridRefs.current.clearGridData();

		const searchParam = searchForm.getFieldsValue();
		const params = {
			dccode: searchParam.gMultiDccode,
			deliverydt: searchParam.deliverydt.format('YYYYMMDD'),
			groupCd: searchParam.groupCd,
			custkey: searchParam.custkey,
			diffAddDate: searchParam.diffAddDate,
		};

		apiGetMasterList(params).then(res => {
			setGridData1(res.data);
			setTotalCnt1(res.data.length);
		});
	};

	/**
	 * 저장 event
	 * @param saveList
	 */
	const saveMaster = (saveList: any) => {
		// 저장하시겠습니까?\n(신규 : {{0}}건, 수정 : {{1}}건, 삭제 : {{2}}건)
		showConfirm(null, t('msg.MSG_COM_VAL_207', [0, saveList.length, 0]), () => {
			gridRefs.current.clearGridData();

			const param = {
				saveMasterList: saveList,
			};

			apiSaveMasterList(param).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_SUC_003'), // 저장되었습니다.
						modalType: 'info',
					});

					// 재조회
					searchMasterList();
				}
			});
		});
	};

	/**
	 * 이메일 발송 event
	 * @param saveList
	 * @param params
	 */
	const sendEmail = (params: any) => {
		// 검색 결과를 담당자에게 이메일 발송하시겠습니까?
		showConfirm(null, t('msg.MSG_COM_VAL_219'), () => {
			const param = {
				emailList: params,
			};

			apiSendEmail(param).then(res => {
				if (res.statusCode === 0) {
					showMessage({
						content: t('msg.MSG_COM_VAL_220'), // 이메일이 발송됐습니다.
						modalType: 'info',
					});
				}
			});
		});
	};

	/**
	 * 페이지 버튼 함수 바인딩
	 */
	const titleFunc = {
		searchYn: searchMasterList, // 조회
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 *  예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle func={titleFunc} />

			{/* 검색 영역 정의 */}
			<SearchFormResponsive form={searchForm} initialValues={searchBox}>
				<TmMonitoringCustomerSearch form={searchForm} />
			</SearchFormResponsive>

			{/* 화면 상세 영역 정의 */}
			<TmMonitoringCustomerDetail
				ref={gridRefs}
				data={gridData}
				totalCnt={totalCnt}
				onSaveHandler={saveMaster}
				onSendEmailHandler={sendEmail}
			/>
		</>
	);
};

export default TmMonitoringCustomer;
