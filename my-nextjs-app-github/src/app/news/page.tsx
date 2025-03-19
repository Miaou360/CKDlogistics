'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaHome } from 'react-icons/fa';

// 임시 뉴스 데이터
const DUMMY_NEWS = [
  {
    id: 1,
    title: '한국-미국 해운 노선 운임 상승세',
    title_en: 'Korea-US Shipping Route Rates on the Rise',
    source: '해운뉴스',
    date: '2024-03-18',
    ports: ['LGB', 'SAV', 'MOB'],
    summary: '최근 한국에서 미국으로 향하는 해운 노선의 운임이 지속적으로 상승하고 있습니다. 이는 연료비 증가와 수요 증가가 주요 원인으로 분석됩니다.',
    summary_en: 'Shipping rates from Korea to the US have been continuously rising recently. This is mainly attributed to increased fuel costs and growing demand.',
    url: '#'
  },
  {
    id: 2,
    title: '롱비치 항만 물동량 20% 증가',
    title_en: 'Long Beach Port Volume Increases by 20%',
    source: '미국 항만 저널',
    date: '2024-03-15',
    ports: ['LGB'],
    summary: '미국 롱비치 항구의 물동량이 전년 대비 20% 증가했습니다. 코로나 이후 수요 회복과 공급망 정상화가 주요 원인입니다.',
    summary_en: 'The cargo volume at the Port of Long Beach has increased by 20% compared to the previous year. Post-COVID demand recovery and supply chain normalization are the main factors.',
    url: '#'
  },
  {
    id: 3,
    title: '중국발 컨테이너 선박 지연 문제 지속',
    title_en: 'Delays in Container Ships from China Continue',
    source: '글로벌 물류 타임즈',
    date: '2024-03-12',
    ports: ['LGB', 'SAV', 'MOB'],
    summary: '중국 주요 항구에서 출발하는 컨테이너 선박의 지연 문제가 지속되고 있습니다. 이로 인해 글로벌 공급망에 추가적인 부담이 발생하고 있습니다.',
    summary_en: 'Delays in container ships departing from major Chinese ports continue to persist. This is causing additional strain on the global supply chain.',
    url: '#'
  },
  {
    id: 4,
    title: '사바나 항구, 확장 공사 완료 예정',
    title_en: 'Savannah Port Expansion Project Nears Completion',
    source: '항만 물류 신문',
    date: '2024-03-10',
    ports: ['SAV'],
    summary: '미국 사바나 항구의 확장 공사가 올해 말 완료될 예정입니다. 이를 통해 대형 선박의 입항이 가능해지고 처리 용량이 30% 증가할 것으로 예상됩니다.',
    summary_en: 'The expansion project at the Port of Savannah is expected to be completed by the end of this year. This will allow larger vessels to enter and increase processing capacity by 30%.',
    url: '#'
  },
  {
    id: 5,
    title: '모빌 항구, 새로운 자동화 시스템 도입',
    title_en: 'Mobile Port Introduces New Automation System',
    source: '물류 기술 저널',
    date: '2024-03-08',
    ports: ['MOB'],
    summary: '미국 모빌 항구에서 새로운 자동화 시스템을 도입했습니다. 이를 통해 화물 처리 시간이 40% 단축될 것으로 기대됩니다.',
    summary_en: 'The Port of Mobile has introduced a new automation system. This is expected to reduce cargo processing time by 40%.',
    url: '#'
  },
  {
    id: 6,
    title: '롱비치 항만, 환경 친화적인 선박 인센티브 확대',
    title_en: 'Long Beach Port Expands Green Ship Incentives',
    source: '환경 물류 뉴스',
    date: '2024-03-05',
    ports: ['LGB'],
    summary: '롱비치 항만은 환경 친화적인 선박에 대한 인센티브 프로그램을 확대한다고 발표했습니다. 이를 통해 친환경 선박의 입항을 촉진하고 항만 지역의 대기 오염을 줄이는 것을 목표로 합니다.',
    summary_en: 'Port of Long Beach has announced an expansion of its incentive program for environmentally friendly vessels. This aims to promote the use of green ships and reduce air pollution in the port area.',
    url: '#'
  },
  {
    id: 7,
    title: '사바나 항구, 신규 컨테이너 터미널 개장',
    title_en: 'New Container Terminal Opens at Savannah Port',
    source: '항만 개발 저널',
    date: '2024-03-02',
    ports: ['SAV'],
    summary: '사바나 항구에 새로운 컨테이너 터미널이 개장했습니다. 이 터미널은 최신 기술을 도입하여 처리 효율성을 30% 향상시켰습니다.',
    summary_en: 'A new container terminal has opened at the Port of Savannah. The terminal incorporates the latest technology, improving processing efficiency by 30%.',
    url: '#'
  }
];

