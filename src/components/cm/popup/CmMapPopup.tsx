/*
 ############################################################################
 # FiledataField	: CmMapPopup.tsx
 # Description		: 지도조회 팝업
 # Author			: jh.jang
 # Since			: 25.06.09
 ############################################################################
*/
// lib
import axios from '@/api/Axios';
import { Button, Dropdown, Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

// Hooks
import DropdownRenderer from '@/components/common/custom/DropdownRenderer';

// component
import { InputText, SearchForm } from '@/components/common/custom/form';
import DatePicker from '@/components/common/custom/form/Datepicker';

import UiFilterArea from '@/assets/styled/Container/UiFilterArea';
import UiFilterGroup from '@/assets/styled/Container/UiFilterGroup';
import Title from '@/assets/styled/Title/Title';

interface PropsType {
	setSearchLatLng?: any;
	setAddressInfo?: any;
	searchText?: string;
	close?: any;
	lat?: string;
	lon?: string;
	showRadius?: boolean; // 반경,체류시간 노출 여부
	radius?: string; // 반경
	stytime?: string; // 체류시간
	callBackFn?: any; // 콜백 Function
}

declare global {
	interface Window {
		Tmapv2: any;
	}
}

const CmMapPopup = (props: PropsType) => {
	/**
	 * =====================================================================
	 *	01. 변수 선언부
	 * =====================================================================
	 */
	const { setSearchLatLng, setAddressInfo, searchText } = props;
	const { t } = useTranslation();

	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstance = useRef<any>(null);
	const [keyword, setKeyword] = useState('');
	const radiusRef = useRef<any>(props.radius);
	const stytimeRef = useRef<any>(props.stytime);
	const markerRef = useRef<any>(null);
	const circleRef = useRef<any>(null);
	const popupRef = useRef<any>(null);
	const addressRef = useRef<any>(null);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [dropdownData, setDropdownData] = useState([]);
	const dropdownBodyRef = useRef<HTMLTableSectionElement | null>(null);

	const APP_KEY = constants.TMAP.APP_KEY;

	const [popupForm] = Form.useForm();

	/**
	 * =====================================================================
	 *	02. 함수
	 * =====================================================================
	 */

	const reverseGeo = async (lon: number, lat: number) => {
		const response = await axios.get(
			'https://apis.openapi.sk.com/tmap/geo/reversegeocoding?format=json&callback=result',
			{
				params: {
					version: 1,
					format: 'json',
					coordType: 'WGS84GEO',
					addressType: 'A10',
					lon: lon,
					lat: lat,
					noErrorMsg: true,
				},
				headers: {
					appKey: APP_KEY,
				},
				withCredentials: false,
			},
		);

		// 기존 팝업 제거
		if (popupRef.current) {
			popupRef.current.setMap(null);
		}

		if (response.status === 200) {
			// 부모창에 전달하기 위한 주소 정보 설정
			const addressInfo = response?.data?.addressInfo ?? {};
			const fullAddressArr = addressInfo?.fullAddress?.split(',');
			fullAddressArr.forEach((address: any, index: number) => {
				addressInfo['fullAddress' + (index + 1)] = address;
			});
			addressRef.current = addressInfo;

			const content = `
				<div class="cdn-layer">
					<h1>위치정보</h1>
					<button class="close-btn">닫기</button>
					<div class="inner">
						<div class="cdn-list">
							<dl>
								<dt>좌표 :</dt>
								<dd>${lat}, ${lon}</dd>
							</dl>
							<dl>
								<dt>행정동 :</dt>
								<dd>${response.data.addressInfo.fullAddress?.split(',')[0]}</dd>
							</dl>
							<dl>
								<dt>법정동 :</dt>
								<dd>${response.data.addressInfo.fullAddress?.split(',')[1]}</dd>
							</dl>
							<dl>
								<dt>도로명 :</dt>
								<dd>${response.data.addressInfo.fullAddress?.split(',')[2]}</dd>
							</dl>
						</div>
						<div class="btn-wrap">
							<button id="apply-coord-btn" class="ant-btn ant-btn-variant-outlined ant-btn-sm ml5">적용</button>
						</div>
					</div>
				</div>
			`;

			// 지도 중심 이동
			mapInstance.current.setCenter(new window.Tmapv2.LatLng(lat, lon));

			// 새 팝업 추가
			popupRef.current = new window.Tmapv2.InfoWindow({
				position: new window.Tmapv2.LatLng(lat, lon),
				content: content, //Popup 표시될 text
				type: 2, //Popup의 type 설정.
				map: mapInstance.current,
			});

			// 버튼 클릭 이벤트 직접 등록
			setTimeout(() => {
				const btn = document.getElementById('apply-coord-btn');
				if (btn) {
					btn.addEventListener('click', () => {
						postLatLng();
					});
				}
				const closeBtn = document.querySelector('.close-btn');
				if (closeBtn) {
					closeBtn.addEventListener('click', () => {
						if (popupRef.current) {
							popupRef.current.setMap(null); // 팝업 제거
							popupRef.current = null; // 팝업 참조 초기화 (중요)
						}
						if (markerRef.current) {
							markerRef.current.setMap(null);
							markerRef.current = null;
						}
					});
				}
			}, 100); // InfoWindow가 DOM에 렌더링 된 후
		} else {
			popupRef.current = null;
			showAlert(null, '해당 주소 정보가 존재하지 않습니다.');
		}
	};

	const handleSearch = async () => {
		if (!keyword.trim() && !searchText.trim()) return;

		try {
			const response = await axios.get('https://apis.openapi.sk.com/tmap/geo/fullAddrGeo?format=json&callback=result', {
				params: {
					version: 1,
					format: 'json',
					coordType: 'WGS84GEO',
					fullAddr: keyword || searchText,
					noErrorMsg: true,
				},
				headers: {
					appKey: APP_KEY,
				},
				withCredentials: false,
			});

			const { coordinateInfo } = response.data;
			if (coordinateInfo.coordinate.length === 0) {
				showAlert(null, t('msg.MSG_COM_ERR_007'));
				return;
			}

			// 검색 결과가 여러개 일 경우
			if (coordinateInfo.coordinate.length > 1) {
				// 지번 검색시 "매칭 구분 코드" 체크
				// M11: 법정동 정매칭, 법정동 코드 + 지번이 모두 일치
				const result = coordinateInfo.coordinate.filter((obj: any) => obj.matchFlag === 'M11');
				if (result && result.length === 1) {
					setDropdownOpen(false);
					setMarker(coordinateInfo.coordinate[0]);
				} else {
					setDropdownData(
						coordinateInfo.coordinate.map((info: any) => ({
							...info,
							addr: `${info.city_do} ${info.gu_gun} ${info.eup_myun}`,
							buildingName: info.buildingName,
						})),
					);
					setDropdownOpen(true);
				}
			} else {
				setDropdownOpen(false);
				setMarker(coordinateInfo.coordinate[0]);
			}
		} catch (error) {
			showAlert(null, '해당 주소 정보가 존재하지 않습니다.');
			return;
		}
	};

	/**
	 * 좌표에 맞는 마커 생성
	 * @param {any} item 선택된 주소
	 */
	const setMarker = (item: any) => {
		let lat = parseFloat(item.lat);
		let lon = parseFloat(item.lon);

		if (isNaN(lat) && isNaN(lon)) {
			lat = parseFloat(item.newLat);
			lon = parseFloat(item.newLon);
		}

		// 지도 중심 이동
		mapInstance.current.setCenter(new window.Tmapv2.LatLng(lat, lon));

		// 기존 마커 제거
		if (markerRef.current) {
			markerRef.current.setMap(null);
		}

		// 새 마커 추가
		markerRef.current = new window.Tmapv2.Marker({
			position: new window.Tmapv2.LatLng(lat, lon),
			map: mapInstance.current,
			draggable: true, // Marker의 드래그 가능 여부.
		});

		// 드래그 이벤트 등록
		addDragEvent();

		// 새 Circle 추가
		if (props.showRadius) {
			makeCircle({ lat: lat, lon: lon }, mapInstance.current);
		}

		reverseGeo(lon, lat);
	};

	/**
	 * 드래그 이벤트 등록
	 */
	const addDragEvent = () => {
		markerRef.current.addListener('dragend', function (e: any) {
			const newLat = e.latLng.lat();
			const newLng = e.latLng.lng();

			// 새 Circle 추가
			if (props.showRadius) {
				makeCircle({ lat: newLat, lon: newLng }, mapInstance.current);
			}

			reverseGeo(newLng, newLat);
		});
	};

	const padTime = (timeStr: string) => {
		// 4자리로 만들고 앞에 '0'을 채움 (예: '95' -> '0095')
		return String(timeStr).padStart(4, '0').slice(-4);
	};

	//부모창에 마커가 위치한 좌표 전달
	const postLatLng = () => {
		if (markerRef.current) {
			if (commUtil.isNotEmpty(addressRef.current)) {
				setAddressInfo?.(addressRef.current);
			}
			setSearchLatLng([
				markerRef.current._marker_data.options.position._lat,
				markerRef.current._marker_data.options.position._lng,
			]);

			// 콜백 처리
			if (props.callBackFn && props.callBackFn instanceof Function) {
				const result = {
					lat: markerRef.current._marker_data.options.position._lat,
					lon: markerRef.current._marker_data.options.position._lng,
					address: addressRef.current,
					radius: radiusRef.current,
					stytime: stytimeRef.current ? stytimeRef.current.format('HHmm') : '',
				};
				props.callBackFn(result);
			}
		} else {
			showAlert(null, '지도에서 먼저 선택해주세요.');
		}
	};

	/**
	 * MAP에 Circle 그리기
	 * @param {any} evt 좌표 정보
	 * @param {any} map MAP
	 */
	const makeCircle = (evt: any, map: any) => {
		// 기존 Circle 제거
		if (circleRef.current) {
			circleRef.current.setMap(null);
		}

		circleRef.current = new window.Tmapv2.Circle({
			center: new window.Tmapv2.LatLng(evt.lat, evt.lon), // 원의 중심
			radius: radiusRef.current, // 반지름(m)
			// strokeColor: '#FF0000', // 테두리 색
			strokeWeight: 0, // 테두리 두께
			strokeOpacity: 0, // 테두리 투명도
			fillColor: '#FF0000', // 원 내부 색
			fillOpacity: 0.2, // 내부 투명도
			map: map, // 원을 표시할 지도 객체
		});
	};

	/**
	 * 검색결과 INPUT 하단 커스텀 그리드
	 * @returns {object} HTML
	 */
	const dropdownRenderFormat = () => {
		return (
			<>
				{
					<div className={'dropdown-content'}>
						<table className="data-table">
							<thead>
								<tr>
									<th>주소</th>
									<th>건물명</th>
								</tr>
							</thead>
							<tbody>
								{dropdownData.map((item, index) => (
									<tr key={`${item.addr}_${index}`} onClick={() => handleDropdownClick(item)}>
										<td id="dropdownTable">{item.addr}</td>
										<td id="dropdownTable">{item.buildingName}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				}
			</>
		);
	};

	/**
	 *  검색결과 클릭
	 * @param {any} item 클릭한로우
	 */
	const handleDropdownClick = (item: any) => {
		setDropdownOpen(false);
		setMarker(item);
	};

	/**
	 * =====================================================================
	 *	03. react hook event
	 *	예시) useEffect, useImperativeHandle, useActivate, useUnactivate
	 * =====================================================================
	 */

	useEffect(() => {
		if (!window.Tmapv2 || !mapRef.current) return;

		const handler = setTimeout(() => {
			// 지도 생성
			const map = new window.Tmapv2.Map(mapRef.current, {
				center: new window.Tmapv2.LatLng(37.582099, 126.888991), // 기본 좌표
				width: '100%',
				height: '500px',
				zoom: 15,
			});

			map.addListener('click', function (evt: any) {
				// 기존 마커 제거
				if (markerRef.current) {
					markerRef.current.setMap(null);
				}

				// 새 마커 추가
				markerRef.current = new window.Tmapv2.Marker({
					position: new window.Tmapv2.LatLng(evt.latLng._lat, evt.latLng._lng),
					map: mapInstance.current,
					draggable: true, // Marker의 드래그 가능 여부.
				});

				// 드래그 이벤트 등록
				addDragEvent();

				// 새 Circle 추가
				if (props.showRadius) {
					makeCircle({ lat: evt.latLng._lat, lon: evt.latLng._lng }, map);
				}

				reverseGeo(evt.latLng._lng, evt.latLng._lat);
			});

			// 초기값 설정시 위도/경도 있으면 주소 검색 제외
			if (commUtil.isEmpty(props.lat) && commUtil.isEmpty(props.lon)) {
				handleSearch();
			}

			mapInstance.current = map;
		}, 500);

		// 이전 타이머를 제거하여 마지막 타이머만 남도록 한다.
		return () => {
			clearTimeout(handler);
		};
	}, []);

	useEffect(() => {
		setKeyword(searchText);
		popupForm.setFieldsValue({ search: searchText });
	}, [searchText]);

	useEffect(() => {
		// 기존 주소 설정
		if (props.lat && props.lon) {
			setTimeout(() => {
				setMarker({ lat: props.lat, lon: props.lon });
			}, 700);
		}

		// 반경
		if (props.showRadius && props.radius) {
			popupForm.setFieldsValue({ radiusTmp: props.radius });
			radiusRef.current = props.radius;
		}

		// 체류시간
		if (props.showRadius && props.stytime) {
			popupForm.setFieldsValue({ stytimeTmp: dayjs(padTime(props.stytime), 'HHmm') });
			stytimeRef.current = dayjs(padTime(props.stytime), 'HHmm');
		}
	}, []);

	/**
	 * 외부 클릭 감지하여 드롭다운 닫기
	 * @param event
	 */
	useEffect(() => {
		const handleClickOutside = (e: any) => {
			if (e.target?.id !== 'dropdownTable' && e.target?.className !== 'dropdown-content') {
				setDropdownOpen(false);
			}
		};
		if (dropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [dropdownOpen]);

	/**
	 * Drop Down 노출시 포커스 이동
	 */
	useEffect(() => {
		if (!dropdownOpen) return;
		requestAnimationFrame(() => {
			dropdownBodyRef.current?.querySelector('tr')?.focus();
		});
	}, [dropdownOpen]);

	return (
		<>
			{/* 상단 타이틀 및 페이지버튼 */}
			<Title>
				<h2>위경도 좌표 설정</h2>
			</Title>

			{/* 지도 영역 */}
			<div>
				<SearchForm form={popupForm} isAlwaysVisible>
					<UiFilterArea>
						<UiFilterGroup className="">
							{props.showRadius && (
								<>
									<li>
										<InputText
											name="radiusTmp"
											value={radiusRef.current}
											onChange={(e: any) => {
												radiusRef.current = e.target.value;
												makeCircle(
													{
														lat: markerRef.current?._marker_data.options.position._lat,
														lon: markerRef.current?._marker_data.options.position._lng,
													},
													mapInstance.current,
												);
											}}
											label="반경"
										/>
									</li>
									<li>
										<DatePicker
											label="체류시간"
											name="stytimeTmp"
											value={stytimeRef.current}
											onChange={(e: any) => {
												stytimeRef.current = e;
											}}
											format="HH:mm"
											picker="time"
											placeholder={'시분 선택'}
											showNow={false}
											allowClear
										/>
									</li>{' '}
								</>
							)}
							<li className="flex-wrap" style={{ gridColumn: 'span 2' }}>
								<Dropdown
									placement="bottom"
									open={dropdownOpen}
									trigger={[]} // hover, click 방지 => 명시적으로 상태로만 열림
									popupRender={() =>
										DropdownRenderer(
											[
												{ key: 'addr', title: '주소' },
												{ key: 'buildingName', title: '건물명' },
											],
											dropdownData,
											handleDropdownClick,
											null,
											{
												bodyRef: dropdownBodyRef,
												setDropdownOpen,
												form: popupForm,
												name: 'search',
											},
										)
									}
								>
									<InputText
										name="search"
										placeholder="주소 입력 (예: 서울시 마포구 월드컵북로 54길 25)"
										value={keyword}
										onChange={(e: any) => setKeyword(e.target.value)}
										label="주소"
										onPressEnter={handleSearch}
										autoComplete="off"
									/>
								</Dropdown>
								<span>
									<Button size={'small'} onClick={handleSearch}>
										위치찾기
									</Button>
									{/* <Button size={'small'} onClick={handleSearch}>
									좌표찾기
								</Button> */}
									{/* <Button size={'small'} onClick={postLatLng} className="ml5">
										확인
									</Button> */}
								</span>
							</li>
						</UiFilterGroup>
					</UiFilterArea>
				</SearchForm>
				<div ref={mapRef} style={{ width: '100%', height: '500px', border: '1px solid #aaa', cursor: 'grab' }} />
			</div>
		</>
	);
};

export default CmMapPopup;
