"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";
import { WeatherPropertyList } from "./weather-property-list";
import { WeatherFilters } from "@/types";
import { useProperties } from "@/hooks/use-properties";

const WEATHER_CONDITIONS = [
  { value: "clear", label: "Clear" },
  { value: "cloudy", label: "Cloudy" },
  { value: "drizzle", label: "Drizzle" },
  { value: "rainy", label: "Rainy" },
  { value: "snow", label: "Snow" },
];

export function WeatherPropertyFilter() {
  const [filters, setFilters] = useState<WeatherFilters>({
    search: "",
    tempRange: [-20, 50],
    humidityRange: [0, 100],
    weatherCondition: "",
  });
  const [hasSearched, setHasSearched] = useState(false);
  const [pendingFilters, setPendingFilters] = useState(filters);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const PAGE_SIZE = 30;

  // debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        setFilters((prev) => ({ ...prev, search: searchTerm }));
        setPage(1);
        setHasSearched(true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { properties, loading, error } = useProperties(
    filters,
    page,
    PAGE_SIZE,
    hasSearched
  );

  const hasActiveFilters = () =>
    filters.tempRange[0] !== -20 ||
    filters.tempRange[1] !== 50 ||
    filters.humidityRange[0] !== 0 ||
    filters.humidityRange[1] !== 100 ||
    filters.weatherCondition !== "";

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.tempRange[0] !== -20 || filters.tempRange[1] !== 50) count++;
    if (filters.humidityRange[0] !== 0 || filters.humidityRange[1] !== 100)
      count++;
    if (filters.weatherCondition !== "") count++;
    return count;
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      tempRange: [-20, 50],
      humidityRange: [0, 100],
      weatherCondition: "",
    });
    setPendingFilters({
      search: "",
      tempRange: [-20, 50],
      humidityRange: [0, 100],
      weatherCondition: "",
    });
    setPage(1);
    setSearchTerm("");
  };

  const applyFilters = () => {
    setFilters(pendingFilters);
    setPage(1);
    setHasSearched(true);
  };

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Search & Filters */}
      <div className="flex gap-2">
        <Input
          placeholder="Search weather properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={hasActiveFilters() ? "default" : "outline"}
              size="icon"
              className="relative"
            >
              <Filter className="h-4 w-4" />
              {hasActiveFilters() && (
                <Badge
                  variant="secondary"
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm">Filters</h4>
                {hasActiveFilters() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {/* Temperature */}
                <div className="space-y-3">
                  <Label>Temperature Range</Label>
                  <Slider
                    value={pendingFilters.tempRange}
                    onValueChange={(value) =>
                      setPendingFilters((prev) => ({
                        ...prev,
                        tempRange: value as [number, number],
                      }))
                    }
                    min={-20}
                    max={50}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span className="font-medium">
                      {filters.tempRange[0]}°C
                    </span>
                    <span className="text-xs">-20°C to 50°C</span>
                    <span className="font-medium">
                      {filters.tempRange[1]}°C
                    </span>
                  </div>
                </div>

                {/* Humidity */}
                <div className="space-y-3">
                  <Label>Humidity Range</Label>
                  <Slider
                    value={pendingFilters.humidityRange}
                    onValueChange={(value) =>
                      setPendingFilters((prev) => ({
                        ...prev,
                        humidityRange: value as [number, number],
                      }))
                    }
                    min={0}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span className="font-medium">
                      {filters.humidityRange[0]}%
                    </span>
                    <span className="text-xs">0% to 100%</span>
                    <span className="font-medium">
                      {filters.humidityRange[1]}%
                    </span>
                  </div>
                </div>

                {/* Weather Condition */}
                <div className="space-y-3">
                  <Label>Weather Condition</Label>
                  <Select
                    value={pendingFilters.weatherCondition}
                    onValueChange={(value) =>
                      setPendingFilters((prev) => ({
                        ...prev,
                        weatherCondition: value,
                      }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {WEATHER_CONDITIONS.map((condition) => (
                        <SelectItem
                          key={condition.value}
                          value={condition.value}
                        >
                          {condition.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={applyFilters} className="w-full">
                Apply Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2">
          {(filters.tempRange[0] !== -20 || filters.tempRange[1] !== 50) && (
            <Badge variant="secondary">
              Temp: {filters.tempRange[0]}°C - {filters.tempRange[1]}°C
            </Badge>
          )}
          {(filters.humidityRange[0] !== 0 ||
            filters.humidityRange[1] !== 100) && (
            <Badge variant="secondary">
              Humidity: {filters.humidityRange[0]}% - {filters.humidityRange[1]}
              %
            </Badge>
          )}
          {filters.weatherCondition && (
            <Badge variant="secondary">
              {
                WEATHER_CONDITIONS.find(
                  (c) => c.value === filters.weatherCondition
                )?.label
              }
            </Badge>
          )}
        </div>
      )}

      {/* Results */}
      <WeatherPropertyList
        properties={properties}
        loading={loading}
        error={error}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />
    </div>
  );
}
