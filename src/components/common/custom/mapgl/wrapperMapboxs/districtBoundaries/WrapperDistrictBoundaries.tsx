import { apiTmLocationMonitorPostGetWeatherInfo } from '@/api/tm/apiTmLocationMonitor';
import { Layer, Marker, RooutyMap, Source, useRooutyMap } from '@/components/common/custom/mapgl/mapbox';
import type { MapEvent, MapProps, ViewStateChangeEvent } from '@/components/common/custom/mapgl/mapbox/types';
import MapSearchSelect from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/components/MapSearchSelect';
import { WeatherMarker } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/components/WeatherMarker';
import {
	getDefaultWeatherIndex,
	WeatherTimeSelector,
} from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/components/WeatherTimeSelector';
import { useDistrictBoundariesData } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/hooks/useDistrictBoundariesData';
import { useHover } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/hooks/useHover';
import { useToggleButtons } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/hooks/useToggleButtons';
import MapToggleBtn, {
	IMapToggleBtn,
} from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/mapOverlay/MapToggleBtn';
import MapToolTip from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/mapOverlay/MapToolTip';
import type { IPolygonData } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/types/feature';
import {
	BasePloygonLayerStyle,
	SelectedPloygonLayerStyle,
} from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/utils/mapLayerStyles';
import { getRegionLevel } from '@/components/common/custom/mapgl/wrapperMapboxs/districtBoundaries/utils/viewports';
import { useDistrictBoundaryStore } from '@/store/districtBoundaryStore';
import { WeatherInfoItem } from '@/types/tm/locationMonitor';
import * as turf from '@turf/turf';
import { type MapWheelEvent } from 'mapbox-gl';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useActivate, useUnactivate } from 'react-activation';

const { VITE_NAVER_MAPS_API_KEY } = import.meta.env;

interface IWrapperDistrictBoundariesProps extends MapProps {
	children?: React.ReactNode; // 1) 슬롯: 폴리곤/폴리라인/마커/텍스트
	textLayerChildren?: React.ReactNode; // 2) 텍스트 레이어 슬롯
	// 2) 인터랙티브 레이어 추가  (MapProps 에 있음)
	isUsingHover?: boolean; // 3) 호버/툴팁 사용 여부
	// 4) 맵 이벤트 콜백  (MapProps 에 있음) - onMove, onMouseMove, onMouseOut, onClick 만 해당 컴포넌트에서 사용함
	isUsingMapSearchSelect?: boolean; // 5) 검색 컴포넌트 사용 여부
	addToggleButtonObjectList?: IMapToggleBtn[]; // 6) 추가 토글 버튼 객체 배열
	clickableHjdongList?: any[]; // 7) 클릭 가능한 행정동 리스트
	loadBoundaryDataOnLoad?: boolean;
}

