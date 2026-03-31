// lib
import { Dropdown, Form } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

// components
import CustomModal from '@/components/common/custom/CustomModal';
import { InputSearch } from '@/components/common/custom/form';
import MsDeliveryDistrictPopup from '@/components/ms/popup/MsDeliveryDistrictPopup';

// css
import { CloseCircleFilled } from '@ant-design/icons';

// api calls
import { apiPostGetMasterList } from '@/api/ms/apiMsDeliveryDistrict';

// store
import { useAppSelector } from '@/store/core/coreHook';

// utils
import { usePopupPasteTransform } from '@/hooks/cm/usePopupPasteTransform';


interface IMsDeliveryDistrictDistrictSearchProps {
  form: any;                  // 상위 컴포넌트의 Form 인스턴스
  selectionMode?: string;     // 'singleRow' | 'multipleRows'
  name: string;               // 표시 필드 (e.g. 'districtName')
  code: string;               // 실제 검색 값 필드 (e.g. 'searchDistrict')
  returnValueFormat?: string; // 'code' - 코드만 반환
  label?: string;             // 라벨 (InputSearch 에서 사용)
  required?: boolean;         // 필수 여부 (InputSearch 에서 사용)
  value?: string;             // 초기값 (InputSearch 에서 사용)
  disabled?: boolean;         // 비활성화 여부
  customDccode?: string;      // 커스텀 물류센터 코드
}

