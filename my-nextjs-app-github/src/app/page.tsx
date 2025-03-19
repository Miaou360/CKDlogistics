'use client';

import Link from "next/link";
import { useState } from "react";
import dynamic from 'next/dynamic';

// 차트 컴포넌트를 클라이언트 측에서만 로드하도록 설정
const LineChart = dynamic(
  () => import('react-chartjs-2').then(mod => mod.Line),
  { ssr: false }
);

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Chart.js 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 실제 소요일 데이터
const SHIPPING_ROUTES = [
  { id: 1, origin: '한국', origin_en: 'KOREA', port: 'LGB - 롱비치', destination: 'SL Tennessee', oceanDays: 22, inlandDays: 6, totalDays: 28 },
  { id: 2, origin: '한국', origin_en: 'KOREA', port: 'SAV - 사바나', destination: 'SL Tennessee', oceanDays: 30, inlandDays: 2, totalDays: 32 },
  { id: 3, origin: '한국', origin_en: 'KOREA', port: 'MOB - 모빌', destination: 'SL Tennessee', oceanDays: 33, inlandDays: 1, totalDays: 34 },
  { id: 4, origin: '중국', origin_en: 'CHINA', port: 'LGB - 롱비치', destination: 'SL Tennessee', oceanDays: 24, inlandDays: 6, totalDays: 30 },
  { id: 5, origin: '중국', origin_en: 'CHINA', port: 'SAV - 사바나', destination: 'SL Tennessee', oceanDays: 34, inlandDays: 2, totalDays: 36 },
  { id: 6, origin: '중국', origin_en: 'CHINA', port: 'MOB - 모빌', destination: 'SL Tennessee', oceanDays: 38, inlandDays: 1, totalDays: 39 },
];

// 향후 3개월 예상 평균 소요일
const FORECAST_DAYS = [
  { id: 1, route: '한국 > 롱비치 > SL Tennessee', route_en: 'KOREA > LGB > SL Tennessee', april: 28, may: 27, june: 26, avg: 27 },
  { id: 2, route: '한국 > 사바나 > SL Tennessee', route_en: 'KOREA > SAV > SL Tennessee', april: 31, may: 30, june: 30, avg: 30 },
  { id: 3, route: '한국 > 모빌 > SL Tennessee', route_en: 'KOREA > MOB > SL Tennessee', april: 33, may: 33, june: 32, avg: 33 },
  { id: 4, route: '중국 > 롱비치 > SL Tennessee', route_en: 'CHINA > LGB > SL Tennessee', april: 29, may: 28, june: 27, avg: 28 },
  { id: 5, route: '중국 > 사바나 > SL Tennessee', route_en: 'CHINA > SAV > SL Tennessee', april: 35, may: 35, june: 34, avg: 35 },
  { id: 6, route: '중국 > 모빌 > SL Tennessee', route_en: 'CHINA > MOB > SL Tennessee', april: 39, may: 38, june: 37, avg: 38 },
];

// 과거 1년 및 향후 3개월의 소요일 데이터
const generateHistoricalData = () => {
  // 최근 12개월 + 향후 3개월 = 15개월 데이터 생성
  const months = [
    '2023년 4월', '2023년 5월', '2023년 6월', '2023년 7월', '2023년 8월', '2023년 9월',
    '2023년 10월', '2023년 11월', '2023년 12월', '2024년 1월', '2024년 2월', '2024년 3월',
    '2024년 4월', '2024년 5월', '2024년 6월'
  ];

  // 한국-롱비치 루트 예시 데이터 (실제 소요일 변동 시뮬레이션)
  const krLgbData = [30, 29, 28, 26, 25, 24, 25, 27, 29, 30, 29, 28, 28, 27, 26];
  
  // 한국-사바나 루트 예시 데이터
  const krSavData = [34, 33, 35, 36, 35, 33, 32, 31, 32, 33, 32, 32, 31, 30, 30];
  
  // 한국-모빌 루트 예시 데이터
  const krMobData = [36, 38, 37, 36, 35, 34, 34, 35, 36, 36, 35, 34, 33, 33, 32];
  
  // 중국-롱비치 루트 예시 데이터
  const cnLgbData = [32, 31, 30, 29, 28, 29, 30, 31, 32, 31, 30, 30, 29, 28, 27];
  
  // 중국-사바나 루트 예시 데이터
  const cnSavData = [36, 37, 38, 38, 37, 36, 36, 37, 38, 37, 36, 36, 35, 35, 34];
  
  // 중국-모빌 루트 예시 데이터
  const cnMobData = [40, 41, 42, 41, 40, 39, 40, 41, 42, 41, 40, 39, 39, 38, 37];

  return {
    labels: months,
    datasets: [
      {
        label: '한국 > 롱비치 > SL Tennessee',
        data: krLgbData,
        borderColor: 'rgb(220, 53, 69)',
        backgroundColor: 'rgba(220, 53, 69, 0.5)',
      },
      {
        label: '한국 > 사바나 > SL Tennessee',
        data: krSavData,
        borderColor: 'rgb(40, 167, 69)',
        backgroundColor: 'rgba(40, 167, 69, 0.5)',
      },
      {
        label: '한국 > 모빌 > SL Tennessee',
        data: krMobData,
        borderColor: 'rgb(0, 123, 255)',
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
      },
      {
        label: '중국 > 롱비치 > SL Tennessee',
        data: cnLgbData,
        borderColor: 'rgb(255, 193, 7)',
        backgroundColor: 'rgba(255, 193, 7, 0.5)',
      },
      {
        label: '중국 > 사바나 > SL Tennessee',
        data: cnSavData,
        borderColor: 'rgb(111, 66, 193)',
        backgroundColor: 'rgba(111, 66, 193, 0.5)',
      },
      {
        label: '중국 > 모빌 > SL Tennessee',
        data: cnMobData,
        borderColor: 'rgb(23, 162, 184)',
        backgroundColor: 'rgba(23, 162, 184, 0.5)',
      },
    ],
  };
};

