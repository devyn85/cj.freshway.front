/*
 ############################################################################
 # FiledataField	: Popup.tsx
 # Description		: 팝업
 # Author			: Canal Frame
 # Since			: 23.08.21
 ############################################################################
*/
// lib
import { Divider, Form } from 'antd';
import { useRef } from 'react';

// utils
import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';

// component
import CmTestSearch from '@/components/cm/popup/CmTestSearch';
import { Button, InputText, SearchForm } from '@/components/common/custom/form';
import MenuTitle from '@/components/common/custom/MenuTitle';

import CmMapPopup from '@/components/cm/popup/CmMapPopup';
import CmMyMenuPopup from '@/components/cm/popup/CmMyMenuPopup';
import CmSendUserPopup from '@/components/cm/popup/CmSendUserPopup';
import CustomModal from '@/components/common/custom/CustomModal';

// map
// import MapSample from '@/pages/comfunc/sample/MapSample';

// API Call Function

const Popup = () => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const [form] = Form.useForm();
	const refModal = useRef(null); // CustomModal 제어용 ref
	const [searchAddr, setSearchAddr] = useState('');
	const [searchLatLng, setSearchLatLng] = useState('');
	const [addressInfo, setAddressInfo] = useState('');
	const [searchLng, setSearchLng] = useState('');
	const [searchLat, setSearchLat] = useState('');
	const [radius, setRadius] = useState('');
	const [stytime, setStytime] = useState('');

	const openModal = () => {
		refModal.current?.handlerOpen();
	};

	// form data 초기화
	const initFormData = {
		custName1: '',
		custName2: '',
		custName3: '',
		custCode1: '',
		custCode2: '',
		custCode3: '',
	};

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const popRefModal = useRef(null);
	const myMenuRefModal = useRef(null);

	//Form 수정된값 출력
	const onValuesChange = (changedValues: any, allValues: any) => {
		// //console.log(allValues);
	};

	const geocodingCloseEvent = () => {
		return;
	};

	// POP 조회 팝업 열기
	const handleOpenPopPopup = () => {
		popRefModal.current?.handlerOpen();
	};

	// POP 조회 팝업 닫기
	const handleClosePopPopup = () => {
		popRefModal.current?.handlerClose();
	};

	// POP 조회 팝업 콜백 예제
	const handlePopPopupCallback = (data: any) => {
		handleClosePopPopup();
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		form.setFieldsValue({ searchLat: searchLatLng[0] });
		form.setFieldsValue({ searchLng: searchLatLng[1] });
		setSearchLat(searchLatLng[0]);
		setSearchLng(searchLatLng[1]);
		refModal.current.handlerClose();
	}, [searchLatLng]);

	useEffect(() => {
		refModal.current.handlerClose();
	}, [addressInfo]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<MenuTitle />
			<SearchForm form={form} initialValues={initFormData} onValuesChange={onValuesChange}>
				<UiFilterArea>
					<UiFilterGroup>
						<li>
							{/* 지도팝업 */}
							<Divider orientation="left">지도 샘플</Divider>
							<InputText
								name="search"
								placeholder="주소 입력 (예: 서울시 중구 세종대로 110)"
								value={searchAddr}
								onChange={(e: any) => setSearchAddr(e.target.value)}
								label="주소"
							/>
							<InputText
								name="searchLng"
								value={searchLng}
								onChange={(e: any) => setSearchLng(e.target.value)}
								label="경도"
							/>
							<InputText
								name="searchLat"
								value={searchLat}
								onChange={(e: any) => setSearchLat(e.target.value)}
								label="위도"
							/>
							<InputText name="radius" value={radius} onChange={(e: any) => setRadius(e.target.value)} label="반경" />
							<InputText
								name="stytime"
								value={stytime}
								onChange={(e: any) => setStytime(e.target.value)}
								label="체류시간"
							/>
							<Button onClick={openModal}>좌표검색</Button>
						</li>
						<li>
							<Divider orientation="left">샘플1 - 다중선택, 결과값 [코드]라벨</Divider>
							<CmTestSearch
								form={form}
								name="custName1"
								code="custCode1"
								selectionMode="multipleRows"
								returnValueFormat="name"
							/>
						</li>
						<li>
							<Divider orientation="left">샘플2 - 단일선택, 결과값 코드</Divider>
							<CmTestSearch
								form={form}
								selectionMode="singleRow"
								name="custName2"
								code="custCode2"
								returnValueFormat="code"
							/>
						</li>
						<li>
							<Divider orientation="left">샘플3 (Default) - 단일선택, 결과값 [코드]라벨</Divider>
							<CmTestSearch form={form} name="custName3" code="custCode3" />
						</li>
						<li>
							<Divider orientation="left">사용자 메세지</Divider>
							<button onClick={handleOpenPopPopup}>사용자 메세지 Popup</button>
							<CustomModal ref={popRefModal} width="640px">
								<CmSendUserPopup
									params={{ rcvrId: 'dev01' }}
									callBack={handlePopPopupCallback}
									close={handleClosePopPopup}
								/>
							</CustomModal>
						</li>
						<li>
							<Divider orientation="left">드래그 가능한 POP 조회 팝업</Divider>
							<button onClick={handleOpenPopPopup}>드래그 가능한 POP 조회</button>
							<CustomModal ref={popRefModal} width="640px" draggable>
								<CmSendUserPopup
									params={{ rcvrId: 'dev01' }}
									callBack={handlePopPopupCallback}
									close={handleClosePopPopup}
								/>
							</CustomModal>
						</li>
						<li>
							<Divider orientation="left">메뉴 즐겨찾기 팝업</Divider>
							<button onClick={() => myMenuRefModal.current?.handlerOpen()}>메뉴 즐겨찾기 팝업</button>
							<CustomModal ref={myMenuRefModal} width="1280px">
								<CmMyMenuPopup />
							</CustomModal>
						</li>
					</UiFilterGroup>
				</UiFilterArea>
			</SearchForm>
			{/* 팝업 */}
			<CustomModal ref={refModal} width="1280px">
				<CmMapPopup
					setSearchLatLng={setSearchLatLng}
					setAddressInfo={setAddressInfo}
					searchText={searchAddr}
					close={geocodingCloseEvent}
					lat={searchLat}
					lon={searchLng}
					showRadius={true}
					radius={radius}
					stytime={stytime}
					callBackFn={(result: any) => {
						form.setFieldsValue({ radius: result.radius });
						form.setFieldsValue({ stytime: result.stytime });
						setRadius(result.radius);
						setStytime(result.stytime);
					}}
				></CmMapPopup>
			</CustomModal>
		</>
	);
};

export default Popup;