const MsDeliveryDistrictSearch = ({
  form,
  selectionMode = 'multipleRows',
  name,
  code,
  returnValueFormat,
  label,
  required,
  value,
  disabled,
  customDccode,
}: IMsDeliveryDistrictDistrictSearchProps) => {
  const { t } = useTranslation();
  const pasteTransform = usePopupPasteTransform();

  const modalRef = useRef<any>(null);

  // 해당 필드 값 구독 (값 바뀌면 컴포넌트 re-render)
  const fieldValue = Form.useWatch(name, form);

  // dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownData, setDropdownData] = useState<any[]>([]);

  const user = useAppSelector(s => s.user.userInfo);

  /**
	 * 조회 결과 저장
	 * @param {object} val
	 * @returns {void}
	 */
	const settingSelectData = (val: any): void => {
		let searchName = `[${val[0].dlvdistrictId}]${val[0].dlvdistrictNm || ''}`;
		let searchCode = val[0].dlvdistrictId;

		for (let i = 1; i < val.length; i++) {
			searchName += `,[${val[i].dlvdistrictId}]${val[i].dlvdistrictNm || ''}`;
			searchCode += ',' + val[i].dlvdistrictId;
		}

		if (returnValueFormat === 'code') {
			form.setFieldsValue({ [name]: searchCode, [code]: searchCode });
		} else if (val.length > 1) {
			form.setFieldsValue({ [name]: `${val.length}건 선택`, [code]: searchCode });
		} else {
			form.setFieldsValue({ [name]: searchName, [code]: searchCode });
		}

		// // 선택 후 콜백 실행
		// if (onConfirm) {
		// 	onConfirm(val);
		// }
	};

  /**
    * 팝업 닫기 이벤트
    */
  const closeEvent = (): void => {
    // 의미없는 값 삭제
    if (commUtil.isEmpty(form.getFieldValue(code))) {
      form.setFieldsValue({ [name]: '' });
    }
    modalRef.current?.handlerClose();
  };

	/**
	 * 팝업 확인 버튼 (체크된 행들 or 1개 행 선택 시)
	 * @param {object} rows 선택된 행들
	 */
	const confirmEvent = (rows: any[]): void => {
		modalRef.current?.handlerClose();
		settingSelectData(rows);
	};

  /**
   * POP 조회 API 호출
   * @param {boolean} isPopup 팝업여부
   * @param {string} value 검색할 이름
   * @param isMultiSelect 다중 선택 여부
   * @returns {void}
   */
	const getSearchApi = (isPopup: boolean, value: string, isMultiSelect: boolean) => {
		if (value === '') {
			handleOpenPopup();
			return;
		}

		const params = {
      dccode: form.getFieldValue('dccode') ?? customDccode ?? user?.defDccode,
      effectiveDate: form.getFieldValue('effectiveDate').format('YYYYMMDD') ?? dayjs().format('YYYYMMDD'),
      searchDistrict: '',
      searchKeyword: '',
      searchDistrictGroup: '',
      multiSelect: '',
		};

		if (isMultiSelect) {
			params.multiSelect = value;
			params.searchDistrict = '';
		} else {
			params.searchDistrict = value;
		}

		apiPostGetMasterList(params).then((res: any) => {
			// [페이징 로직 제거] 기존: res.data.list 변경: res.data (배열 직접 반환)
			const dataList = res.data || [];

			if (!isPopup) {
				// if (res.data.list.length == value.split(',').map(v => v.trim()).length) {
				if (dataList.length == value.split(',').map(v => v.trim()).length) {
					// settingSelectData(res.data.list);
					settingSelectData(dataList);
				} else {
					modalRef.current?.handlerOpen();
				}
			}
		});
	};  



	/**
	 * 엔터 입력 시 조회
	 * @param {string} value 검색어
	 * @param {boolean} isForceSearch 강제 검색 여부
	 */
	const searchEnter = (value: string, isForceSearch?: boolean): void => {
		if (value === '' || (!isForceSearch && commUtil.isNotEmpty(form.getFieldValue(code)))) return;

		dropdownData.length = 0;
		const params = {
      dccode: form.getFieldValue('dccode') ?? customDccode ?? user?.defDccode,
      effectiveDate: form.getFieldValue('effectiveDate').format('YYYYMMDD') ?? dayjs().format('YYYYMMDD'),
      searchDistrict: value,
      searchKeyword: '',
      searchDistrictGroup: '',
      multiSelect: '',
		};

		setDropdownData([]);
		apiPostGetMasterList(params).then((res: any) => {
			// [페이징 로직 제거] 기존: res.data.list 변경: res.data (배열 직접 반환)
			const dataList = res.data || [];

			if (dataList.length === 1) {
				settingSelectData(dataList);
			} else if (dataList.length > 0) {
				const tempList = [];
				for (const item of dataList) {
					tempList.push(item);
				}
				setDropdownData(tempList);
				setDropdownOpen(true);
			} else if (dataList.length === 0) {
				modalRef.current.handlerOpen();
			}
		});
	};

  /**
  * 검색 버튼 클릭 시
  * @param {object} param 조회 param
  * @param  {any} event 이벤트
  * @param  {any} source clear, input
  * @returns {void}
  */
	const onClickSearchButton = (param: string, event: any, source: any) => {
		if (source.source === 'clear') return;

		const isMultiSelect = param.split(',').length > 1;
		if (event.key === 'Enter') {
			if (isMultiSelect) {
				getSearchApi(false, param, isMultiSelect);
			} else {
				searchEnter(param);
			}
		} else {
			handleOpenPopup();
		}
	};

  const handleOpenPopup = () => {
    modalRef.current?.handlerOpen();
  };


  /**
	 * 드롭다운에서 항목 선택 시
	 * @param val
	 */
	const handleDropdownClick = (val: any) => {
		if (returnValueFormat === 'code') {
			form.setFieldsValue({ [name]: val.dlvdistrictId, [code]: val.dlvdistrictId });
		} else {
			form.setFieldsValue({ [name]: `[${val.dlvdistrictId}]${val.dlvdistrictNm || ''}`, [code]: val.dlvdistrictId });
		}
		setDropdownOpen(false);

		// // 드롭다운 선택 후 콜백 실행
		// if (onConfirm) {
		// 	onConfirm([val]);
		// }
	};

  /**
	 * 검색결과 INPUT 하단 커스텀 그리드
	 * @returns {object} HTML
	 */
	const dropdownRenderFormat = (): JSX.Element => {
		return (
			<div className="dropdown-content">
				<table className="data-table">
					<thead>
						<tr>
							{/* 권역코드 */}
							<th>{'권역 ID'}</th>
							{/* 권역명 */}
							<th>{'권역 명'}</th>
						</tr>
					</thead>
					<tbody>
						{dropdownData.map((item, index) => (
							<tr key={index} onClick={() => handleDropdownClick(item)}>
								<td id="dropdownTable">{item.dlvdistrictId}</td>
								<td id="dropdownTable">{item.dlvdistrictNm}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	};

	// 드롭 다운 외부 클릭 시 닫기 처리 로직 
	useEffect(() => {
    const handleClickOutside = (e: any) => {
        // 드롭다운 내부 요소가 아닌 경우에만 닫기
        if (e.target?.id !== 'dropdownTable' && e.target?.className !== 'dropdown-content') {
            setDropdownOpen(false);
        }
    };
    
    if (dropdownOpen) {
        // 드롭다운이 열려있을 때만 이벤트 리스너 추가
        document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
        // 컴포넌트 언마운트 시 또는 dropdownOpen 변경 시 이벤트 리스너 제거
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, [dropdownOpen]);

  return (
    <>
      {/* 검색 + 간단조회 결과 */}
      <Dropdown placement="bottom" open={dropdownOpen} trigger={[]} popupRender={dropdownRenderFormat}>
        <InputSearch 
          label={label ?? '권역'}
          placeholder={t('msg.placeholder1', ['권역 ID 또는 명'])}
          form={form}
          name={name}
          code={code}
          value={value}
          hidden={true}
          onSearch={onClickSearchButton}
          onPaste={(e: any) => {
						pasteTransform(form, name, true, code)(e);
						if (!String(form.getFieldValue(code) || '').includes(',')) searchEnter(form.getFieldValue(code), true);
					}}
          onBlur={() => {
						// 의미 없는 값 입력시 삭제
						if (!dropdownOpen && commUtil.isEmpty(form.getFieldValue(code)) && !modalRef.current?.getIsOpen()) {
							form.setFieldValue(name, '');
						}
					}}
          allowClear={!disabled && commUtil.isEmpty(form.getFieldValue(name))}
					required={required}
          rules={[{ required: required, validateTrigger: 'none' }]}
          disabled={disabled}
          readOnly={commUtil.isNotEmpty(form.getFieldValue(code))}
					suffix={
						!disabled && commUtil.isNotEmpty(fieldValue) ? (
							<CloseCircleFilled
								style={{ cursor: 'pointer', color: 'rgba(0,0,0,0.25)' }}
								onClick={() => {
									form.setFieldValue(name, '');
									form.setFieldValue(code, '');
								}}
							/>
						) : null
					}
					autoComplete="off"
        />
      </Dropdown>

      <CustomModal ref={modalRef} width="1280px">
        <MsDeliveryDistrictPopup
          form={form}
          handleSetSelectedRows={confirmEvent}
          handleClose={closeEvent}
          searchName={form.getFieldValue(code) || form.getFieldValue(name)}
          selectionMode={selectionMode}
          customDccode={customDccode}
        />
      </CustomModal>
    </>
  );
};

export default MsDeliveryDistrictSearch;