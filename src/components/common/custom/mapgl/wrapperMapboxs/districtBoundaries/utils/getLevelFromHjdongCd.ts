// hjdongCd 패턴으로 레벨 추론
export function getLevelFromHjdongCd(code?: string): 'sido' | 'sgg' | 'dem' {
  if (!code || code.length !== 10) return 'dem';

  const sggPart = code.slice(2, 5);  // 시군구 3자리
  const demPart = code.slice(5, 10); // 행정동 5자리

  // [시도2][000][00000]
  if (sggPart === '000' && demPart === '00000') return 'sido';

  // [시도2][시군구3][00000]
  if (demPart === '00000') return 'sgg';

  // 나머지는 행정동
  return 'dem';
}