// 영어 번역 데이터
const translations = {
  kr: {
    title: 'SL TENNESSEE CKD 해운 뉴스',
    subtitle: '최신 해운 및 물류 관련 뉴스',
    homeLink: '홈으로 돌아가기',
    searchPlaceholder: '뉴스 검색...',
    noResults: '검색 결과가 없습니다.',
    readMore: '자세히 보기 →',
    filter: '필터',
    filterAll: '전체',
    filterLGB: 'LGB - 롱비치',
    filterSAV: 'SAV - 사바나',
    filterMOB: 'MOB - 모빌',
    sort: '정렬',
    sortLatest: '최신순',
    sortOldest: '오래된순',
    footer: 'SL TENNESSEE CKD 해운 뉴스 및 소요일 예상 시스템',
    creator: '제작자: SEUNGHUN YEA',
    copyright: '© 2025 무단 복제 및 배포 금지'
  },
  en: {
    title: 'SL TENNESSEE CKD Shipping News',
    subtitle: 'Latest Shipping and Logistics News',
    homeLink: 'Return to Home',
    searchPlaceholder: 'Search news...',
    noResults: 'No search results found.',
    readMore: 'Read More →',
    filter: 'Filter',
    filterAll: 'All',
    filterLGB: 'LGB - Long Beach',
    filterSAV: 'SAV - Savannah',
    filterMOB: 'MOB - Mobile',
    sort: 'Sort',
    sortLatest: 'Latest',
    sortOldest: 'Oldest',
    footer: 'SL TENNESSEE CKD Shipping News and Transit Time Forecast System',
    creator: 'Created by: SEUNGHUN YEA',
    copyright: '© 2025 Unauthorized copying and distribution prohibited'
  }
};

export default function NewsPage() {
  const [news, setNews] = useState(DUMMY_NEWS);
  const [searchTerm, setSearchTerm] = useState('');
  const [language, setLanguage] = useState<'kr' | 'en'>('kr');
  const [portFilter, setPortFilter] = useState<'ALL' | 'LGB' | 'SAV' | 'MOB'>('ALL');
  const [sortOrder, setSortOrder] = useState<'latest' | 'oldest'>('latest');
  const t = translations[language];
  
  // 뉴스 정렬 및 필터링
  const filteredAndSortedNews = () => {
    // 검색어 필터링
    let result = news.filter(item => {
      const titleToSearch = language === 'kr' ? item.title : item.title_en;
      const summaryToSearch = language === 'kr' ? item.summary : item.summary_en;
      
      return (
        titleToSearch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summaryToSearch.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    
    // 항구 필터링
    if (portFilter !== 'ALL') {
      result = result.filter(item => item.ports.includes(portFilter));
    }
    
    // 날짜 정렬
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.date.split('.').reverse().join('-'));
      const dateB = new Date(b.date.split('.').reverse().join('-'));
      
      return sortOrder === 'latest' 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });
    
    return result;
  };
  
  const filteredNews = filteredAndSortedNews();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-[#002060] text-white p-6 shadow-md">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
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
          
          <div className="flex justify-between items-center">
            <p className="text-slate-200 mt-2">{t.subtitle}</p>
            <Link href="/" className="text-white hover:text-yellow-300 transition-colors flex items-center">
              <FaHome className="mr-2" />
              <span className="border-b border-dashed border-white">{t.homeLink}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="col-span-3 md:col-span-1">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                className="w-full p-3 border border-[#c7d7f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002060]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="md:col-span-1">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-[#002060]">{t.filter}</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setPortFilter('ALL')} 
                    className={`px-3 py-1 text-sm rounded-full ${portFilter === 'ALL' ? 'bg-[#002060] text-white' : 'bg-[#eef5ff] text-[#002060]'}`}
                  >
                    {t.filterAll}
                  </button>
                  <button 
                    onClick={() => setPortFilter('LGB')} 
                    className={`px-3 py-1 text-sm rounded-full ${portFilter === 'LGB' ? 'bg-[#002060] text-white' : 'bg-[#eef5ff] text-[#002060]'}`}
                  >
                    {t.filterLGB}
                  </button>
                  <button 
                    onClick={() => setPortFilter('SAV')} 
                    className={`px-3 py-1 text-sm rounded-full ${portFilter === 'SAV' ? 'bg-[#002060] text-white' : 'bg-[#eef5ff] text-[#002060]'}`}
                  >
                    {t.filterSAV}
                  </button>
                  <button 
                    onClick={() => setPortFilter('MOB')} 
                    className={`px-3 py-1 text-sm rounded-full ${portFilter === 'MOB' ? 'bg-[#002060] text-white' : 'bg-[#eef5ff] text-[#002060]'}`}
                  >
                    {t.filterMOB}
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-1">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium text-[#002060]">{t.sort}</label>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSortOrder('latest')} 
                    className={`px-4 py-1 text-sm rounded-full ${sortOrder === 'latest' ? 'bg-[#002060] text-white' : 'bg-[#eef5ff] text-[#002060]'}`}
                  >
                    {t.sortLatest}
                  </button>
                  <button 
                    onClick={() => setSortOrder('oldest')} 
                    className={`px-4 py-1 text-sm rounded-full ${sortOrder === 'oldest' ? 'bg-[#002060] text-white' : 'bg-[#eef5ff] text-[#002060]'}`}
                  >
                    {t.sortOldest}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {filteredNews.map(item => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-[#002060]">
                  {language === 'kr' ? item.title : item.title_en}
                </h2>
                <span className="text-sm bg-[#eef5ff] text-[#002060] px-2 py-1 rounded font-medium">
                  {item.source}
                </span>
              </div>
              <div className="flex items-center mt-2">
                <p className="text-gray-500 text-sm mr-4">{item.date}</p>
                <div className="flex gap-1">
                  {item.ports.map(port => (
                    <span key={port} className={`text-xs px-2 py-1 rounded ${
                      port === 'LGB' ? 'bg-red-100 text-red-800' :
                      port === 'SAV' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {port}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mt-3">
                {language === 'kr' ? item.summary : item.summary_en}
              </p>
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mt-4 text-[#002060] hover:text-[#1a3a7a] transition-colors font-medium"
              >
                {t.readMore}
              </a>
            </div>
          ))}

          {filteredNews.length === 0 && (
            <div className="text-center p-10 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">{t.noResults}</p>
            </div>
          )}
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