'use client';

import Link from 'next/link';
import { useState } from 'react';

// 출발지 옵션
const ORIGIN_OPTIONS = [
  { id: 'kr', name: '한국' },
  { id: 'cn', name: '중국' }
];

// 항구 옵션
const PORT_OPTIONS = [
  { id: 'sav', name: 'SAV - 사바나', country: 'us' },
  { id: 'lgb', name: 'LGB - 롱비치', country: 'us' },
  { id: 'mob', name: 'MOB - 모빌', country: 'us' }
];

type ShippingTimeKey = 'kr-sav' | 'kr-lgb' | 'kr-mob' | 'cn-sav' | 'cn-lgb' | 'cn-mob';
type PortKey = 'sav' | 'lgb' | 'mob';

// 실제 소요일 데이터로 업데이트 (해상 운송)
const SHIPPING_TIMES: Record<ShippingTimeKey, { min: number; max: number; avg: number }> = {
  'kr-sav': { min: 28, max: 32, avg: 30 },
  'kr-lgb': { min: 20, max: 24, avg: 22 },
  'kr-mob': { min: 31, max: 35, avg: 33 },
  'cn-sav': { min: 32, max: 36, avg: 34 },
  'cn-lgb': { min: 22, max: 26, avg: 24 },
  'cn-mob': { min: 36, max: 40, avg: 38 }
};

// 내륙 운송 시간 (항구에서 Tennessee까지)
const INLAND_TIMES: Record<PortKey, { min: number; max: number; avg: number }> = {
  'sav': { min: 1, max: 3, avg: 2 },
  'lgb': { min: 5, max: 7, avg: 6 },
  'mob': { min: 1, max: 2, avg: 1 }
};

interface EstimateResult {
  origin: string;
  port: string;
  destination: string;
  oceanTransit: { min: number; max: number; avg: number };
  inlandTransit: { min: number; max: number; avg: number };
  total: { min: number; max: number; avg: number };
}

export default function ShippingEstimatePage() {
  const [origin, setOrigin] = useState('');
  const [port, setPort] = useState('');
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // 소요일 계산하기
  const calculateShippingTime = () => {
    if (!origin || !port) {
      alert('출발지와 항구를 모두 선택해주세요.');
      return;
    }

    setIsCalculating(true);
    
    // 실제로는 API 호출이 필요할 수 있음
    setTimeout(() => {
      const key = `${origin}-${port}` as ShippingTimeKey;
      const portKey = port as PortKey;
      const shippingTime = SHIPPING_TIMES[key];
      const inlandTime = INLAND_TIMES[portKey];
      
      setResult({
        origin: ORIGIN_OPTIONS.find(o => o.id === origin)?.name || '',
        port: PORT_OPTIONS.find(p => p.id === port)?.name || '',
        destination: 'SL Tennessee',
        oceanTransit: shippingTime,
        inlandTransit: inlandTime,
        total: {
          min: shippingTime.min + inlandTime.min,
          max: shippingTime.max + inlandTime.max,
          avg: shippingTime.avg + inlandTime.avg
        }
      });
      
      setIsCalculating(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-800">선적 소요일 예상</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
        <p className="text-gray-600 mt-2">출발지와 항구를 선택하여 Tennessee까지의 예상 소요일을 확인하세요</p>
        <p className="text-blue-600 font-medium mt-1">실제 소요일 데이터 기반으로 계산됩니다</p>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">출발지</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            >
              <option value="">출발지 선택</option>
              {ORIGIN_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-medium">도착 항구</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg bg-white"
              value={port}
              onChange={(e) => setPort(e.target.value)}
            >
              <option value="">항구 선택</option>
              {PORT_OPTIONS.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <button 
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400"
            onClick={calculateShippingTime}
            disabled={isCalculating}
          >
            {isCalculating ? '계산 중...' : '소요일 계산하기'}
          </button>
        </div>
      </div>

      {result && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">소요일 예상 결과</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border-r pr-4">
              <p className="text-gray-600"><strong>출발지:</strong> {result.origin}</p>
              <p className="text-gray-600"><strong>도착 항구:</strong> {result.port}</p>
              <p className="text-gray-600"><strong>최종 목적지:</strong> {result.destination}</p>
            </div>
            
            <div>
              <p className="text-gray-600"><strong>해상 운송:</strong> {result.oceanTransit.min}~{result.oceanTransit.max}일 (평균: {result.oceanTransit.avg}일)</p>
              <p className="text-gray-600"><strong>내륙 운송:</strong> {result.inlandTransit.min}~{result.inlandTransit.max}일 (평균: {result.inlandTransit.avg}일)</p>
              <p className="text-gray-700 font-bold"><strong>총 소요일:</strong> {result.total.min}~{result.total.max}일 (평균: {result.total.avg}일)</p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 mb-2">참고 사항</h3>
            <ul className="list-disc pl-5 text-gray-600 space-y-1">
              <li>위 소요일은 실제 운송 데이터를 기반으로 한 예상치입니다.</li>
              <li>해상 운송은 출항일로부터 입항일까지의 기간입니다.</li>
              <li>내륙 운송은 항구에서 SL Tennessee까지의 운송 기간입니다.</li>
              <li>기상 조건, 항만 혼잡도, 통관 절차 등이 소요일에 영향을 줄 수 있습니다.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
} 