// CSS

// Lib

// Util

// Type

// Component
import { Rangepicker, SelectBox } from '@/components/common/custom/form';

// Store
import Constants from '@/util/constants';

// API Call Function
import CmPartnerSearch from '@/components/cm/popup/CmPartnerSearch';
import CmSkuSearch from '@/components/cm/popup/CmSkuSearch';
import { getCommonCodeList } from '@/store/core/comCodeStore';
import dayjs from 'dayjs';

const KpDpInspectMonitoringSearch = forwardRef((props: any, ref: any) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { t } = useTranslation();
	const { search, form } = props;

	/**
	 * =====================================================================
	 *	02. 함수 선언부
	 * =====================================================================
	 */

	/**
	 * 집계PDP
	 */
	const onClickSumPDP = () => {
		// 저장품자동발주검수 팝업 열기 (window.open)
		const checkedItems = ref.gridRef.current.getCheckedRowItemsAll();

		// 팝업 열기
		const width = window.screen.availWidth;
		const height = window.screen.availHeight;
		const popupUrl = `/om/OmPurchaseInspectPop?${Constants.WIN_POPUP.KEY}=${Constants.WIN_POPUP.VALUE}`;
		const popup = window.open(popupUrl, 'OmPurchaseInspectPop', `width=${'1200px'},height=${'480px'},left=0,top=0`);

		// 팝업이 준비되면 데이터 전송
		const handleMessage = (event: MessageEvent) => {
			if (event.data === 'popup-ready' && popup) {
				popup.postMessage(checkedItems, window.location.origin);
				window.removeEventListener('message', handleMessage);
			}
		};

		window.addEventListener('message', handleMessage);
	};

	/**
	 * 집계PDP
	 */
	const onClickDetailPDP = () => {
		alert('상세PDP');
	};

	/**
	 * =====================================================================
	 *  03. react hook event
	 * =====================================================================
	 */
	useEffect(() => {
		props.form.setFieldValue('slipdtRange', [dayjs(), dayjs()]);
	}, []);

	return (
		<>
			<li>
				<Rangepicker
					label={'입고전표일자'} // 입고전표일자
					name="slipdtRange"
					format={'YYYY-MM-DD'} // 화면에 표시될 형식
					span={24}
					allowClear
					showNow={false}
					//nChange={handleDateChange}
					required
					rules={[{ required: true, validateTrigger: 'none' }]}
				/>
			</li>
			<li className="flex-wrap">
				<SelectBox
					label={'처리결과'}
					name="result"
					options={[
						{ comCd: '', cdNm: '전체' },
						{ comCd: '10', cdNm: '스캔중' },
						{ comCd: '20', cdNm: '스캔완료' },
					]}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
				{/* <Button onClick={onClickSumPDP}>집계PDP</Button>
				<Button onClick={onClickDetailPDP}>상세PDP</Button> */}
			</li>
			<li>
				<CmSkuSearch
					form={form}
					label={t('lbl.SKU')} //상품코드
					name="skuNm"
					code="sku"
					selectionMode="multipleRows"
				/>
			</li>
			<li>
				<CmPartnerSearch //협력사코드
					form={props.form}
					// name="vendorName"
					// code="vendor"
					name="fromcustkeyNm"
					code="fromcustkey"
					selectionMode="multipleRows"
					returnValueFormat="name"
					label={t('lbl.VENDOR')}
				/>
			</li>
			<li>
				<SelectBox
					label={t('lbl.UNDONEYN_DP')} //미입고처리여부
					name="undoneyn"
					options={getCommonCodeList('YN', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>

			<li>
				<SelectBox
					label={t('lbl.CHANNEL_DMD')} //저장유무
					name="channel"
					options={getCommonCodeList('PUTAWAYTYPE', t('lbl.ALL'))}
					fieldNames={{ label: 'cdNm', value: 'comCd' }}
				/>
			</li>
		</>
	);
});

export default KpDpInspectMonitoringSearch;