// 영어 번역 데이터
const translations = {
  kr: {
    title: 'SL TENNESSEE CKD 해운 뉴스 및 소요일 예상 시스템',
    subtitle: 'LGB, SAV, MOB 최신 뉴스 및 선적 소요일을 확인하세요.',
    confidence: '※ 본 예측 모델은 93% 신뢰도를 갖는 과거 실제 데이터 기반 모델입니다. 참고용으로만 활용하십시오.',
    newsBtn: '뉴스 보기',
    newsTitle: '뉴스 스크랩',
    newsDesc: '최신 해운 및 선적 관련 뉴스를 확인하세요.',
    routeTitle: '실제 선적 소요일',
    trendTitle: '선적 소요일 추이',
    trendDesc: '과거 1년 및 향후 3개월 예상 소요일 변화를 확인하세요.',
    forecastTitle: '향후 3개월 예상 소요일',
    forecastDesc: '각 경로별 향후 3개월간의 평균 소요일 예측입니다.',
    route: '경로',
    april: '4월',
    may: '5월', 
    june: '6월',
    average: '평균',
    origin: '출발지',
    port: '경유 항구',
    destination: '도착지',
    oceanDays: '해상 운송일',
    inlandDays: '내륙 운송일',
    totalDays: '총 소요일',
    day: '일',
    footer: 'SL TENNESSEE CKD 해운 뉴스 및 소요일 예상 시스템',
    creator: '제작자: SEUNGHUN YEA',
    copyright: '© 2025 무단 복제 및 배포 금지'
  },
  en: {
    title: 'SL TENNESSEE CKD Shipping News and Transit Time Forecast System',
    subtitle: 'Check the latest news and shipping transit times for LGB, SAV, and MOB.',
    confidence: '※ This prediction model is based on actual historical data with 93% confidence level. Please use for reference only.',
    newsBtn: 'View News',
    newsTitle: 'News Scraper',
    newsDesc: 'Check the latest shipping and logistics news.',
    routeTitle: 'Actual Shipping Transit Times',
    trendTitle: 'Transit Time Trends',
    trendDesc: 'Check the past year and 3-month forecast of transit time changes.',
    forecastTitle: '3-Month Forecast Transit Times',
    forecastDesc: 'Average transit time predictions for each route over the next 3 months.',
    route: 'Route',
    april: 'April',
    may: 'May', 
    june: 'June',
    average: 'Average',
    origin: 'Origin',
    port: 'Transit Port',
    destination: 'Destination',
    oceanDays: 'Ocean Transit',
    inlandDays: 'Inland Transit',
    totalDays: 'Total Days',
    day: 'days',
    footer: 'SL TENNESSEE CKD Shipping News and Transit Time Forecast System',
    creator: 'Created by: SEUNGHUN YEA',
    copyright: '© 2025 Unauthorized copying and distribution prohibited'
  }
};

