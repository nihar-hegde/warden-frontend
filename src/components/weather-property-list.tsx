"use client";

import { Property } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

interface Props {
  properties: Property[];
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function WeatherPropertyList({
  properties,
  loading,
  error,
  page,
  pageSize,
  onPageChange,
}: Props) {
  return (
    <div className="space-y-6">
      {/* Loading / Error / Empty */}
      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && properties.length === 0 && (
        <p className="text-sm text-muted-foreground">No results found.</p>
      )}

      {/* Results */}
      <div className="grid gap-4">
        {properties.map((prop) => (
          <Card key={prop.id}>
            <CardHeader>
              <CardTitle>{prop.name}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {prop.city}, {prop.state}, {prop.country}
              </p>
            </CardHeader>
            <CardContent>
              {prop.weather && (
                <div className="text-xs text-muted-foreground mb-2">
                  🌡 Temp: {prop.weather.temperature}°C | 💧 Humidity:{" "}
                  {prop.weather.humidity}% | Code: {prop.weather.weathercode}
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {prop.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, page - 1))}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          <span className="px-3 py-2 text-sm text-muted-foreground">
            Page {page}
          </span>
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(page + 1)}
              className={
                properties.length < pageSize
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