const WrapperDistrictBoundaries = ({
	children,
	textLayerChildren,
	isUsingHover = false,
	isUsingMapSearchSelect = false,
	addToggleButtonObjectList = [],
	clickableHjdongList,
	showWeather = false,
	loadBoundaryDataOnLoad = true,
	...props
}: IWrapperDistrictBoundariesProps) => {
	const [weatherInfoList, setWeatherInfoList] = useState<WeatherInfoItem[]>([]);
	const [isTabActivated, setIsTabActivated] = useState(true);
	// 지도 GL 로드 완료 상태 (렌더링 타이밍 경쟁 조건 방지)
	const [isMapGlReady, setIsMapGlReady] = useState(false);
	// 현재 줌 레벨의 FeatureCollection (디바운스 적용)
	const [currentLevel, setCurrentLevel] = useState<'sido' | 'sgg' | 'dem'>('sido');
	const currentLevelRef = useRef<'sido' | 'sgg' | 'dem'>('sido');
	const moveRafRef = useRef<number | null>(null);
	const latestMoveEventRef = useRef<ViewStateChangeEvent | null>(null);

	// 줌 레벨에 따라 날씨 정보 필터링 후 hjdongCd로 그룹화
	// zoom < 10: sigKorNm이 null인 데이터만 (시/도 전체)
	// zoom >= 10: 모든 데이터 (구 단위 포함)
	const groupedWeatherInfo = useMemo(() => {
		// 1단계: 줌 레벨에 따라 필터링
		const filtered =
			currentLevel === 'sido'
				? weatherInfoList.filter(item => !item.sigKorNm)
				: weatherInfoList.filter(item => item.sigKorNm);

		// 2단계: hjdongCd로 그룹화
		const grouped: {
			[key: string]: {
				hjdongCd: string;
				lonS100: string;
				latS100: string;
				ctpKorNm: string;
				sigKorNm: string | null;
				weatherInfo: WeatherInfoItem[];
			};
		} = {};

		filtered.forEach(item => {
			if (!grouped[item.hjdongCd]) {
				grouped[item.hjdongCd] = {
					hjdongCd: item.hjdongCd,
					lonS100: item.lonS100,
					latS100: item.latS100,
					ctpKorNm: item.ctpKorNm,
					sigKorNm: item.sigKorNm,
					weatherInfo: [],
				};
			}
			grouped[item.hjdongCd].weatherInfo.push(item);
		});

		return Object.values(grouped);
	}, [weatherInfoList, currentLevel]);

	// 첫 번째 그룹의 weatherInfo를 기준으로 시간 목록 생성 (모든 지역이 동일한 시간대를 가짐)
	const availableWeatherList = useMemo(() => {
		if (groupedWeatherInfo.length === 0) return [];
		return groupedWeatherInfo[0].weatherInfo;
	}, [groupedWeatherInfo]);

	// 날씨 정보 조회 (중복 호출 방지)
	const isFetchingWeatherRef = useRef(false);
	const fetchWeatherInfo = () => {
		if (isFetchingWeatherRef.current) return;
		isFetchingWeatherRef.current = true;

		apiTmLocationMonitorPostGetWeatherInfo()
			.then(res => {
				if (res?.data) {
					setWeatherInfoList(res.data);
				}
			})
			.finally(() => {
				isFetchingWeatherRef.current = false;
			});
	};

	// 탭 재활성화 시 호출
	useActivate(() => {
		setIsTabActivated(true);
	});

	useUnactivate(() => {
		setIsTabActivated(false);
		setIsMapGlReady(false);
	});

	// 지도 GL 로드 완료 핸들러 (렌더링 타이밍 경쟁 조건 방지)
	const handleGlLoad = useCallback(() => {
		// requestAnimationFrame을 사용하여 다음 프레임에 렌더링되도록 보장
		requestAnimationFrame(() => {
			setIsMapGlReady(true);
		});
		// 기존 onGlLoad 콜백 호출
		props?.onGlLoad?.();
	}, [props?.onGlLoad]);

	// 기본 인덱스 설정 (최초 1회만)
	const isWeatherIndexInitialized = useRef(false);

	useEffect(() => {
		if (!isWeatherIndexInitialized.current && availableWeatherList.length > 0) {
			const defaultIndex = getDefaultWeatherIndex(availableWeatherList);
			setSelectedWeatherIndex(defaultIndex);
			isWeatherIndexInitialized.current = true;
		}
	}, [availableWeatherList]);

	// 행정경계 데이터 (IndexedDB + 서버)
	const { reload } = useDistrictBoundariesData({ loadBoundaryDataOnLoad }); // 데이터 로딩 트리거
	const listenerSource = useDistrictBoundaryStore(s => s.listenerSource);
	const clear = useDistrictBoundaryStore(s => s.clear);
	const mapId = props?.id || 'wrapper-district-map';
	// 호버 상태
	const { hoveredEventFeature, hoveredFullFeature, pointerXYRef, onMouseMove, onMouseOut, refreshHover, clearHover } =
		useHover(isUsingHover, clickableHjdongList);

	// 컴포넌트 언마운트 시 hover 상태 정리
	useEffect(() => {
		return () => {
			clearHover();
			clear();
		};
	}, [clearHover, clear]);

	const [isShowWeather, setIsShowWeather] = useState(false);
	const [selectedWeatherIndex, setSelectedWeatherIndex] = useState<number>(0);

	// 날씨 토글 핸들러
	const onClickWeatherToggle = useCallback(() => {
		setIsShowWeather(v => {
			const newValue = !v;
			// 토글이 on일 때만 날씨 정보 조회
			if (newValue) {
				fetchWeatherInfo();
			}
			return newValue;
		});
	}, [fetchWeatherInfo]);

	// 경계 토글 + 추가 토글
	const { isShowBoundary, toggleButtons } = useToggleButtons([
		...(showWeather
			? [
					{
						isOn: isShowWeather,
						onToggle: onClickWeatherToggle,
						label: '날씨 표시',
						width: '130px',
					},
			  ]
			: []),
		...addToggleButtonObjectList,
	]);

	useEffect(() => {
		if (loadBoundaryDataOnLoad === false && isShowBoundary) {
			if (listenerSource.sido?.features?.length === 0) reload();
		}
	}, [isShowBoundary, listenerSource, loadBoundaryDataOnLoad]);

	// 검색 상태
	const [searchGeoJson, setSearchGeoJson] = useState<any>(null);
	const maps = useRooutyMap();

	// searchGeoJson 변경 시 해당 위치로 포커싱 (추가)
	useEffect(() => {
		if (!searchGeoJson) return;

		const map = maps[mapId]?.mapbox;
		if (!map) return;

		try {
			const [minLng, minLat, maxLng, maxLat] = turf.bbox(searchGeoJson);
			map.fitBounds(
				[
					[minLng, minLat],
					[maxLng, maxLat],
				],
				{ padding: 60, duration: 700 },
			);
		} catch {
			const c = turf.center(searchGeoJson)?.geometry?.coordinates;
			if (c) {
				map.flyTo({ center: [c[0], c[1]], zoom: 11 });
			}
		}
	}, [searchGeoJson, maps, mapId]);

	// currentLevel에 따른 텍스트 필드 표현식
	const labelTextField = useMemo(() => {
		switch (currentLevel) {
			case 'sido':
				return ['get', 'ctpKorNm'];
			case 'sgg':
				return ['get', 'sigKorNm'];
			case 'dem':
				return ['concat', ['get', 'sigKorNm'], ' ', ['get', 'hjdongNm']];
			default:
				return ['get', 'ctpKorNm'];
		}
	}, [currentLevel]);

	const labelTextSize = useMemo(() => {
		switch (currentLevel) {
			case 'sido':
				return 14;
			case 'sgg':
				return 12;
			default:
				return 10;
		}
	}, [currentLevel]);

	const baseGeojson = useMemo(() => {
		const map = maps[mapId]?.mapbox;
		if (!isShowBoundary || !map) {
			return { type: 'FeatureCollection', features: [] as any[] };
		}
		const sourceData = listenerSource[currentLevel];
		if (!sourceData?.features?.length) {
			return { type: 'FeatureCollection', features: [] as any[] };
		}
		// sido 레벨일 때 광주광역시를 맨 위로 올림
		if (currentLevel === 'sido' && Array.isArray(sourceData.features)) {
			const normal: any[] = [];
			const gwangju: any[] = [];
			for (const f of sourceData.features) {
				if (f?.properties?.ctpKorNm === '광주광역시') {
					gwangju.push(f);
				} else {
					normal.push(f);
				}
			}
			return {
				...sourceData,
				features: [...normal, ...gwangju], // 광주 먼저
			};
		}
		return sourceData;
	}, [listenerSource, currentLevel, isShowBoundary, maps]);

	// 라벨용 Point GeoJSON (미리 계산된 center 좌표 사용)
	// 동일 좌표(centerLng + centerLat)가 여러 개일 경우 fromDate가 최신인 것만 사용
	const labelGeojson = useMemo(() => {
		if (!baseGeojson?.features?.length) {
			return { type: 'FeatureCollection', features: [] };
		}

		const coordMap = new Map<string, any>();

		baseGeojson.features.forEach((feature: any) => {
			const { centerLng, centerLat, ctpKorNm, sigKorNm, hjdongNm, fromDate } = feature.properties || {};

			// center 좌표가 없으면 skip
			if (centerLng == null || centerLat == null) return;

			const coordKey = `${centerLng},${centerLat}`;
			const existing = coordMap.get(coordKey);

			// 같은 좌표가 이미 있으면 fromDate가 더 최신인 것만 유지
			if (existing && existing.properties.fromDate >= (fromDate || '')) return;

			coordMap.set(coordKey, {
				type: 'Feature',
				properties: { ctpKorNm, sigKorNm, hjdongNm, fromDate },
				geometry: {
					type: 'Point',
					coordinates: [centerLng, centerLat],
				},
			});
		});

		return { type: 'FeatureCollection', features: Array.from(coordMap.values()) };
	}, [baseGeojson]);

	const interactiveLayerIds = useMemo(() => {
		const defaults = ['base-fill-layer', 'base-line-layer'];
		const extra = Array.isArray(props?.interactiveLayerIds) ? props?.interactiveLayerIds : [];
		return [...defaults, ...extra];
	}, [props?.interactiveLayerIds]);

	// 호버된 폴리곤 데이터
	const hoveredGeojson = useMemo<IPolygonData>(() => {
		if (!hoveredFullFeature) return { type: 'FeatureCollection', features: [] };
		return { type: 'FeatureCollection', features: [hoveredFullFeature] };
	}, [hoveredFullFeature]);

	// 검색된 폴리곤 데이터
	const searchedGeojson = useMemo<IPolygonData>(() => {
		// 검색 안 되어 있으면 빈 컬렉션
		if (!searchGeoJson) {
			return { type: 'FeatureCollection', features: [] };
		}

		// MapSearchSelect 에서 넘겨주는 건 Feature 이므로 그대로 사용
		if (searchGeoJson.type === 'Feature') {
			return { type: 'FeatureCollection', features: [searchGeoJson] };
		}

		// 혹시 나중에 FeatureCollection 을 넘기게 될 경우 대비
		if (searchGeoJson.type === 'FeatureCollection') {
			return searchGeoJson as IPolygonData;
		}

		return { type: 'FeatureCollection', features: [] };
	}, [searchGeoJson]);

	// 이벤트 래핑 (내부 처리 + 외부 콜백)
	const handleMoveWrapped = useCallback(
		(event: ViewStateChangeEvent) => {
			latestMoveEventRef.current = event;
			if (moveRafRef.current !== null) return;
			moveRafRef.current = requestAnimationFrame(() => {
				moveRafRef.current = null;
				const latestEvent = latestMoveEventRef.current;
				if (!latestEvent) return;

				props?.onMove?.(latestEvent);
				const level = getRegionLevel(latestEvent.viewState.zoom);
				if (level !== currentLevelRef.current) {
					currentLevelRef.current = level;
					setCurrentLevel(level);
				}
			});
		},
		[props?.onMove],
	);

	const handleMouseMoveWrapped = useCallback(
		(event: MapEvent) => {
			onMouseMove(event);
			if (props?.onMouseMove) {
				props.onMouseMove(event);
			}
		},
		[onMouseMove, props?.onMouseMove],
	);

	const handleWheelWrapped = useCallback(
		(event: MapWheelEvent) => {
			// 외부 onWheel 먼저 호출
			if (props?.onWheel) {
				props.onWheel(event);
			}

			const map = maps[mapId]?.mapbox;
			if (!map) return;

			// 이번 휠로 인한 이동/줌이 끝난 뒤, 마지막 마우스 위치 기준으로 hover 다시 계산
			map.once('moveend', () => {
				refreshHover(map);
			});
		},
		[maps, refreshHover, props?.onWheel],
	);

	const handleMouseOutWrapped = useCallback(
		(event: MapEvent) => {
			onMouseOut(event);
			if (props?.onMouseOut) {
				props.onMouseOut(event);
			}
		},
		[onMouseOut, props?.onMouseOut],
	);

	useEffect(() => {
		currentLevelRef.current = currentLevel;
	}, [currentLevel]);

	useEffect(() => {
		return () => {
			if (moveRafRef.current !== null) {
				cancelAnimationFrame(moveRafRef.current);
			}
		};
	}, []);

	return (
		<>
			{isUsingMapSearchSelect && (
				<MapSearchSelect listenerSource={listenerSource} setSearchGeoJson={setSearchGeoJson} />
			)}

			{isTabActivated && (
				<RooutyMap
					{...props}
					id={mapId}
					clientId={VITE_NAVER_MAPS_API_KEY}
					style={{ width: '100%', height: '100%', ...props?.style }}
					onMove={handleMoveWrapped}
					onMouseMove={handleMouseMoveWrapped}
					onWheel={handleWheelWrapped}
					onMouseOut={handleMouseOutWrapped}
					onGlLoad={handleGlLoad}
					interactiveLayerIds={interactiveLayerIds}
				>
					{/* 날씨 시간 선택 UI */}
					{isShowWeather && (
						<WeatherTimeSelector
							weatherList={availableWeatherList}
							hasWeatherData={weatherInfoList.length > 0}
							selectedIndex={selectedWeatherIndex}
							onIndexChange={setSelectedWeatherIndex}
						/>
					)}

					{isShowWeather &&
						groupedWeatherInfo.map(weather => {
							// selectedWeatherIndex에 해당하는 날씨 가져오기
							const matchedWeather = weather.weatherInfo[selectedWeatherIndex];
							if (!matchedWeather) return null;

							return (
								<Marker key={weather.hjdongCd} longitude={Number(weather.lonS100)} latitude={Number(weather.latS100)}>
									<WeatherMarker weather={matchedWeather} />
								</Marker>
							);
						})}

					<Source id="base-source" type="geojson" data={baseGeojson as any}>
						{/* 1) Base: 경계 토글 */}
						<Layer
							id="base-fill-layer"
							type="fill"
							paint={{
								'fill-color': BasePloygonLayerStyle.fillColor,
							}}
						/>
						<Layer
							id="base-line-layer"
							type="line"
							paint={{
								'line-color': BasePloygonLayerStyle.lineColor,
								'line-width': BasePloygonLayerStyle.lineWidth,
							}}
						/>
					</Source>

					{/* 2) Base: 텍스트 라벨 (Point 기반 - 폴리곤 크기와 무관하게 항상 표시) */}
					<Source id="label-source" type="geojson" data={labelGeojson as any}>
						<Layer
							id="base-label-layer"
							type="symbol"
							layout={{
								'text-field': labelTextField as any,
								'text-size': labelTextSize,
								'text-anchor': 'center',
								'text-allow-overlap': true,
								'text-ignore-placement': true,
							}}
							paint={{
								'text-color': '#333333',
								'text-halo-color': '#ffffff',
								'text-halo-width': 1.5,
							}}
						/>
					</Source>

					{/* 1)폴리곤 → 2)폴리라인 → 3)마커(마커는 deckgl 로 처리) → 4)텍스트  */}
					{children}

					<Source id="hover-source" type="geojson" data={hoveredGeojson}>
						{/* 2) Hovered: 단일 코드 일치 */}
						<Layer
							id="hovered-fill-layer"
							type="fill"
							paint={{
								'fill-color': SelectedPloygonLayerStyle.fillColor,
								'fill-opacity': hoveredGeojson.features.length > 0 ? 1 : 0,
							}}
						/>
						<Layer
							id="hovered-line-layer"
							type="line"
							paint={{
								'line-color': SelectedPloygonLayerStyle.lineColor,
								'line-width': hoveredGeojson.features.length > 0 ? SelectedPloygonLayerStyle.lineWidth : 0,
							}}
						/>
					</Source>

					<Source id="searched-source" type="geojson" data={searchedGeojson}>
						{/* 3) Searched: 다중 코드 포함 */}
						<Layer
							id="searched-fill-layer"
							type="fill"
							paint={{
								'fill-color': SelectedPloygonLayerStyle.fillColor,
								'fill-opacity': searchedGeojson.features.length > 0 ? 1 : 0,
							}}
						/>
						<Layer
							id="searched-line-layer"
							type="line"
							paint={{
								'line-color': SelectedPloygonLayerStyle.lineColor,
								'line-width': searchedGeojson.features.length > 0 ? SelectedPloygonLayerStyle.lineWidth : 0,
							}}
						/>
					</Source>

					{/* 4) Text: 텍스트 레이어 */}
					{textLayerChildren}

					{/* 토글 버튼 - 지도 GL 로드 완료 후 렌더링 (렌더링 타이밍 경쟁 조건 방지) */}
					{isMapGlReady && <MapToggleBtn addToggleButtonObjectList={toggleButtons} />}

					{pointerXYRef.current && hoveredEventFeature && isUsingHover && (
						<MapToolTip
							hoveredObject={hoveredEventFeature}
							position={pointerXYRef.current}
							currentLevel={currentLevel}
						/>
					)}
				</RooutyMap>
			)}
		</>
	);
};

export default WrapperDistrictBoundaries;
