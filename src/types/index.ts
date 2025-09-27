export interface WeatherFilters {
  search: string;
  tempRange: [number, number];
  humidityRange: [number, number];
  weatherCondition: string;
}

export interface Property {
  id: number;
  name: string;
  city: string;
  state: string;
  country: string;
  tags: string[];
  weather?: {
    temperature: number | null;
    humidity: number | null;
    weathercode: number | null;
    weatherGroup: string | null;
  };
}
