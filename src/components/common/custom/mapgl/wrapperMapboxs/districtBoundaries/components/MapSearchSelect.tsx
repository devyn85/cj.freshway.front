// lib
import { useRooutyMap } from '@/components/common/custom/mapgl/mapbox';
import * as turf from '@turf/turf';
import { Button, Form } from 'antd';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
// components
import { SearchFormResponsive, SelectBox } from '@/components/common/custom/form';
// types
import { Dispatch } from 'react';

// types
import { IListenerSource } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/types/feature';

interface IMapSearchSelectProps {
	listenerSource: IListenerSource;
	setSearchGeoJson: Dispatch<any>;
}

const MapSearchSelect = ({ listenerSource, setSearchGeoJson }: IMapSearchSelectProps) => {
	// 다국어
	const { t } = useTranslation();

	const maps = useRooutyMap();

	// 검색 하이라이트 자동 해제 타이머
  const clearSearchTimerRef = useRef<number | null>(null);
	const scheduleClearSearch = () => {
	  // 기존 타이머 있으면 취소
	  if (clearSearchTimerRef.current !== null) {
	    window.clearTimeout(clearSearchTimerRef.current);
	  }
	  // 2초 뒤에 검색 하이라이트 해제
	  clearSearchTimerRef.current = window.setTimeout(() => {
	    setSearchGeoJson(null);
	    clearSearchTimerRef.current = null;
	  }, 2000);
	};
	// 언마운트 시 타이머 정리
	useEffect(() => {
	  return () => {
	    if (clearSearchTimerRef.current !== null) {
	      window.clearTimeout(clearSearchTimerRef.current);
	    }
	  };
	}, []);


	const flyToFeature = async (feature: any) => {
		const map = maps['wrapper-district-map']?.mapbox;
		if (!map || !feature) return;
		try {
			const [minLng, minLat, maxLng, maxLat] = turf.bbox(feature);
			map.fitBounds(
				[
					[minLng, minLat],
					[maxLng, maxLat],
				],
				{ padding: 60, duration: 700 },
			);
		} catch {
			const c = turf.center(feature)?.geometry?.coordinates;
			if (c) map.flyTo({ center: [c[0], c[1]], zoom: 11 });
		}
	};

	const [form] = Form.useForm();
	// selectBox 는 행정동 코드값 임
	const [mapSelectBoxes] = useState({
		sido: '',
		sgg: '',
		dem: '',
	});

	const onSubmit = () => {
		const { sido, sgg, dem } = form.getFieldsValue();
		if (sido?.length > 0 && sgg?.length > 0 && dem?.length > 0) {
			const geoJsonObj = listenerSource?.dem.features.find((item: any) => item.properties.hjdongCd === dem);
			setSearchGeoJson(geoJsonObj);
			flyToFeature(geoJsonObj);
			scheduleClearSearch();
		} else if (sido?.length > 0 && sgg?.length > 0) {
			// 세종시 예외처리 
			if (sgg === '3600000000') {
				const geoJsonObj = listenerSource?.sido.features.find((item: any) => item.properties.hjdongCd === sido);
				setSearchGeoJson(geoJsonObj);
				flyToFeature(geoJsonObj);
				scheduleClearSearch();
			} else {
				const geoJsonObj = listenerSource?.sgg.features.find((item: any) => item.properties.hjdongCd === sgg);
				setSearchGeoJson(geoJsonObj);
				flyToFeature(geoJsonObj);
				scheduleClearSearch();
			}
		} else if (sido?.length > 0) {
			const geoJsonObj = listenerSource?.sido.features.find((item: any) => item.properties.hjdongCd === sido);
			setSearchGeoJson(geoJsonObj);
			flyToFeature(geoJsonObj);
			scheduleClearSearch();
		}
	};

	// 시/도 선택 옵션
	const [sidoSelectOptions, setSidoSelectOptions] = useState([{ ctpKorNm: '시/도', hjdongCd: '' }]);
	// 시/군/구 선택 옵션
	const [sggSelectOptions, setSggSelectOptions] = useState([{ sigKorNm: '시/군/구', hjdongCd: '' }]);
	// 읍/면/동 선택 옵션
	const [demSelectOptions, setDemSelectOptions] = useState([{ hjdongNm: '읍/면/동', hjdongCd: '' }]);

	// 시/도 선택 시 하위 옵션 처리
	const handleSidoSelect = (hjdongCd: string) => {
		if (hjdongCd.length === 0) {
			form.setFieldsValue({ sgg: '', dem: '' });
			setSggSelectOptions([{ sigKorNm: '시/군/구', hjdongCd: '' }]);
			return;
		}

		const sidoCtpKorObject = listenerSource.sido.features.find((item: any) => item.properties.hjdongCd === hjdongCd);
		// 세종시 예외 케이스 처리 (세종시는 시군구 가 존재하지 않는다.)
		if (hjdongCd === '3600000000') {
			const sggList = [{
				sigKorNm: sidoCtpKorObject?.properties?.ctpKorNm ?? '',
				hjdongCd: hjdongCd,
			}];
			setSggSelectOptions([{ sigKorNm: '시/군/구', hjdongCd: '' }, ...sggList]);
			setDemSelectOptions([{ hjdongNm: '읍/면/동', hjdongCd: '' }]);
		} else if (sidoCtpKorObject) {
			const sggList = listenerSource.sgg.features
				.filter((item: any) => item.properties.ctpKorNm === sidoCtpKorObject?.properties?.ctpKorNm)
				.map((item: any) => ({
					sigKorNm: item.properties.sigKorNm,
					hjdongCd: item.properties.hjdongCd,
				}));
			setSggSelectOptions([{ sigKorNm: '시/군/구', hjdongCd: '' }, ...sggList]);
			setDemSelectOptions([{ hjdongNm: '읍/면/동', hjdongCd: '' }]);
			// 하위 항목 초기화
			form.setFieldsValue({ sgg: '', dem: '' });
		}
	};

	// 시/군/구 선택 시 하위 옵션 처리
	const handleSggSelect = (hjdongCd: string) => {
		if (hjdongCd.length === 0) {
			form.setFieldValue('dem', '');
			setDemSelectOptions([{ hjdongNm: '읍/면/동', hjdongCd: '' }]);
			return;
		}

		// 세종시 예외 케이스 처리
		if (hjdongCd === '3600000000') {
			// 세종시 이름 가져오기
			const sidoCtpKorNm = listenerSource.sido.features.find((item: any) => item.properties.hjdongCd === hjdongCd)?.properties?.ctpKorNm;
			let demList: any[] = [];
			if (sidoCtpKorNm && sidoCtpKorNm.length > 0) {
				demList = listenerSource.dem.features.filter((item: any) => item.properties.ctpKorNm === sidoCtpKorNm).map((item: any) => ({
					hjdongNm: item.properties.hjdongNm,
					hjdongCd: item.properties.hjdongCd,
				}));
			}
			setDemSelectOptions([{ hjdongNm: '읍/면/동', hjdongCd: '' }, ...demList]);
			form.setFieldValue('dem', '');
		} else {
			const sggSigObject = listenerSource.sgg.features.find((item: any) => item.properties.hjdongCd === hjdongCd);
			if (sggSigObject) {
				const demList = listenerSource.dem.features
					.filter((item: any) => item.properties.ctpKorNm === sggSigObject?.properties?.ctpKorNm && item.properties.sigKorNm === sggSigObject?.properties?.sigKorNm)
					.map((item: any) => ({
						hjdongNm: item.properties.hjdongNm,
						hjdongCd: item.properties.hjdongCd,
					}));
				setDemSelectOptions([{ hjdongNm: '읍/면/동', hjdongCd: '' }, ...demList]);
				form.setFieldValue('dem', '');
			}
		}
	};

	const onSelectHandle = (hjdongCd: string, selectType: 'sido' | 'sgg' | 'dem') => {
		// 폼 값 설정
		form.setFieldValue(selectType, hjdongCd);

		// 선택한 select 에 따라 다른 select 처리
		if (selectType === 'sido') {
			handleSidoSelect(hjdongCd);
		} else if (selectType === 'sgg') {
			handleSggSelect(hjdongCd);
		}
	};

	// 최초 랜더링 시 시/도 옵션 설정
	useEffect(() => {
		if (
			listenerSource.sido.features.length + listenerSource.sgg.features.length + listenerSource.dem.features.length >
			0
		) {
			setSidoSelectOptions([
				{ ctpKorNm: '시/도', hjdongCd: '' },
				...listenerSource.sido.features.map((item: any) => ({
					ctpKorNm: item.properties.ctpKorNm,
					hjdongCd: item.properties.hjdongCd,
				})),
			]);
		}
	}, [listenerSource]);

	const ulStyle: CSSProperties = {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		alignItems: 'center',
		flexWrap: 'nowrap', // 줄바꿈 방지
	};

	const liStyle: CSSProperties = {
		flex: 1,
		// padding: '0 15px',
		margin: '0 10px',
		minWidth: '130 px', // flex 아이템이 내용 크기보다 작아질 수 있도록 설정
	};
	// 기존 liStyle 유지
	const selectLiStyle: CSSProperties = {
		...liStyle,
		flex: '0 0 130px',   // shrink 방지 + 고정폭
		width: 130,          // 부모 폭 고정
		minWidth: 130,       // 공백 없는 유효 값
		borderRight:0,
		borderLeft:0,
		borderBottom:0,
		borderTop:0,
	};

	const titleStyle: CSSProperties = {
		width: 'auto',
		minWidth: 'fit-content',
		whiteSpace: 'nowrap',
		display: 'flex',
		alignItems: 'center',
		margin: '0 10px',
		paddingRight: '15px',
		borderRight: '0px',
		borderLeft: '0px',
		borderBottom: '0px',
		borderTop: '0px',
	};

	const buttonStyle: CSSProperties = {
		width: 'auto',
		minWidth: 'fit-content',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		paddingLeft: '15px',
		border: 0,
	};

	// 기존 스타일 정의 아래에 새로운 CSS 오버라이드 추가
	const formItemControlStyle = `
  .ant-form-item .ant-form-item-control:first-child:not([class^="ant-col-"]):not([class*=" ant-col-"]) {
    padding: 0 !important;
  }
  
  /* 모든 form-item-control에 패딩 0을 적용하려면 아래 선택자도 추가 */
  .ant-col.ant-form-item-control {
    padding: 0 !important;
  }
  .ant-col.ant-col-24 {
    padding: 0 !important;
  }
`;

	return (
		<>
			<div style={{ width: '100%', backgroundColor: '#f2f2f2' }} >
				{/* 인라인 스타일 태그 추가 */}
				<style>{formItemControlStyle}</style>
				<SearchFormResponsive form={form} initialValues={mapSelectBoxes}>
					<ul style={ulStyle}>
						<li style={titleStyle}>
							<h3>지역 이동</h3>
						</li>
						<li style={selectLiStyle}>
							<SelectBox
								name="sido"
								placeholder="선택해주세요"
								options={sidoSelectOptions}
								fieldNames={{ label: 'ctpKorNm', value: 'hjdongCd' }}
								initval={''}
								label={''}
								onChange={(hjdongCd: string) => onSelectHandle(hjdongCd, 'sido')}
								style={{ width: '130px' }}
							/>
						</li>
						<li style={selectLiStyle}>
							<SelectBox
								name="sgg"
								placeholder="선택해주세요"
								options={sggSelectOptions}
								fieldNames={{ label: 'sigKorNm', value: 'hjdongCd' }}
								initval={''}
								label={''}
								onChange={(hjdongCd: string) => onSelectHandle(hjdongCd, 'sgg')}
								style={{ width: '130px' }}
							/>
						</li>
						<li style={selectLiStyle}>
							<SelectBox
								name="dem"
								placeholder="선택해주세요"
								options={demSelectOptions}
								fieldNames={{ label: 'hjdongNm', value: 'hjdongCd' }}
								initval={''}
								label={''}
								onChange={(hjdongCd: string) => onSelectHandle(hjdongCd, 'dem')}
								style={{ width: '130px' }}
							/>
						</li>
						<li style={buttonStyle}>
							<Button type="default" onClick={onSubmit}>
								{'검색'}
							</Button>
						</li>
					</ul>
				</SearchFormResponsive>
			</div>
			{/* <CustomModal ref={modalRef} width={'300px'}>
				<MapSelectPopup onClose={() => modalRef.current?.handlerClose()}  />
			</CustomModal> */}
		</>
	);
};

export default MapSearchSelect;