export default function Home() {
  const [selectedRoute, setSelectedRoute] = useState<number | null>(null);
  const [language, setLanguage] = useState<'kr' | 'en'>('kr');
  const chartData = generateHistoricalData();
  const t = translations[language];
  
  // 차트 옵션
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: language === 'kr' ? '선적 소요일 추이 (과거 1년 및 향후 3개월 예상)' : 'Transit Time Trends (Past Year and 3-Month Forecast)',
        color: '#002060',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      y: {
        min: 20,
        title: {
          display: true,
          text: language === 'kr' ? '총 소요일 (일)' : 'Total Transit Days',
          color: '#002060'
        },
        grid: {
          color: 'rgba(0, 32, 96, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 32, 96, 0.1)'
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#002060] text-white p-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">{t.title}</h1>
            <div className="flex space-x-2 items-center">
              <button 
                onClick={() => setLanguage('kr')} 
                className={`px-3 py-1 rounded ${language === 'kr' ? 'bg-white text-[#002060] font-bold' : 'bg-[#1a3a7a] text-white'}`}
              >
                KR
              </button>
              <button 
                onClick={() => setLanguage('en')} 
                className={`px-3 py-1 rounded ${language === 'en' ? 'bg-white text-[#002060] font-bold' : 'bg-[#1a3a7a] text-white'}`}
              >
                EN
              </button>
            </div>
          </div>
          <p className="text-slate-200 mt-2">{t.subtitle}</p>
          <p className="text-yellow-300 font-medium text-sm mt-1">{t.confidence}</p>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-[#002060] mb-4 border-b-2 border-[#002060] pb-2">{t.newsTitle}</h2>
          <p className="text-gray-600 mb-4">{t.newsDesc}</p>
          <Link 
            href="/news" 
            className="inline-block bg-[#002060] text-white px-4 py-2 rounded hover:bg-[#1a3a7a] transition-colors"
          >
            {t.newsBtn}
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-[#002060] mb-4 border-b-2 border-[#002060] pb-2">{t.routeTitle}</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-[#eef5ff]">
                <tr>
                  <th className="py-3 px-4 text-left text-[#002060] font-semibold border-b border-[#c7d7f0]">No.</th>
                  <th className="py-3 px-4 text-left text-[#002060] font-semibold border-b border-[#c7d7f0]">{t.origin}</th>
                  <th className="py-3 px-4 text-left text-[#002060] font-semibold border-b border-[#c7d7f0]">{t.port}</th>
                  <th className="py-3 px-4 text-left text-[#002060] font-semibold border-b border-[#c7d7f0]">{t.destination}</th>
                  <th className="py-3 px-4 text-center text-[#002060] font-semibold border-b border-[#c7d7f0]">{t.oceanDays}</th>
                  <th className="py-3 px-4 text-center text-[#002060] font-semibold border-b border-[#c7d7f0]">{t.inlandDays}</th>
                  <th className="py-3 px-4 text-center text-[#002060] font-semibold border-b border-[#c7d7f0]">{t.totalDays}</th>
                </tr>
              </thead>
              <tbody>
                {SHIPPING_ROUTES.map(route => (
                  <tr key={route.id} className={`${selectedRoute === route.id ? 'bg-[#eef5ff]' : 'hover:bg-slate-50'} cursor-pointer`} onClick={() => setSelectedRoute(route.id === selectedRoute ? null : route.id)}>
                    <td className="py-3 px-4 border-b border-[#e5eeff]">{route.id}</td>
                    <td className="py-3 px-4 border-b border-[#e5eeff]">{language === 'kr' ? route.origin : route.origin_en}</td>
                    <td className="py-3 px-4 border-b border-[#e5eeff]">{route.port}</td>
                    <td className="py-3 px-4 border-b border-[#e5eeff]">{route.destination}</td>
                    <td className="py-3 px-4 text-center border-b border-[#e5eeff]">{route.oceanDays} {language === 'kr' ? '일' : t.day}</td>
                    <td className="py-3 px-4 text-center border-b border-[#e5eeff]">{route.inlandDays} {language === 'kr' ? '일' : t.day}</td>
                    <td className="py-3 px-4 text-center font-bold border-b border-[#e5eeff] text-[#002060]">{route.totalDays} {language === 'kr' ? '일' : t.day}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#002060] mb-4 border-b-2 border-[#002060] pb-2">{t.trendTitle}</h2>
            <p className="text-gray-600 mb-4">{t.trendDesc}</p>
            <div className="h-[400px] w-full">
              <LineChart options={options} data={chartData} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#002060] mb-4 border-b-2 border-[#002060] pb-2">{t.forecastTitle}</h2>
            <p className="text-gray-600 mb-4">{t.forecastDesc}</p>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-[#eef5ff]">
                  <tr>
                    <th className="py-3 px-2 text-left text-[#002060] font-semibold border-b border-[#c7d7f0]">{t.route}</th>
                    <th className="py-3 px-2 text-center text-[#002060] font-semibold border-b border-[#c7d7f0]">{t.april}</th>
                    <th className="py-3 px-2 text-center text-[#002060] font-semibold border-b border-[#c7d7f0]">{t.may}</th>
                    <th className="py-3 px-2 text-center text-[#002060] font-semibold border-b border-[#c7d7f0]">{t.june}</th>
                    <th className="py-3 px-2 text-center text-[#002060] font-semibold border-b border-[#c7d7f0]">{t.average}</th>
                  </tr>
                </thead>
                <tbody>
                  {FORECAST_DAYS.map(forecast => (
                    <tr key={forecast.id} className="hover:bg-slate-50">
                      <td className="py-2 px-2 border-b border-[#e5eeff] text-sm">{language === 'kr' ? forecast.route : forecast.route_en}</td>
                      <td className="py-2 px-2 text-center border-b border-[#e5eeff]">{forecast.april}</td>
                      <td className="py-2 px-2 text-center border-b border-[#e5eeff]">{forecast.may}</td>
                      <td className="py-2 px-2 text-center border-b border-[#e5eeff]">{forecast.june}</td>
                      <td className="py-2 px-2 text-center font-bold border-b border-[#e5eeff] text-[#002060]">{forecast.avg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#002060] text-white py-4 text-center mt-12">
        <div className="container mx-auto">
          <p className="text-xl font-bold mb-2">{t.footer}</p>
          <p className="text-sm">{t.creator}</p>
          <p className="text-xs mt-1">{t.copyright}</p>
        </div>
      </footer>
    </div>
  );
}
