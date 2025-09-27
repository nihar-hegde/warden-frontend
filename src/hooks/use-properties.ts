// hooks/use-properties.ts
import { useEffect, useState } from "react";
import axios from "axios";
import { WeatherFilters, Property } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useProperties(
  filters: WeatherFilters,
  page: number,
  pageSize: number,
  enabled: boolean
) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);

  const buildParams = () => {
    const { search, tempRange, humidityRange, weatherCondition } = filters;
    return {
      searchText: search || undefined,
      tempMin: tempRange[0] > -20 ? tempRange[0] : undefined,
      tempMax: tempRange[1] < 50 ? tempRange[1] : undefined,
      humMin: humidityRange[0] > 0 ? humidityRange[0] : undefined,
      humMax: humidityRange[1] < 100 ? humidityRange[1] : undefined,
      weather: weatherCondition || undefined,
      page,
      take: pageSize,
    };
  };

  useEffect(() => {
    if (!enabled) return;

    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${BASE_URL}/get-properties`, {
          params: buildParams(),
        });

        setProperties(res.data.data || []);
        setTotal(res.data.total ?? 0);
        setHasNextPage(res.data.hasNextPage ?? false);
      } catch (err) {
        console.error("Failed to fetch properties", err);
        setError("Failed to fetch properties. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters, page, pageSize, enabled]);

  return { properties, loading, error, total, hasNextPage };
}
