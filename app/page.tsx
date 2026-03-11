'use client';

import dynamic from 'next/dynamic';
import './map.css';

const Map = dynamic(() => import('@/app/components/Map'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen bg-[#161616] text-white">Загрузка карты...</div>
});

const defaultBlips = [
  { name: "Работа Электрик", x: 734.63855, y: 128.54727, blip: "job-1" },
  { name: "Работа Автобусник", x: 432.01242, y: -628.3286, blip: "job-1" },
  { name: "Работа Инкассатор", x: 46.437027, y: -842.20435, blip: "job-1" },
  { name: "Работа Почтальон", x: -197.82831, y: 6235.436, blip: "job-1" },
  { name: "Работа Газонокосильщик", x: -1331.847, y: 41.47328, blip: "job-1" },
  { name: "Работа Такси", x: 900.21326, y: -173.38603, blip: "job-1" },
  { name: "Работа Развозчик товаров", x: 1737.877, y: 3709.549, blip: "job-1" },
];

export default function Home() {
  return (
    <div className="map-container">
      <div className="map-control">
        <a href="/" style={{ color: '#fff' }}>
          <div className="button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </div>
        </a>
      </div>
      <Map blips={defaultBlips} className="map-wrapper" />
    </div>
  );
}
